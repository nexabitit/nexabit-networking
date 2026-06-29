import Link from 'next/link';
import { SITE_CONFIG } from '@nexabit/shared';
import { GUIDES } from '@/lib/seo/guides';

export const metadata = {
  title: 'Guides — How-To Articles for DNS, SSL & API',
  description: `Answer-ready how-to guides for ${SITE_CONFIG.name}. API keys, DNS propagation, SSL expiry monitoring, and more.`,
  alternates: { canonical: `https://${SITE_CONFIG.domain}/guides` },
};

export default function GuidesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold md:text-4xl">Guides</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Step-by-step articles for common operational tasks on {SITE_CONFIG.name}.
        </p>
      </header>
      <ul className="space-y-4">
        {GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-muted/30"
            >
              <h2 className="font-semibold">{guide.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{guide.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
