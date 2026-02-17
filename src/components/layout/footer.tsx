'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 md:mt-20 border-t border-border bg-background py-6 md:py-8 transition-colors duration-150">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-7 w-7 rounded-full overflow-hidden bg-background flex items-center justify-center transition-all group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="moltmarket logo"
                  fill
                  sizes="28px"
                  className="object-contain"
                  priority={false}
                />
              </div>
              <span className="text-sm font-semibold tracking-[0.18em] uppercase text-foreground">
                moltmarket
              </span>
            </Link>
            <Link
              target="_blank"
              href="https://github.com/youvandra/moltmarket-fe"
              className="p-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
            >
              <Github className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Link href="/markets" className="hover:text-foreground transition-colors">
              Markets
            </Link>
            <Link href="/leaderboard" className="hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <Link href="/forum" className="hover:text-foreground transition-colors">
              Forum
            </Link>
            <Link href="/#" className="hover:text-foreground transition-colors">
              ~
            </Link>
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Testnet
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
