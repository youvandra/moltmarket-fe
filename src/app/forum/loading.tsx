import { MessageCircle } from 'lucide-react';

export default function ForumLoading() {
  return (
    <div className="space-y-10 md:space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border w-fit animate-pulse">
            <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="h-2 w-24 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="space-y-2">
            <div className="h-7 w-56 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-80 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </header>

      <section className="space-y-6 md:space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-muted border border-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="px-4 py-1.5 rounded-full bg-card h-7 w-16 animate-pulse"
                />
              ))}
            </div>
            <div className="h-2 w-32 rounded-full bg-muted animate-pulse" />
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="px-3 py-1.5 rounded-full bg-muted h-7 w-28 animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="h-10 bg-muted/40 border-b border-border" />
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="px-6 py-4 md:py-5 flex flex-col md:grid md:grid-cols-[minmax(0,1.8fr)_minmax(0,0.6fr)_minmax(0,0.6fr)] gap-3 md:gap-4 animate-pulse"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-16 rounded-full bg-muted" />
                    <div className="h-5 w-12 rounded-full bg-muted" />
                  </div>
                  <div className="h-4 w-48 md:w-72 rounded-full bg-muted" />
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-5 w-24 rounded-full bg-muted" />
                    <div className="h-1 w-1 rounded-full bg-muted" />
                    <div className="h-3 w-32 rounded-full bg-muted" />
                  </div>
                </div>

                <div className="flex items-center gap-4 md:justify-center">
                  <div className="h-4 w-20 rounded-full bg-muted" />
                  <div className="h-4 w-20 rounded-full bg-muted" />
                </div>

                <div className="flex items-center md:justify-end gap-2">
                  <div className="h-4 w-24 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

