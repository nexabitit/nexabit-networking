import { API_TIERS, SITE_CONFIG } from '@nexabit/shared';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PricingTiers({ highlight }: { highlight?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {API_TIERS.map((tier) => (
        <Card
          key={tier.id}
          className={cn(
            'relative flex flex-col',
            highlight === tier.id && 'border-primary shadow-md shadow-primary/10',
          )}
        >
          <CardHeader>
            <CardTitle className="text-lg">{tier.name}</CardTitle>
            <p className="text-2xl font-bold">{tier.priceLabel}</p>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ul className="mb-4 flex-1 space-y-2 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-primary">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {tier.id === 'free' ? (
              <Link href="/developers#create-key" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Create free API key
              </Link>
            ) : (
              <a
                href={`${SITE_CONFIG.companyUrl}/contact`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: tier.id === 'enterprise' ? 'default' : 'outline', size: 'sm' })}
              >
                Contact {SITE_CONFIG.company}
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
