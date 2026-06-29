import Link from 'next/link';
import { API_TIERS, SITE_CONFIG, type ApiTierDefinition } from '@nexabit/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function TierCta({ tier, loggedIn }: { tier: ApiTierDefinition; loggedIn?: boolean }) {
  if (tier.id === 'enterprise') {
    return (
      <a
        href={`${SITE_CONFIG.companyUrl}/contact`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: 'default', size: 'sm', className: 'w-full' })}
      >
        Contact sales
      </a>
    );
  }
  if (tier.id === 'free') {
    return (
      <Link
        href={loggedIn ? '/developers/dashboard#keys' : '/developers/login'}
        className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
      >
        {loggedIn ? 'Manage keys' : 'Get API access'}
      </Link>
    );
  }
  return (
    <Link
      href={loggedIn ? '/developers/dashboard#pricing' : '/developers/login'}
      className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
    >
      {loggedIn ? 'Upgrade plan' : 'Login to upgrade'}
    </Link>
  );
}

/** Public hybrid pricing — plan names, starting prices, key limits teaser */
export function PricingTeaser({ className }: { className?: string }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-5', className)}>
      {API_TIERS.map((tier) => (
        <Card key={tier.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{tier.name}</CardTitle>
            <p className="text-xl font-bold">{tier.priceLabel}</p>
            <p className="text-xs text-muted-foreground">{tier.bestFor}</p>
          </CardHeader>
          <CardContent className="mt-auto space-y-3">
            <p className="text-sm text-muted-foreground">
              {tier.monthlyQuota > 0
                ? `${tier.monthlyQuota.toLocaleString()} req/mo`
                : 'Custom quota'}
              {' · '}
              {tier.requestsPerSecond} RPS
            </p>
            <TierCta tier={tier} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Full comparison table — shown after login in developer dashboard */
export function PricingTableFull({
  currentPlan,
  highlight,
}: {
  currentPlan?: string;
  highlight?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-semibold">Plan</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold">Requests / mo</th>
            <th className="px-4 py-3 font-semibold">RPS</th>
            <th className="px-4 py-3 font-semibold">Apps</th>
            <th className="px-4 py-3 font-semibold">Keys</th>
            <th className="px-4 py-3 font-semibold">Seats</th>
            <th className="px-4 py-3 font-semibold">Support</th>
            <th className="px-4 py-3 font-semibold" />
          </tr>
        </thead>
        <tbody>
          {API_TIERS.map((tier) => {
            const isCurrent = currentPlan === tier.id;
            const isHighlight = highlight === tier.id;
            return (
              <tr
                key={tier.id}
                className={cn(
                  'border-b border-border last:border-0',
                  isCurrent && 'bg-primary/5',
                  isHighlight && !isCurrent && 'bg-muted/30',
                )}
              >
                <td className="px-4 py-3 font-medium">
                  {tier.name}
                  {isCurrent && (
                    <span className="ml-2 rounded bg-primary/15 px-1.5 py-0.5 text-xs text-primary">
                      Current
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{tier.priceLabel}</td>
                <td className="px-4 py-3 tabular-nums">
                  {tier.monthlyQuota > 0 ? tier.monthlyQuota.toLocaleString() : 'Custom'}
                </td>
                <td className="px-4 py-3 tabular-nums">{tier.requestsPerSecond}</td>
                <td className="px-4 py-3 tabular-nums">
                  {tier.maxApps || 'Custom'}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {tier.maxApiKeys || 'Custom'}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {tier.teamSeats || 'Custom'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{tier.support}</td>
                <td className="px-4 py-3">
                  <TierCta tier={tier} loggedIn />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        Upgrades apply immediately. Downgrades take effect at the next billing cycle. Payment via
        Razorpay or Stripe — contact {SITE_CONFIG.company} to activate paid plans.
      </p>
    </div>
  );
}
