import { webhookTest } from '@nexabit/api-core';
import { json, error, checkRateLimit, logToolUsage, corsOptions } from '@/lib/api/handler';

export const runtime = 'nodejs';
export const maxDuration = 30;

type Params = { params: Promise<{ action?: string[] }> };

export async function GET(_request: Request, { params }: Params) {
  const { action } = await params;
  return json({
    module: 'dev',
    actions: ['webhook-test'],
    current: action?.[0] || null,
  });
}

export async function POST(request: Request, { params }: Params) {
  const limited = await checkRateLimit(request);
  if (limited) return limited;

  const { action } = await params;
  const slug = action?.[0] || 'webhook-test';

  if (slug !== 'webhook-test') {
    return error(`Unknown dev action: ${slug}. Use: webhook-test`, 404);
  }

  let body: { url?: string; method?: string; headers?: Record<string, string>; body?: string };
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON body');
  }

  if (!body.url) return error('url is required');

  await logToolUsage('webhook-tester', request);
  return json(
    await webhookTest(body.url, body.method || 'POST', body.headers || {}, body.body),
  );
}

export async function OPTIONS() {
  return corsOptions();
}
