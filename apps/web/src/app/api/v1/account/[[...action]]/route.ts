import { API_TIERS, getMaxApiKeysForTier, getRateLimitForTier, normalizeTierId } from '@nexabit/shared';
import {
  corsOptions,
  error,
  generateApiKey,
  hashApiKey,
  isValidEmail,
  json,
  resolveApiKey,
} from '@/lib/api/handler';

export const runtime = 'nodejs';
export const maxDuration = 30;

type Params = { params: Promise<{ action?: string[] }> };

export async function GET(request: Request, { params }: Params) {
  const { action } = await params;
  const slug = action?.[0];

  if (!slug) {
    return json({
      module: 'account',
      actions: ['tiers', 'verify', 'usage'],
      database: Boolean(process.env.DATABASE_URL),
    });
  }

  switch (slug) {
    case 'tiers':
      return json({ success: true, tiers: API_TIERS });

    case 'verify': {
      const key = await resolveApiKey(request);
      if (!key) return error('Invalid or missing API key. Pass X-API-Key header.', 401);
      return json({
        success: true,
        key: { name: key.name, tier: key.tier, rateLimit: key.rateLimit },
      });
    }

    case 'usage': {
      const key = await resolveApiKey(request);
      if (!key) return error('Invalid or missing API key', 401);

      try {
        const { getDb, schema } = await import('@nexabit/db');
        const { and, eq, gte, sql } = await import('drizzle-orm');
        const db = getDb();
        if (!db) return error('Usage analytics require DATABASE_URL', 503);

        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const rows = await db
          .select({
            toolSlug: schema.toolUsage.toolSlug,
            count: sql<number>`count(*)::int`,
          })
          .from(schema.toolUsage)
          .where(and(eq(schema.toolUsage.apiKeyId, key.id), gte(schema.toolUsage.createdAt, since)))
          .groupBy(schema.toolUsage.toolSlug);

        const total = rows.reduce((sum, row) => sum + Number(row.count ?? 0), 0);

        return json({
          success: true,
          tier: key.tier,
          rateLimit: key.rateLimit,
          period: '7 days',
          totalRequests: total,
          byTool: rows,
        });
      } catch (e) {
        return error(e instanceof Error ? e.message : 'Failed to load usage', 500);
      }
    }

    default:
      return error(`Unknown account action: ${slug}`, 404);
  }
}

export async function POST(request: Request, { params }: Params) {
  const { action } = await params;
  const slug = action?.[0];

  if (slug !== 'keys') {
    return error('Use POST /api/v1/account/keys to create an API key', 404);
  }

  if (!process.env.DATABASE_URL) {
    return error(
      'API key provisioning requires DATABASE_URL (Neon PostgreSQL). See DEPLOYMENT.md.',
      503,
    );
  }

  let body: { email?: string; name?: string; keyName?: string; teamName?: string };
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON body');
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  const keyName = body.keyName?.trim() || 'Default key';
  const teamName = body.teamName?.trim();

  if (!email || !isValidEmail(email)) return error('Valid email is required');
  if (!name) return error('Name is required');

  try {
    const { getDb, schema } = await import('@nexabit/db');
    const { eq } = await import('drizzle-orm');
    const db = getDb();
    if (!db) return error('Database unavailable', 503);

    let user = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    let userId = user[0]?.id;

    if (!userId) {
      const inserted = await db
        .insert(schema.users)
        .values({ email, name })
        .returning({ id: schema.users.id });
      userId = inserted[0].id;
    }

    const existingKeys = await db
      .select()
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.userId, userId));

    const activeKeys = existingKeys.filter((k) => k.isActive);
    const tier = 'free';
    const maxKeys = getMaxApiKeysForTier(tier);
    const tierActive = activeKeys.filter((k) => normalizeTierId(k.tier) === tier);
    if (tierActive.length >= maxKeys) {
      return error(
        `Free tier allows ${maxKeys} active API key. Log in at /developers and upgrade for more keys.`,
        403,
      );
    }

    let teamId: string | null = null;
    if (teamName) {
      const teamInsert = await db
        .insert(schema.teams)
        .values({ name: teamName, ownerEmail: email, tier: 'free' })
        .returning({ id: schema.teams.id });
      teamId = teamInsert[0].id;
    }

    const plaintext = generateApiKey();
    const keyHash = await hashApiKey(plaintext);
    const rateLimit = getRateLimitForTier(tier);

    const keyRow = await db
      .insert(schema.apiKeys)
      .values({
        userId,
        teamId,
        keyHash,
        name: keyName,
        tier,
        rateLimit,
      })
      .returning({ id: schema.apiKeys.id, name: schema.apiKeys.name });

    return json({
      success: true,
      message: 'Store this key securely — it is shown only once.',
      apiKey: plaintext,
      key: {
        id: keyRow[0].id,
        name: keyRow[0].name,
        tier,
        rateLimit,
      },
    });
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Failed to create API key', 500);
  }
}

export async function OPTIONS() {
  return corsOptions();
}
