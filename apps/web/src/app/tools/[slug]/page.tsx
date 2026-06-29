import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getToolBySlug, getRelatedTools, TOOLS, SITE_CONFIG } from '@nexabit/shared';
import { ToolRenderer } from '@/components/tools/tool-renderer';
import { ToolCard } from '@/components/tool-card';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { JsonLd } from '@/components/seo/json-ld';
import { toolJsonLd } from '@/lib/seo/json-ld';
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

  const title = `${tool.name} — Free Online Tool`;
  const description = `${tool.description} Use ${tool.name} free on ${SITE_CONFIG.name}. No sign-up required.`;

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

function defaultFaq(tool: { name: string; description: string; category: string }) {
  return [
    {
      question: `What is ${tool.name}?`,
      answer: `${tool.name} is a free online tool on ${SITE_CONFIG.name}. ${tool.description}`,
    },
    {
      question: `Is ${tool.name} free?`,
      answer: `Yes. ${tool.name} is completely free on ${SITE_CONFIG.name}, with no account required. The platform is open source under the MIT license.`,
    },
    {
      question: `Who provides ${tool.name}?`,
      answer: `${tool.name} is provided by ${SITE_CONFIG.name}, built and maintained by ${SITE_CONFIG.company}.`,
    },
  ];
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = getRelatedTools(slug);
  const faq = tool.faq?.length ? tool.faq : defaultFaq(tool);

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={toolJsonLd({ ...tool, faq })} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/category/${tool.category}`} className="capitalize hover:text-primary">
              {tool.category}
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
            — free, open-source tools by {SITE_CONFIG.company}.
          </p>
        </header>

        <ToolRenderer slug={slug} />

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
