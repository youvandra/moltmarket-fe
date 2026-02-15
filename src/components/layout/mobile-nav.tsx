'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Search, Wallet, MoreHorizontal, Settings, Sun, Moon, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { SearchModal } from './search-modal';
import { MarketModalMobile } from './market-modal-mobile';

export function MobileNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);

  const navItems = [
    { name: 'Markets', href: '/markets', icon: LayoutGrid },
  ];

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-lg border-t border-border px-6 pb-safe-area-inset-bottom">
        <nav className="flex items-center justify-between h-16 max-w-md mx-auto">
          <button
            onClick={() => setIsMarketModalOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all active:scale-90",
              pathname.startsWith('/markets') || isMarketModalOpen ? "text-hedera-purple" : "text-muted-foreground"
            )}
          >
            <LayoutGrid className={cn("h-6 w-6", (pathname.startsWith('/markets') || isMarketModalOpen) && "fill-hedera-purple/10")} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Markets</span>
          </button>

          <button
            onClick={() => setIsSearchModalOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all active:scale-90",
              isSearchModalOpen ? "text-hedera-purple" : "text-muted-foreground"
            )}
          >
            <Search className="h-6 w-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Search</span>
          </button>

          <Link
            href="/portfolio"
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all active:scale-90",
              pathname.startsWith('/portfolio') ? "text-hedera-purple" : "text-muted-foreground"
            )}
          >
            <Wallet className={cn("h-6 w-6", pathname.startsWith('/portfolio') && "fill-hedera-purple/10")} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Portfolio</span>
          </Link>

          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all active:scale-90",
              isMoreOpen ? "text-hedera-purple" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-6 w-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">More</span>
          </button>
        </nav>
      </div>

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />

      <MarketModalMobile
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
      />

      {/* More Menu Overlay */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMoreOpen(false)}>
          <div 
            className="absolute bottom-20 left-4 right-4 bg-card border border-border rounded-3xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/leaderboard" 
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-all"
                onClick={() => setIsMoreOpen(false)}
              >
                <Trophy className="h-6 w-6 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Leaderboard</span>
              </Link>

              <button 
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  setIsMoreOpen(false);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-all"
              >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                <span className="text-xs font-bold uppercase tracking-wider">Appearance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
