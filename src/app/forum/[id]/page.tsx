'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Clock, ArrowUp } from 'lucide-react';
import LeaderboardLoading from '../../leaderboard/loading';

type ForumThreadDetail = {
  id: string;
  title: string;
  body: string;
  category: string;
  reply_count: number;
  upvote_count: number;
  last_activity_at: string;
  created_at: string;
  author: string | null;
};

type ForumReply = {
  id: string;
  body: string;
  created_at: string;
  author: string | null;
};

export default function ForumThreadPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = typeof params?.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [thread, setThread] = useState<ForumThreadDetail | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadThread() {
      if (!threadId) {
        setLoading(false);
        return;
      }

      const functionsBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!functionsBaseUrl) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${functionsBaseUrl}/functions/v1/get_forum_thread?thread_id=${encodeURIComponent(
            threadId,
          )}`,
        );

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const json = await res.json();
        const t = json?.thread as ForumThreadDetail | undefined;
        const r = (json?.replies ?? []) as ForumReply[];

        if (cancelled) {
          return;
        }

        if (t) {
          setThread(t);
          setReplies(r);
        } else {
          setThread(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadThread();

    return () => {
      cancelled = true;
    };
  }, [threadId]);

  const formatTimestamp = (iso: string) => {
    if (!iso) return '-';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleString();
  };

  if (loading) {
    return <LeaderboardLoading />;
  }

  if (!thread) {
    return (
      <div className="pb-20">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        </div>
        <p className="text-sm md:text-base text-muted-foreground">Thread not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10 pb-20">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          <span className="opacity-70">Thread ID</span>
          <span className="text-foreground">{thread.id}</span>
        </span>
      </div>

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hedera-purple/10 border border-hedera-purple/20">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-hedera-purple">
            {thread.category}
          </span>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
            {thread.title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {thread.body}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] md:text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-[0.18em]">
              By {thread.author ?? 'Unknown'}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="font-semibold">{thread.reply_count}</span>
              <span className="uppercase tracking-[0.18em]">Reply</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowUp className="h-3.5 w-3.5" />
              <span className="font-semibold">{thread.upvote_count}</span>
              <span className="uppercase tracking-[0.18em]">Upvote</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono uppercase tracking-[0.18em]">
                {formatTimestamp(thread.last_activity_at || thread.created_at)}
              </span>
            </span>
          </div>
        </div>
      </header>

      <section className="space-y-4 md:space-y-6">
        <div className="rounded-3xl border border-border bg-card divide-y divide-border/60">
          {replies.map((post) => (
            <article key={post.id} className="p-5 md:p-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs md:text-sm text-foreground">
                      {post.author ?? 'Unknown'}
                    </span>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Reply
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-mono uppercase tracking-[0.18em]">
                    {formatTimestamp(post.created_at)}
                  </span>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {post.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
