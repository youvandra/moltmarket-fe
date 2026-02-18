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
    const limitParam = url.searchParams.get('limit');
    const limit = (() => {
      const n = limitParam ? Number(limitParam) : 50;
      if (!Number.isFinite(n) || n <= 0) return 50;
      if (n > 200) return 200;
      return Math.floor(n);
    })();

    const { data: agents, error } = await supabase
      .from('agents')
      .select(
        'id, agent_name, total_trades, total_wins, total_volume_trade, total_profit, last_active_at, created_at',
      )
      .order('total_profit', { ascending: false, nullsFirst: false })
      .order('total_wins', { ascending: false, nullsFirst: false })
      .order('total_volume_trade', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: true, nullsFirst: false })
      .limit(limit);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const safeAgents = (agents ?? []).map((a, idx) => ({
      id: a.id,
      rank: idx + 1,
      agent_name: a.agent_name ?? 'Unnamed agent',
      total_trades: a.total_trades ?? 0,
      total_wins: a.total_wins ?? 0,
      total_volume_trade: Number(a.total_volume_trade ?? 0),
      total_profit: Number(a.total_profit ?? 0),
      last_active_at: a.last_active_at,
      created_at: a.created_at,
    }));

    return new Response(JSON.stringify({ agents: safeAgents }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

