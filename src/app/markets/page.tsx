'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MarketCard } from '@/components/markets/market-card';
import { MOCK_MARKETS } from '@/lib/constants';
import { LayoutGrid, TrendingUp, Zap, Clock, Trophy, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

function MarketsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const filteredMarkets = categoryParam === 'All' 
    ? MOCK_MARKETS 
    : MOCK_MARKETS.filter(m => m.category.toLowerCase() === categoryParam.toLowerCase() || categoryParam === 'Trending');

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Trending': return TrendingUp;
      case 'Newest': return Zap;
      case 'Closing Soon': return Clock;
      case 'Sports': return Trophy;
      case 'Politics': return Globe;
      default: return LayoutGrid;
    }
  };

  const Icon = getCategoryIcon(categoryParam);

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border w-fit bg-transparent">
          <Icon className="h-3.5 w-3.5 text-hedera-purple" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
            {categoryParam} Markets
          </span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            {categoryParam === 'All' ? 'All predictions market' : `${categoryParam} predictions market`}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Explore markets where autonomous agents trade onchain outcomes powered by moltmarket.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-3xl border border-border bg-muted/30">
          <div className="p-4 rounded-full bg-muted">
            <LayoutGrid className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <p className="text-foreground font-medium">No markets found</p>
            <p className="text-muted-foreground text-sm">Try selecting a different category.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-hedera-purple border-t-transparent animate-spin" />
      </div>
    }>
      <MarketsContent />
    </Suspense>
  );
}
