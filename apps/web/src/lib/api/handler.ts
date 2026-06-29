import { NextResponse } from 'next/server';
import { getRateLimitForTier } from '@nexabit/shared';
import {
  extractApiKey,
  generateApiKey,
  hashApiKey,
  isValidEmail,
  resolveApiKey,
} from './api-key';

const DEFAULT_RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '60', 10);
const WINDOW_MS = 60_000;

const hits = new Map<string, { count: number; resetAt: number }>();

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    },
  });
}

export function error(message: string, status = 400) {
  return json({ success: false, error: message, statusCode: status }, status);
}

function rateLimitKey(request: Request, apiKeyId?: string): string {
  if (apiKeyId) return `key:${apiKeyId}`;
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';
  return `ip:${ip}`;
}

function checkBucket(bucket: string, limit: number): NextResponse | null {
  const now = Date.now();
  const entry = hits.get(bucket);

  if (!entry || now > entry.resetAt) {
    hits.set(bucket, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  entry.count += 1;
  if (entry.count > limit) {
    return json(
      {
        success: false,
        error: `Rate limit exceeded (${limit}/minute). Upgrade at /developers or contact Nexabit IT Solutions.`,
        statusCode: 429,
      },
      429,
    );
  }

  return null;
}

export async function checkRateLimit(request: Request): Promise<NextResponse | null> {
  const apiKey = await resolveApiKey(request);
  const limit = apiKey?.rateLimit ?? DEFAULT_RATE_LIMIT;
  const bucket = rateLimitKey(request, apiKey?.id);
  return checkBucket(bucket, limit);
}

export function getSearchParams(request: Request) {
  return new URL(request.url).searchParams;
}

export async function logToolUsage(toolSlug: string, request: Request) {
  try {
    const { getDb, schema } = await import('@nexabit/db');
    const db = getDb();
    if (!db) return;

    const apiKey = await resolveApiKey(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(ip));
    const ipHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16);

    await db.insert(schema.toolUsage).values({
      toolSlug,
      ipHash: apiKey ? null : ipHash,
      apiKeyId: apiKey?.id ?? null,
    });
  } catch {
    // Non-blocking — DB optional on Hobby tier
  }
}

export function corsOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    },
  });
}

export { extractApiKey, resolveApiKey, generateApiKey, hashApiKey, isValidEmail, getRateLimitForTier };
