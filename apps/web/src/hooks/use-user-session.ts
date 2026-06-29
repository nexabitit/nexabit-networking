'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  addRecentCheck,
  addWatchlistItem,
  clearRecentChecks,
  clearWatchlist,
  getFavorites,
  getRecentChecks,
  getWatchlist,
  isFavorite,
  removeWatchlistItem,
  SSR_FAVORITES,
  SSR_RECENT_CHECKS,
  SSR_WATCHLIST,
  subscribeSession,
  toggleFavorite,
  updateWatchlistItem,
  type WatchlistItem,
  type WatchlistType,
} from '@/lib/user-session';

export function useRecentChecks() {
  const checks = useSyncExternalStore(subscribeSession, getRecentChecks, () => SSR_RECENT_CHECKS);
  const record = useCallback(
    (entry: { toolSlug: string; toolName: string; input: string }) => {
      addRecentCheck(entry);
    },
    [],
  );
  const clear = useCallback(() => clearRecentChecks(), []);
  return { checks, record, clear };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribeSession, getFavorites, () => SSR_FAVORITES);
  const toggle = useCallback((slug: string) => toggleFavorite(slug), []);
  const isFav = useCallback((slug: string) => isFavorite(slug), []);
  return { favorites, toggle, isFav };
}

export function useWatchlist() {
  const items = useSyncExternalStore(subscribeSession, getWatchlist, () => SSR_WATCHLIST);
  const add = useCallback(
    (item: { type: WatchlistType; label: string; value: string; alertDays?: number }) => {
      addWatchlistItem(item);
    },
    [],
  );
  const remove = useCallback((id: string) => removeWatchlistItem(id), []);
  const update = useCallback(
    (
      id: string,
      patch: Partial<Pick<WatchlistItem, 'lastChecked' | 'lastStatus' | 'lastDetail' | 'alertDays'>>,
    ) => updateWatchlistItem(id, patch),
    [],
  );
  const clear = useCallback(() => clearWatchlist(), []);
  return { items, add, remove, update, clear };
}
