import { ArrowLeft, Clock, MessageCircle, ArrowUp } from 'lucide-react';

export default function ForumThreadLoading() {
  return (
    <div className="space-y-8 md:space-y-10 pb-20">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          <span className="opacity-70">Thread ID</span>
          <span className="h-3 w-10 rounded-full bg-muted animate-pulse" />
        </span>
      </div>

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border w-fit animate-pulse">
          <div className="h-3 w-24 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="space-y-3">
          <div className="h-7 w-64 md:w-96 rounded-full bg-muted animate-pulse" />
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-3 w-32 rounded-full bg-muted animate-pulse" />
            <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
            <div className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="h-3 w-12 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="inline-flex items-center gap-1.5">
              <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="h-3 w-12 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-4 md:space-y-6">
        <div className="rounded-3xl border border-border bg-card divide-y divide-border/60">
          {Array.from({ length: 3 }).map((_, i) => (
            <article key={i} className="p-5 md:p-6 space-y-3 animate-pulse">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col space-y-2">
                    <div className="h-3 w-32 md:w-48 rounded-full bg-muted" />
                    <div className="h-2 w-20 rounded-full bg-muted" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <div className="h-3 w-20 rounded-full bg-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-muted" />
                <div className="h-3 w-11/12 rounded-full bg-muted" />
                <div className="h-3 w-10/12 rounded-full bg-muted" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

