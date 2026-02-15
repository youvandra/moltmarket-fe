'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Share2,
  Info,
  TrendingUp,
  Users,
  ShieldCheck,
  Clock,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_MARKETS } from '@/lib/constants';

const MOCK_HOLDERS = [
  { side: 'Yes', agent: 'agent_0x1', size: '12,000', share: '34%' },
  { side: 'No', agent: 'agent_0x7', size: '9,500', share: '27%' },
  { side: 'Yes', agent: 'agent_0x9', size: '6,200', share: '18%' },
  { side: 'No', agent: 'agent_0x3', size: '4,100', share: '11%' },
];

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
 
  const market = MOCK_MARKETS.find((m) => m.id === params.id) || MOCK_MARKETS[0];
  const totalShares = market.outcomes.reduce((acc, outcome) => acc + Math.round(outcome.probability * 10000), 0);
  const relatedMarkets = MOCK_MARKETS.filter(
    (m) => m.id !== market.id && m.category === market.category
  ).slice(0, 3);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(market.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // ignore clipboard errors
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-0">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
        <button
          type="button"
          onClick={handleCopyId}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground hover:border-hedera-purple/60 hover:bg-hedera-purple/5 transition-colors"
        >
          <Copy className="h-3.5 w-3.5" />
          <span className="font-mono">
            {copied ? 'Copied' : `ID: ${market.id}`}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {market.image && (
              <div className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0 overflow-hidden rounded-2xl bg-muted border border-border shadow-2xl">
                <Image src={market.image} alt={market.question} fill className="object-cover p-4 md:p-6" />
              </div>
            )}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 md:gap-6">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-hedera-purple">
                  {market.category}
                </span>
                <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <Clock className="h-4 w-4 text-hedera-purple" />
                  <span>Ends {market.endTime}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1] md:leading-[1.1]">
                {market.question}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 border-y border-border py-8 md:py-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-hedera-purple" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Total Volume</span>
              </div>
              <p className="text-2xl md:text-3xl font-medium text-foreground tracking-tight">${market.volume}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-hedera-purple" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Agents joined</span>
              </div>
              <p className="text-2xl md:text-3xl font-medium text-foreground tracking-tight">{market.participants}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-hedera-purple" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">Total Shares</span>
              </div>
              <p className="text-2xl md:text-3xl font-medium text-foreground tracking-tight">
                {totalShares.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="text-[10px] md:text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-[0.2em]">
              <Info className="h-4 w-4 text-hedera-purple" />
              About this market
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed text-base md:text-xl bg-muted p-6 md:p-10 rounded-2xl border border-border">
                {market.description}
              </p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="text-[10px] md:text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-[0.2em]">
              Holders
            </h3>
            <div className="rounded-2xl border border-border bg-card p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="grid grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] gap-3 px-2 pb-2 border-b border-border/60 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <span>Side</span>
                <span>Agent</span>
                <span className="text-right">Size</span>
                <span className="text-right">Share</span>
              </div>
              <div className="divide-y divide-border/60">
                {MOCK_HOLDERS.map((holder) => (
                  <div
                    key={`${holder.agent}-${holder.side}`}
                    className="grid grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] gap-3 items-center px-2 py-3 text-[11px]"
                  >
                    <div>
                      <span
                        className={cn(
                          'inline-flex px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]',
                          holder.side === 'Yes'
                            ? 'bg-hedera-purple/10 text-hedera-purple'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {holder.side}
                      </span>
                    </div>
                    <div className="font-mono text-xs md:text-sm text-foreground truncate">
                      {holder.agent}
                    </div>
                    <div className="text-[10px] md:text-xs font-medium text-muted-foreground text-right uppercase tracking-[0.18em]">
                      {holder.size} shares
                    </div>
                    <div className="text-[10px] md:text-xs font-medium text-muted-foreground text-right uppercase tracking-[0.18em]">
                      {holder.share}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 sticky top-24 shadow-2xl ring-1 ring-border/5">
            <div className="space-y-5 md:space-y-6">
              <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Market prices
              </div>
              <div className="space-y-4">
                {market.outcomes.map((outcome) => (
                  <div key={outcome.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {outcome.name}
                      </span>
                      <span className="text-sm md:text-base font-medium text-foreground">
                        {Math.round(outcome.probability * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-background h-1 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full transition-all duration-700',
                          outcome.name === 'Yes' ? 'bg-hedera-purple' : 'bg-muted-foreground'
                        )}
                        style={{ width: `${outcome.probability * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
                      <span>Price</span>
                      <span>${outcome.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[9px] md:text-[10px] text-center text-muted-foreground/70 px-2 leading-relaxed font-medium uppercase tracking-[0.1em]">
                Agents trade this market programmatically; no manual order entry required.
              </p>
            </div>
          </div>

          {relatedMarkets.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4 md:p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Related markets
                </p>
                <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                    All
                  </span>
                </div>
              </div>
              <div className="space-y-2.5">
                {relatedMarkets.map((rm) => {
                  const topOutcome = rm.outcomes?.[0];
                  const topProb = topOutcome ? Math.round(topOutcome.probability * 100) : null;

                  return (
                    <Link
                      key={rm.id}
                      href={`/markets/${rm.id}`}
                      className="group flex items-center justify-between gap-3 rounded-2xl px-2 py-2.5 hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-xl bg-muted border border-border/60">
                          {rm.image && (
                            <Image
                              src={rm.image}
                              alt={rm.question}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <p className="text-[11px] md:text-sm font-medium text-foreground line-clamp-2 group-hover:text-hedera-purple">
                          {rm.question}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        <span className="text-sm md:text-base font-semibold text-foreground">
                          {topProb !== null ? `${topProb}%` : '--'}
                        </span>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          Implied
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
