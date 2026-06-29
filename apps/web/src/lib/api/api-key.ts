import { getRateLimitForTier } from '@nexabit/shared';

export interface ResolvedApiKey {
  id: string;
  name: string;
  tier: string;
  rateLimit: number;
}

export function extractApiKey(request: Request): string | null {
  const header = request.headers.get('x-api-key')?.trim();
  if (header) return header;
  const auth = request.headers.get('authorization');
  if (auth?.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  return null;
}

export async function hashApiKey(key: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const token = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `nxb_${token}`;
}

export async function resolveApiKey(request: Request): Promise<ResolvedApiKey | null> {
  const raw = extractApiKey(request);
  if (!raw) return null;

  try {
    const { getDb, schema } = await import('@nexabit/db');
    const { eq, and } = await import('drizzle-orm');
    const db = getDb();
    if (!db) return null;

    const keyHash = await hashApiKey(raw);
    const rows = await db
      .select()
      .from(schema.apiKeys)
      .where(and(eq(schema.apiKeys.keyHash, keyHash), eq(schema.apiKeys.isActive, true)))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    await db
      .update(schema.apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(schema.apiKeys.id, row.id));

    return {
      id: row.id,
      name: row.name,
      tier: row.tier,
      rateLimit: row.rateLimit ?? getRateLimitForTier(row.tier),
    };
  } catch {
    return null;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
