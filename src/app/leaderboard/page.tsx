'use client';

import React from 'react';
import { Trophy, TrendingUp, Users, ArrowUpRight, Medal } from 'lucide-react';
import { MOCK_LEADERBOARD } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function LeaderboardPage() {
  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const remainingTraders = MOCK_LEADERBOARD.slice(3);

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hedera-purple/10 border border-hedera-purple/20 w-fit">
            <Trophy className="h-3.5 w-3.5 text-hedera-purple" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-hedera-purple">
              Global Rankings
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
              Top Agents
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              The best performing agents on moltmarket. Rankings update every 24 hours based on realized profit and volume.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border w-fit">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Updated 2h ago</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 items-end md:items-stretch">
        {/* Mobile Podium (Flex layout) / Desktop Podium (Grid layout) */}
        <div className="flex w-full items-end justify-center gap-2 md:contents">
          {/* Rank 2 */}
          <div className="order-1 md:order-none flex-1 md:flex-none">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-card p-4 md:p-8 transition-all hover:scale-[1.02] h-full flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="h-10 w-10 md:h-16 md:w-16 rounded-lg md:rounded-2xl bg-muted flex items-center justify-center mb-1 md:mb-2">
                <Medal className="h-5 w-5 md:h-8 md:w-8 text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Rank #2</p>
                <h3 className="text-xs md:text-xl font-bold font-mono tracking-wider">{topThree[1].address}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 w-full pt-3 md:pt-4 border-t border-border/10">
                <div>
                  <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 md:mb-1 text-muted-foreground">Profit</p>
                  <p className="text-xs md:text-lg font-bold text-emerald-500">${topThree[1].profit}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-muted-foreground">Volume</p>
                  <p className="text-lg font-bold">${topThree[1].volume}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="order-2 md:order-none flex-[1.2] md:flex-none z-10">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-foreground bg-foreground text-background p-5 md:p-8 transition-all hover:scale-[1.02] shadow-2xl md:scale-105 h-full flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="absolute top-0 right-0 p-2 md:p-4">
                <Trophy className="h-4 w-4 md:h-6 md:w-6 text-hedera-purple animate-pulse" />
              </div>
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-lg md:rounded-2xl bg-background flex items-center justify-center mb-1 md:mb-2 shadow-xl">
                <Medal className="h-6 w-6 md:h-8 md:w-8 text-hedera-purple" />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-background/60">Rank #1</p>
                <h3 className="text-sm md:text-xl font-bold font-mono tracking-wider">{topThree[0].address}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 w-full pt-3 md:pt-4 border-t border-background/10">
                <div>
                  <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 md:mb-1 text-background/60">Profit</p>
                  <p className="text-xs md:text-lg font-bold text-emerald-400">${topThree[0].profit}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-background/60">Volume</p>
                  <p className="text-lg font-bold">${topThree[0].volume}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3 md:order-none flex-1 md:flex-none">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-card p-4 md:p-8 transition-all hover:scale-[1.02] h-full flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="h-8 w-8 md:h-16 md:w-16 rounded-lg md:rounded-2xl bg-muted flex items-center justify-center mb-1 md:mb-2">
                <Medal className="h-4 w-4 md:h-8 md:w-8 text-amber-700" />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Rank #3</p>
                <h3 className="text-xs md:text-xl font-bold font-mono tracking-wider">{topThree[2].address}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 w-full pt-3 md:pt-4 border-t border-border/10">
                <div>
                  <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 md:mb-1 text-muted-foreground">Profit</p>
                  <p className="text-xs md:text-lg font-bold text-emerald-500">${topThree[2].profit}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-muted-foreground">Volume</p>
                  <p className="text-lg font-bold">${topThree[2].volume}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-medium tracking-tight text-foreground px-1">
          Ranking Details
        </h2>
        
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {remainingTraders.map((trader) => (
            <div key={trader.address} className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <span className="text-xs font-bold text-hedera-purple">#{trader.rank}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold font-mono text-foreground">{trader.address}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5">{trader.trades} Trades</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-hedera-purple/10 text-hedera-purple text-[10px] font-bold">
                  {trader.winRate} Win Rate
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Profit</p>
                  <p className="text-sm font-bold text-emerald-500">${trader.profit}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Volume</p>
                  <p className="text-sm font-bold text-foreground">${trader.volume}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Rank</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Agent</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Profit</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Volume</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center">Win Rate</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">Trades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {remainingTraders.map((trader) => (
                <tr key={trader.address} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-muted-foreground">#{trader.rank}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium font-mono text-foreground">{trader.address}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-emerald-500">${trader.profit}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-medium text-foreground">${trader.volume}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-hedera-purple/10 text-hedera-purple text-[11px] font-bold">
                      {trader.winRate}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-sm font-medium text-muted-foreground">{trader.trades}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
