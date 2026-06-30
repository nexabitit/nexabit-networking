import Link from 'next/link';
import { SITE_CONFIG } from '@nexabit/shared';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { JsonLd } from '@/components/seo/json-ld';
import { PRICING_FAQ, faqPageJsonLd } from '@/lib/seo/json-ld';
import { PricingTeaser, PricingTableFull } from '@/components/portal/pricing-table';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'API Pricing — Developer Plans from ₹0',
  description: `Developer API pricing for ${SITE_CONFIG.name}. Free Developer, Starter ₹999/mo, Growth ₹2,999/mo, Team ₹7,999/mo, and Enterprise custom plans.`,
  alternates: { canonical: `https://${SITE_CONFIG.domain}/pricing` },
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={faqPageJsonLd([...PRICING_FAQ])} />

      <header className="mb-10 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Pricing</p>
        <h1 className="text-3xl font-bold md:text-4xl">Developer API plans</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Simple monthly pricing for programmatic access. Browser-based diagnostic tools do not
          require an API plan. Log in to activate a plan, generate keys, and manage usage.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/developers/login" className={buttonVariants({ size: 'lg' })}>
            Log in to activate
          </Link>
          <Link href="/developers" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            Developer portal
          </Link>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Plan overview</h2>
        <PricingTeaser />
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Full comparison</h2>
        <PricingTableFull highlight="growth" />
      </section>

      <section className="mb-12 rounded-xl border border-border bg-muted/30 p-6 text-sm">
        <h2 className="mb-3 text-lg font-semibold">Access rules</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Public visitors can browse and run browser tools without login.</li>
          <li>Logged-in developers can view pricing, generate API keys, and monitor usage.</li>
          <li>Free Developer: 1 app, 1 key, 10,000 requests/month after email verification.</li>
          <li>Paid plans add quota, keys, team seats, and support — contact {SITE_CONFIG.company} to bill.</li>
          <li>Admins can revoke keys and adjust plans (enterprise operations).</li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="mb-4 text-2xl font-bold">Pricing FAQ</h2>
        <FaqAccordion items={[...PRICING_FAQ]} />
      </section>
    </div>
  );
}
