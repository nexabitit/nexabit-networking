import { notFound } from 'next/navigation';
import { getCategoryBySlug, getToolsByCategory, type ToolCategory } from '@nexabit/shared';
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
    title: `${category.name} Tools`,
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
      <h1 className="mb-2 text-3xl font-bold">{category.name}</h1>
      <p className="mb-8 text-muted-foreground">{category.description}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
