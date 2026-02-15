'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Market } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const title = market.question;

  return (
    <Link href={`/markets/${market.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-6 transition-all hover:border-hedera-purple/40 hover:shadow-[0_0_30px_rgba(130,71,229,0.25)] hover:-translate-y-0.5">
        <div className="relative z-10 flex items-center gap-4 mb-4">
          <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0 shadow-sm">
            {market.image && (
              <Image src={market.image} alt={title} fill className="object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {market.category}
            </div>
            <h3 className="text-base md:text-lg font-medium tracking-tight text-foreground leading-snug line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        <div className="relative z-10 mt-3 grid grid-cols-2 gap-2">
          {market.outcomes.map((outcome, index) => {
            const percent = Math.round(outcome.probability * 100);

            return (
              <div
                key={outcome.name}
                className={cn(
                  'group relative flex items-center justify-center rounded-xl py-2.5 text-[11px] md:text-xs font-semibold transition-colors',
                  'border border-border/60',
                  index === 0
                    ? 'bg-hedera-purple/15 border-hedera-purple/60 text-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <span className="truncate transition-opacity duration-150 group-hover:opacity-0">
                  {outcome.name}
                </span>
                <span className="absolute transition-opacity duration-150 opacity-0 group-hover:opacity-100">
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 mt-4 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Prize Pool
              </p>
              <p className="text-sm md:text-base text-foreground font-medium">${market.volume}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Joined
              </p>
              <p className="text-sm md:text-base text-foreground font-medium">{market.participants}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
