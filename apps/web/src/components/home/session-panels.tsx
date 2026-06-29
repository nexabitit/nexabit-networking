'use client';

import Link from 'next/link';
import { Clock, Star, Trash2 } from 'lucide-react';
import { getToolBySlug } from '@nexabit/shared';
import { useRecentChecks, useFavorites } from '@/hooks/use-user-session';
import { Button, buttonVariants } from '@/components/ui/button';

function formatTime(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts));
}

export function RecentChecksPanel() {
  const { checks, clear } = useRecentChecks();

  if (checks.length === 0) return null;

  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Recently used</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Stored locally in your browser — resume diagnostics quickly.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={clear}>
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
            <Link href="/workspace" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              Workspace
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {checks.slice(0, 8).map((check) => (
            <Link
              key={check.id}
              href={check.href}
              className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              <p className="font-medium group-hover:text-primary">{check.toolName}</p>
              <p className="mt-1 truncate font-mono text-sm text-muted-foreground">{check.input}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTime(check.timestamp)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FavoritesPanel() {
  const { favorites } = useFavorites();
  const tools = favorites
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  if (tools.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-center gap-2">
        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        <h2 className="text-2xl font-bold">Your favorites</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
