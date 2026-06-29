'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Star,
  Trash2,
} from 'lucide-react';
import { getToolBySlug, SITE_CONFIG } from '@nexabit/shared';
import { useFavorites, useRecentChecks, useWatchlist } from '@/hooks/use-user-session';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_URL } from '@/lib/api-url';
import { useState } from 'react';

function formatTime(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts));
}

export function WorkspaceDashboard() {
  const { checks, clear: clearRecent } = useRecentChecks();
  const { favorites, toggle } = useFavorites();
  const { items, add, remove, update, clear: clearWatchlist } = useWatchlist();
  const [newHost, setNewHost] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newEndpoint, setNewEndpoint] = useState('');
  const [checking, setChecking] = useState(false);

  const favoriteTools = favorites
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  const sslItems = items.filter((i) => i.type === 'ssl');
  const endpointItems = items.filter((i) => i.type === 'endpoint');
  const alerts = items.filter((i) => i.lastStatus === 'warning' || i.lastStatus === 'error');

  const checkSslWatchlist = async () => {
    setChecking(true);
    for (const item of sslItems) {
      try {
        const res = await fetch(
          `${API_URL}/api/v1/ssl/expiry?hostname=${encodeURIComponent(item.value)}`,
        );
        const data = await res.json();
        const threshold = item.alertDays ?? 30;
        let status: 'ok' | 'warning' | 'error' | 'unknown' = 'unknown';
        let detail = 'Checked';
        if (data.success === false) {
          status = 'error';
          detail = data.error ?? 'Check failed';
        } else if (data.expired) {
          status = 'error';
          detail = 'Certificate expired';
        } else if ((data.daysRemaining ?? 999) <= threshold) {
          status = 'warning';
          detail = `Expires in ${data.daysRemaining} days`;
        } else {
          status = 'ok';
          detail = `${data.daysRemaining} days remaining`;
        }
        update(item.id, { lastChecked: Date.now(), lastStatus: status, lastDetail: detail });
      } catch {
        update(item.id, {
          lastChecked: Date.now(),
          lastStatus: 'error',
          lastDetail: 'Request failed',
        });
      }
    }
    setChecking(false);
  };

  const checkEndpoints = async () => {
    setChecking(true);
    for (const item of endpointItems) {
      try {
        const url = item.value.startsWith('http') ? item.value : `https://${item.value}`;
        const res = await fetch(
          `${API_URL}/api/v1/network/http-headers?url=${encodeURIComponent(url)}`,
        );
        const data = await res.json();
        if (data.success === false) {
          update(item.id, {
            lastChecked: Date.now(),
            lastStatus: 'error',
            lastDetail: data.error ?? 'Unreachable',
          });
        } else if (data.status && data.status >= 400) {
          update(item.id, {
            lastChecked: Date.now(),
            lastStatus: 'warning',
            lastDetail: `HTTP ${data.status}`,
          });
        } else {
          update(item.id, {
            lastChecked: Date.now(),
            lastStatus: 'ok',
            lastDetail: `HTTP ${data.status} · grade ${data.analysis?.grade ?? '—'}`,
          });
        }
      } catch {
        update(item.id, {
          lastChecked: Date.now(),
          lastStatus: 'error',
          lastDetail: 'Request failed',
        });
      }
    }
    setChecking(false);
  };

  return (
    <div className="space-y-8">
      {alerts.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-4">
          <p className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            {alerts.length} active alert{alerts.length === 1 ? '' : 's'}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {alerts.map((a) => (
              <li key={a.id}>
                <span className="font-medium text-foreground">{a.value}</span> — {a.lastDetail}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent checks</CardTitle>
            {checks.length > 0 && (
              <Button type="button" variant="ghost" size="sm" onClick={clearRecent}>
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {checks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Run any tool to populate recent checks. Data stays in this browser only.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {checks.map((check) => (
                  <li key={check.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                    <div className="min-w-0">
                      <Link href={check.href} className="font-medium hover:text-primary">
                        {check.toolName}
                      </Link>
                      <p className="truncate font-mono text-muted-foreground">{check.input}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatTime(check.timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteTools.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Star tools from any tool page to pin them here.
              </p>
            ) : (
              <ul className="space-y-2">
                {favoriteTools.map((tool) => (
                  <li key={tool.slug} className="flex items-center justify-between gap-2">
                    <Link href={`/tools/${tool.slug}`} className="text-sm font-medium hover:text-primary">
                      {tool.name}
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggle(tool.slug)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Watchlist</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track SSL certificates, domains, and endpoints. Alerts update when you run checks.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={checking || sslItems.length === 0}
              onClick={checkSslWatchlist}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
              Check SSL
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={checking || endpointItems.length === 0}
              onClick={checkEndpoints}
            >
              Check endpoints
            </Button>
            {items.length > 0 && (
              <Button type="button" size="sm" variant="ghost" onClick={clearWatchlist}>
                Clear all
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>SSL hostname</Label>
              <div className="flex gap-2">
                <Input
                  value={newHost}
                  onChange={(e) => setNewHost(e.target.value)}
                  placeholder="example.com"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => {
                    const value = newHost.trim();
                    if (!value) return;
                    add({ type: 'ssl', label: value, value, alertDays: 30 });
                    setNewHost('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Domain (DNS)</Label>
              <div className="flex gap-2">
                <Input
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="example.com"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => {
                    const value = newDomain.trim();
                    if (!value) return;
                    add({ type: 'domain', label: value, value });
                    setNewDomain('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Endpoint URL</Label>
              <div className="flex gap-2">
                <Input
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  placeholder="https://api.example.com"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => {
                    const value = newEndpoint.trim();
                    if (!value) return;
                    add({ type: 'endpoint', label: value, value });
                    setNewEndpoint('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No watchlist items yet.</p>
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.value}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {item.type}
                      {item.lastDetail ? ` · ${item.lastDetail}` : ''}
                      {item.lastChecked ? ` · ${formatTime(item.lastChecked)}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.lastStatus === 'ok' && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {item.lastStatus === 'warning' && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    {item.lastStatus === 'error' && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
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
          )}

          <p className="text-xs text-muted-foreground">
            <Clock className="mr-1 inline h-3 w-3" />
            Watchlist data is stored locally. For scheduled monitoring and team alerts, contact{' '}
            <a href={SITE_CONFIG.companyUrl} className="text-primary hover:underline">
              {SITE_CONFIG.company}
            </a>
            .
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/tools/ssl-expiry-monitor" className={buttonVariants()}>
          SSL Expiry Monitor
        </Link>
        <Link href="/tools/bulk-dns-lookup" className={buttonVariants({ variant: 'outline' })}>
          Bulk DNS Lookup
        </Link>
        <Link href="/tools/http-security-headers" className={buttonVariants({ variant: 'outline' })}>
          HTTP Headers Checker
        </Link>
      </div>
    </div>
  );
}
