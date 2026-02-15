'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MarketCard } from '@/components/markets/market-card';
import type { Market } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { LayoutGrid, TrendingUp, Zap, Clock, Trophy, Globe } from 'lucide-react';

type DbMarket = {
  id: string;
  question: string;
  description: string;
  category: string;
  image_url: string | null;
  end_time: string;
  initial_yes_price: number;
  initial_liquidity: number;
  status: string;
};

function MarketsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-border bg-card p-5 md:p-6 space-y-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-muted border border-border" />
            <div className="space-y-2 flex-1">
              <div className="h-2.5 w-16 rounded-full bg-muted" />
              <div className="h-3.5 w-full rounded-full bg-muted/80" />
            </div>
          </div>
          <div className="h-3 w-3/4 rounded-full bg-muted" />
          <div className="h-8 w-full rounded-2xl bg-muted" />
        </div>
      ))}
    </div>
  );
}

function MarketsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMarkets() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('markets')
        .select('*')
        .eq('status', 'open');

      if (['Sports', 'Politics', 'Crypto', 'Science', 'Other'].includes(categoryParam)) {
        query = query.eq('category', categoryParam);
      }

      switch (categoryParam) {
        case 'Trending':
          query = query.order('initial_liquidity', { ascending: false });
          break;
        case 'Newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'Closing Soon':
          query = query.order('end_time', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setMarkets([]);
        setLoading(false);
        return;
      }

      const mapped: Market[] = (data as DbMarket[]).map((row) => {
        const yesPrice = typeof row.initial_yes_price === 'number' ? row.initial_yes_price : 0.5;
        const noPrice = 1 - yesPrice;

        return {
          id: row.id,
          question: row.question,
          description: row.description,
          category: row.category,
          image: row.image_url || undefined,
          volume: row.initial_liquidity != null ? String(row.initial_liquidity) : '0',
          participants: 0,
          endTime: row.end_time,
          outcomes: [
            {
              name: 'Yes',
              probability: yesPrice,
              price: yesPrice,
            },
            {
              name: 'No',
              probability: noPrice,
              price: noPrice,
            },
          ],
        };
      });

      setMarkets(mapped);
      setLoading(false);
    }

    loadMarkets();

    return () => {
      cancelled = true;
    };
  }, [categoryParam]);

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Trending':
        return <TrendingUp className="h-3.5 w-3.5 text-hedera-purple" />;
      case 'Newest':
        return <Zap className="h-3.5 w-3.5 text-hedera-purple" />;
      case 'Closing Soon':
        return <Clock className="h-3.5 w-3.5 text-hedera-purple" />;
      case 'Sports':
        return <Trophy className="h-3.5 w-3.5 text-hedera-purple" />;
      case 'Politics':
        return <Globe className="h-3.5 w-3.5 text-hedera-purple" />;
      default:
        return <LayoutGrid className="h-3.5 w-3.5 text-hedera-purple" />;
    }
  };

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border w-fit bg-transparent">
          {getCategoryIcon(categoryParam)}
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

      {error && (
        <div className="rounded-3xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">
          Failed to load markets: {error}
        </div>
      )}

      {loading ? (
        <MarketsSkeletonGrid />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>

          {markets.length === 0 && !error && (
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
        </>
      )}
    </div>
  );
}

export default function MarketsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-hedera-purple border-t-transparent animate-spin" />
        </div>
      }
    >
      <MarketsContent />
    </Suspense>
  );
}
