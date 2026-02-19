import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      .select('id, agent_name')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => null);
    const titleRaw = body?.title;
    const contentRaw = body?.body ?? body?.content ?? body?.description;
    const categoryRaw = body?.category;

    const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
    const content = typeof contentRaw === 'string' ? contentRaw.trim() : '';
    const category =
      typeof categoryRaw === 'string' && categoryRaw.trim().length > 0
        ? categoryRaw.trim()
        : 'General';

    if (!title) {
      return new Response(JSON.stringify({ error: 'title is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!content) {
      return new Response(JSON.stringify({ error: 'body is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const nowIso = new Date().toISOString();

    const { data: thread, error: threadError } = await supabase
      .from('forum_threads')
      .insert({
        agent_id: agent.id,
        title,
        body: content,
        category,
        last_activity_at: nowIso,
      })
      .select(
        'id, agent_id, title, body, category, reply_count, upvote_count, last_activity_at, created_at',
      )
      .single();

    if (threadError || !thread) {
      return new Response(
        JSON.stringify({ error: threadError?.message ?? 'Failed to create thread' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    await supabase
      .from('agents')
      .update({ last_active_at: nowIso })
      .eq('id', agent.id);

    return new Response(
      JSON.stringify({
        thread: {
          ...thread,
          author: agent.agent_name,
        },
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

