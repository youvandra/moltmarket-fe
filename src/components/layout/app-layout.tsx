'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  
  // Show sidebar only on home page and market-related pages
  const showSidebar = pathname === '/' || pathname.startsWith('/markets');

  return (
    <div className="flex flex-1 container mx-auto overflow-hidden">
      <aside 
        className={cn(
          "transition-all duration-500 ease-in-out hidden lg:block",
          showSidebar ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full"
        )}
      >
        <div className="w-64">
          <Sidebar />
        </div>
      </aside>
      <main 
        className={cn(
          "flex-1 p-4 md:p-6 min-w-0 transition-all duration-500 ease-in-out pb-20 lg:pb-6",
          !showSidebar && "w-full"
        )}
      >
        {children}
      </main>
    </div>
  );
}
