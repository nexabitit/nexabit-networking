import Link from 'next/link';
import { CATEGORIES, SITE_CONFIG, TOOLS } from '@nexabit/shared';
import { ToolCard } from '@/components/tool-card';
import { CategoryCard } from '@/components/category-card';
import { SearchBar } from '@/components/search-bar';
import { Network, Github, Zap, Shield, Code } from 'lucide-react';

export default function HomePage() {
  const featuredTools = TOOLS.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              Open Source · Free · API-First
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {SITE_CONFIG.tagline}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {SITE_CONFIG.description}
            </p>
            <div className="mx-auto max-w-xl">
              <SearchBar />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Network className="h-4 w-4" /> {TOOLS.length} tools
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" /> Rate-limited API
              </span>
              <span className="flex items-center gap-1.5">
                <Code className="h-4 w-4" /> MIT License
              </span>
              <Link
                href={SITE_CONFIG.githubUrl}
                target="_blank"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" /> GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Tools</h2>
          <Link href="/tools" className="text-sm text-primary hover:underline">
            View all {TOOLS.length} tools →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/50">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Built by {SITE_CONFIG.company}</h2>
          <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
            Nexabit IT Solutions provides enterprise networking, cloud, and cybersecurity
            services. This platform is our contribution to the open-source community.
          </p>
          <Link
            href={SITE_CONFIG.companyUrl}
            target="_blank"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Visit Nexabit IT Solutions
          </Link>
        </div>
      </section>
    </div>
  );
}
