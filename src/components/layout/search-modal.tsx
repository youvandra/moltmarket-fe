'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, History, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[105] bg-background/60 backdrop-blur-sm lg:hidden"
          />
          
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-background flex flex-col h-[100dvh] w-[80vw] shadow-2xl border-r border-border lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-border">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-hedera-purple transition-colors" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search markets..."
                  className="w-full h-12 bg-muted/50 border border-border rounded-2xl pl-11 pr-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-hedera-purple/50 focus:bg-background transition-all"
                />
              </div>
              <button 
                onClick={onClose}
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-muted/50 text-foreground active:scale-90 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-10">
              {/* Recent Searches */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Recent Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RECENT_SEARCHES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm font-medium hover:bg-muted transition-all"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {RECOMMENDATIONS.map((text) => (
                    <button
                      key={text}
                      onClick={() => setQuery(text)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-border transition-all group text-left"
                    >
                      <span className="text-[13px] font-bold text-foreground group-hover:text-hedera-purple transition-colors">{text}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Categories Placeholder */}
              <div className="pt-4">
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-hedera-purple/10 to-transparent border border-hedera-purple/10 text-center">
                  <h4 className="text-sm font-bold text-foreground mb-2">Explore Categories</h4>
                  <p className="text-xs text-muted-foreground mb-4">Discover markets by your favorite topics</p>
                  <button className="h-10 px-6 rounded-full bg-hedera-purple text-hedera-white text-xs font-bold uppercase tracking-widest shadow-lg">
                    View All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
