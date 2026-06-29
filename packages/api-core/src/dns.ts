import * as dns from 'dns/promises';

export const DNS_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'SOA', 'PTR', 'SRV', 'CNAME'] as const;
export type DnsType = (typeof DNS_TYPES)[number];

const RESOLVERS = [
  { name: 'Google', server: '8.8.8.8' },
  { name: 'Cloudflare', server: '1.1.1.1' },
  { name: 'Quad9', server: '9.9.9.9' },
  { name: 'OpenDNS', server: '208.67.222.222' },
];

export async function dnsLookup(domain: string, type: DnsType) {
  try {
    let records: unknown;

    switch (type) {
      case 'A':
        records = await dns.resolve4(domain);
        break;
      case 'AAAA':
        records = await dns.resolve6(domain);
        break;
      case 'MX':
        records = await dns.resolveMx(domain);
        break;
      case 'TXT':
        records = await dns.resolveTxt(domain);
        break;
      case 'NS':
        records = await dns.resolveNs(domain);
        break;
      case 'SOA':
        records = await dns.resolveSoa(domain);
        break;
      case 'PTR':
        records = await dns.resolvePtr(domain);
        break;
      case 'SRV':
        records = await dns.resolveSrv(domain);
        break;
      case 'CNAME':
        records = await dns.resolveCname(domain);
        break;
      default:
        return { success: false, error: `Unsupported record type: ${type}` };
    }

    return { success: true, domain, type, records };
  } catch (e) {
    return {
      success: false,
      domain,
      type,
      error: e instanceof Error ? e.message : 'DNS lookup failed',
    };
  }
}

export async function spfCheck(domain: string) {
  const result = await dnsLookup(domain, 'TXT');
  if (!result.success) return result;

  const txtRecords = result.records as string[][];
  const spfRecord = txtRecords.flat().find((r) => r.startsWith('v=spf1'));

  return {
    success: true,
    domain,
    spf: spfRecord || null,
    valid: !!spfRecord,
    records: txtRecords,
  };
}

export async function dkimCheck(domain: string, selector = 'default') {
  return dnsLookup(`${selector}._domainkey.${domain}`, 'TXT');
}

export async function dmarcCheck(domain: string) {
  const result = await dnsLookup(`_dmarc.${domain}`, 'TXT');
  if (!result.success) return result;

  const txtRecords = result.records as string[][];
  const dmarcRecord = txtRecords.flat().find((r) => r.startsWith('v=DMARC1'));

  return {
    success: true,
    domain,
    dmarc: dmarcRecord || null,
    valid: !!dmarcRecord,
    records: txtRecords,
  };
}

export async function dnsPropagation(domain: string, type: DnsType) {
  const results = await Promise.all(
    RESOLVERS.map(async (resolver) => {
      const r = new dns.Resolver();
      r.setServers([resolver.server]);

      try {
        let records: unknown;
        switch (type) {
          case 'A':
            records = await r.resolve4(domain);
            break;
          case 'AAAA':
            records = await r.resolve6(domain);
            break;
          case 'MX':
            records = await r.resolveMx(domain);
            break;
          case 'TXT':
            records = await r.resolveTxt(domain);
            break;
          case 'NS':
            records = await r.resolveNs(domain);
            break;
          default:
            records = await r.resolve4(domain);
        }
        return { resolver: resolver.name, server: resolver.server, success: true, records };
      } catch (e) {
        return {
          resolver: resolver.name,
          server: resolver.server,
          success: false,
          error: e instanceof Error ? e.message : 'Failed',
        };
      }
    }),
  );

  return { success: true, domain, type, results };
}
