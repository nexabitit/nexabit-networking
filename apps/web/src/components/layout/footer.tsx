import Link from 'next/link';
import { SITE_CONFIG } from '@nexabit/shared';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold">{SITE_CONFIG.name}</h3>
            <p className="text-sm text-muted-foreground">{SITE_CONFIG.tagline}</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Links</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-foreground transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href={SITE_CONFIG.githubUrl} target="_blank" className="hover:text-foreground transition-colors inline-flex items-center gap-1">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">{SITE_CONFIG.company}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Enterprise IT solutions, networking, and cybersecurity.
            </p>
            <Link
              href={SITE_CONFIG.companyUrl}
              target="_blank"
              className="text-sm text-primary hover:underline"
            >
              nexabitit.com
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_CONFIG.company}. Open source under MIT License.
        </div>
      </div>
    </footer>
  );
}
