import {
  dnsLookup,
  spfCheck,
  dkimCheck,
  dmarcCheck,
  dnsPropagation,
  type DnsType,
} from '@nexabit/api-core';
import { json, error, checkRateLimit, getSearchParams, logToolUsage, corsOptions } from '@/lib/api/handler';

export const runtime = 'nodejs';
export const maxDuration = 30;

type Params = { params: Promise<{ action?: string[] }> };

async function handle(request: Request, action: string) {
  const limited = checkRateLimit(request);
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
    default:
      return error(
        `Unknown dns action: ${action}. Use: lookup, spf, dkim, dmarc, propagation`,
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
      actions: ['lookup', 'spf', 'dkim', 'dmarc', 'propagation'],
    });
  }
  return handle(request, slug);
}

export async function OPTIONS() {
  return corsOptions();
}
