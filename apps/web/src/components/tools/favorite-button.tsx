'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/use-user-session';
import { cn } from '@/lib/utils';

export function FavoriteButton({ toolSlug }: { toolSlug: string }) {
  const { favorites, toggle } = useFavorites();
  const active = favorites.includes(toolSlug);
  const [pulse, setPulse] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn('gap-1.5', active && 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400')}
      onClick={() => {
        toggle(toolSlug);
        setPulse(true);
        setTimeout(() => setPulse(false), 300);
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        className={cn(
          'h-4 w-4 transition-transform',
          active && 'fill-current',
          pulse && 'scale-125',
        )}
      />
      {active ? 'Favorited' : 'Favorite'}
    </Button>
  );
}
