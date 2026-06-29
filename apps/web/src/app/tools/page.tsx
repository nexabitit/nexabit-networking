import Link from 'next/link';
import { TOOLS, SITE_CONFIG } from '@nexabit/shared';
import { ToolCard } from '@/components/tool-card';
import { SearchBar } from '@/components/search-bar';

const baseUrl = `https://${SITE_CONFIG.domain}`;

export const metadata = {
  title: `All ${TOOLS.length} Free Tools — Networking, DNS, SSL & DevOps`,
  description: `Browse ${TOOLS.length} free networking, DNS, SSL, security, and developer utilities on ${SITE_CONFIG.name}. No sign-up for browser tools.`,
  alternates: { canonical: `${baseUrl}/tools` },
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        {' / '}
        <span className="text-foreground">All tools</span>
      </nav>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">All Tools</h1>
        <p className="mb-6 max-w-2xl text-muted-foreground">
          {TOOLS.length} free open-source utilities for networking, DNS, SSL, security, and
          development. Browser use requires no account. Automate via the{' '}
          <Link href="/developers" className="text-primary hover:underline">
            Developer API
          </Link>
          .
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
