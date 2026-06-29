import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getToolBySlug, getRelatedTools, TOOLS, SITE_CONFIG } from '@nexabit/shared';
import { ToolRenderer } from '@/components/tools/tool-renderer';
import { ToolCard } from '@/components/tool-card';
import { Badge } from '@/components/ui/label';

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.name} | ${SITE_CONFIG.name}`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = getRelatedTools(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Organization', name: SITE_CONFIG.company },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        {' / '}
        <Link href={`/category/${tool.category}`} className="hover:text-foreground capitalize">
          {tool.category}
        </Link>
        {' / '}
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          <Badge variant="secondary" className="capitalize">{tool.category}</Badge>
        </div>
        <p className="text-lg text-muted-foreground">{tool.description}</p>
      </div>

      <ToolRenderer slug={slug} />

      {tool.faq && tool.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">FAQ</h2>
          <div className="space-y-4">
            {tool.faq.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <h3 className="mb-2 font-medium">{item.question}</h3>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Related Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
