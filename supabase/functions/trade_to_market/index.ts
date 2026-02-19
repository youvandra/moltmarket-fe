import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MAX_PAYOUT_MULTIPLE = 1;
const ABSOLUTE_MAX_STAKE = 1000;

const rawScale = Deno.env.get('ONCHAIN_STAKE_SCALE');
const ONCHAIN_STAKE_SCALE = !rawScale ? 1 : Number(rawScale) > 0 ? Number(rawScale) : 1;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'x-api-key, authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response('Server configuration error', {
      status: 500,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const headerKey = req.headers.get('x-api-key') ?? '';
    const authHeader = req.headers.get('authorization') ?? '';
    const bearerKey = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7).trim()
      : '';
    const apiKey = headerKey || bearerKey;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, total_trades, total_volume_trade')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => null);
    const marketId = body?.market_id ?? body?.marketId;
    const sideRaw = body?.side;
    const optionRaw = body?.option ?? body?.outcome ?? body?.label;
    const stakeRaw = body?.stake;

    if (!marketId || typeof marketId !== 'string') {
      return new Response(JSON.stringify({ error: 'market_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const normalizedSide =
      typeof sideRaw === 'string' ? sideRaw.toLowerCase().trim() : '';
    const optionLabel =
      typeof optionRaw === 'string' ? optionRaw.trim() : '';

    const stake = typeof stakeRaw === 'number' ? stakeRaw : Number(stakeRaw);

    if (!Number.isFinite(stake) || stake <= 0) {
      return new Response(JSON.stringify({ error: 'stake must be a positive number' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: market, error: marketError } = await supabase
      .from('markets')
      .select('id, status, initial_yes_price, initial_liquidity, option_a, option_b')
      .eq('id', marketId)
      .single();

    if (marketError || !market) {
      return new Response(JSON.stringify({ error: 'Market not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (market.status !== 'open') {
      return new Response(JSON.stringify({ error: 'Market is not open for trading' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let side: 'yes' | 'no' | null = null;

    if (normalizedSide === 'yes' || normalizedSide === 'no') {
      side = normalizedSide as 'yes' | 'no';
    } else if (optionLabel) {
      const optionA = String((market as { option_a?: string | null }).option_a ?? '').trim();
      const optionB = String((market as { option_b?: string | null }).option_b ?? '').trim();
      const normalizedOption = optionLabel.trim();

      if (normalizedOption === optionA) {
        side = 'yes';
      } else if (normalizedOption === optionB) {
        side = 'no';
      } else {
        return new Response(
          JSON.stringify({
            error: 'option must match option_a or option_b for this market',
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }
    }

    if (side !== 'yes' && side !== 'no') {
      return new Response(
        JSON.stringify({
          error: "You must provide either side ('yes'/'no') or a valid option label",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const yesPrice = Number(market.initial_yes_price);

    if (!Number.isFinite(yesPrice) || yesPrice <= 0 || yesPrice >= 1) {
      return new Response(JSON.stringify({ error: 'Invalid market pricing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const noPrice = 1 - yesPrice;
    const price = side === 'yes' ? yesPrice : noPrice;

    if (!Number.isFinite(price) || price <= 0 || price >= 1) {
      return new Response(JSON.stringify({ error: 'Invalid side price' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const currentVolumeRaw = (market as { initial_liquidity?: number | null }).initial_liquidity;
    const currentVolume = Number(currentVolumeRaw ?? 0);
    const volumeBasedMaxStake =
      currentVolume > 0 ? price * currentVolume * MAX_PAYOUT_MULTIPLE : ABSOLUTE_MAX_STAKE;
    const maxStakeAllowed = Math.min(volumeBasedMaxStake, ABSOLUTE_MAX_STAKE);

    if (stake > maxStakeAllowed) {
      return new Response(
        JSON.stringify({
          error: 'stake is too large for this market',
          max_stake_allowed: maxStakeAllowed,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const shares = stake / price;
    const onChainStake = stake * ONCHAIN_STAKE_SCALE;

    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .insert({
        agent_id: agent.id,
        market_id: market.id,
        side,
        price,
        shares,
        stake,
      })
      .select('id, agent_id, market_id, side, price, shares, stake, created_at')
      .single();

    if (tradeError || !trade) {
      return new Response(JSON.stringify({ error: tradeError?.message ?? 'Failed to insert trade' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: existingPosition } = await supabase
      .from('market_positions')
      .select('id, yes_shares, no_shares')
      .eq('agent_id', agent.id)
      .eq('market_id', market.id)
      .maybeSingle();

    const isYes = side === 'yes';
    const nowIso = new Date().toISOString();

    if (!existingPosition) {
      const { data: newPosition, error: positionInsertError } = await supabase
        .from('market_positions')
        .insert({
          agent_id: agent.id,
          market_id: market.id,
          yes_shares: isYes ? shares : 0,
          no_shares: isYes ? 0 : shares,
          last_trade_at: nowIso,
        })
        .select('id, agent_id, market_id, yes_shares, no_shares, last_trade_at')
        .single();

      if (positionInsertError || !newPosition) {
        return new Response(JSON.stringify({ error: positionInsertError?.message ?? 'Failed to insert position' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const updatedTotalTrades = (agent.total_trades ?? 0) + 1;
      const updatedTotalVolume = Number(agent.total_volume_trade ?? 0) + stake;
      const updatedMarketVolume =
        Number((market as { initial_liquidity?: number | null }).initial_liquidity ?? 0) +
        stake;

      await supabase
        .from('agents')
        .update({
          total_trades: updatedTotalTrades,
          total_volume_trade: updatedTotalVolume,
          last_active_at: nowIso,
        })
        .eq('id', agent.id);

      await supabase
        .from('markets')
        .update({
          initial_liquidity: updatedMarketVolume,
        })
        .eq('id', market.id);

      return new Response(
        JSON.stringify({
          trade,
          position: newPosition,
          on_chain_stake: onChainStake,
          on_chain_stake_scale: ONCHAIN_STAKE_SCALE,
        }),
        {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const updatedYesShares = Number(existingPosition.yes_shares ?? 0) + (isYes ? shares : 0);
    const updatedNoShares = Number(existingPosition.no_shares ?? 0) + (isYes ? 0 : shares);

    const { data: updatedPosition, error: positionUpdateError } = await supabase
      .from('market_positions')
      .update({
        yes_shares: updatedYesShares,
        no_shares: updatedNoShares,
        last_trade_at: nowIso,
      })
      .eq('id', existingPosition.id)
      .select('id, agent_id, market_id, yes_shares, no_shares, last_trade_at')
      .single();

    if (positionUpdateError || !updatedPosition) {
      return new Response(JSON.stringify({ error: positionUpdateError?.message ?? 'Failed to update position' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const updatedTotalTrades = (agent.total_trades ?? 0) + 1;
    const updatedTotalVolume = Number(agent.total_volume_trade ?? 0) + stake;
    const updatedMarketVolume =
      Number((market as { initial_liquidity?: number | null }).initial_liquidity ?? 0) +
      stake;

    await supabase
      .from('agents')
      .update({
        total_trades: updatedTotalTrades,
        total_volume_trade: updatedTotalVolume,
        last_active_at: nowIso,
      })
      .eq('id', agent.id);

    await supabase
      .from('markets')
      .update({
        initial_liquidity: updatedMarketVolume,
      })
      .eq('id', market.id);

    return new Response(
      JSON.stringify({
        trade,
        position: updatedPosition,
        on_chain_stake: onChainStake,
        on_chain_stake_scale: ONCHAIN_STAKE_SCALE,
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
