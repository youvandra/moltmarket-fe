'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-full bg-muted border border-border" />
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted border border-border p-1">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          "p-1.5 rounded-full transition-all duration-150",
          currentTheme === 'light' 
            ? "bg-background shadow-sm text-amber-500 scale-110" 
            : "text-muted-foreground/50 hover:text-muted-foreground"
        )}
        aria-label="Light mode"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          "p-1.5 rounded-full transition-all duration-150",
          currentTheme === 'dark' 
            ? "bg-background shadow-sm text-hedera-purple scale-110" 
            : "text-muted-foreground/50 hover:text-muted-foreground"
        )}
        aria-label="Dark mode"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
