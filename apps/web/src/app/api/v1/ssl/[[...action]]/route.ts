import { sslCheck, sslExpiry } from '@nexabit/api-core';
import { json, error, checkRateLimit, getSearchParams, logToolUsage, corsOptions } from '@/lib/api/handler';

export const runtime = 'nodejs';
export const maxDuration = 30;

type Params = { params: Promise<{ action?: string[] }> };

async function handle(request: Request, action: string) {
  const limited = await checkRateLimit(request);
  if (limited) return limited;

  const params = getSearchParams(request);
  const hostname = params.get('hostname');
  if (!hostname) return error('hostname parameter is required');

  switch (action) {
    case 'check': {
      const port = params.get('port');
      await logToolUsage('ssl-checker', request);
      return json(await sslCheck(hostname, port ? parseInt(port, 10) : 443));
    }
    case 'expiry': {
      await logToolUsage('ssl-expiry', request);
      return json(await sslExpiry(hostname));
    }
    default:
      return error(`Unknown ssl action: ${action}. Use: check, expiry`, 404);
  }
}

export async function GET(request: Request, { params }: Params) {
  const { action } = await params;
  const slug = action?.[0];
  if (!slug) {
    return json({ module: 'ssl', actions: ['check', 'expiry'] });
  }
  return handle(request, slug);
}

export async function OPTIONS() {
  return corsOptions();
}
