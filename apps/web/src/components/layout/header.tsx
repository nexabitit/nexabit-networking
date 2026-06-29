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
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Network className="h-5 w-5" />
          </div>
          <span className="hidden max-w-[180px] truncate text-sm font-bold leading-tight sm:block lg:max-w-none lg:text-base">
            {SITE_CONFIG.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {[
            { href: '/tools', label: 'All Tools' },
            ...CATEGORIES.slice(0, 3).map((c) => ({
              href: `/category/${c.slug}`,
              label: c.name,
            })),
            { href: '/api-docs', label: 'API' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
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
        <div className="border-t border-border px-4 py-3 lg:hidden">
          <SearchBar />
        </div>
      )}

      {mobileOpen && (
        <nav className="border-t border-border lg:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            <Link
              href="/tools"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileOpen(false)}
            >
              All Tools
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/api-docs"
              className="rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
              onClick={() => setMobileOpen(false)}
            >
              API Docs
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
