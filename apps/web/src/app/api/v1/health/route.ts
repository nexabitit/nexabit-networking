import { json, corsOptions } from '@/lib/api/handler';

export const runtime = 'nodejs';

export async function GET() {
  return json({
    status: 'ok',
    service: 'nexabit-network-api',
    platform: 'vercel-serverless',
    timestamp: new Date().toISOString(),
  });
}

export async function OPTIONS() {
  return corsOptions();
}
