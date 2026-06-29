import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export function MetricCard({
  label,
  value,
  detail,
  status = 'neutral',
  icon: Icon,
}: {
  label: string;
  value: string;
  detail?: string;
  status?: 'neutral' | 'ok' | 'warning' | 'error';
  icon?: LucideIcon;
}) {
  const statusBorder = {
    neutral: 'border-border',
    ok: 'border-emerald-500/30',
    warning: 'border-amber-500/30',
    error: 'border-destructive/30',
  }[status];

  return (
    <div className={cn('rounded-xl border bg-card p-4', statusBorder)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

export function QuotaBar({
  used,
  limit,
  label = 'Monthly quota',
}: {
  used: number;
  limit: number;
  label?: string;
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const tone = pct >= 90 ? 'bg-destructive' : pct >= 70 ? 'bg-amber-500' : 'bg-primary';

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {used.toLocaleString()} / {limit > 0 ? limit.toLocaleString() : '∞'}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-all', tone)} style={{ width: `${pct}%` }} />
      </div>
      {pct >= 70 && (
        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          {pct >= 90 ? 'Quota nearly exhausted — upgrade to avoid throttling.' : 'Approaching monthly quota.'}
        </p>
      )}
    </div>
  );
}
