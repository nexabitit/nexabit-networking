import { json, corsOptions } from '@/lib/api/handler';

export const runtime = 'nodejs';

export async function GET() {
  return json({
    status: 'ok',
    service: 'nexabit-network-api',
    platform: 'vercel-serverless',
    database: Boolean(process.env.DATABASE_URL),
    apiKeys: Boolean(process.env.DATABASE_URL),
    timestamp: new Date().toISOString(),
  });
}

export async function OPTIONS() {
  return corsOptions();
}
