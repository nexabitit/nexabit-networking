'use client';

import Link from 'next/link';
import { ArrowRight, Lock, Users } from 'lucide-react';
import { hasTeamAccess, SITE_CONFIG } from '@nexabit/shared';
import { useDeveloperAccount } from '@/hooks/use-developer-session';
import { TeamDashboard } from '@/components/team/team-dashboard';
import { PortalShell } from '@/components/portal/portal-shell';
import { PricingTeaser } from '@/components/portal/pricing-table';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const teamFeatures = [
  'Shared usage visibility across operators',
  'Up to 10 team seats on the Team plan',
  'MSP CSV exports and printable audit reports',
  'Shared watchlists and operational workspace',
  'Role-based member permissions (coming soon)',
];

export function TeamLanding() {
  return (
    <>
      <section className="mb-10 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Team</p>
        <h1 className="text-3xl font-bold md:text-4xl">Team & MSP workspace</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Centralize API usage, exports, and monitoring for IT teams and managed service providers.
          Team features require a logged-in developer account on Growth, Team, or Enterprise plans.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/developers/login" className={buttonVariants({ size: 'lg' })}>
            Log in to team workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/workspace" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            Personal workspace (no login)
          </Link>
        </div>
      </section>

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        {teamFeatures.map((feature) => (
          <Card key={feature}>
            <CardContent className="flex items-start gap-3 py-4 text-sm">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {feature}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-bold">Plans with team access</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Growth includes 3 seats. Team includes 10 seats and MSP exports.{' '}
          <Link href="/developers/login" className="text-primary hover:underline">
            Log in for full details
          </Link>
          .
        </p>
        <PricingTeaser className="xl:grid-cols-3" />
      </section>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4" />
            Access requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Verify your developer account, then upgrade to Growth or Team for shared dashboards. Free and
          Starter plans use the personal{' '}
          <Link href="/workspace" className="text-primary hover:underline">
            Workspace
          </Link>{' '}
          for browser-based retention. Contact{' '}
          <a href={SITE_CONFIG.companyUrl} className="text-primary hover:underline">
            {SITE_CONFIG.company}
          </a>{' '}
          for Enterprise SSO and white-label exports.
        </CardContent>
      </Card>
    </>
  );
}

export function TeamGatedDashboard() {
  const { account, isLoggedIn, isVerified } = useDeveloperAccount();

  if (!isLoggedIn || !isVerified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TeamLanding />
      </div>
    );
  }

  const canAccessTeam = account?.role === 'admin' || hasTeamAccess(account?.plan ?? 'free');

  if (!canAccessTeam) {
    return (
      <PortalShell
        title="Team dashboard"
        description="Upgrade to Growth or Team for shared MSP workflows."
        variant="team"
      >
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-8 text-center">
            <Lock className="mx-auto mb-3 h-8 w-8 text-amber-600" />
            <p className="font-semibold">Team features require a Growth or Team plan</p>
            <p className="mt-2 text-sm text-muted-foreground">
              You are on the {account?.plan} plan. Upgrade to unlock shared seats, MSP exports, and
              team usage views.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/developers/dashboard#pricing" className={buttonVariants()}>
                View plans & upgrade
              </Link>
              <Link href="/workspace" className={buttonVariants({ variant: 'outline' })}>
                Use personal workspace
              </Link>
            </div>
          </CardContent>
        </Card>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      title="Team dashboard"
      description={`${account?.name} · ${account?.plan} plan · shared team operations`}
      variant="team"
    >
      <TeamDashboard />
    </PortalShell>
  );
}
