import { CATEGORIES, SITE_CONFIG, TOOLS, TOOL_COUNT } from '@nexabit/shared';

const baseUrl = `https://${SITE_CONFIG.domain}`;

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.company,
    url: SITE_CONFIG.companyUrl,
    logo: `${baseUrl}/icon`,
    sameAs: [SITE_CONFIG.githubUrl, SITE_CONFIG.companyUrl],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    alternateName: 'Nexabit Network Tools',
    url: baseUrl,
    description: SITE_CONFIG.description,
    publisher: { '@type': 'Organization', name: SITE_CONFIG.company },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/tools?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_CONFIG.name,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Developer API',
        price: '0',
        priceCurrency: 'INR',
        description: '10,000 requests/month with verified developer account',
      },
      {
        '@type': 'Offer',
        name: 'Starter API',
        price: '999',
        priceCurrency: 'INR',
        description: 'Monthly paid developer API plan',
      },
    ],
    description: SITE_CONFIG.description,
    url: baseUrl,
    author: { '@type': 'Organization', name: SITE_CONFIG.company },
    featureList: `${TOOL_COUNT} browser tools; gated Developer API with tiered monthly plans`,
  };
}

export function toolJsonLd(tool: {
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  faq?: Array<{ question: string; answer: string }>;
  steps?: string[];
}) {
  const url = `${baseUrl}/tools/${tool.slug}`;
  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      description: tool.description,
      url,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      provider: { '@type': 'Organization', name: SITE_CONFIG.company },
      keywords: tool.keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: tool.category,
          item: `${baseUrl}/category/${tool.category}`,
        },
        { '@type': 'ListItem', position: 3, name: tool.name, item: url },
      ],
    },
  ];

  if (tool.faq?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  if (tool.steps?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use ${tool.name}`,
      description: tool.description,
      step: tool.steps.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text,
      })),
    });
  }

  return schemas;
}

export function faqPageJsonLd(faq: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function articleJsonLd(article: {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
}) {
  const url = `${baseUrl}/guides/${article.slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: article.title,
      description: article.description,
      url,
      datePublished: article.datePublished,
      author: { '@type': 'Organization', name: SITE_CONFIG.company },
      publisher: { '@type': 'Organization', name: SITE_CONFIG.company },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${baseUrl}/guides` },
        { '@type': 'ListItem', position: 3, name: article.title, item: url },
      ],
    },
  ];
}

export function generateLlmsTxt(): string {
  const lines = [
    `# ${SITE_CONFIG.name}`,
    '',
    `> ${SITE_CONFIG.description}`,
    '',
    `## Entity model`,
    `- Product: ${SITE_CONFIG.name} — professional network utilities + Developer API platform (${baseUrl})`,
    `- Company: ${SITE_CONFIG.company} (${SITE_CONFIG.companyUrl})`,
    `- Browser tools: ${TOOL_COUNT} diagnostics utilities — no login required to browse and run`,
    `- Developer API: authenticated access only — login at /developers/login, keys after email verification`,
    `- Pricing: Free Developer ₹0, Starter ₹999/mo, Growth ₹2,999/mo, Team ₹7,999/mo, Enterprise custom`,
    `- Team: shared MSP exports and seats on Growth+ plans (/team)`,
    `- Workspace: personal browser workspace for recent checks and watchlists (/workspace)`,
    '',
    '## Key pages',
    `- [Home](${baseUrl}/)`,
    `- [All tools](${baseUrl}/tools) — ${TOOL_COUNT} utilities`,
    `- [Pricing](${baseUrl}/pricing) — API plan comparison`,
    `- [Developer login](${baseUrl}/developers/login) — API key access`,
    `- [Workspace](${baseUrl}/workspace) — local recent checks and watchlists`,
    `- [Team](${baseUrl}/team) — MSP exports (Growth/Team plans)`,
    `- [API documentation](${baseUrl}/api-docs)`,
    `- [Guides](${baseUrl}/guides) — how-to articles for SEO/AEO`,
    `- [Changelog](${baseUrl}/changelog)`,
    '',
    '## Categories',
    ...CATEGORIES.map(
      (c) => `- [${c.useCaseLabel}](${baseUrl}/category/${c.slug}): ${c.description}`,
    ),
    '',
    '## Tools',
    ...TOOLS.map(
      (t) => `- [${t.name}](${baseUrl}/tools/${t.slug}): ${t.description}`,
    ),
    '',
    '## Developer API',
    `- Base: ${baseUrl}/api/v1`,
    '- Free plan: 10,000 requests/month, 2 RPS, 1 API key',
    '- Paid plans: Starter ₹999, Growth ₹2,999, Team ₹7,999, Enterprise custom',
    '- Auth: X-API-Key header after key creation at /developers/login',
    '- DNS: GET /api/v1/dns/lookup?domain=example.com&type=A',
    '- SSL: GET /api/v1/ssl/check?hostname=example.com',
    '- IP: GET /api/v1/network/ip-lookup?ip=8.8.8.8',
    '',
    '## Guides',
    `- [How to get an API key](${baseUrl}/guides/how-to-get-api-key)`,
    `- [How free API access works](${baseUrl}/guides/how-free-api-access-works)`,
    `- [Monitor SSL expiry](${baseUrl}/guides/how-to-monitor-ssl-expiry)`,
    `- [Troubleshoot DNS propagation](${baseUrl}/guides/how-to-troubleshoot-dns-propagation)`,
    '',
    '## Contact',
    `- Company: [${SITE_CONFIG.company}](${SITE_CONFIG.companyUrl})`,
    `- Source: [GitHub](${SITE_CONFIG.githubUrl})`,
  ];
  return lines.join('\n');
}

export const HOME_FAQ = [
  {
    question: 'What is Nexabit Network Utilities?',
    answer: `Nexabit Network Utilities is a professional network utilities and Developer API platform with ${TOOL_COUNT} browser-based tools for networking, DNS, SSL/TLS, security, and DevOps. It is built and maintained by Nexabit IT Solutions.`,
  },
  {
    question: 'Do I need an account to use the tools?',
    answer:
      'No. You can browse and run diagnostic tools in your browser without signing in. The Developer API for automation requires a logged-in developer account with email verification and a paid or free-tier API plan.',
  },
  {
    question: 'What tools are available?',
    answer:
      'The platform includes DNS lookup, DNS propagation, SSL checker, SSL expiry monitor, CIDR calculator, WHOIS, traceroute, SPF/DKIM/DMARC checkers, HTTP security headers, bulk DNS lookup, and more across networking, DNS, SSL, security, developer, and DevOps categories.',
  },
  {
    question: 'How does the Developer API work?',
    answer:
      'The REST API at /api/v1 uses tiered monthly plans from Free Developer (₹0) through Team (₹7,999/mo). Sign in at /developers/login, verify your email, and generate API keys from the dashboard. Documentation is at /api-docs.',
  },
  {
    question: 'How do I get an API key?',
    answer:
      'Create a developer account at /developers/login, verify your email, then generate a key from the dashboard. Keys are shown once at creation and require an active plan.',
  },
  {
    question: 'Who built Nexabit Network Utilities?',
    answer:
      'Nexabit Network Utilities is built by Nexabit IT Solutions, an IT services company specializing in networking, cloud infrastructure, and cybersecurity.',
  },
] as const;

export const PRICING_FAQ = [
  {
    question: 'Can I see full pricing without logging in?',
    answer:
      'Yes. Visit /pricing for plan names, starting prices, and limits. Log in at /developers/login to activate a plan, generate API keys, and manage billing.',
  },
  {
    question: 'What is included in the Free Developer plan?',
    answer:
      'Free Developer (₹0) includes 10,000 API requests per month, 2 RPS, 1 application, 1 API key, and 7-day analytics. It requires a verified developer account.',
  },
  {
    question: 'How do paid plans work?',
    answer:
      'Starter (₹999/mo), Growth (₹2,999/mo), and Team (₹7,999/mo) add higher quotas, more keys, team seats, and support levels. Contact Nexabit IT Solutions to activate billing.',
  },
  {
    question: 'When should I upgrade to Team?',
    answer:
      'Choose Team when you need MSP exports, shared usage visibility, and up to 10 operator seats for client or internal environments.',
  },
] as const;

export const DEVELOPER_FAQ = [
  {
    question: 'How do I get an API key?',
    answer:
      'Sign up at /developers/login, verify your email, open the developer dashboard, create an application label, and generate a key. The full key is shown only once — store it securely.',
  },
  {
    question: 'What is included in the Free Developer tier?',
    answer:
      'Free Developer includes 10,000 requests per month, 2 RPS, 1 application, 1 API key, and 7-day usage analytics. Browser tools do not require an API key.',
  },
  {
    question: 'How do team accounts work?',
    answer:
      'Team seats are on Growth (3), Team (10), and Enterprise (custom). After login, Growth+ users access /team for shared MSP exports, member profiles, and operational workspace.',
  },
  {
    question: 'What happens when I hit my API quota?',
    answer:
      'Requests may be throttled or blocked until the monthly quota resets. The dashboard shows quota usage and upgrade options. Contact Nexabit IT Solutions for Enterprise custom limits.',
  },
  {
    question: 'How is the Developer API different from browser tools?',
    answer:
      'Browser tools are for manual diagnostics without an account. The Developer API is for programmatic access with authenticated keys, monthly quotas, and paid upgrade paths.',
  },
  {
    question: 'How do I reset my developer account password?',
    answer:
      'Use Forgot password on /developers/login. A reset code is issued to your registered email (preview mode shows the code on screen until transactional email is connected).',
  },
] as const;
