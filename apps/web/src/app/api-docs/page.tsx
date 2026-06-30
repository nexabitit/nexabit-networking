import Link from 'next/link';
import { SITE_CONFIG } from '@nexabit/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const baseUrl = `https://${SITE_CONFIG.domain}`;

export const metadata = {
  title: 'API Documentation — REST Reference',
  description: `Gated REST API for ${SITE_CONFIG.name}. Developer plans from Free Developer (₹0) to Team. Login required for API keys.`,
  alternates: { canonical: `${baseUrl}/api-docs` },
};

const endpoints = [
  { method: 'GET', path: '/api/v1/network/ip-lookup?ip={ip}', desc: 'IP geolocation lookup' },
  { method: 'GET', path: '/api/v1/network/port-check?host={host}&port={port}', desc: 'TCP port check' },
  { method: 'GET', path: '/api/v1/network/ping?host={host}', desc: 'ICMP ping (serverless: returns notice)' },
  { method: 'GET', path: '/api/v1/network/traceroute?host={host}', desc: 'Traceroute (serverless: returns notice)' },
  { method: 'GET', path: '/api/v1/network/whois?query={query}', desc: 'WHOIS lookup' },
  { method: 'GET', path: '/api/v1/network/asn-lookup?query={query}', desc: 'ASN lookup' },
  { method: 'GET', path: '/api/v1/network/http-headers?url={url}', desc: 'HTTP security headers analysis' },
  { method: 'GET', path: '/api/v1/dns/lookup?domain={domain}&type={type}', desc: 'DNS record lookup' },
  { method: 'GET', path: '/api/v1/dns/spf?domain={domain}', desc: 'SPF record check' },
  { method: 'GET', path: '/api/v1/dns/dkim?domain={domain}&selector={selector}', desc: 'DKIM check' },
  { method: 'GET', path: '/api/v1/dns/dmarc?domain={domain}', desc: 'DMARC check' },
  { method: 'GET', path: '/api/v1/dns/propagation?domain={domain}&type={type}', desc: 'DNS propagation' },
  { method: 'POST', path: '/api/v1/dns/bulk', desc: 'Bulk DNS lookup (JSON body: domains[], type?)' },
  { method: 'GET', path: '/api/v1/ssl/check?hostname={hostname}', desc: 'SSL certificate check' },
  { method: 'GET', path: '/api/v1/ssl/expiry?hostname={hostname}', desc: 'SSL expiry check' },
  { method: 'POST', path: '/api/v1/dev/webhook-test', desc: 'Webhook HTTP test' },
  { method: 'GET', path: '/api/v1/account/tiers', desc: 'List API rate tiers' },
  { method: 'POST', path: '/api/v1/account/keys', desc: 'Create API key (requires DATABASE_URL)' },
  { method: 'GET', path: '/api/v1/account/verify', desc: 'Verify API key (X-API-Key header)' },
  { method: 'GET', path: '/api/v1/account/usage', desc: 'API key usage stats (7 days)' },
  { method: 'GET', path: '/api/v1/health', desc: 'Health check' },
];

export default function ApiDocsPage() {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://network.nexabitit.com';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">API Documentation</h1>
      <p className="mb-8 text-muted-foreground">
        Gated REST API for {SITE_CONFIG.name}. Browser diagnostics require no account. Programmatic
        access uses logged-in developer accounts with monthly API plans —{' '}
        <Link href="/pricing" className="text-primary hover:underline">
          view pricing
        </Link>
        ,{' '}
        <Link href="/developers/login" className="text-primary hover:underline">
          log in
        </Link>{' '}
        to create keys. Unauthenticated API requests are rate limited per IP.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Same-origin API on Vercel (recommended)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <strong>Base URL:</strong>{' '}
            <code className="rounded bg-muted px-2 py-1">{base}/api/v1</code>
          </div>
          <div>
            <strong>API root:</strong>{' '}
            <Link href="/api" className="text-primary hover:underline">/api</Link>
          </div>
          <div>
            <strong>Health:</strong>{' '}
            <Link href="/api/v1/health" className="text-primary hover:underline">/api/v1/health</Link>
          </div>
          <div>
            <strong>Serverless functions:</strong> 6 consolidated handlers (within Vercel Hobby 12-function limit).
          </div>
          <div>
            <strong>Authentication:</strong> API key via{' '}
            <code className="rounded bg-muted px-1">X-API-Key</code> header.{' '}
            <Link href="/developers/login" className="text-primary hover:underline">
              Log in to create a key
            </Link>
            {' · '}
            <Link href="/developers" className="text-primary hover:underline">
              View API plans
            </Link>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-xl font-bold">Endpoints</h2>
      <div className="space-y-3">
        {endpoints.map((ep) => (
          <Card key={ep.path}>
            <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    ep.method === 'GET' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                  }`}
                >
                  {ep.method}
                </span>
                <code className="text-sm">{ep.path}</code>
              </div>
              <span className="text-sm text-muted-foreground">{ep.desc}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
