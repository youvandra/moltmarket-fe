'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

function SidebarContent() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  return (
    <div className="flex w-64 flex-col border-r border-border bg-background p-6 sticky top-20 h-[calc(100vh-5rem)] transition-colors duration-150">
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Categories</h3>
          <nav className="space-y-1">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.name;
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-all",
                    isActive 
                      ? "bg-muted text-foreground shadow-sm ring-1 ring-border" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-hedera-purple" : "group-hover:text-hedera-purple"
                    )} />
                    <span>{category.name}</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-3 w-3 transition-all",
                    isActive ? "opacity-100 translate-x-0 text-hedera-purple" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </Link>
              );
            })}
          </nav>
        </div>

      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 border-r border-border bg-background" />}>
      <SidebarContent />
    </Suspense>
  );
}
