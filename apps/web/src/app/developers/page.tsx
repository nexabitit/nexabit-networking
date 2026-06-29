import Link from 'next/link';
import { SITE_CONFIG, API_TIERS } from '@nexabit/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingTiers } from '@/components/team/pricing-tiers';
import { ApiKeyManager } from '@/components/team/api-key-manager';

export const metadata = {
  title: 'Developers — API Keys, Tiers & Documentation',
  description: `API access for ${SITE_CONFIG.name}. Rate tiers, key provisioning, and REST documentation.`,
};

export default function DevelopersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold md:text-4xl">Developers</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Integrate {SITE_CONFIG.name} into your runbooks and automation. Free tier includes{' '}
          {API_TIERS[0].rateLimit} requests per minute; authenticate with an API key for tracking and
          upgrades.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/api-docs" className="font-medium text-primary hover:underline">
            REST API reference
          </Link>
          <Link href="/team" className="font-medium text-primary hover:underline">
            Team dashboard
          </Link>
          <Link href="/api/v1/health" className="font-medium text-primary hover:underline">
            Health check
          </Link>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Authentication</h2>
        <Card>
          <CardContent className="space-y-3 py-6 text-sm">
            <p>Include your API key on every request:</p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs">
{`curl -H "X-API-Key: nxb_your_key_here" \\
  "https://${SITE_CONFIG.domain}/api/v1/network/ip-lookup?ip=8.8.8.8"`}
            </pre>
            <p className="text-muted-foreground">
              Verify: <code className="rounded bg-muted px-1">GET /api/v1/account/verify</code> · Usage:{' '}
              <code className="rounded bg-muted px-1">GET /api/v1/account/usage</code>
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <ApiKeyManager id="create-key" />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Rate tiers</h2>
        <PricingTiers highlight="pro" />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Enterprise & MSP</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Pro and Team tiers include higher limits, audit PDF exports, and multi-domain monitoring.
              Enterprise adds white-label reports, scheduled audits, and integration with{' '}
              <a href={SITE_CONFIG.companyUrl} className="text-primary hover:underline">
                {SITE_CONFIG.company}
              </a>{' '}
              managed services.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
