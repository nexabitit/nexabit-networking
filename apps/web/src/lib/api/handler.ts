import { NextResponse } from 'next/server';

const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '60', 10);
const WINDOW_MS = 60_000;

const hits = new Map<string, { count: number; resetAt: number }>();

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}

export function error(message: string, status = 400) {
  return json({ success: false, error: message, statusCode: status }, status);
}

export function checkRateLimit(request: Request): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT) {
    return json(
      {
        success: false,
        error: 'Rate limit exceeded. Try again in a minute.',
        statusCode: 429,
      },
      429,
    );
  }

  return null;
}

export function getSearchParams(request: Request) {
  return new URL(request.url).searchParams;
}

export async function logToolUsage(toolSlug: string, request: Request) {
  try {
    const { getDb, schema } = await import('@nexabit/db');
    const db = getDb();
    if (!db) return;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(ip));
    const ipHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16);

    await db.insert(schema.toolUsage).values({ toolSlug, ipHash });
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
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}
