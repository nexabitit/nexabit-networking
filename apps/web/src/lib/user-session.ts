export const SESSION_STORAGE_KEY = 'nexabit-network-session-v1';
export const SESSION_EVENT = 'nexabit-session-update';

export interface RecentCheck {
  id: string;
  toolSlug: string;
  toolName: string;
  input: string;
  timestamp: number;
  href: string;
}

export type WatchlistType = 'ssl' | 'domain' | 'endpoint';

export interface WatchlistItem {
  id: string;
  type: WatchlistType;
  label: string;
  value: string;
  addedAt: number;
  alertDays?: number;
  lastChecked?: number;
  lastStatus?: 'ok' | 'warning' | 'error' | 'unknown';
  lastDetail?: string;
}

interface SessionData {
  recentChecks: RecentCheck[];
  favorites: string[];
  watchlist: WatchlistItem[];
}

const MAX_RECENT = 20;

const EMPTY_SESSION: SessionData = {
  recentChecks: [],
  favorites: [],
  watchlist: [],
};

/** Stable empty snapshots for useSyncExternalStore server rendering */
export const SSR_RECENT_CHECKS: RecentCheck[] = EMPTY_SESSION.recentChecks;
export const SSR_FAVORITES: string[] = EMPTY_SESSION.favorites;
export const SSR_WATCHLIST: WatchlistItem[] = EMPTY_SESSION.watchlist;

let sessionCache: SessionData = EMPTY_SESSION;

function readSession(): SessionData {
  if (typeof window === 'undefined') return EMPTY_SESSION;
  if (sessionCache !== EMPTY_SESSION) return sessionCache;

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return EMPTY_SESSION;

    const parsed = JSON.parse(raw) as Partial<SessionData>;
    sessionCache = {
      recentChecks: Array.isArray(parsed.recentChecks) ? parsed.recentChecks : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
    };
    return sessionCache;
  } catch {
    return EMPTY_SESSION;
  }
}

function writeSession(data: SessionData) {
  if (typeof window === 'undefined') return;
  sessionCache = data;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getRecentChecks(): RecentCheck[] {
  return readSession().recentChecks;
}

export function addRecentCheck(entry: {
  toolSlug: string;
  toolName: string;
  input: string;
}): RecentCheck[] {
  const session = readSession();
  const href = `/tools/${entry.toolSlug}`;
  const item: RecentCheck = {
    id: `${entry.toolSlug}-${Date.now()}`,
    toolSlug: entry.toolSlug,
    toolName: entry.toolName,
    input: entry.input,
    timestamp: Date.now(),
    href,
  };

  const filtered = session.recentChecks.filter(
    (c) => !(c.toolSlug === entry.toolSlug && c.input === entry.input),
  );
  const recentChecks = [item, ...filtered].slice(0, MAX_RECENT);
  writeSession({ ...session, recentChecks });
  return recentChecks;
}

export function clearRecentChecks() {
  const session = readSession();
  writeSession({ ...session, recentChecks: [] });
}

export function getFavorites(): string[] {
  return readSession().favorites;
}

export function isFavorite(toolSlug: string): boolean {
  return readSession().favorites.includes(toolSlug);
}

export function toggleFavorite(toolSlug: string): string[] {
  const session = readSession();
  const favorites = session.favorites.includes(toolSlug)
    ? session.favorites.filter((s) => s !== toolSlug)
    : [...session.favorites, toolSlug];
  writeSession({ ...session, favorites });
  return favorites;
}

export function getWatchlist(): WatchlistItem[] {
  return readSession().watchlist;
}

export function addWatchlistItem(item: Omit<WatchlistItem, 'id' | 'addedAt'>): WatchlistItem[] {
  const session = readSession();
  const exists = session.watchlist.some(
    (w) => w.type === item.type && w.value.toLowerCase() === item.value.toLowerCase(),
  );
  if (exists) return session.watchlist;

  const watchlist = [
    {
      ...item,
      id: `${item.type}-${Date.now()}`,
      addedAt: Date.now(),
    },
    ...session.watchlist,
  ].slice(0, 100);
  writeSession({ ...session, watchlist });
  return watchlist;
}

export function removeWatchlistItem(id: string): WatchlistItem[] {
  const session = readSession();
  const watchlist = session.watchlist.filter((w) => w.id !== id);
  writeSession({ ...session, watchlist });
  return watchlist;
}

export function updateWatchlistItem(
  id: string,
  patch: Partial<Pick<WatchlistItem, 'lastChecked' | 'lastStatus' | 'lastDetail' | 'alertDays'>>,
): WatchlistItem[] {
  const session = readSession();
  const watchlist = session.watchlist.map((w) => (w.id === id ? { ...w, ...patch } : w));
  writeSession({ ...session, watchlist });
  return watchlist;
}

export function clearWatchlist() {
  const session = readSession();
  writeSession({ ...session, watchlist: [] });
}

export function subscribeSession(listener: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    sessionCache = EMPTY_SESSION;
    listener();
  };
  window.addEventListener(SESSION_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(SESSION_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function isResultError(result: unknown): boolean {
  if (!result || typeof result !== 'object') return false;
  const r = result as Record<string, unknown>;
  return r.success === false || Boolean(r.error);
}
