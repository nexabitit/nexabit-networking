import Link from 'next/link';
import { QUICK_LAUNCH } from '@nexabit/shared';

export function QuickLaunchChips() {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="mr-1 self-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Quick launch
      </span>
      {QUICK_LAUNCH.map((item) => (
        <Link
          key={item.slug}
          href={`/tools/${item.slug}`}
          className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
