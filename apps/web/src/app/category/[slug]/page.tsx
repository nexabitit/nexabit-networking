import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCategoryBySlug, getToolsByCategory, SITE_CONFIG, type ToolCategory } from '@nexabit/shared';
import { ToolCard } from '@/components/tool-card';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { JsonLd } from '@/components/seo/json-ld';
import {
  CATEGORY_COMPARISONS,
  CATEGORY_FAQ,
  categoryBreadcrumbJsonLd,
  categoryFaqJsonLd,
  getCategoryMeta,
} from '@/lib/seo/category-content';

export function generateStaticParams() {
  return [
    { slug: 'networking' },
    { slug: 'dns' },
    { slug: 'ssl' },
    { slug: 'security' },
    { slug: 'developer' },
    { slug: 'devops' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug as ToolCategory);
  if (!category) return {};
  return getCategoryMeta(category);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug as ToolCategory);
  if (!category) notFound();

  const tools = getToolsByCategory(category.slug);
  const comparison = CATEGORY_COMPARISONS[category.slug];
  const faq = CATEGORY_FAQ[category.slug] ?? [];
  const faqSchema = categoryFaqJsonLd(faq);

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={categoryBreadcrumbJsonLd(category.slug, category.useCaseLabel)} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/tools" className="hover:text-primary">
              Tools
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-foreground">{category.useCaseLabel}</li>
        </ol>
      </nav>

      <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary">
        {category.name}
      </p>
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{category.useCaseLabel}</h1>
      <p className="mb-8 max-w-3xl text-lg text-muted-foreground">{category.description}</p>

      {comparison && (
        <section className="mb-10 rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="mb-4 text-xl font-bold">{comparison.title}</h2>
          <ul className="space-y-4">
            {comparison.items.map((item) => (
              <li key={item.label}>
                <p className="font-medium">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {faq.length > 0 && (
        <section className="mt-12" aria-labelledby="category-faq">
          <h2 id="category-faq" className="mb-4 text-2xl font-bold">
            Common questions
          </h2>
          <FaqAccordion items={faq} />
        </section>
      )}

      <p className="mt-10 text-sm text-muted-foreground">
        Part of{' '}
        <Link href="/" className="text-primary hover:underline">
          {SITE_CONFIG.name}
        </Link>
        {' · '}
        <Link href="/guides" className="text-primary hover:underline">
          How-to guides
        </Link>
      </p>
    </div>
  );
}
