/**
 * API base URL for client-side fetches.
 * On Vercel: leave NEXT_PUBLIC_API_URL empty to use same-origin /api routes.
 * For local NestJS dev: set NEXT_PUBLIC_API_URL=http://localhost:4000
 */
export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured !== undefined && configured !== '') {
    return configured.replace(/\/$/, '');
  }
  return '';
}

export const API_URL = getApiBaseUrl();
