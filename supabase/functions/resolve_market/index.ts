import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type TradeRow = {
  agent_id: string | null;
  side: 'yes' | 'no' | null;
  price: number | null;
  shares: number | null;
  stake: number | null;
};

type PositionRow = {
  agent_id: string | null;
  yes_shares: number | null;
  no_shares: number | null;
};

type AgentStat = {
  profitDelta: number;
  winDelta: number;
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

    const body = await req.json().catch(() => null);
    const marketId = body?.market_id ?? body?.marketId;
    const outcome = body?.outcome;

    if (!marketId || typeof marketId !== 'string') {
      return new Response(JSON.stringify({ error: 'market_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!outcome || typeof outcome !== 'string') {
      return new Response(JSON.stringify({ error: 'outcome is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: market, error: marketError } = await supabase
      .from('markets')
      .select('id, outcome, option_a, option_b')
      .eq('id', marketId)
      .single();

    if (marketError || !market) {
      return new Response(JSON.stringify({ error: 'Market not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (market.outcome && String(market.outcome).trim() !== '') {
      return new Response(JSON.stringify({ error: 'Market already resolved' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const optionA = String((market as { option_a?: string | null }).option_a ?? '').trim();
    const optionB = String((market as { option_b?: string | null }).option_b ?? '').trim();
    const normalizedOutcome = String(outcome).trim();

    let winningSide: 'yes' | 'no';

    if (normalizedOutcome === optionA) {
      winningSide = 'yes';
    } else if (normalizedOutcome === optionB) {
      winningSide = 'no';
    } else {
      return new Response(
        JSON.stringify({ error: 'Outcome must match option_a or option_b for this market' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('agent_id, side, price, shares, stake')
      .eq('market_id', marketId);

    if (tradesError) {
      return new Response(JSON.stringify({ error: tradesError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: positions, error: positionsError } = await supabase
      .from('market_positions')
      .select('agent_id, yes_shares, no_shares')
      .eq('market_id', marketId);

    if (positionsError) {
      return new Response(JSON.stringify({ error: positionsError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const statsByAgent = new Map<string, AgentStat>();

    for (const raw of (trades ?? []) as TradeRow[]) {
      const agentId = raw.agent_id;
      if (!agentId) continue;

      const side = raw.side === 'yes' || raw.side === 'no' ? raw.side : null;
      if (!side) continue;

      const shares = Number(raw.shares ?? 0);
      const stake = Number(raw.stake ?? 0);

      if (!Number.isFinite(shares) || !Number.isFinite(stake) || stake <= 0) {
        continue;
      }

      let profitDelta = 0;

      if (side === winningSide) {
        profitDelta = shares - stake;
      } else {
        profitDelta = -stake;
      }

      const existing = statsByAgent.get(agentId) ?? { profitDelta: 0, winDelta: 0 };
      existing.profitDelta += profitDelta;
      statsByAgent.set(agentId, existing);
    }

    for (const raw of (positions ?? []) as PositionRow[]) {
      const agentId = raw.agent_id;
      if (!agentId) continue;

      const yesShares = Number(raw.yes_shares ?? 0);
      const noShares = Number(raw.no_shares ?? 0);

      const hasWinningPosition =
        winningSide === 'yes' ? yesShares > 0 : winningSide === 'no' ? noShares > 0 : false;

      if (!hasWinningPosition) {
        continue;
      }

      const existing = statsByAgent.get(agentId) ?? { profitDelta: 0, winDelta: 0 };
      existing.winDelta += 1;
      statsByAgent.set(agentId, existing);
    }

    const agentIds = Array.from(statsByAgent.keys());

    if (agentIds.length > 0) {
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, total_wins, total_profit')
        .in('id', agentIds);

      if (agentsError) {
        return new Response(JSON.stringify({ error: agentsError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      for (const agent of agents ?? []) {
        if (!agent || !agent.id) continue;

        const stat = statsByAgent.get(agent.id);
        if (!stat) continue;

        const currentWins = Number((agent as { total_wins?: number | null }).total_wins ?? 0);
        const currentProfit = Number(
          (agent as { total_profit?: number | null }).total_profit ?? 0,
        );

        const nextWins = currentWins + (stat.winDelta ?? 0);
        const nextProfit = currentProfit + (stat.profitDelta ?? 0);

        await supabase
          .from('agents')
          .update({
            total_wins: nextWins,
            total_profit: nextProfit,
          })
          .eq('id', agent.id);
      }
    }

    const { error: updateMarketError } = await supabase
      .from('markets')
      .update({
        outcome: normalizedOutcome,
        status: 'resolved',
      })
      .eq('id', marketId);

    if (updateMarketError) {
      return new Response(JSON.stringify({ error: updateMarketError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        market_id: marketId,
        outcome: normalizedOutcome,
        winning_side: winningSide,
        updated_agents: agentIds.length,
      }),
      {
        status: 200,
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
