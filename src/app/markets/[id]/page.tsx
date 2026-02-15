'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Info, TrendingUp, Users, ShieldCheck, Clock, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Market } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

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
  outcome: string | null;
  option_a: string;
  option_b: string;
};

type HolderRow = {
  side: 'Yes' | 'No';
  agent: string;
  size: string;
  share: string;
};

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [holders, setHolders] = useState<HolderRow[]>([]);
  const [holdersLoading, setHoldersLoading] = useState(false);

  const id = (params as { id: string }).id;

  useEffect(() => {
    let cancelled = false;

    async function loadMarket() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('id', id)
        .single();

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setMarket(null);
        setLoading(false);
        return;
      }

      const row = data as DbMarket;
      const yesPrice =
        typeof row.initial_yes_price === 'number' ? row.initial_yes_price : 0.5;
      const noPrice = 1 - yesPrice;

      const optionA = (row as DbMarket).option_a || 'Yes';
      const optionB = (row as DbMarket).option_b || 'No';

      const mapped: Market = {
        id: row.id,
        question: row.question,
        description: row.description,
        category: row.category,
        image: row.image_url || undefined,
        volume:
          row.initial_liquidity != null ? String(row.initial_liquidity) : '0',
        participants: 0,
        endTime: row.end_time,
        outcome: row.outcome,
        outcomes: [
          {
            name: optionA,
            probability: yesPrice,
            price: yesPrice,
          },
          {
            name: optionB,
            probability: noPrice,
            price: noPrice,
          },
        ],
      };

      setMarket(mapped);

      const functionsBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!functionsBaseUrl) {
        return;
      }

      setHoldersLoading(true);

      try {
        const res = await fetch(
          `${functionsBaseUrl}/functions/v1/get_market_holders?market_id=${encodeURIComponent(row.id)}`,
        );

        if (!res.ok) {
          setHolders([]);
        } else {
          const json = await res.json();
          const items = (json?.holders ?? []) as {
            agent_name: string;
            side: string;
            shares: number;
            share_percent: number;
          }[];

          const formatted: HolderRow[] = items.map((h) => ({
            side: h.side.toLowerCase() === 'yes' ? optionA : optionB,
            agent: h.agent_name,
            size: `${Math.round(h.shares).toLocaleString()}`,
            share: `${Math.round(h.share_percent)}%`,
          }));

          setHolders(formatted);

          const uniqueAgents = new Set(items.map((h) => h.agent_name));
          setMarket((prev) =>
            prev ? { ...prev, participants: uniqueAgents.size } : prev,
          );
        }
      } catch {
        setHolders([]);
      } finally {
        setHoldersLoading(false);
      }
      setLoading(false);
    }

    if (id) {
      loadMarket();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-0">
        <div className="flex items-center justify-between gap-3">
          <div className="h-7 w-20 md:w-24 rounded-full bg-muted animate-pulse" />
          <div className="h-7 w-32 md:w-40 rounded-full bg-muted animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0 overflow-hidden rounded-2xl bg-muted border border-border shadow-2xl animate-pulse" />
              <div className="space-y-4 md:space-y-6 flex-1">
                <div className="h-3 w-24 md:w-32 rounded-full bg-muted animate-pulse" />
                <div className="h-8 md:h-12 w-full rounded-lg bg-muted animate-pulse" />
                <div className="h-3 w-2/3 rounded-full bg-muted animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 border-y border-border py-8 md:py-10">
              <div className="space-y-3">
                <div className="h-3 w-32 rounded-full bg-muted animate-pulse" />
                <div className="h-8 w-32 md:w-40 rounded-full bg-muted animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-40 rounded-full bg-muted animate-pulse" />
                <div className="h-8 w-24 md:w-32 rounded-full bg-muted animate-pulse" />
                <div className="h-3 w-32 rounded-full bg-muted animate-pulse" />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="h-3 w-40 rounded-full bg-muted animate-pulse" />
              <div className="h-24 md:h-32 w-full rounded-2xl bg-muted animate-pulse" />
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
              <div className="h-32 w-full rounded-2xl bg-muted animate-pulse" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-64 rounded-2xl border border-border bg-muted animate-pulse" />
            <div className="h-36 rounded-2xl border border-border bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <p className="text-sm md:text-base text-muted-foreground">
          {error ? 'Failed to load market.' : 'Market not found.'}
        </p>
        <button
          onClick={() => router.push('/markets')}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-hedera-purple/60 hover:bg-hedera-purple/5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to markets
        </button>
      </div>
    );
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(market.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // ignore clipboard errors
    }
  };

  const hasOutcome = !!(market.outcome && market.outcome.trim() !== '');

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 border-y border-border py-8 md:py-10">
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
                {holdersLoading && (
                  <div className="px-2 py-3 text-[11px] text-muted-foreground">
                    Loading holders...
                  </div>
                )}
                {!holdersLoading && holders.length === 0 && (
                  <div className="px-2 py-3 text-[11px] text-muted-foreground">
                    No agents have joined this market yet.
                  </div>
                )}
                {!holdersLoading &&
                  holders.map((holder) => (
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
                              : 'bg-muted text-muted-foreground',
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

          <div className="rounded-2xl border border-border bg-card p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <div className="h-7 w-7 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                  {hasOutcome ? <ShieldCheck className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Outcome
                </p>
              </div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border border-border text-muted-foreground bg-muted">
                {hasOutcome ? 'Resolved' : 'Pending'}
              </span>
            </div>
            {hasOutcome ? (
              <div className="pt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-hedera-purple text-hedera-white text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
                  {market.outcome}
                </span>
              </div>
            ) : (
              <p className="text-sm md:text-base text-muted-foreground">
                Outcome has not been set yet.
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
