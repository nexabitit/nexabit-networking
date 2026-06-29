import {
  ipLookup,
  portCheck,
  ping,
  traceroute,
  whois,
  asnLookup,
  httpSecurityHeaders,
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
    case 'ip-lookup': {
      const ip = params.get('ip');
      if (!ip) return error('ip parameter is required');
      await logToolUsage('ip-lookup', request);
      return json(await ipLookup(ip));
    }
    case 'port-check': {
      const host = params.get('host');
      const port = params.get('port');
      if (!host || !port) return error('host and port are required');
      const portNum = parseInt(port, 10);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        return error('port must be between 1 and 65535');
      }
      await logToolUsage('port-check', request);
      return json(await portCheck(host, portNum));
    }
    case 'ping': {
      const host = params.get('host');
      if (!host) return error('host parameter is required');
      await logToolUsage('ping', request);
      return json(ping(host));
    }
    case 'traceroute': {
      const host = params.get('host');
      if (!host) return error('host parameter is required');
      await logToolUsage('traceroute', request);
      return json(traceroute(host));
    }
    case 'whois': {
      const query = params.get('query');
      if (!query) return error('query parameter is required');
      await logToolUsage('whois', request);
      return json(await whois(query));
    }
    case 'asn-lookup': {
      const query = params.get('query');
      if (!query) return error('query parameter is required');
      await logToolUsage('asn-lookup', request);
      return json(await asnLookup(query));
    }
    case 'http-headers': {
      const url = params.get('url');
      if (!url) return error('url parameter is required');
      await logToolUsage('http-security-headers', request);
      return json(await httpSecurityHeaders(url));
    }
    default:
      return error(
        `Unknown network action: ${action}. Use: ip-lookup, port-check, ping, traceroute, whois, asn-lookup, http-headers`,
        404,
      );
  }
}

export async function GET(request: Request, { params }: Params) {
  const { action } = await params;
  const slug = action?.[0];
  if (!slug) {
    return json({
      module: 'network',
      actions: ['ip-lookup', 'port-check', 'ping', 'traceroute', 'whois', 'asn-lookup', 'http-headers'],
    });
  }
  return handle(request, slug);
}

export async function OPTIONS() {
  return corsOptions();
}
