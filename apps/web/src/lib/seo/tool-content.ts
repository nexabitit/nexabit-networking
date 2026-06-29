import type { ToolDefinition } from '@nexabit/shared';
import { SITE_CONFIG } from '@nexabit/shared';

export interface ToolSeoContent {
  bestFor: string;
  useCases: string[];
  steps?: string[];
  extraFaq: Array<{ question: string; answer: string }>;
}

const TOOL_SEO: Partial<Record<string, ToolSeoContent>> = {
  'dns-lookup': {
    bestFor: 'Checking live DNS records before cutovers, email setup, or incident triage.',
    useCases: [
      'Verify A, AAAA, MX, TXT, and CNAME records after DNS changes',
      'Confirm nameserver delegation during domain migrations',
      'Quick lookups during email delivery troubleshooting',
    ],
    extraFaq: [
      {
        question: 'How do I check if DNS has propagated?',
        answer:
          'Use DNS Lookup for your authoritative answer, then compare with the DNS Propagation tool to see resolver differences globally.',
      },
    ],
  },
  'dns-propagation': {
    bestFor: 'Confirming whether DNS changes have reached resolvers worldwide.',
    useCases: [
      'Post-migration validation after TTL expiry',
      'Detecting stale cache at regional resolvers',
      'Cutover go/no-go checks for production domains',
    ],
    steps: [
      'Enter the hostname and record type (A, AAAA, CNAME, MX, TXT).',
      'Run the check and compare results across public resolvers.',
      'If results differ, wait for TTL expiry or purge CDN/DNS caches as needed.',
    ],
    extraFaq: [
      {
        question: 'Why do DNS propagation results differ?',
        answer:
          'Each resolver caches records based on TTL. Until TTL expires, some locations may still return the old value even after you updated the authoritative zone.',
      },
    ],
  },
  'spf-checker': {
    bestFor: 'Validating SPF TXT records before email campaigns or domain onboarding.',
    useCases: [
      'Audit SPF syntax and included mechanisms',
      'Reduce risk of email spoofing misconfiguration',
      'Pre-flight checks for Microsoft 365 or Google Workspace DNS',
    ],
    steps: [
      'Enter the domain name (e.g. example.com).',
      'Review the SPF record, mechanisms, and lookup count.',
      'Fix syntax errors or too many DNS lookups before going live.',
    ],
    extraFaq: [
      {
        question: 'What is a valid SPF record?',
        answer:
          'A valid SPF record is a single TXT record starting with v=spf1, listing authorized senders with mechanisms like include, ip4, and a terminating -all or ~all policy.',
      },
    ],
  },
  'dmarc-checker': {
    bestFor: 'Verifying DMARC policy records for email authentication and reporting.',
    useCases: [
      'Confirm p=none, quarantine, or reject policies',
      'Validate rua/ruf reporting addresses',
      'Email security audits for compliance reviews',
    ],
    extraFaq: [
      {
        question: 'What does DMARC do?',
        answer:
          'DMARC tells receiving mail servers how to handle messages that fail SPF or DKIM alignment and where to send aggregate or forensic reports.',
      },
    ],
  },
  'ssl-checker': {
    bestFor: 'Inspecting live TLS certificates on public hostnames.',
    useCases: [
      'Validate chain, issuer, and SAN coverage before launch',
      'Troubleshoot HTTPS errors reported by browsers',
      'Certificate audits during security reviews',
    ],
    extraFaq: [
      {
        question: 'What is the difference between SSL checker and SSL expiry monitor?',
        answer:
          'SSL Checker inspects the certificate right now for a single hostname. SSL Expiry Monitor is designed to track multiple certificates over time in your Workspace watchlist.',
      },
    ],
  },
  'ssl-expiry-monitor': {
    bestFor: 'Tracking certificate expiry across multiple domains in your browser workspace.',
    useCases: [
      'MSP watchlists for client domains',
      'Preventing surprise outages from expired certs',
      'Weekly operational checks without external monitoring tools',
    ],
    extraFaq: [
      {
        question: 'How do I monitor SSL expiry?',
        answer:
          'Add hostnames to your Workspace watchlist, run SSL checks from the monitor tool, and review warning alerts when certificates are within your threshold (default 30 days).',
      },
    ],
  },
  traceroute: {
    bestFor: 'Diagnosing network path and latency between your location and a remote host.',
    useCases: [
      'Identify hops with high latency or packet loss',
      'Distinguish local vs upstream connectivity issues',
      'Support tickets with hop-by-hop evidence',
    ],
    steps: [
      'Enter the target hostname or IP address.',
      'Run traceroute and review each hop RTT.',
      'Look for sudden latency spikes or timeouts that indicate the problem segment.',
    ],
    extraFaq: [
      {
        question: 'How do I read traceroute output?',
        answer:
          'Each line is a router hop. Rising latency at a specific hop often points to congestion or routing issues at that network. Asterisks mean the hop did not respond within the timeout.',
      },
    ],
  },
  whois: {
    bestFor: 'Looking up domain registration, registrar, and expiry metadata.',
    useCases: [
      'Confirm domain ownership during investigations',
      'Check registration expiry dates',
      'Gather abuse contacts for security reports',
    ],
    extraFaq: [
      {
        question: 'What information does WHOIS provide?',
        answer:
          'WHOIS typically shows registrar, registration dates, nameservers, and status codes. Privacy-protected domains may hide registrant contact details.',
      },
    ],
  },
  'cidr-calculator': {
    bestFor: 'Planning IPv4 subnets, host ranges, and netmasks.',
    useCases: [
      'VPC and firewall rule planning',
      'IP address allocation documentation',
      'Quick validation of CIDR notation in change requests',
    ],
    extraFaq: [
      {
        question: 'How many hosts fit in a /24 subnet?',
        answer:
          'A /24 provides 256 addresses (254 usable hosts when network and broadcast addresses are reserved in typical IPv4 deployments).',
      },
    ],
  },
};

export function getToolSeoContent(tool: ToolDefinition): ToolSeoContent {
  const custom = TOOL_SEO[tool.slug];
  if (custom) return custom;

  const categoryUseCase: Record<string, string> = {
    networking: 'connectivity and IP troubleshooting',
    dns: 'DNS and email authentication workflows',
    ssl: 'TLS certificate validation',
    security: 'credential and token inspection',
    developer: 'API and payload debugging',
    devops: 'infrastructure syntax validation',
  };

  return {
    bestFor: `Engineers and operators working on ${categoryUseCase[tool.category] ?? 'technical diagnostics'}.`,
    useCases: [
      `Run ${tool.name} during incident response or change validation`,
      'Export results as JSON for tickets and runbooks',
      'Combine with related tools on the same category page',
    ],
    extraFaq: [
      {
        question: `When should I use ${tool.name}?`,
        answer: `Use ${tool.name} when you need to ${tool.description.charAt(0).toLowerCase()}${tool.description.slice(1)} It is free in the browser on ${SITE_CONFIG.name} with no login required.`,
      },
      {
        question: `Can I use ${tool.name} via API?`,
        answer: tool.apiPath
          ? `Yes. ${tool.name} is available via the Developer API at ${tool.apiPath}. Sign in at /developers/login to create an API key. Browser use remains free.`
          : `This tool runs client-side in your browser. For automation of related checks, see the Developer API at /developers for endpoints in the same category.`,
      },
    ],
  };
}

export function buildToolFaq(
  tool: ToolDefinition,
  seo: ToolSeoContent,
): Array<{ question: string; answer: string }> {
  const base = tool.faq?.length
    ? [...tool.faq]
    : [
        {
          question: `What is ${tool.name}?`,
          answer: `${tool.name} is a free online tool on ${SITE_CONFIG.name}. ${tool.description}`,
        },
      ];

  const standard = [
    {
      question: `Is ${tool.name} free?`,
      answer: `Yes. ${tool.name} is free in your browser on ${SITE_CONFIG.name} with no account required. The Developer API has separate free and paid plans for automation.`,
    },
    {
      question: `Who provides ${tool.name}?`,
      answer: `${tool.name} is part of ${SITE_CONFIG.name}, built and maintained by ${SITE_CONFIG.company}.`,
    },
  ];

  return [...base, ...seo.extraFaq, ...standard].slice(0, 6);
}
