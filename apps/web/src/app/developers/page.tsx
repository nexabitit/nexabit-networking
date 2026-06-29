import Link from 'next/link';
import { SITE_CONFIG } from '@nexabit/shared';
import { DeveloperLanding } from '@/components/portal/developer-portal';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { JsonLd } from '@/components/seo/json-ld';
import { DEVELOPER_FAQ, faqPageJsonLd } from '@/lib/seo/json-ld';

export const metadata = {
  title: 'Developers — API Access, Plans & Documentation',
  description: `Developer API for ${SITE_CONFIG.name}. Free browser tools; programmatic access via verified developer accounts with free (₹0) and paid monthly plans.`,
  alternates: { canonical: `https://${SITE_CONFIG.domain}/developers` },
};

export default function DevelopersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={faqPageJsonLd([...DEVELOPER_FAQ])} />
      <DeveloperLanding />
      <section className="mt-12 border-t border-border pt-12" id="faq">
        <h2 className="mb-4 text-2xl font-bold">Developer FAQ</h2>
        <FaqAccordion items={[...DEVELOPER_FAQ]} />
        <p className="mt-6 text-sm text-muted-foreground">
          See also:{' '}
          <Link href="/guides/how-to-get-api-key" className="text-primary hover:underline">
            How to generate an API key
          </Link>
          {' · '}
          <Link href="/guides/how-free-api-access-works" className="text-primary hover:underline">
            How free API access works
          </Link>
        </p>
      </section>
    </div>
  );
}
