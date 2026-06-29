import {
  dnsLookup,
  spfCheck,
  dkimCheck,
  dmarcCheck,
  dnsPropagation,
  dnsBulkLookup,
  type DnsType,
} from '@nexabit/api-core';
import { json, error, checkRateLimit, getSearchParams, logToolUsage, corsOptions } from '@/lib/api/handler';

export const runtime = 'nodejs';
export const maxDuration = 30;

type Params = { params: Promise<{ action?: string[] }> };

async function handle(request: Request, action: string) {
  const limited = await checkRateLimit(request);
  if (limited) return limited;

  const params = getSearchParams(request);

  switch (action) {
    case 'lookup': {
      const domain = params.get('domain');
      const type = (params.get('type') || 'A') as DnsType;
      if (!domain) return error('domain parameter is required');
      await logToolUsage('dns-lookup', request);
      return json(await dnsLookup(domain, type));
    }
    case 'spf': {
      const domain = params.get('domain');
      if (!domain) return error('domain parameter is required');
      await logToolUsage('spf-checker', request);
      return json(await spfCheck(domain));
    }
    case 'dkim': {
      const domain = params.get('domain');
      if (!domain) return error('domain parameter is required');
      await logToolUsage('dkim-checker', request);
      return json(await dkimCheck(domain, params.get('selector') || 'default'));
    }
    case 'dmarc': {
      const domain = params.get('domain');
      if (!domain) return error('domain parameter is required');
      await logToolUsage('dmarc-checker', request);
      return json(await dmarcCheck(domain));
    }
    case 'propagation': {
      const domain = params.get('domain');
      const type = (params.get('type') || 'A') as DnsType;
      if (!domain) return error('domain parameter is required');
      await logToolUsage('dns-propagation', request);
      return json(await dnsPropagation(domain, type));
    }
    case 'bulk': {
      return error('Use POST /api/v1/dns/bulk with JSON body { domains: string[], type?: string }', 405);
    }
    default:
      return error(
        `Unknown dns action: ${action}. Use: lookup, spf, dkim, dmarc, propagation, bulk`,
        404,
      );
  }
}

export async function GET(request: Request, { params }: Params) {
  const { action } = await params;
  const slug = action?.[0];
  if (!slug) {
    return json({
      module: 'dns',
      actions: ['lookup', 'spf', 'dkim', 'dmarc', 'propagation', 'bulk'],
    });
  }
  return handle(request, slug);
}

export async function POST(request: Request, { params }: Params) {
  const limited = await checkRateLimit(request);
  if (limited) return limited;

  const { action } = await params;
  const slug = action?.[0];
  if (slug !== 'bulk') {
    return error('Unknown dns POST action. Use: bulk', 404);
  }

  let body: { domains?: string[]; type?: string };
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON body');
  }

  const domains = body.domains;
  if (!Array.isArray(domains) || domains.length === 0) {
    return error('domains array is required');
  }

  const type = (body.type || 'A') as DnsType;
  await logToolUsage('bulk-dns-lookup', request);
  return json(await dnsBulkLookup(domains, type));
}

export async function OPTIONS() {
  return corsOptions();
}
