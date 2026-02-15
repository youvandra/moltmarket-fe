import { Trophy } from 'lucide-react';

export default function LeaderboardLoading() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border w-fit animate-pulse">
            <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="h-2 w-24 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="space-y-2">
            <div className="h-7 w-40 md:w-56 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-64 md:w-96 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border w-fit">
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
          <div className="h-2 w-32 rounded-full bg-muted-foreground/20" />
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 items-end md:items-stretch">
        <div className="flex w-full items-end justify-center gap-2 md:contents">
          {[2, 1, 3].map((rank, idx) => (
            <div
              key={rank}
              className={idx === 1 ? 'order-2 md:order-none flex-[1.2] md:flex-none z-10' : 'order-1 md:order-none flex-1 md:flex-none'}
            >
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-card p-4 md:p-8 h-full flex flex-col items-center text-center space-y-3 md:space-y-4 animate-pulse">
                <div className="h-10 w-10 md:h-16 md:w-16 rounded-lg md:rounded-2xl bg-muted flex items-center justify-center mb-1 md:mb-2" />
                <div className="space-y-1">
                  <div className="h-2 w-16 rounded-full bg-muted" />
                  <div className="h-3 w-24 md:w-40 rounded-full bg-muted" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 w-full pt-3 md:pt-4 border-t border-border/10">
                  <div>
                    <div className="h-2 w-12 rounded-full bg-muted mb-1" />
                    <div className="h-3 w-16 rounded-full bg-muted" />
                  </div>
                  <div className="hidden md:block">
                    <div className="h-2 w-12 rounded-full bg-muted mb-1" />
                    <div className="h-3 w-16 rounded-full bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-5 w-40 rounded-full bg-muted animate-pulse" />
        <div className="hidden md:block rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="border-b border-border bg-muted/30 h-10" />
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-8 py-4 gap-4 animate-pulse">
                <div className="h-3 w-10 rounded-full bg-muted" />
                <div className="flex-1 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted" />
                  <div className="h-3 w-40 rounded-full bg-muted" />
                </div>
                <div className="h-3 w-16 rounded-full bg-muted" />
                <div className="h-3 w-16 rounded-full bg-muted" />
                <div className="h-6 w-20 rounded-full bg-muted" />
                <div className="h-3 w-10 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted" />
                  <div className="space-y-2">
                    <div className="h-3 w-32 rounded-full bg-muted" />
                    <div className="h-2 w-24 rounded-full bg-muted" />
                  </div>
                </div>
                <div className="h-6 w-20 rounded-full bg-muted" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <div className="h-2 w-12 rounded-full bg-muted" />
                  <div className="h-3 w-16 rounded-full bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-12 rounded-full bg-muted" />
                  <div className="h-3 w-16 rounded-full bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

