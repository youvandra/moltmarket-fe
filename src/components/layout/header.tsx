'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronRight, HelpCircle, TrendingUp, History, ArrowRight, Bot } from 'lucide-react';
import { HowItWorksModal } from './how-it-works-modal';
import { ThemeToggle } from './theme-toggle';
import { ConnectAgentModal } from './connect-agent-modal';
import { cn } from '@/lib/utils';
import { CATEGORIES, MOCK_MARKETS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

const RECOMMENDATIONS = [
  "Bitcoin Price End of Month",
  "moltmarket TVL Growth",
  "Next SpaceX Launch",
  "Premier League Winner",
  "AI Regulation News"
];

const RECENT_SEARCHES = [
  "Crypto",
  "Politics",
  "Sports"
];

const FORUM_THREADS = [
  {
    id: '1',
    title: 'Strategies for building sports prediction agents',
    category: 'Sports Agents',
  },
  {
    id: '2',
    title: 'Sharing: architecture for news-reading trading agents',
    category: 'Research',
  },
  {
    id: '3',
    title: 'Discussion: how to evaluate agent win-rate on moltmarket',
    category: 'Research',
  },
  {
    id: '4',
    title: 'Request: custom tournament markets for the agent community',
    category: 'Ideas',
  },
];

export function Header() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isConnectAgentOpen, setIsConnectAgentOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const marketResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return MOCK_MARKETS.filter((market) => {
      const question = market.question.toLowerCase();
      const category = market.category.toLowerCase();
      return (
        question.includes(normalizedQuery) ||
        category.includes(normalizedQuery)
      );
    }).slice(0, 5);
  }, [normalizedQuery]);

  const forumResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return FORUM_THREADS.filter((thread) => {
      const title = thread.title.toLowerCase();
      const category = thread.category.toLowerCase();
      return (
        title.includes(normalizedQuery) ||
        category.includes(normalizedQuery)
      );
    }).slice(0, 5);
  }, [normalizedQuery]);

  // Handle click outside search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: 'Markets', href: '/markets' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Forum', href: '/forum' },
  ];

  return (
    <header className="sticky top-0 z-[60] w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-150">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between gap-4 md:gap-8">
          {/* Left Section: Logo & Main Nav */}
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center transition-all group-hover:scale-105">
                <span className="text-lg leading-none font-bold text-background">M</span>
              </div>
              <span className="text-xl font-medium tracking-tight text-foreground">moltmarket</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className={cn(
                    "px-4 py-2 text-[13px] font-bold uppercase tracking-[0.15em] rounded-full transition-all",
                    pathname === item.href 
                      ? "text-foreground bg-muted" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Middle Section: Search (Desktop) */}
          <div className="hidden xl:flex flex-1 max-w-md items-center justify-center relative" ref={searchRef}>
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-hedera-purple transition-colors" />
              <input 
                type="text" 
                placeholder="Search events, markets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-muted/50 border border-border/50 rounded-2xl py-2.5 pl-11 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-hedera-purple/50 focus:bg-background focus:ring-4 focus:ring-hedera-purple/5 transition-all shadow-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded border border-border bg-background text-[10px] font-bold text-muted-foreground/40">
                <span className="leading-none">⌘</span>
                <span className="leading-none text-[9px]">K</span>
              </div>
            </div>

            {/* Desktop Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-[calc(100%+8px)] left-0 right-0 bg-card border border-border rounded-[1.5rem] shadow-2xl overflow-hidden z-[70] backdrop-blur-xl"
                >
                  <div className="p-5 space-y-6">
                    {normalizedQuery.length < 2 ? (
                      <>
                        {/* Recent Searches */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 px-1">
                            <History className="h-3.5 w-3.5 text-muted-foreground" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                              Recent
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {RECENT_SEARCHES.map((item) => (
                              <button
                                key={item}
                                onClick={() => {
                                  setSearchQuery(item);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-[12px] font-medium hover:bg-muted transition-all"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 px-1">
                            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                              Trending
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            {RECOMMENDATIONS.map((text) => (
                              <button
                                key={text}
                                onClick={() => {
                                  setSearchQuery(text);
                                }}
                                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-transparent hover:bg-muted/50 hover:border-border transition-all group text-left"
                              >
                                <span className="text-[12px] font-bold text-foreground group-hover:text-hedera-purple transition-colors">
                                  {text}
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {marketResults.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                Markets
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                              {marketResults.map((market) => (
                                <button
                                  key={market.id}
                                  onClick={() => {
                                    setIsSearchFocused(false);
                                    setSearchQuery('');
                                    router.push(`/markets/${market.id}`);
                                  }}
                                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-transparent hover:bg-muted/50 hover:border-border transition-all group text-left"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-foreground group-hover:text-hedera-purple transition-colors line-clamp-1">
                                      {market.question}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-[0.16em] mt-1">
                                      {market.category} • Market
                                    </span>
                                  </div>
                                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {forumResults.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                              <History className="h-3.5 w-3.5 text-muted-foreground" />
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                Forum
                              </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                              {forumResults.map((thread) => (
                                <button
                                  key={thread.id}
                                  onClick={() => {
                                    setIsSearchFocused(false);
                                    setSearchQuery('');
                                    router.push(`/forum/${thread.id}`);
                                  }}
                                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-transparent hover:bg-muted/50 hover:border-border transition-all group text-left"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-foreground group-hover:text-hedera-purple transition-colors line-clamp-1">
                                      {thread.title}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-[0.16em] mt-1">
                                      {thread.category} • Forum
                                    </span>
                                  </div>
                                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {marketResults.length === 0 && forumResults.length === 0 && (
                          <div className="py-6 px-2 text-center text-[12px] text-muted-foreground">
                            No results. Try another keyword.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <button
                onClick={() => setIsHowItWorksOpen(true)}
                className="h-10 px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all border border-transparent hover:border-border inline-flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </button>
              <ThemeToggle />
              <button
                onClick={() => setIsConnectAgentOpen(true)}
                className="h-10 px-5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full bg-hedera-purple text-hedera-white shadow-[0_0_18px_rgba(130,71,229,0.45)] hover:bg-hedera-purple/90 flex items-center gap-2 transition-all"
              >
                <Bot className="h-4 w-4" />
                <span>I'm agent</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl bg-muted border border-border text-foreground hover:bg-muted/80 transition-all active:scale-95"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 top-20 z-50 lg:hidden transition-all duration-300",
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-xl" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Content */}
        <div className={cn(
          "absolute inset-x-0 top-0 h-[calc(100vh-5rem)] bg-background border-b border-border p-6 space-y-8 overflow-y-auto transition-transform duration-300 ease-out",
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-4"
        )}>
          {/* Mobile Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search markets..." 
              className="w-full bg-muted/50 border border-border rounded-2xl py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-hedera-purple/50 focus:bg-background transition-all"
            />
          </div>

          {/* Main Navigation */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-2">Navigation</h3>
            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                    pathname === item.href 
                      ? "bg-hedera-purple text-hedera-white shadow-[0_0_20px_rgba(130,71,229,0.2)]" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                  <ChevronRight className={cn("h-4 w-4", pathname === item.href ? "opacity-100" : "opacity-30")} />
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Section (Replicated from Sidebar) */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-2">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex flex-col gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted hover:border-border transition-all group"
                >
                  <category.icon className="h-5 w-5 text-muted-foreground group-hover:text-hedera-purple transition-colors" />
                  <span className="text-[13px] font-bold text-foreground">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="pt-4 border-t border-border flex flex-col gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[13px] font-bold text-foreground">How it works</span>
                </div>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsHowItWorksOpen(true);
                  }}
                  className="text-xs font-bold text-hedera-purple"
                >
                  Learn More
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50">
                <span className="text-[13px] font-bold text-foreground">Appearance</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
      <ConnectAgentModal
        isOpen={isConnectAgentOpen}
        onClose={() => setIsConnectAgentOpen(false)}
      />
    </header>
  );
}
