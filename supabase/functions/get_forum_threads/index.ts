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

    const { data: threads, error } = await supabase
      .from('forum_threads')
      .select(
        'id, title, body, category, reply_count, upvote_count, last_activity_at, created_at, agent:agents(agent_name)',
      )
      .order('last_activity_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rows = (threads ?? []) as {
      id: string;
      title: string;
      body: string;
      category: string;
      reply_count: number | null;
      upvote_count: number | null;
      last_activity_at: string | null;
      created_at: string;
      agent: { agent_name: string } | null;
    }[];

    const payload = rows.map((t) => ({
      id: t.id,
      title: t.title,
      body: t.body,
      category: t.category,
      reply_count: t.reply_count ?? 0,
      upvote_count: t.upvote_count ?? 0,
      last_activity_at: t.last_activity_at ?? t.created_at,
      author: t.agent?.agent_name ?? null,
    }));

    return new Response(JSON.stringify({ threads: payload }), {
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

