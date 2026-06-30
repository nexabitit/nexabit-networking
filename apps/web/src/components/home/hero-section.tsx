'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/search-bar';
import { QuickLaunchChips } from '@/components/home/quick-launch-chips';
import { SITE_CONFIG } from '@nexabit/shared';
import { Code2, Zap, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 grid-bg" />
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      <div className="container relative mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
            {SITE_CONFIG.name}
          </p>

          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {SITE_CONFIG.heroHeadline}
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {SITE_CONFIG.heroSubline}
          </p>

          <div className="mb-6 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
            >
              <Zap className="h-4 w-4" />
              Browse all tools
            </Link>
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              <Code2 className="h-4 w-4" />
              API Docs
            </Link>
            <Link
              href="/developers/login"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              Get API access
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mb-8 text-sm text-muted-foreground">{SITE_CONFIG.trustLine}</p>

          <div className="mb-6 max-w-xl">
            <SearchBar />
          </div>

          <QuickLaunchChips />
        </div>
      </div>
    </section>
  );
}
