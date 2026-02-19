import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const marketId = url.searchParams.get('market_id');

    if (!marketId) {
      return new Response(JSON.stringify({ error: 'market_id is required' }), {
        status: 400,
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

    if (!positions || positions.length === 0) {
      return new Response(
        JSON.stringify({
          holders: [],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const agentIds = Array.from(
      new Set(
        (positions as { agent_id: string | null }[])
          .map((p) => p.agent_id)
          .filter((id): id is string => !!id),
      ),
    );

    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('id, agent_name')
      .in('id', agentIds);

    if (agentsError) {
      return new Response(JSON.stringify({ error: agentsError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const agentNameById = new Map<string, string>();
    for (const a of agents ?? []) {
      if (a && a.id) {
        agentNameById.set(a.id, a.agent_name ?? 'Unknown agent');
      }
    }

    type HolderInternal = {
      agent_id: string;
      agent_name: string;
      side: 'yes' | 'no';
      shares: number;
    };

    const holdersInternal: HolderInternal[] = [];

    for (const p of positions) {
      const agentId: string | undefined = p.agent_id;
      if (!agentId) continue;

      const agentName = agentNameById.get(agentId) ?? 'Unknown agent';

      const yesShares = Number(p.yes_shares ?? 0);
      const noShares = Number(p.no_shares ?? 0);

      if (yesShares > 0) {
        holdersInternal.push({
          agent_id: agentId,
          agent_name: agentName,
          side: 'yes',
          shares: yesShares,
        });
      }

      if (noShares > 0) {
        holdersInternal.push({
          agent_id: agentId,
          agent_name: agentName,
          side: 'no',
          shares: noShares,
        });
      }
    }

    const totalYesShares = holdersInternal
      .filter((h) => h.side === 'yes')
      .reduce((acc, h) => acc + h.shares, 0);
    const totalNoShares = holdersInternal
      .filter((h) => h.side === 'no')
      .reduce((acc, h) => acc + h.shares, 0);

    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('agent_id, market_id, side, tx_hash, created_at')
      .eq('market_id', marketId)
      .not('tx_hash', 'is', null)
      .order('created_at', { ascending: false });

    if (tradesError) {
      return new Response(JSON.stringify({ error: tradesError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const latestTxByAgentSide = new Map<string, string>();

    for (const t of trades ?? []) {
      const agentId = t.agent_id as string | null;
      const side = t.side as string | null;
      const txHash = t.tx_hash as string | null;
      if (!agentId || (side !== 'yes' && side !== 'no') || !txHash) {
        continue;
      }

      const key = `${agentId}:${side}`;
      const existing = latestTxByAgentSide.get(key);

      if (!existing) {
        latestTxByAgentSide.set(key, txHash);
      }
    }

    const holders = holdersInternal.map((h) => {
      const totalForSide = h.side === 'yes' ? totalYesShares : totalNoShares;
      const sharePercent =
        totalForSide > 0 ? (h.shares / totalForSide) * 100 : 0;
      const key = `${h.agent_id}:${h.side}`;
      const txHash = latestTxByAgentSide.get(key) ?? null;

      return {
        agent_name: h.agent_name,
        side: h.side,
        shares: h.shares,
        share_percent: sharePercent,
        tx_hash: txHash,
      };
    });

    return new Response(
      JSON.stringify({
        holders,
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
