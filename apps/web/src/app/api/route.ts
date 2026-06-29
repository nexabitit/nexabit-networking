import { API_INFO } from '@nexabit/api-core';
import { json } from '@/lib/api/handler';

export const runtime = 'nodejs';

export async function GET() {
  return json({
    ...API_INFO,
    status: 'ok',
    platform: 'vercel-serverless',
    message: 'Use /api/v1/health or see endpoints below.',
  });
}

export async function OPTIONS() {
  const { corsOptions } = await import('@/lib/api/handler');
  return corsOptions();
}
