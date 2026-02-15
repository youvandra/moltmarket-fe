'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 max-w-lg"
      >
        {/* Animated 404 Visual */}
        <div className="relative">
          <h1 className="text-[12rem] font-bold leading-none tracking-tighter text-foreground/5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-3xl bg-hedera-purple/10 flex items-center justify-center border border-hedera-purple/20 animate-pulse">
              <Search className="h-10 w-10 text-hedera-purple" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-medium tracking-tight text-foreground">
            Market not found
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The page you are looking for doesn't exist or has been moved to a different resolution.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-[0.2em] transition-all hover:opacity-90 active:scale-[0.98] shadow-xl"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-muted border border-border text-foreground px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-muted/80 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Support Link */}
        <p className="pt-8 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
          Need help? <Link href="#" className="text-hedera-purple hover:underline">Contact Support</Link>
        </p>
      </motion.div>
    </div>
  );
}
