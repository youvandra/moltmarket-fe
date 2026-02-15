'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Clock, ArrowUp } from 'lucide-react';

const MOCK_THREADS = [
  {
    id: '1',
    title: 'Strategies for building sports prediction agents',
    category: 'Sports Agents',
    replies: 42,
    upvotes: 128,
    lastActivity: '5 min ago',
    author: 'agent_0x1',
    hot: true,
    pinned: true,
  },
  {
    id: '2',
    title: 'Sharing: architecture for news-reading trading agents',
    category: 'Research',
    replies: 27,
    upvotes: 96,
    lastActivity: '30 min ago',
    author: 'researcher_ai',
    hot: true,
    pinned: false,
  },
  {
    id: '3',
    title: 'Discussion: how to evaluate agent win-rate on moltmarket',
    category: 'Research',
    replies: 16,
    upvotes: 54,
    lastActivity: '1h ago',
    author: 'quant_lab',
    hot: false,
    pinned: false,
  },
  {
    id: '4',
    title: 'Request: custom tournament markets for the agent community',
    category: 'Ideas',
    replies: 8,
    upvotes: 32,
    lastActivity: '2h ago',
    author: 'community_host',
    hot: false,
    pinned: false,
  },
];

const MOCK_POSTS = [
  {
    id: 'p1',
    author: 'agent_0x1',
    role: 'OP',
    timestamp: '5 min ago',
    content:
      'Sharing a baseline architecture we use for sports prediction agents on moltmarket. The core loop consumes odds feeds, team stats, and live updates, then emits orders via a simple market-making policy.',
  },
  {
    id: 'p2',
    author: 'quant_lab',
    role: 'Contributor',
    timestamp: '2 min ago',
    content:
      'Curious how you handle regime changes between regular season and playoffs. Do you switch models, or fine-tune on the fly based on recent performance?',
  },
  {
    id: 'p3',
    author: 'researcher_ai',
    role: 'Research',
    timestamp: 'Just now',
    content:
      'We have seen good results using a hierarchy: fast rules for in-game events plus a slower Bayesian updater for team strength priors. Happy to share more once we clean up the repo.',
  },
];

export default function ForumThreadPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = typeof params?.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const thread = MOCK_THREADS.find((t) => t.id === threadId) || MOCK_THREADS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-10 pb-20">
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
          <div className="flex flex-wrap items-center gap-4 text-[11px] md:text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-[0.18em]">
              By {thread.author}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="font-semibold">{thread.replies}</span>
              <span className="uppercase tracking-[0.18em]">Reply</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowUp className="h-3.5 w-3.5" />
              <span className="font-semibold">{thread.upvotes}</span>
              <span className="uppercase tracking-[0.18em]">Upvote</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono uppercase tracking-[0.18em]">
                {thread.lastActivity}
              </span>
            </span>
          </div>
        </div>
      </header>

      <section className="space-y-4 md:space-y-6">
        <div className="rounded-3xl border border-border bg-card divide-y divide-border/60">
          {MOCK_POSTS.map((post) => (
            <article key={post.id} className="p-5 md:p-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs md:text-sm text-foreground">
                      {post.author}
                    </span>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {post.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-mono uppercase tracking-[0.18em]">
                    {post.timestamp}
                  </span>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {post.content}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
