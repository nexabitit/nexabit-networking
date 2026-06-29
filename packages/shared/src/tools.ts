export type ToolCategory =
  | 'networking'
  | 'dns'
  | 'ssl'
  | 'security'
  | 'developer'
  | 'devops';

export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  apiPath?: string;
  clientOnly?: boolean;
  faq?: Array<{ question: string; answer: string }>;
  relatedTools?: string[];
}

export interface CategoryDefinition {
  slug: ToolCategory;
  name: string;
  useCaseLabel: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: 'networking',
    name: 'Networking',
    useCaseLabel: 'Investigate IPs and connectivity',
    description:
      'IP lookup, subnetting, ping, traceroute, port checks, WHOIS, and ASN utilities for connectivity troubleshooting.',
    icon: 'Network',
  },
  {
    slug: 'dns',
    name: 'DNS',
    useCaseLabel: 'Verify DNS and email records',
    description:
      'DNS lookup, propagation, MX, SPF, DKIM, and DMARC workflows for domain and email authentication validation.',
    icon: 'Globe',
  },
  {
    slug: 'ssl',
    name: 'SSL / TLS',
    useCaseLabel: 'Inspect certificates and trust',
    description:
      'SSL inspection, certificate expiry, PEM decoding, and CSR generation for TLS trust validation.',
    icon: 'ShieldCheck',
  },
  {
    slug: 'security',
    name: 'Security',
    useCaseLabel: 'Validate credentials and tokens',
    description:
      'Password generation, hashing, JWT decoding, Base64, and UUID tools for credential and token workflows.',
    icon: 'Lock',
  },
  {
    slug: 'developer',
    name: 'Developer',
    useCaseLabel: 'Parse and transform payloads',
    description:
      'JSON, YAML, regex, cURL, and webhook utilities to accelerate API and payload workflows.',
    icon: 'Code',
  },
  {
    slug: 'devops',
    name: 'Linux & DevOps',
    useCaseLabel: 'Validate infrastructure syntax',
    description:
      'chmod, cron, Docker Compose, and Kubernetes validators for deployment readiness checks.',
    icon: 'Terminal',
  },
];

export const TOOLS: ToolDefinition[] = [
  // Networking
  {
    slug: 'ip-lookup',
    name: 'IP Lookup',
    description: 'Look up geolocation and network information for any IPv4 or IPv6 address.',
    category: 'networking',
    keywords: ['ip', 'geolocation', 'whois', 'asn'],
    apiPath: '/api/v1/network/ip-lookup',
    faq: [
      {
        question: 'What information does IP lookup provide?',
        answer:
          'IP lookup returns country, region, city, ISP, ASN, and approximate coordinates when available from public databases.',
      },
    ],
    relatedTools: ['cidr-calculator', 'ipv4-validator', 'asn-lookup'],
  },
  {
    slug: 'cidr-calculator',
    name: 'CIDR / Subnet Calculator',
    description: 'Calculate subnet masks, network ranges, broadcast addresses, and host counts.',
    category: 'networking',
    keywords: ['cidr', 'subnet', 'netmask', 'ip range'],
    clientOnly: true,
    relatedTools: ['ipv4-validator', 'ip-lookup'],
  },
  {
    slug: 'ipv4-validator',
    name: 'IPv4 Validator',
    description: 'Validate IPv4 addresses and check if they are public, private, or reserved.',
    category: 'networking',
    keywords: ['ipv4', 'validate', 'private', 'public'],
    clientOnly: true,
    relatedTools: ['ipv6-validator', 'cidr-calculator'],
  },
  {
    slug: 'ipv6-validator',
    name: 'IPv6 Validator',
    description: 'Validate IPv6 addresses and expand compressed notation.',
    category: 'networking',
    keywords: ['ipv6', 'validate', 'expand'],
    clientOnly: true,
    relatedTools: ['ipv4-validator', 'cidr-calculator'],
  },
  {
    slug: 'port-checker',
    name: 'Port Checker',
    description: 'Check if a TCP port is open on a remote host.',
    category: 'networking',
    keywords: ['port', 'tcp', 'open', 'scan'],
    apiPath: '/api/v1/network/port-check',
    relatedTools: ['ping', 'traceroute'],
  },
  {
    slug: 'ping',
    name: 'Ping',
    description: 'Send ICMP echo requests to test host reachability and latency.',
    category: 'networking',
    keywords: ['ping', 'icmp', 'latency', 'reachability'],
    apiPath: '/api/v1/network/ping',
    relatedTools: ['traceroute', 'port-checker'],
  },
  {
    slug: 'traceroute',
    name: 'Traceroute',
    description: 'Trace the network path to a destination host.',
    category: 'networking',
    keywords: ['traceroute', 'trace', 'hop', 'path'],
    apiPath: '/api/v1/network/traceroute',
    relatedTools: ['ping', 'ip-lookup'],
  },
  {
    slug: 'whois',
    name: 'WHOIS Lookup',
    description: 'Query WHOIS records for domains and IP address blocks.',
    category: 'networking',
    keywords: ['whois', 'domain', 'registrar'],
    apiPath: '/api/v1/network/whois',
    relatedTools: ['dns-lookup', 'asn-lookup'],
  },
  {
    slug: 'asn-lookup',
    name: 'ASN Lookup',
    description: 'Look up Autonomous System Number details for an IP or ASN.',
    category: 'networking',
    keywords: ['asn', 'autonomous system', 'bgp'],
    apiPath: '/api/v1/network/asn-lookup',
    relatedTools: ['ip-lookup', 'whois', 'http-security-headers'],
  },
  {
    slug: 'http-security-headers',
    name: 'HTTP Security Headers Checker',
    description: 'Analyze HSTS, CSP, X-Frame-Options, and other security headers for any URL.',
    category: 'networking',
    keywords: ['http', 'headers', 'security', 'hsts', 'csp'],
    apiPath: '/api/v1/network/http-headers',
    relatedTools: ['ssl-checker', 'port-checker'],
  },
  // DNS
  {
    slug: 'dns-lookup',
    name: 'DNS Lookup',
    description: 'Query A, AAAA, MX, TXT, NS, SOA, PTR, and SRV records.',
    category: 'dns',
    keywords: ['dns', 'a record', 'mx', 'txt', 'ns'],
    apiPath: '/api/v1/dns/lookup',
    relatedTools: ['spf-checker', 'dmarc-checker', 'dns-propagation'],
  },
  {
    slug: 'spf-checker',
    name: 'SPF Checker',
    description: 'Parse and validate SPF records for email authentication.',
    category: 'dns',
    keywords: ['spf', 'email', 'txt'],
    apiPath: '/api/v1/dns/spf',
    relatedTools: ['dkim-checker', 'dmarc-checker'],
  },
  {
    slug: 'dkim-checker',
    name: 'DKIM Checker',
    description: 'Look up DKIM selector records for a domain.',
    category: 'dns',
    keywords: ['dkim', 'email', 'selector'],
    apiPath: '/api/v1/dns/dkim',
    relatedTools: ['spf-checker', 'dmarc-checker'],
  },
  {
    slug: 'dmarc-checker',
    name: 'DMARC Checker',
    description: 'Retrieve and parse DMARC policy records.',
    category: 'dns',
    keywords: ['dmarc', 'email', 'policy'],
    apiPath: '/api/v1/dns/dmarc',
    relatedTools: ['spf-checker', 'dkim-checker'],
  },
  {
    slug: 'dns-propagation',
    name: 'DNS Propagation',
    description: 'Check DNS record propagation across global resolvers.',
    category: 'dns',
    keywords: ['dns', 'propagation', 'global'],
    apiPath: '/api/v1/dns/propagation',
    relatedTools: ['dns-lookup', 'bulk-dns-lookup'],
  },
  {
    slug: 'bulk-dns-lookup',
    name: 'Bulk DNS Lookup',
    description: 'Look up DNS records for multiple domains from a list or CSV upload.',
    category: 'dns',
    keywords: ['dns', 'bulk', 'csv', 'msp', 'audit'],
    apiPath: '/api/v1/dns/bulk',
    relatedTools: ['dns-lookup', 'dns-propagation'],
  },
  // SSL
  {
    slug: 'ssl-checker',
    name: 'SSL Checker',
    description: 'Inspect SSL/TLS certificates for a hostname.',
    category: 'ssl',
    keywords: ['ssl', 'tls', 'certificate', 'https'],
    apiPath: '/api/v1/ssl/check',
    relatedTools: ['ssl-expiry', 'pem-decoder'],
  },
  {
    slug: 'ssl-expiry',
    name: 'SSL Expiry Checker',
    description: 'Check certificate expiration dates and days remaining.',
    category: 'ssl',
    keywords: ['ssl', 'expiry', 'expiration'],
    apiPath: '/api/v1/ssl/expiry',
    relatedTools: ['ssl-checker', 'ssl-expiry-monitor'],
  },
  {
    slug: 'ssl-expiry-monitor',
    name: 'SSL Expiry Monitor',
    description: 'Track multiple hostnames and alert when certificates are expiring soon.',
    category: 'ssl',
    keywords: ['ssl', 'monitor', 'expiry', 'watchlist', 'alert'],
    clientOnly: true,
    relatedTools: ['ssl-expiry', 'ssl-checker'],
  },
  {
    slug: 'csr-generator',
    name: 'CSR Generator',
    description: 'Generate a Certificate Signing Request and private key.',
    category: 'ssl',
    keywords: ['csr', 'certificate', 'openssl'],
    clientOnly: true,
    relatedTools: ['pem-decoder', 'ssl-checker'],
  },
  {
    slug: 'pem-decoder',
    name: 'PEM Decoder',
    description: 'Decode PEM-encoded certificates and keys to inspect details.',
    category: 'ssl',
    keywords: ['pem', 'certificate', 'decode'],
    clientOnly: true,
    relatedTools: ['csr-generator', 'ssl-checker'],
  },
  // Security
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure random passwords with customizable options.',
    category: 'security',
    keywords: ['password', 'generate', 'secure', 'random'],
    clientOnly: true,
    relatedTools: ['password-strength', 'hash-generator'],
  },
  {
    slug: 'password-strength',
    name: 'Password Strength Checker',
    description: 'Analyze password strength and get improvement suggestions.',
    category: 'security',
    keywords: ['password', 'strength', 'entropy'],
    clientOnly: true,
    relatedTools: ['password-generator'],
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes.',
    category: 'security',
    keywords: ['hash', 'sha256', 'md5'],
    clientOnly: true,
    relatedTools: ['base64', 'jwt-decoder'],
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Token headers and payloads.',
    category: 'security',
    keywords: ['jwt', 'token', 'decode'],
    clientOnly: true,
    relatedTools: ['base64', 'hash-generator'],
  },
  {
    slug: 'base64',
    name: 'Base64 Encode / Decode',
    description: 'Encode or decode text and data using Base64.',
    category: 'security',
    keywords: ['base64', 'encode', 'decode'],
    clientOnly: true,
    relatedTools: ['url-encoder', 'hash-generator'],
  },
  {
    slug: 'url-encoder',
    name: 'URL / HTML Encode & Decode',
    description: 'Encode or decode URL components and HTML entities.',
    category: 'security',
    keywords: ['url', 'encode', 'html', 'decode'],
    clientOnly: true,
    relatedTools: ['base64'],
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate RFC 4122 version 4 UUIDs.',
    category: 'security',
    keywords: ['uuid', 'guid', 'generate'],
    clientOnly: true,
    relatedTools: ['hash-generator'],
  },
  // Developer
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data.',
    category: 'developer',
    keywords: ['json', 'format', 'validate', 'pretty'],
    clientOnly: true,
    relatedTools: ['yaml-formatter', 'xml-formatter'],
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    description: 'Format and validate YAML documents.',
    category: 'developer',
    keywords: ['yaml', 'format', 'validate'],
    clientOnly: true,
    relatedTools: ['json-formatter'],
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Format and validate XML documents.',
    category: 'developer',
    keywords: ['xml', 'format', 'validate'],
    clientOnly: true,
    relatedTools: ['json-formatter'],
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions against sample text with match highlighting.',
    category: 'developer',
    keywords: ['regex', 'regular expression', 'test'],
    clientOnly: true,
    relatedTools: ['json-formatter'],
  },
  {
    slug: 'curl-generator',
    name: 'cURL Generator',
    description: 'Build cURL commands from HTTP request parameters.',
    category: 'developer',
    keywords: ['curl', 'http', 'api'],
    clientOnly: true,
    relatedTools: ['webhook-tester'],
  },
  {
    slug: 'webhook-tester',
    name: 'Webhook Tester',
    description: 'Send test HTTP requests to webhook endpoints.',
    category: 'developer',
    keywords: ['webhook', 'http', 'test'],
    apiPath: '/api/v1/dev/webhook-test',
    relatedTools: ['curl-generator'],
  },
  // DevOps
  {
    slug: 'chmod-calculator',
    name: 'chmod Calculator',
    description: 'Convert between numeric and symbolic Unix file permissions.',
    category: 'devops',
    keywords: ['chmod', 'permissions', 'unix', 'linux'],
    clientOnly: true,
    relatedTools: ['cron-generator'],
  },
  {
    slug: 'cron-generator',
    name: 'Cron Expression Generator',
    description: 'Build and explain cron schedule expressions.',
    category: 'devops',
    keywords: ['cron', 'schedule', 'crontab'],
    clientOnly: true,
    relatedTools: ['chmod-calculator'],
  },
  {
    slug: 'docker-compose-validator',
    name: 'Docker Compose Validator',
    description: 'Validate Docker Compose YAML syntax and structure.',
    category: 'devops',
    keywords: ['docker', 'compose', 'yaml', 'validate'],
    clientOnly: true,
    relatedTools: ['yaml-formatter', 'kubernetes-yaml-validator'],
  },
  {
    slug: 'kubernetes-yaml-validator',
    name: 'Kubernetes YAML Validator',
    description: 'Validate Kubernetes manifest YAML files.',
    category: 'devops',
    keywords: ['kubernetes', 'k8s', 'yaml', 'validate'],
    clientOnly: true,
    relatedTools: ['yaml-formatter', 'docker-compose-validator'],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getCategoryBySlug(slug: ToolCategory): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getToolBySlug(slug);
  if (!tool?.relatedTools) return [];
  return tool.relatedTools
    .map((s) => getToolBySlug(s))
    .filter((t): t is ToolDefinition => t !== undefined);
}

export const TOOL_COUNT = TOOLS.length;

export const SITE_CONFIG = {
  name: 'Nexabit Network Utilities',
  shortName: 'Nexabit Network Utilities',
  domain: 'network.nexabitit.com',
  company: 'Nexabit IT Solutions',
  companyUrl: 'https://nexabitit.com',
  githubUrl: 'https://github.com/nexabitit/nexabit-networking',
  description: `Nexabit Network Utilities is a free, open-source platform with ${TOOL_COUNT} professional networking, DNS, SSL, security, and developer tools. Browser tools are free; the Developer API offers free and paid monthly plans. Built by Nexabit IT Solutions.`,
  heroHeadline: 'Free network, DNS, SSL, and diagnostics tools for IT teams.',
  heroSubline:
    'Run fast checks, troubleshoot issues, validate configurations, and automate repeatable infrastructure tasks from one toolkit.',
  trustLine: `${TOOL_COUNT} free browser tools • open source • Developer API with free & paid plans`,
  lastUpdated: '2026-06',
  tagline: 'Nexabit Network Utilities',
  subtagline:
    'Run fast checks, troubleshoot issues, validate configurations, and automate repeatable infrastructure tasks from one toolkit.',
} as const;

export const QUICK_LAUNCH = [
  { label: 'IP', slug: 'ip-lookup' },
  { label: 'DNS', slug: 'dns-lookup' },
  { label: 'SSL', slug: 'ssl-checker' },
  { label: 'Ping', slug: 'ping' },
  { label: 'Traceroute', slug: 'traceroute' },
  { label: 'WHOIS', slug: 'whois' },
  { label: 'JWT', slug: 'jwt-decoder' },
  { label: 'CIDR', slug: 'cidr-calculator' },
] as const;

export const WORKFLOW_PATHS = [
  {
    title: 'DNS troubleshooting',
    description: 'Lookup records, check propagation, validate SPF, DKIM, and DMARC.',
    href: '/category/dns',
    tools: ['dns-lookup', 'dns-propagation', 'spf-checker', 'dmarc-checker'],
  },
  {
    title: 'SSL inspection',
    description: 'Check certificates, expiry dates, and decode PEM files.',
    href: '/category/ssl',
    tools: ['ssl-checker', 'ssl-expiry', 'ssl-expiry-monitor', 'pem-decoder'],
  },
  {
    title: 'IP investigation',
    description: 'Geolocate IPs, WHOIS, ASN lookup, and subnet planning.',
    href: '/category/networking',
    tools: ['ip-lookup', 'whois', 'asn-lookup', 'cidr-calculator'],
  },
  {
    title: 'DevOps validation',
    description: 'chmod, cron, Docker Compose, and Kubernetes YAML checks.',
    href: '/category/devops',
    tools: ['chmod-calculator', 'cron-generator', 'docker-compose-validator'],
  },
] as const;
