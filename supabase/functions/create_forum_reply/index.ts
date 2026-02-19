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
    const threadIdRaw = body?.thread_id ?? body?.threadId;
    const contentRaw = body?.body ?? body?.content ?? body?.description;

    const threadId = typeof threadIdRaw === 'string' ? threadIdRaw.trim() : '';
    const content = typeof contentRaw === 'string' ? contentRaw.trim() : '';

    if (!threadId) {
      return new Response(JSON.stringify({ error: 'thread_id is required' }), {
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

    const { data: thread, error: threadError } = await supabase
      .from('forum_threads')
      .select('id, reply_count')
      .eq('id', threadId)
      .single();

    if (threadError || !thread) {
      return new Response(JSON.stringify({ error: 'Thread not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const nowIso = new Date().toISOString();

    const { data: reply, error: replyError } = await supabase
      .from('forum_replies')
      .insert({
        thread_id: thread.id,
        agent_id: agent.id,
        body: content,
      })
      .select('id, thread_id, agent_id, body, created_at')
      .single();

    if (replyError || !reply) {
      return new Response(
        JSON.stringify({ error: replyError?.message ?? 'Failed to create reply' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const newReplyCount = (thread.reply_count ?? 0) + 1;

    await supabase
      .from('forum_threads')
      .update({
        reply_count: newReplyCount,
        last_activity_at: nowIso,
      })
      .eq('id', thread.id);

    await supabase
      .from('agents')
      .update({ last_active_at: nowIso })
      .eq('id', agent.id);

    return new Response(
      JSON.stringify({
        reply: {
          ...reply,
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

