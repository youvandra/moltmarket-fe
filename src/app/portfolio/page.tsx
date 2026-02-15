'use client';

import React, { useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_MARKETS } from '@/lib/constants';
import Link from 'next/link';
import { useSupabaseUser } from '@/providers/supabase-provider';
import { useRouter } from 'next/navigation';

const MOCK_POSITIONS = [
  {
    marketId: '1',
    outcome: 'Yes',
    amount: 100,
    avgPrice: 0.65,
    currentPrice: 0.72,
    pnl: 7.0,
    pnlPercentage: 10.7
  },
  {
    marketId: '2',
    outcome: 'No',
    amount: 50,
    avgPrice: 0.40,
    currentPrice: 0.35,
    pnl: -2.5,
    pnlPercentage: -12.5
  }
];

export default function PortfolioPage() {
  const user = useSupabaseUser();
  const router = useRouter();
  const address = user?.email || user?.id || '';

  useEffect(() => {
    if (user === null) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium text-foreground tracking-tight">Portfolio</h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full border border-border w-fit">
            <div className="h-1.5 w-1.5 rounded-full bg-hedera-purple animate-pulse" />
            <p className="text-muted-foreground font-mono text-[10px] font-bold tracking-widest uppercase">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="bg-card border border-border p-5 md:p-8 rounded-2xl min-w-0 md:min-w-[220px]">
            <p className="text-[9px] md:text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-2 md:mb-3">Total Balance</p>
            <p className="text-2xl md:text-4xl font-medium text-foreground tracking-tight">$1,245.50</p>
          </div>
          <div className="bg-card border border-border p-5 md:p-8 rounded-2xl min-w-0 md:min-w-[220px]">
            <p className="text-[9px] md:text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-2 md:mb-3">Total P/L</p>
            <p className="text-2xl md:text-4xl font-medium text-emerald-500 tracking-tight">+$45.20</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8 md:space-y-10">
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-[10px] md:text-[11px] font-bold flex items-center gap-3 text-muted-foreground uppercase tracking-[0.2em]">
              <TrendingUp className="h-4 w-4 text-hedera-purple" />
              Active Positions
            </h3>
            <div className="space-y-4 md:space-y-6">
              {MOCK_POSITIONS.map((pos) => {
                const market = MOCK_MARKETS.find(m => m.id === pos.marketId);
                if (!market) return null;
                
                return (
                  <Link 
                    key={pos.marketId}
                    href={`/markets/${pos.marketId}`}
                    className="block group bg-card border border-border hover:border-border/80 rounded-2xl p-6 md:p-8 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6 md:mb-8">
                      <div className="space-y-4">
                        <h4 className="text-xl md:text-2xl font-medium text-foreground group-hover:text-hedera-purple transition-colors leading-tight line-clamp-2 sm:line-clamp-none">
                          {market.question}
                        </h4>
                        <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
                          <span className={cn(
                            "px-3 md:px-4 py-1.5 rounded-full",
                            pos.outcome === 'Yes' ? "bg-hedera-purple/10 text-hedera-purple" : "bg-red-500/10 text-red-500"
                          )}>
                            {pos.outcome}
                          </span>
                          <span className="text-border">/</span>
                          <span className="text-muted-foreground">{pos.amount} Shares</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                        <p className="text-2xl md:text-3xl font-medium text-foreground tracking-tight">${(pos.amount * pos.currentPrice).toFixed(2)}</p>
                        <div className={cn(
                          "flex items-center gap-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]",
                          pos.pnl >= 0 ? "text-emerald-500" : "text-red-500"
                        )}>
                          {pos.pnl >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          {Math.abs(pos.pnlPercentage)}%
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-border text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                      <div>
                        <p className="mb-2 text-muted-foreground/40 truncate">Entry Price</p>
                        <p className="text-foreground text-sm md:text-base font-medium">${pos.avgPrice}</p>
                      </div>
                      <div>
                        <p className="mb-2 text-muted-foreground/40 truncate">Current Price</p>
                        <p className="text-foreground text-sm md:text-base font-medium">${pos.currentPrice}</p>
                      </div>
                      <div>
                        <p className="mb-2 text-muted-foreground/40 truncate">Total P/L</p>
                        <p className={cn("text-sm md:text-base font-medium", pos.pnl >= 0 ? "text-emerald-500" : "text-red-500")}>
                          {pos.pnl >= 0 ? '+' : '-'}${Math.abs(pos.pnl).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8 md:space-y-10">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8">
            <h3 className="text-[10px] md:text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-[0.2em]">
              <PieChart className="h-4 w-4 text-hedera-purple" />
              Allocation
            </h3>
            <div className="space-y-5 md:space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
                  <span className="text-muted-foreground">Politics</span>
                  <span className="text-foreground">65%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden border border-border/50">
                  <div className="bg-foreground h-full w-[65%] transition-all duration-1000" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
                  <span className="text-muted-foreground">Sports</span>
                  <span className="text-foreground">35%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden border border-border/50">
                  <div className="bg-hedera-purple h-full w-[35%] transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8">
            <h3 className="text-[10px] md:text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-[0.2em]">
              <History className="h-4 w-4 text-hedera-purple" />
              Activity
            </h3>
            <div className="space-y-6 md:space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 md:gap-5">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-muted flex items-center justify-center border border-border">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-foreground truncate leading-tight">Bought YES</p>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1.5">2h ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm font-medium text-foreground">$100.00</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
