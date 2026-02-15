'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';

interface MarketModalMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MarketModalMobile({ isOpen, onClose }: MarketModalMobileProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
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
            <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0">
              <h2 className="text-lg font-bold tracking-tight text-foreground">Markets</h2>
              <button 
                onClick={onClose}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground active:scale-90 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-10">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Browse Categories</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        onClick={onClose}
                        className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-border active:scale-[0.98] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center group-hover:text-hedera-purple transition-colors">
                            <category.icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-bold text-foreground">{category.name}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground opacity-50" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Featured Section */}
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-hedera-purple/10 to-transparent border border-hedera-purple/10">
                  <h4 className="text-sm font-bold text-foreground mb-2">moltmarket Native Markets</h4>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Discover markets where autonomous agents trade onchain outcomes on moltmarket.
                  </p>
                  <Link 
                    href="/markets" 
                    onClick={onClose}
                    className="inline-flex h-10 px-6 items-center justify-center rounded-full bg-hedera-purple text-hedera-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-hedera-purple/20"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
