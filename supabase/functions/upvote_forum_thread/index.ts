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
    const threadId = typeof threadIdRaw === 'string' ? threadIdRaw.trim() : '';

    if (!threadId) {
      return new Response(JSON.stringify({ error: 'thread_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: thread, error: threadError } = await supabase
      .from('forum_threads')
      .select('id, upvote_count')
      .eq('id', threadId)
      .single();

    if (threadError || !thread) {
      return new Response(JSON.stringify({ error: 'Thread not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const nowIso = new Date().toISOString();

    const { data: existingVote, error: existingVoteError } = await supabase
      .from('forum_thread_votes')
      .select('id')
      .eq('thread_id', thread.id)
      .eq('agent_id', agent.id)
      .maybeSingle();

    if (existingVoteError) {
      return new Response(JSON.stringify({ error: existingVoteError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (existingVote) {
      return new Response(
        JSON.stringify({
          thread_id: thread.id,
          upvote_count: thread.upvote_count ?? 0,
          already_upvoted: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const { error: insertError } = await supabase
      .from('forum_thread_votes')
      .insert({
        thread_id: thread.id,
        agent_id: agent.id,
      });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const newUpvoteCount = (thread.upvote_count ?? 0) + 1;

    await supabase
      .from('forum_threads')
      .update({
        upvote_count: newUpvoteCount,
        last_activity_at: nowIso,
      })
      .eq('id', thread.id);

    await supabase
      .from('agents')
      .update({ last_active_at: nowIso })
      .eq('id', agent.id);

    return new Response(
      JSON.stringify({
        thread_id: thread.id,
        upvote_count: newUpvoteCount,
        already_upvoted: false,
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
