'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X, Network, Search } from 'lucide-react';
import { useState } from 'react';
import { SITE_CONFIG, CATEGORIES } from '@nexabit/shared';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search-bar';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 glass">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Network className="h-5 w-5" />
          </div>
          <span className="hidden max-w-[140px] truncate text-sm font-bold leading-tight xl:block xl:max-w-[200px]">
            {SITE_CONFIG.shortName}
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 md:block md:max-w-md lg:max-w-lg">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {[
            { href: '/tools', label: 'Tools' },
            { href: '/workspace', label: 'Workspace' },
            { href: '/team', label: 'Team' },
            { href: '/developers', label: 'Developers' },
            { href: '/api-docs', label: 'API' },
            { href: SITE_CONFIG.githubUrl, label: 'GitHub', external: true },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                !link.external &&
                  (pathname === link.href || pathname.startsWith(link.href + '/'))
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search tools"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <SearchBar />
        </div>
      )}

      {mobileOpen && (
        <nav className="border-t border-border lg:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            <Link href="/tools" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
              All Tools
            </Link>
            <Link href="/workspace" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
              Workspace
            </Link>
            <Link href="/team" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
              Team
            </Link>
            <Link href="/developers" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted" onClick={() => setMobileOpen(false)}>
              Developers
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {cat.useCaseLabel}
              </Link>
            ))}
            <Link href="/api-docs" className="rounded-lg px-3 py-2.5 text-sm hover:bg-muted" onClick={() => setMobileOpen(false)}>
              API Docs
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
