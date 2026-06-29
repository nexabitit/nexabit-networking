'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Key, CreditCard, BarChart3, BookOpen, LifeBuoy, Users } from 'lucide-react';

const developerLinks = [
  { href: '/developers/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/developers/dashboard#keys', label: 'API Keys', icon: Key },
  { href: '/developers/dashboard#pricing', label: 'Pricing & billing', icon: CreditCard },
  { href: '/developers/dashboard#usage', label: 'Usage', icon: BarChart3 },
  { href: '/api-docs', label: 'Docs', icon: BookOpen },
  { href: '/developers/dashboard#support', label: 'Support', icon: LifeBuoy },
];

const teamLinks = [
  { href: '/team', label: 'Team overview', icon: Users },
  { href: '/team#members', label: 'Members', icon: Users },
  { href: '/team#exports', label: 'MSP exports', icon: BarChart3 },
  { href: '/workspace', label: 'Workspace', icon: LayoutDashboard },
];

export function PortalShell({
  title,
  description,
  variant = 'developer',
  children,
}: {
  title: string;
  description?: string;
  variant?: 'developer' | 'team';
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links = variant === 'team' ? teamLinks : developerLinks;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-lg text-muted-foreground">{description}</p> : null}
      </header>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block">
          <ul className="sticky top-24 space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href.includes('#') && pathname === href.split('#')[0]);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="min-w-0 space-y-8">{children}</div>
      </div>
    </div>
  );
}
