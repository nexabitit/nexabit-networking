import Link from 'next/link';
import { WORKFLOW_PATHS, getToolBySlug } from '@nexabit/shared';
import { ArrowRight } from 'lucide-react';

export function WorkflowPaths() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-3xl font-bold">Start with your workflow</h2>
        <p className="mt-2 text-muted-foreground">
          Job-based paths for common IT tasks — not just category browsing.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {WORKFLOW_PATHS.map((path) => (
          <div
            key={path.title}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 card-hover"
          >
            <h3 className="text-lg font-semibold">{path.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {path.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {path.tools.map((slug) => {
                const tool = getToolBySlug(slug);
                if (!tool) return null;
                return (
                  <Link
                    key={slug}
                    href={`/tools/${slug}`}
                    className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium hover:bg-primary/10 hover:text-primary"
                  >
                    {tool.name}
                  </Link>
                );
              })}
            </div>
            <Link
              href={path.href}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              View category
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
