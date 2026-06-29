'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWatchlist } from '@/hooks/use-user-session';
import { API_URL } from '@/lib/api-url';
import { ResultPanel } from './result-panel';

interface MonitorResult {
  hostname: string;
  success: boolean;
  daysRemaining?: number | null;
  validTo?: string;
  expired?: boolean;
  expiringSoon?: boolean;
  error?: string;
}

export function SslExpiryMonitorTool() {
  const { items, add, remove, update } = useWatchlist();
  const sslItems = items.filter((i) => i.type === 'ssl');
  const [hostname, setHostname] = useState('');
  const [alertDays, setAlertDays] = useState('30');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MonitorResult[] | null>(null);

  const runMonitor = async () => {
    if (sslItems.length === 0) return;
    setLoading(true);
    const batch: MonitorResult[] = [];

    for (const item of sslItems) {
      try {
        const res = await fetch(
          `${API_URL}/api/v1/ssl/expiry?hostname=${encodeURIComponent(item.value)}`,
        );
        const data = (await res.json()) as MonitorResult & { hostname?: string };
        const entry: MonitorResult = {
          hostname: item.value,
          success: data.success !== false,
          daysRemaining: data.daysRemaining,
          validTo: data.validTo,
          expired: data.expired,
          expiringSoon: data.expiringSoon,
          error: data.error,
        };
        batch.push(entry);

        const threshold = item.alertDays ?? 30;
        let status: 'ok' | 'warning' | 'error' | 'unknown' = 'unknown';
        let detail = 'Checked';
        if (!entry.success) {
          status = 'error';
          detail = entry.error ?? 'Check failed';
        } else if (entry.expired) {
          status = 'error';
          detail = 'Certificate expired';
        } else if ((entry.daysRemaining ?? 999) <= threshold) {
          status = 'warning';
          detail = `Expires in ${entry.daysRemaining} days`;
        } else {
          status = 'ok';
          detail = `${entry.daysRemaining} days remaining`;
        }
        update(item.id, {
          lastChecked: Date.now(),
          lastStatus: status,
          lastDetail: detail,
        });
      } catch {
        batch.push({ hostname: item.value, success: false, error: 'Request failed' });
      }
    }

    setResults(batch);
    setLoading(false);
  };

  const alerts = sslItems.filter(
    (i) => i.lastStatus === 'warning' || i.lastStatus === 'error',
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Watchlist</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add hostnames to monitor. Status is stored in your browser and checked on demand.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
            <div className="space-y-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input
                id="hostname"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                placeholder="example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-days">Alert within (days)</Label>
              <Input
                id="alert-days"
                type="number"
                min={1}
                max={365}
                value={alertDays}
                onChange={(e) => setAlertDays(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                onClick={() => {
                  const value = hostname.trim();
                  if (!value) return;
                  add({
                    type: 'ssl',
                    label: value,
                    value,
                    alertDays: parseInt(alertDays, 10) || 30,
                  });
                  setHostname('');
                }}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {sslItems.length > 0 ? (
            <ul className="divide-y divide-border rounded-xl border border-border">
              {sslItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.value}</p>
                    <p className="text-muted-foreground">
                      Alert ≤ {item.alertDays ?? 30} days
                      {item.lastDetail ? ` · ${item.lastDetail}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.lastStatus === 'ok' && (
                      <CheckCircle2 className="h-4 w-4 text-success" aria-label="OK" />
                    )}
                    {item.lastStatus === 'warning' && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" aria-label="Warning" />
                    )}
                    {item.lastStatus === 'error' && (
                      <AlertTriangle className="h-4 w-4 text-destructive" aria-label="Error" />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.value}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No hostnames on the watchlist yet.</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={runMonitor} disabled={loading || sslItems.length === 0}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Check all certificates
            </Button>
            <Link href="/workspace" className={buttonVariants({ variant: 'outline' })}>
              Open workspace
            </Link>
          </div>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
          <p className="font-semibold text-amber-700 dark:text-amber-400">
            {alerts.length} alert{alerts.length === 1 ? '' : 's'}
          </p>
          <ul className="mt-1 list-inside list-disc text-muted-foreground">
            {alerts.map((a) => (
              <li key={a.id}>
                {a.value}: {a.lastDetail}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results && (
        <section aria-label="Monitor results">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Results
          </h2>
          <ResultPanel result={{ success: true, checked: results.length, results }} filename="ssl-monitor" />
        </section>
      )}
    </div>
  );
}
