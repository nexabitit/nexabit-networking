export * from './network';
export * from './dns';
export * from './ssl';
export * from './dev';
export * from './http-headers';

export const API_INFO = {
  name: 'Nexabit Network Utilities API',
  version: '1.0.0',
  docs: '/api-docs',
  endpoints: {
    health: 'GET /api/v1/health',
    network:
      'GET /api/v1/network/{ip-lookup|port-check|ping|traceroute|whois|asn-lookup|http-headers}',
    dns: 'GET /api/v1/dns/{lookup|spf|dkim|dmarc|propagation} POST /api/v1/dns/bulk',
    ssl: 'GET /api/v1/ssl/{check|expiry}',
    dev: 'POST /api/v1/dev/webhook-test',
  },
};
