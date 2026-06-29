import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@nexabit/shared';
import { GUIDES, getGuideBySlug } from '@/lib/seo/guides';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { JsonLd } from '@/components/seo/json-ld';
import { articleJsonLd, faqPageJsonLd } from '@/lib/seo/json-ld';

const baseUrl = `https://${SITE_CONFIG.domain}`;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `${baseUrl}/guides/${slug}` },
    openGraph: { title: guide.title, description: guide.description, url: `${baseUrl}/guides/${slug}` },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={articleJsonLd(guide)} />
      {guide.faq.length > 0 ? <JsonLd data={faqPageJsonLd(guide.faq)} /> : null}

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        {' / '}
        <Link href="/guides" className="hover:text-primary">
          Guides
        </Link>
        {' / '}
        <span className="text-foreground">{guide.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">{guide.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{guide.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">Updated {guide.datePublished}</p>
        </header>

        {guide.sections.map((section) => (
          <section key={section.heading} className="mb-8">
            <h2 className="mb-3 text-xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </section>
        ))}

        {guide.faq.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold">FAQ</h2>
            <FaqAccordion items={guide.faq} />
          </section>
        )}

        {guide.relatedTools.length > 0 && (
          <section>
            <h2 className="mb-3 text-xl font-bold">Related tools</h2>
            <ul className="flex flex-wrap gap-2">
              {guide.relatedTools.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
