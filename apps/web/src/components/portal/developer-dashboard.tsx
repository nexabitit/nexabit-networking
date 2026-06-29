'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import {
  getTierDefinition,
  getMonthlyQuotaForTier,
  SITE_CONFIG,
} from '@nexabit/shared';
import { useDeveloperAccount } from '@/hooks/use-developer-session';
import { useStoredApiKey } from '@/hooks/use-team-session';
import { PortalShell } from '@/components/portal/portal-shell';
import { MetricCard, QuotaBar } from '@/components/portal/metric-cards';
import { PricingTableFull } from '@/components/portal/pricing-table';
import { ApiKeyManager } from '@/components/team/api-key-manager';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_URL } from '@/lib/api-url';
import { useState } from 'react';

export function DeveloperDashboard() {
  const router = useRouter();
  const { account, isLoggedIn, isVerified, logout } = useDeveloperAccount();
  const { meta } = useStoredApiKey();
  const [usage, setUsage] = useState<{ totalRequests?: number; rateLimit?: number } | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !isVerified) {
      router.replace('/developers/login');
    }
  }, [isLoggedIn, isVerified, router]);

  if (!account || !isVerified) return null;

  const plan = getTierDefinition(account.plan);
  const monthlyQuota = getMonthlyQuotaForTier(account.plan);
  const used = usage?.totalRequests ?? 0;

  return (
    <PortalShell
      title="Developer dashboard"
      description={`Signed in as ${account.email} · ${plan.name} plan`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {account.role === 'admin' && (
            <span className="mr-2 rounded bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
              Admin
            </span>
          )}
          Manage API keys, monitor usage, and upgrade your plan.
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={() => { logout(); router.push('/developers'); }}>
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current plan" value={plan.name} detail={plan.priceLabel} />
        <MetricCard
          label="Rate limit"
          value={`${plan.requestsPerSecond} RPS`}
          detail={`${plan.rateLimit}/min burst`}
        />
        <MetricCard
          label="API keys"
          value={meta ? '1 active' : '0 active'}
          detail={`Up to ${plan.maxApiKeys} on ${plan.name}`}
          status={meta ? 'ok' : 'neutral'}
        />
        <MetricCard
          label="Applications"
          value={`0 / ${plan.maxApps}`}
          detail="Create an app when issuing keys"
        />
      </div>

      <QuotaBar used={used} limit={monthlyQuota} />

      <section id="keys">
        <ApiKeyManager
          id="create-key"
          requireVerified
          developerEmail={account.email}
          developerName={account.name}
          maxKeys={plan.maxApiKeys}
        />
      </section>

      <section id="usage">
        <h2 className="mb-4 text-xl font-bold">Usage & analytics</h2>
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6">
            <div className="text-sm text-muted-foreground">
              {plan.analyticsRetentionDays}-day retention on {plan.name}. Load live stats from your
              active API key.
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                const key = localStorage.getItem('nexabit-api-key-v1');
                if (!key) return;
                const res = await fetch(`${API_URL}/api/v1/account/usage`, {
                  headers: { 'X-API-Key': key },
                });
                const data = await res.json();
                setUsage(data);
              }}
            >
              Refresh usage
            </Button>
          </CardContent>
          {usage && (
            <CardContent className="border-t border-border pt-0">
              <pre className="max-h-48 overflow-auto rounded-lg bg-muted p-3 text-xs">
                {JSON.stringify(usage, null, 2)}
              </pre>
            </CardContent>
          )}
        </Card>
      </section>

      <section id="pricing">
        <h2 className="mb-4 text-xl font-bold">Pricing & billing</h2>
        <PricingTableFull currentPlan={account.plan} highlight="growth" />
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Billing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Paid plans (Starter, Growth, Team) activate via Razorpay or Stripe. Contact{' '}
              <a href={SITE_CONFIG.companyUrl} className="text-primary hover:underline">
                {SITE_CONFIG.company}
              </a>{' '}
              to enable billing on your account. Invoices and renewal dates will appear here once
              connected.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="support">
        <h2 className="mb-4 text-xl font-bold">Support</h2>
        <Card>
          <CardContent className="space-y-3 py-6 text-sm">
            <p>
              <strong>Rate-limit appeal:</strong> email ops@nexabitit.com with your key prefix and
              use case.
            </p>
            <p>
              <strong>Enterprise enquiry:</strong>{' '}
              <a href={`${SITE_CONFIG.companyUrl}/contact`} className="text-primary hover:underline">
                Contact {SITE_CONFIG.company}
              </a>
            </p>
            <Link href="/api-docs" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              API documentation
            </Link>
          </CardContent>
        </Card>
      </section>
    </PortalShell>
  );
}
