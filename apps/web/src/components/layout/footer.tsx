import Link from 'next/link';
import { SITE_CONFIG } from '@nexabit/shared';
import { Github, Network } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center gap-2 font-bold">
              <Network className="h-5 w-5 text-primary" />
              {SITE_CONFIG.name}
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools" className="text-foreground/80 hover:text-primary">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-foreground/80 hover:text-primary">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/llms.txt" className="text-foreground/80 hover:text-primary">
                  llms.txt (AI)
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="text-foreground/80 hover:text-primary">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={SITE_CONFIG.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-primary"
                >
                  {SITE_CONFIG.company}
                </Link>
              </li>
              <li>
                <Link
                  href={SITE_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-primary"
                >
                  <Github className="h-3.5 w-3.5" />
                  Open Source
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <span>
            © {new Date().getFullYear()} {SITE_CONFIG.company}. MIT License.
          </span>
          <span>{SITE_CONFIG.name} — network.nexabitit.com</span>
        </div>
      </div>
    </footer>
  );
}
