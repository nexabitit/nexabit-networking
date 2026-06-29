import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getToolBySlug, getRelatedTools, getCategoryBySlug, TOOLS, SITE_CONFIG } from '@nexabit/shared';
import { ToolRenderer } from '@/components/tools/tool-renderer';
import { ToolPageActions } from '@/components/tools/tool-page-actions';
import { ToolCard } from '@/components/tool-card';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { ToolAnswerBlocks, ToolHowToSteps } from '@/components/seo/tool-answer-blocks';
import { JsonLd } from '@/components/seo/json-ld';
import { toolJsonLd } from '@/lib/seo/json-ld';
import { buildToolFaq, getToolSeoContent } from '@/lib/seo/tool-content';
import { Badge } from '@/components/ui/label';

const baseUrl = `https://${SITE_CONFIG.domain}`;

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const title = `${tool.name} — Free Online ${tool.category.toUpperCase()} Tool`;
  const description = `${tool.description} Free ${tool.name} on ${SITE_CONFIG.name}. No sign-up for browser use.`;

  return {
    title,
    description,
    keywords: [...tool.keywords, SITE_CONFIG.name, 'free online tool', tool.category],
    alternates: { canonical: `${baseUrl}/tools/${slug}` },
    openGraph: {
      title: `${tool.name} | ${SITE_CONFIG.name}`,
      description,
      url: `${baseUrl}/tools/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = getRelatedTools(slug);
  const seo = getToolSeoContent(tool);
  const faq = buildToolFaq(tool, seo);
  const category = getCategoryBySlug(tool.category);

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={toolJsonLd({ ...tool, faq, steps: seo.steps })} />

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
          <li>
            <Link href={`/category/${tool.category}`} className="hover:text-primary">
              {category?.useCaseLabel ?? tool.category}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-foreground">{tool.name}</li>
        </ol>
      </nav>

      <article>
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold md:text-4xl">{tool.name}</h1>
            <Badge variant="secondary" className="capitalize">
              {tool.category}
            </Badge>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Part of{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              {SITE_CONFIG.name}
            </Link>{' '}
            — free browser tools by {SITE_CONFIG.company}.{' '}
            <Link href="/developers" className="text-primary hover:underline">
              Developer API
            </Link>{' '}
            available for automation.
          </p>
          <ToolPageActions toolSlug={slug} />
        </header>

        <ToolAnswerBlocks tool={tool} seo={seo} />
        <ToolHowToSteps steps={seo.steps ?? []} toolName={tool.name} />

        <ToolRenderer slug={slug} />

        <section className="mt-10 rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Tip:</strong> Results open in Visual mode (tables and cards). Use
          the JSON tab or Copy/Download to export raw output for tickets and runbooks.
        </section>

        <section className="mt-12" aria-labelledby="tool-faq">
          <h2 id="tool-faq" className="mb-4 text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={faq} />
        </section>

        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="related-tools">
            <h2 id="related-tools" className="mb-4 text-2xl font-bold">
              Related Tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
