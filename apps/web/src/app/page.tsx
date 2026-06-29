import Link from 'next/link';
import { CATEGORIES, SITE_CONFIG, TOOLS } from '@nexabit/shared';
import { ToolCard } from '@/components/tool-card';
import { CategoryCard } from '@/components/category-card';
import { HeroSection } from '@/components/home/hero-section';
import { TrustStrip } from '@/components/home/trust-strip';
import { WorkflowPaths } from '@/components/home/workflow-paths';
import { BusinessCta } from '@/components/home/business-cta';
import { ApiAccessSection } from '@/components/home/api-access-section';
import { RecentChecksPanel, FavoritesPanel } from '@/components/home/session-panels';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { JsonLd } from '@/components/seo/json-ld';
import { HOME_FAQ, faqPageJsonLd } from '@/lib/seo/json-ld';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Nexabit Network Utilities — Free Networking, DNS & SSL Tools',
  description: SITE_CONFIG.description,
  alternates: { canonical: `https://${SITE_CONFIG.domain}` },
};

export default function HomePage() {
  const featuredTools = TOOLS.slice(0, 8);

  return (
    <div>
      <JsonLd data={faqPageJsonLd([...HOME_FAQ])} />
      <HeroSection />
      <TrustStrip />
      <WorkflowPaths />
      <RecentChecksPanel />

      <section className="border-y border-border bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-bold">Browse by use case</h2>
            <p className="mt-2 text-muted-foreground">
              Categories reframed around what you are trying to accomplish.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      <FavoritesPanel />

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Popular tools</h2>
            <p className="mt-2 text-muted-foreground">Fast entry points for common diagnostics</p>
          </div>
          <Link
            href="/tools"
            className="group hidden items-center gap-1 text-sm font-medium text-primary sm:flex"
          >
            View all {TOOLS.length} tools
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool, i) => (
            <div key={tool.slug} className={i < 4 ? 'lg:col-span-1' : ''}>
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </section>

      <BusinessCta />
      <ApiAccessSection />

      <section className="border-t border-border bg-muted/30 py-16" id="faq">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Frequently asked questions</h2>
            <p className="mt-2 text-muted-foreground">About {SITE_CONFIG.name}</p>
          </div>
          <FaqAccordion items={HOME_FAQ} />
        </div>
      </section>
    </div>
  );
}
