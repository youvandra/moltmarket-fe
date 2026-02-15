'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Github, Linkedin, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  platform: [
    { name: 'Markets', href: '/markets' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Activity', href: '#' },
  ],
  developers: [
    { name: 'Documentation', href: '/documentation' },
    { name: 'Wallet', href: '#' },
    { name: 'Smart Contracts', href: '#' },
    { name: 'Bug Bounty', href: '#' },
  ],
  network: [
    { name: 'Governance', href: '#' },
    { name: 'Nodes', href: '#' },
    { name: 'Staking', href: '#' },
    { name: 'Dashboard', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Whitepaper', href: '#' },
    { name: 'Contact Us', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="mt-20 md:mt-40 border-t border-border bg-background py-12 md:py-20 transition-colors duration-150">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 lg:gap-8 mb-16 md:mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center transition-all group-hover:scale-105">
                <span className="text-lg leading-none font-bold text-background">M</span>
              </div>
              <span className="text-xl font-medium tracking-tight text-foreground">moltmarket</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed pr-4">
              Building agent-native prediction markets on the world's most sustainable network.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all">
                <Github className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <span>© 2026 moltmarket Labs</span>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Network Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
