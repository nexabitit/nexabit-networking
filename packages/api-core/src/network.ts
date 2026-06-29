import * as net from 'net';

export async function ipLookup(ip: string) {
  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,org,as,lat,lon,query`,
    );
    const data = (await response.json()) as {
      status?: string;
      message?: string;
      query?: string;
      country?: string;
      regionName?: string;
      city?: string;
      isp?: string;
      org?: string;
      as?: string;
      lat?: number;
      lon?: number;
    };

    if (data.status === 'fail') {
      return { success: false, error: data.message || 'Lookup failed' };
    }

    return {
      success: true,
      ip: data.query,
      country: data.country,
      region: data.regionName,
      city: data.city,
      isp: data.isp,
      org: data.org,
      asn: data.as,
      latitude: data.lat,
      longitude: data.lon,
    };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Lookup failed' };
  }
}

export async function portCheck(
  host: string,
  port: number,
  timeout = 5000,
): Promise<{ open: boolean; error?: string }> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;

    const done = (result: { open: boolean; error?: string }) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(result);
      }
    };

    socket.setTimeout(timeout);
    socket.on('connect', () => done({ open: true }));
    socket.on('timeout', () => done({ open: false, error: 'Connection timed out' }));
    socket.on('error', (err) => done({ open: false, error: err.message }));
    socket.connect(port, host);
  });
}

export function ping(_host: string) {
  return {
    success: false,
    error:
      'Ping (ICMP) is not available on serverless hosting. Use Port Checker or an external monitoring service.',
    serverless: true,
  };
}

export function traceroute(_host: string) {
  return {
    success: false,
    error:
      'Traceroute is not available on serverless hosting. Deploy the NestJS API on a VPS/Docker for full network diagnostics.',
    serverless: true,
  };
}

export async function whois(query: string) {
  try {
    const whoisModule = await import('whois-json');
    const result = await whoisModule.default(query);
    return { success: true, query, data: result };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'WHOIS lookup failed' };
  }
}

export async function asnLookup(query: string) {
  try {
    const url = query.match(/^\d+$/)
      ? `https://stat.ripe.net/data/as-overview/data.json?resource=AS${query}`
      : `https://stat.ripe.net/data/prefix-overview/data.json?resource=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = (await response.json()) as { data?: unknown };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'ASN lookup failed' };
  }
}
