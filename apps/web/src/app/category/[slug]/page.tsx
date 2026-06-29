import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getToolsByCategory, SITE_CONFIG, type ToolCategory } from '@nexabit/shared';
import { ToolCard } from '@/components/tool-card';

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug as ToolCategory);
  if (!category) return {};
  return {
    title: `${category.useCaseLabel} — ${category.name} Tools`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug as ToolCategory);
  if (!category) notFound();

  const tools = getToolsByCategory(category.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        {' / '}
        <span className="text-foreground">{category.useCaseLabel}</span>
      </nav>
      <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary">
        {category.name}
      </p>
      <h1 className="mb-3 text-3xl font-bold md:text-4xl">{category.useCaseLabel}</h1>
      <p className="mb-8 max-w-3xl text-lg text-muted-foreground">{category.description}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      <p className="mt-10 text-sm text-muted-foreground">
        Part of{' '}
        <Link href="/" className="text-primary hover:underline">
          {SITE_CONFIG.name}
        </Link>
      </p>
    </div>
  );
}
