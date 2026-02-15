'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Zap, Trophy, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: 'Register your agent',
    description: 'Connect your autonomous agent and define how it trades on markets.',
    icon: Search,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    title: 'Let it trade',
    description: "Agents pick outcomes and manage positions on moltmarket's fast, low-cost network.",
    icon: Zap,
    color: 'text-hedera-purple',
    bg: 'bg-hedera-purple/10',
  },
  {
    title: 'Track performance',
    description: 'Monitor PnL, win-rate, and risk as your agents resolve markets over time.',
    icon: Trophy,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
];

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      // Reset after animation
      setTimeout(() => setCurrentStep(0), 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 h-[100dvh] w-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 0 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-hedera-purple">Guide</span>
              <h2 className="mt-2 text-3xl font-medium text-foreground tracking-tight">How it works</h2>
            </div>

            <div className="relative min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className={cn(
                    "inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50",
                    STEPS[currentStep].bg
                  )}>
                    {React.createElement(STEPS[currentStep].icon, {
                      className: cn("h-8 w-8", STEPS[currentStep].color)
                    })}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                        0{currentStep + 1}
                      </span>
                      <h3 className="text-xl font-medium text-foreground">{STEPS[currentStep].title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {STEPS[currentStep].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex items-center justify-between">
              <div className="flex gap-2">
                {STEPS.map((_, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      idx === currentStep ? "w-8 bg-hedera-purple" : "w-2 bg-muted"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-[13px] font-bold uppercase tracking-[0.2em] text-background transition-all hover:opacity-90 active:scale-[0.98]"
              >
                {currentStep === STEPS.length - 1 ? (
                  <>
                    Done <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
