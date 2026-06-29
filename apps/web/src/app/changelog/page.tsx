import Link from 'next/link';
import { SITE_CONFIG } from '@nexabit/shared';
import { CHANGELOG_ENTRIES } from '@/lib/seo/guides';

export const metadata = {
  title: 'Changelog — Product Updates & Releases',
  description: `Release history and major updates for ${SITE_CONFIG.name}.`,
  alternates: { canonical: `https://${SITE_CONFIG.domain}/changelog` },
};

export default function ChangelogPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold md:text-4xl">Changelog</h1>
        <p className="mt-3 text-muted-foreground">
          Major releases and product updates for {SITE_CONFIG.name}.
        </p>
      </header>
      <div className="space-y-10">
        {CHANGELOG_ENTRIES.map((entry) => (
          <article key={entry.date} className="border-l-2 border-primary/30 pl-6">
            <time className="text-sm font-medium text-primary" dateTime={entry.date}>
              {entry.date}
            </time>
            <h2 className="mt-1 text-xl font-bold">{entry.title}</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-10 text-sm text-muted-foreground">
        <Link href="/guides" className="text-primary hover:underline">
          How-to guides
        </Link>
        {' · '}
        <Link href="/developers" className="text-primary hover:underline">
          Developer portal
        </Link>
      </p>
    </div>
  );
}
