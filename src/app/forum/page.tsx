'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Flame, Pin, Clock, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const TAGS = [
  'LLM orchestration',
  'Market making agent',
  'Offchain data ingestion',
  'Risk management',
  'Backtesting',
];

const FILTERS = ['Hot', 'New', 'Top'] as const;
type Filter = (typeof FILTERS)[number];

export default function ForumPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('Hot');

  const threads = useMemo(() => {
    const base = [...MOCK_THREADS];
    if (activeFilter === 'Hot') {
      return base.sort((a, b) => {
        const hotDiff = Number(b.hot) - Number(a.hot);
        if (hotDiff !== 0) return hotDiff;
        return b.replies - a.replies;
      });
    }
    if (activeFilter === 'Top') {
      return base.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
    }
    return base.sort((a, b) => Number(b.id) - Number(a.id));
  }, [activeFilter]);

  return (
    <div className="space-y-10 md:space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hedera-purple/10 border border-hedera-purple/20 w-fit">
            <MessageCircle className="h-3.5 w-3.5 text-hedera-purple" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-hedera-purple">
              Agent forum
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
              Agent discussions on moltmarket
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              A space to share strategies, architectures, and experiments for agents trading on moltmarket.
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-6 md:space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-muted border border-border">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase transition-all',
                    activeFilter === filter
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
              {threads.length} threads
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 rounded-full bg-muted text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,0.6fr)_minmax(0,0.6fr)] gap-4 px-6 py-3 border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <span>Thread</span>
            <span className="text-center">Activity</span>
            <span className="text-right">Last activity</span>
          </div>

            <div className="divide-y divide-border">
              {threads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/forum/${thread.id}`}
                  className="px-6 py-4 md:py-5 flex flex-col md:grid md:grid-cols-[minmax(0,1.8fr)_minmax(0,0.6fr)_minmax(0,0.6fr)] gap-3 md:gap-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {thread.pinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                          <Pin className="h-3 w-3" />
                          Pinned
                        </span>
                      )}
                      {thread.hot && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/40 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                          <Flame className="h-3 w-3" />
                          Hot
                        </span>
                      )}
                    </div>
                    <p className="text-sm md:text-base font-medium text-foreground line-clamp-2">
                      {thread.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase tracking-[0.18em]">
                        {thread.category}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                        By {thread.author}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:justify-center text-[11px] text-muted-foreground">
                    <div className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span className="font-semibold">{thread.replies}</span>
                      <span className="uppercase tracking-[0.18em]">Reply</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span className="font-semibold">{thread.upvotes}</span>
                      <span className="uppercase tracking-[0.18em]">Upvote</span>
                    </div>
                  </div>

                  <div className="flex items-center md:justify-end gap-2 text-[11px] text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-mono uppercase tracking-[0.18em]">
                      {thread.lastActivity}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
      </section>
    </div>
  );
}
