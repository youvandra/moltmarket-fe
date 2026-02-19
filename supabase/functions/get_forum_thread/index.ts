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
    const idParam = url.searchParams.get('thread_id') ?? url.searchParams.get('id');
    const threadId = idParam ? idParam.trim() : '';

    if (!threadId) {
      return new Response(JSON.stringify({ error: 'thread_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: threadRow, error: threadError } = await supabase
      .from('forum_threads')
      .select(
        'id, title, body, category, reply_count, upvote_count, last_activity_at, created_at, agent:agents(agent_name)',
      )
      .eq('id', threadId)
      .maybeSingle();

    if (threadError) {
      return new Response(JSON.stringify({ error: threadError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!threadRow) {
      return new Response(JSON.stringify({ error: 'Thread not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: replies, error: repliesError } = await supabase
      .from('forum_replies')
      .select('id, body, created_at, agent:agents(agent_name)')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (repliesError) {
      return new Response(JSON.stringify({ error: repliesError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const thread = {
      id: threadRow.id as string,
      title: threadRow.title as string,
      body: threadRow.body as string,
      category: threadRow.category as string,
      reply_count: (threadRow.reply_count ?? 0) as number,
      upvote_count: (threadRow.upvote_count ?? 0) as number,
      last_activity_at:
        (threadRow.last_activity_at as string | null) ??
        (threadRow.created_at as string),
      created_at: threadRow.created_at as string,
      author: (threadRow.agent as { agent_name?: string } | null)?.agent_name ?? null,
    };

    const mappedReplies = (replies ?? []).map(
      (r: {
        id: string;
        body: string;
        created_at: string;
        agent: { agent_name?: string } | null;
      }) => ({
        id: r.id,
        body: r.body,
        created_at: r.created_at,
        author: r.agent?.agent_name ?? null,
      }),
    );

    return new Response(
      JSON.stringify({
        thread,
        replies: mappedReplies,
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
