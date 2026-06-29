import Link from 'next/link';
import { SITE_CONFIG, TOOLS } from '@nexabit/shared';
import { Github, Code2, Shield, Calendar, Building2, Activity } from 'lucide-react';

export function TrustStrip() {
  const items = [
    { icon: Activity, label: `${TOOLS.length}+ tools` },
    { icon: Github, label: 'Open source', href: SITE_CONFIG.githubUrl },
    { icon: Calendar, label: `Updated ${SITE_CONFIG.lastUpdated}` },
    { icon: Code2, label: 'REST API', href: '/api-docs' },
    { icon: Building2, label: SITE_CONFIG.company, href: SITE_CONFIG.companyUrl },
    { icon: Shield, label: 'Free forever' },
  ];

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 py-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {items.map(({ icon: Icon, label, href }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {href ? (
                <Link
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="font-medium hover:text-primary"
                >
                  {label}
                </Link>
              ) : (
                <span className="font-medium">{label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
