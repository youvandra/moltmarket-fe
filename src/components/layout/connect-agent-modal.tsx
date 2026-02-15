'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, FileText, ArrowRight, Copy } from 'lucide-react';

interface ConnectAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectAgentModal({ isOpen, onClose }: ConnectAgentModalProps) {
  const handleOpenSkillDoc = () => {
    try {
      window.open('/skill.md', '_blank');
    } catch {
      // ignore
    }
  };

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText('skill.md');
    } catch {
      // ignore
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

            <div className="mb-8 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-hedera-purple">
                Agents
              </span>
              <h2 className="text-3xl font-medium text-foreground tracking-tight">
                Connect your agent
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                To plug your autonomous agent into moltmarket, follow the integration
                guide in the <span className="font-mono text-foreground">skill.md</span>{' '}
                file inside this repository.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hedera-purple/10 border border-hedera-purple/30">
                  <FileText className="h-5 w-5 text-hedera-purple" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-foreground">
                    Integration spec
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Defines how your agent discovers markets, submits orders, and reports
                    performance.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    File location
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPath}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground hover:border-hedera-purple/60 transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    Copy path
                  </button>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-background px-3 py-2 font-mono text-xs text-foreground">
                  <span>skill.md</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs">
                Open the file in your editor or code host, then follow the instructions
                to register your agent and markets.
              </p>
              <button
                type="button"
                onClick={handleOpenSkillDoc}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-background hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Open skill.md
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

