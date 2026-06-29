'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { TOOLS } from '@nexabit/shared';
import { Input } from '@/components/ui/input';

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q)),
    ).slice(0, 8);
  }, [query]);

  const handleSelect = (slug: string) => {
    setQuery('');
    setOpen(false);
    router.push(`/tools/${slug}`);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus={autoFocus}
          placeholder="Search tools... (e.g. DNS, SSL, CIDR)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className="pl-10 h-12 rounded-xl border-border/80 bg-card shadow-sm focus-visible:ring-primary"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          {results.map((tool) => (
            <button
              key={tool.slug}
              className="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md"
              onMouseDown={() => handleSelect(tool.slug)}
            >
              <span className="font-medium text-sm">{tool.name}</span>
              <span className="text-xs text-muted-foreground line-clamp-1">{tool.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
