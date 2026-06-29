import { SITE_CONFIG } from '@nexabit/shared';

export interface GuideDefinition {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  faq: Array<{ question: string; answer: string }>;
  relatedTools: Array<{ slug: string; label: string }>;
}

export const GUIDES: GuideDefinition[] = [
  {
    slug: 'how-to-get-api-key',
    title: 'How to Generate an API Key',
    description:
      'Step-by-step guide to creating a Nexabit Network Utilities Developer API key after login and email verification.',
    datePublished: '2026-06-01',
    sections: [
      {
        heading: 'Before you start',
        paragraphs: [
          'Browser-based tools on Nexabit Network Utilities are free without an API key. You only need a key for programmatic access via the REST API.',
          'Create a developer account at /developers/login and verify your email before generating keys.',
        ],
      },
      {
        heading: 'Steps',
        paragraphs: [
          '1. Open /developers/login and sign up or log in.',
          '2. Enter the verification code sent to your email.',
          '3. Open the developer dashboard and go to API Keys.',
          '4. Name your application and environment (e.g. Production).',
          '5. Click Generate API key and copy the value immediately — it is shown only once.',
          '6. Pass the key as X-API-Key on requests documented at /api-docs.',
        ],
      },
    ],
    faq: [
      {
        question: 'How many API keys can I have on the free plan?',
        answer: 'The free plan allows 1 active API key. Upgrade to Starter or higher for additional keys.',
      },
    ],
    relatedTools: [
      { slug: 'dns-lookup', label: 'DNS Lookup' },
      { slug: 'ssl-checker', label: 'SSL Checker' },
    ],
  },
  {
    slug: 'how-free-api-access-works',
    title: 'How Free API Access Works',
    description:
      'Understand the difference between free browser tools and the free Developer API tier on Nexabit Network Utilities.',
    datePublished: '2026-06-01',
    sections: [
      {
        heading: 'Two access models',
        paragraphs: [
          'Public visitors can use all browser tools without signing in. These tools run in your browser and store optional Workspace data locally.',
          'The Developer API is a separate product layer for automation. Free API access includes 10,000 requests per month and 2 requests per second after you verify a developer account.',
        ],
      },
      {
        heading: 'When to upgrade',
        paragraphs: [
          'Upgrade to Starter, Growth, or Team when you need higher monthly quotas, more API keys, team seats, or MSP export features.',
          'Paid plans activate via Razorpay or Stripe — contact Nexabit IT Solutions to enable billing on your account.',
        ],
      },
    ],
    faq: [
      {
        question: 'Do I need an API key to use DNS or SSL tools in the browser?',
        answer: 'No. Browser tools are free for everyone. API keys are only required for REST API automation.',
      },
    ],
    relatedTools: [{ slug: 'http-security-headers', label: 'HTTP Headers Checker' }],
  },
  {
    slug: 'how-to-monitor-ssl-expiry',
    title: 'How to Monitor SSL Certificate Expiry',
    description:
      'Monitor TLS certificate expiration using SSL Checker, SSL Expiry, and the Workspace watchlist on Nexabit Network Utilities.',
    datePublished: '2026-06-01',
    sections: [
      {
        heading: 'Single-host checks',
        paragraphs: [
          'Use SSL Checker for full chain inspection or SSL Expiry for a quick days-remaining read on one hostname.',
          'These are ideal for ad-hoc validation during deployments or incident response.',
        ],
      },
      {
        heading: 'Ongoing monitoring',
        paragraphs: [
          'Add hostnames to your Workspace watchlist and use SSL Expiry Monitor to batch-check certificates.',
          'Warning alerts appear when certificates are within your threshold (default 30 days). Export watchlist CSV from the Team dashboard for MSP client reports.',
        ],
      },
    ],
    faq: [
      {
        question: 'How often should I check SSL expiry?',
        answer:
          'Weekly checks are reasonable for production domains. Reduce the alert threshold for certificates with short lifetimes or ACME automation issues.',
      },
    ],
    relatedTools: [
      { slug: 'ssl-expiry-monitor', label: 'SSL Expiry Monitor' },
      { slug: 'ssl-checker', label: 'SSL Checker' },
    ],
  },
  {
    slug: 'how-to-troubleshoot-dns-propagation',
    title: 'How to Troubleshoot DNS Propagation',
    description:
      'Diagnose stale DNS cache and propagation delays using DNS Lookup and DNS Propagation tools.',
    datePublished: '2026-06-01',
    sections: [
      {
        heading: 'Confirm authoritative DNS',
        paragraphs: [
          'Run DNS Lookup against your domain to see what the authoritative zone should return.',
          'If authoritative data is wrong, fix the zone at your DNS provider before checking propagation.',
        ],
      },
      {
        heading: 'Compare resolvers',
        paragraphs: [
          'Use DNS Propagation to query multiple public resolvers. Mismatched answers usually mean TTL cache has not expired.',
          'Lower TTL before planned migrations (e.g. 300 seconds) to speed up global convergence.',
        ],
      },
    ],
    faq: [
      {
        question: 'How long does DNS propagation take?',
        answer:
          'Propagation depends on the previous TTL. With a 1-hour TTL, some resolvers may serve old records for up to an hour after you change the zone.',
      },
    ],
    relatedTools: [
      { slug: 'dns-propagation', label: 'DNS Propagation' },
      { slug: 'dns-lookup', label: 'DNS Lookup' },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideDefinition | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const CHANGELOG_ENTRIES = [
  {
    date: '2026-06-29',
    title: 'Developer portal and INR API pricing',
    items: [
      'Gated developer login with email verification and API key dashboard',
      'Free, Starter, Growth, Team, and Enterprise API plans in INR',
      'Team workspace gated to Growth+ plans',
      'SEO/GEO/AEO content expansion across tools, guides, and llms.txt',
    ],
  },
  {
    date: '2026-06-28',
    title: 'Platform phases 1–3',
    items: [
      'Visual result views, Workspace retention, and MSP exports',
      'HTTP security headers, bulk DNS lookup, and SSL expiry monitor tools',
      'Homepage workflow paths and job-based category labels',
    ],
  },
] as const;
