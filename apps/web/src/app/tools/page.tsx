import { TOOLS } from '@nexabit/shared';
import { ToolCard } from '@/components/tool-card';
import { SearchBar } from '@/components/search-bar';

export const metadata = {
  title: 'All Tools',
  description: 'Browse all free networking, DNS, SSL, security, and developer utilities.',
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">All Tools</h1>
        <p className="mb-6 text-muted-foreground">
          {TOOLS.length} free open-source utilities for networking and development.
        </p>
        <div className="max-w-xl">
          <SearchBar />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
