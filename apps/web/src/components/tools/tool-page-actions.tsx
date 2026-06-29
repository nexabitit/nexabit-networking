'use client';

import { FavoriteButton } from '@/components/tools/favorite-button';

export function ToolPageActions({ toolSlug }: { toolSlug: string }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <FavoriteButton toolSlug={toolSlug} />
    </div>
  );
}
