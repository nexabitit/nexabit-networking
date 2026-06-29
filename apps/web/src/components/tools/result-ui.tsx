'use client';

import { cn } from '@/lib/utils';

export type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const toneStyles: Record<Tone, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400',
  neutral: 'border-border bg-muted/50 text-muted-foreground',
};

export function StatusBadge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: unknown;
  tone?: Tone;
}) {
  const display =
    typeof value === 'string' || typeof value === 'number' ? value : formatValue(value);

  return (
    <div className={cn('rounded-xl border px-4 py-3', toneStyles[tone])}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-lg font-semibold break-all">{display}</p>
    </div>
  );
}

export function SectionCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card', className)}>
      {title && (
        <div className="border-b border-border bg-muted/30 px-4 py-2.5">
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function KeyValueTable({
  rows,
  columns = 2,
}: {
  rows: Array<{ key: string; value: unknown }>;
  columns?: 1 | 2 | 3;
}) {
  const colClass =
    columns === 1 ? 'grid-cols-1' : columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <dl className={cn('grid gap-3', colClass)}>
      {rows.map(({ key, value }) => (
        <div key={key} className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{key}</dt>
          <dd className="mt-1 text-sm font-medium break-all">
            {typeof value === 'object' && value !== null && !Array.isArray(value)
              ? formatValue(value)
              : (value as React.ReactNode) ?? '—'}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DataTable({
  columns,
  rows,
  emptyMessage = 'No data',
}: {
  columns: Array<{ key: string; label: string; className?: string }>;
  rows: Array<Record<string, unknown>>;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-4 py-2.5 font-semibold text-muted-foreground', col.className)}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/20">
              {columns.map((col) => {
                const cell = row[col.key];
                return (
                  <td key={col.key} className={cn('px-4 py-3 align-top break-all', col.className)}>
                    {cell !== null && cell !== undefined && typeof cell !== 'object'
                      ? String(cell)
                      : (cell as React.ReactNode) ?? '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeBlock({ content, label }: { content: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {label && (
        <div className="border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      )}
      <pre className="max-h-[400px] overflow-auto bg-slate-950 p-4 text-sm leading-relaxed text-slate-100 dark:bg-slate-900">
        <code>{content}</code>
      </pre>
    </div>
  );
}

export function GradeBadge({ grade }: { grade: string }) {
  const tone: Tone =
    grade === 'A' ? 'success' : grade === 'B' ? 'info' : grade === 'C' ? 'warning' : 'error';

  return (
    <div
      className={cn(
        'flex h-20 w-20 items-center justify-center rounded-2xl border-4 text-3xl font-black',
        toneStyles[tone],
      )}
    >
      {grade}
    </div>
  );
}

export function ProgressBar({
  value,
  max = 100,
  label,
  tone = 'info',
}: {
  value: number;
  max?: number;
  label?: string;
  tone?: Tone;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor =
    tone === 'success'
      ? 'bg-emerald-500'
      : tone === 'warning'
        ? 'bg-amber-500'
        : tone === 'error'
          ? 'bg-red-500'
          : 'bg-primary';

  return (
    <div>
      {label && <p className="mb-1 text-sm font-medium">{label}</p>}
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{pct}%</p>
    </div>
  );
}

export function PermissionGrid({
  owner,
  group,
  others,
}: {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
}) {
  const rows = [
    { name: 'Owner', perms: owner },
    { name: 'Group', perms: group },
    { name: 'Others', perms: others },
  ];

  return (
    <DataTable
      columns={[
        { key: 'name', label: '' },
        { key: 'read', label: 'Read' },
        { key: 'write', label: 'Write' },
        { key: 'execute', label: 'Execute' },
      ]}
      rows={rows.map((row) => ({
        name: row.name,
        read: row.perms.read ? '✓' : '—',
        write: row.perms.write ? '✓' : '—',
        execute: row.perms.execute ? '✓' : '—',
      }))}
    />
  );
}

export function formatValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    if (value.every((v) => typeof v === 'string' || typeof v === 'number')) {
      return value.join(', ');
    }
    return JSON.stringify(value, null, 2);
  }
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}
