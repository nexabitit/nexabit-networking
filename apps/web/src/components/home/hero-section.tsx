'use client';

import { useEffect, useState } from 'react';
import { SearchBar } from '@/components/search-bar';
import { SITE_CONFIG, TOOLS, CATEGORIES } from '@nexabit/shared';
import { Github, Sparkles, Zap, Code2 } from 'lucide-react';
import Link from 'next/link';

function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold tabular-nums text-foreground md:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 grid-bg" />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse-soft" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl animate-pulse-soft" />

      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
            style={{ animationDelay: '0ms' }}
          >
            <Sparkles className="h-4 w-4" />
            Open Source · Free Forever · API-First
          </div>

          <h1
            className="animate-fade-in-up mb-4 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
            style={{ animationDelay: '100ms' }}
          >
            <span className="text-gradient">{SITE_CONFIG.name}</span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
            style={{ animationDelay: '200ms' }}
          >
            {SITE_CONFIG.subtagline}
          </p>

          <div
            className="animate-fade-in-up mx-auto mb-10 max-w-xl"
            style={{ animationDelay: '300ms' }}
          >
            <SearchBar autoFocus={false} />
            <p className="mt-2 text-xs text-muted-foreground">
              Try: DNS lookup, SSL checker, CIDR calculator, WHOIS
            </p>
          </div>

          <div
            className="animate-fade-in-up flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '400ms' }}
          >
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="h-4 w-4" />
              Browse All Tools
            </Link>
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              <Code2 className="h-4 w-4" />
              API Docs
            </Link>
            <Link
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 border-t border-border/60 pt-12">
          <AnimatedStat value={TOOLS.length} label="Free Tools" suffix="+" />
          <AnimatedStat value={CATEGORIES.length} label="Categories" />
          <AnimatedStat value={100} label="Open Source" suffix="%" />
        </div>
      </div>
    </section>
  );
}
