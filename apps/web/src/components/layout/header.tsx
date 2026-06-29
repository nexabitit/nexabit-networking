'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X, Network } from 'lucide-react';
import { useState } from 'react';
import { SITE_CONFIG, CATEGORIES } from '@nexabit/shared';
import { Button } from '@/components/ui/button';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Network className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">{SITE_CONFIG.shortName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            All Tools
          </Link>
          {CATEGORIES.slice(0, 4).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/api-docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            API Docs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
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
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border md:hidden">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
            <Link href="/tools" className="py-2 text-sm" onClick={() => setMobileOpen(false)}>
              All Tools
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="py-2 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/api-docs" className="py-2 text-sm" onClick={() => setMobileOpen(false)}>
              API Docs
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
