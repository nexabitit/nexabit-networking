import Link from 'next/link';
import { CATEGORIES, SITE_CONFIG, TOOLS } from '@nexabit/shared';
import { ToolCard } from '@/components/tool-card';
import { CategoryCard } from '@/components/category-card';
import { HeroSection } from '@/components/home/hero-section';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { JsonLd } from '@/components/seo/json-ld';
import { HOME_FAQ, faqPageJsonLd } from '@/lib/seo/json-ld';
import { Globe, Shield, Cpu, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Nexabit Network Utilities — Free Networking, DNS & SSL Tools',
  description: SITE_CONFIG.description,
  alternates: { canonical: `https://${SITE_CONFIG.domain}` },
};

const highlights = [
  {
    icon: Globe,
    title: 'DNS & Network',
    text: 'Lookup DNS records, check ports, WHOIS, ASN, and subnet ranges instantly.',
  },
  {
    icon: Shield,
    title: 'SSL & Security',
    text: 'Validate certificates, generate passwords, decode JWT, and hash utilities.',
  },
  {
    icon: Cpu,
    title: 'DevOps Ready',
    text: 'chmod calculator, cron builder, Docker Compose and Kubernetes validators.',
  },
];

export default function HomePage() {
  const featuredTools = TOOLS.slice(0, 8);

  return (
    <div>
      <JsonLd data={faqPageJsonLd([...HOME_FAQ])} />
      <HeroSection />

      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold">Why Nexabit Network Utilities?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Built for engineers who need fast, accurate results — no sign-up, no paywall, no
            tracking bloat.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 card-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">Tool Categories</h2>
              <p className="mt-2 text-muted-foreground">Explore by discipline</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Popular Tools</h2>
            <p className="mt-2 text-muted-foreground">Most used utilities on the platform</p>
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
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link href="/tools" className="text-sm font-medium text-primary">
            View all {TOOLS.length} tools →
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16" id="faq">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-2 text-muted-foreground">
              Common questions about {SITE_CONFIG.name}
            </p>
          </div>
          <FaqAccordion items={HOME_FAQ} />
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10" />
        <div className="container relative mx-auto px-4 py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">Built by {SITE_CONFIG.company}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            {SITE_CONFIG.company} delivers enterprise networking, cloud, and cybersecurity
            services. Nexabit Network Utilities is our open-source contribution to the global
            engineering community.
          </p>
          <Link
            href={SITE_CONFIG.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
          >
            Visit Nexabit IT Solutions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
