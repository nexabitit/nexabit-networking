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
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Free browser tools' },
    description: SITE_CONFIG.description,
    url: baseUrl,
    author: { '@type': 'Organization', name: SITE_CONFIG.company },
    featureList: `${TOOL_COUNT} tools across ${CATEGORIES.map((c) => c.name).join(', ')}`,
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
    `- Product: ${SITE_CONFIG.name} (${baseUrl})`,
    `- Company: ${SITE_CONFIG.company} (${SITE_CONFIG.companyUrl})`,
    `- Tool count: ${TOOL_COUNT} free browser utilities`,
    `- Developer API: gated access with free (₹0) and paid monthly plans — keys after login at /developers/login`,
    `- Browser tools: free, no login required`,
    '',
    '## Key pages',
    `- [Home](${baseUrl}/)`,
    `- [All tools](${baseUrl}/tools) — ${TOOL_COUNT} utilities`,
    `- [Developers](${baseUrl}/developers) — API overview and pricing teaser`,
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
    answer: `Nexabit Network Utilities is a free, open-source platform with ${TOOL_COUNT} online tools for networking, DNS, SSL/TLS, cybersecurity, and software development. It is built and maintained by Nexabit IT Solutions.`,
  },
  {
    question: 'Are Nexabit Network Utilities free to use?',
    answer:
      'Yes. Every browser-based tool is completely free with no login required. The Developer API uses verified accounts with free and paid monthly plans — API keys are available after login and email verification.',
  },
  {
    question: 'What tools are available on Nexabit Network Utilities?',
    answer:
      'The platform includes DNS lookup, DNS propagation, SSL checker, SSL expiry monitor, CIDR calculator, WHOIS, traceroute, SPF/DKIM/DMARC checkers, HTTP security headers, bulk DNS lookup, and more across networking, DNS, SSL, security, developer, and DevOps categories.',
  },
  {
    question: 'Does Nexabit Network Utilities have an API?',
    answer:
      'Yes. A Developer API is available at /api/v1 with free and paid access plans (from ₹0 to Team tiers). Documentation is at /api-docs. Create keys and manage usage from the developer portal after signing in at /developers/login.',
  },
  {
    question: 'How do I get an API key?',
    answer:
      'Click Get API access, create a developer account at /developers/login, verify your email, then generate a key from the dashboard. Keys are shown once at creation.',
  },
  {
    question: 'Who built Nexabit Network Utilities?',
    answer:
      'Nexabit Network Utilities is built by Nexabit IT Solutions, an IT services company specializing in networking, cloud infrastructure, and cybersecurity.',
  },
] as const;

export const DEVELOPER_FAQ = [
  {
    question: 'How do I get an API key?',
    answer:
      'Sign up at /developers/login, verify your email, open the developer dashboard, create an application label, and generate a key. The full key is shown only once — store it securely.',
  },
  {
    question: 'What is included in the free API tier?',
    answer:
      'The free plan includes 10,000 requests per month, 2 requests per second, 1 application, 1 API key, and 7-day usage analytics. Browser tools remain free without an API key.',
  },
  {
    question: 'How do team seats work?',
    answer:
      'Team seats are available on Growth (3 seats), Team (10 seats), and Enterprise (custom). Team dashboard features such as shared MSP exports require Growth or higher after login.',
  },
  {
    question: 'What happens when I hit my API quota?',
    answer:
      'Requests may be throttled or blocked until the monthly quota resets. The dashboard shows quota usage and upgrade options. Contact Nexabit IT Solutions for Enterprise custom limits.',
  },
  {
    question: 'Is the Developer API the same as browser tools?',
    answer:
      'Browser tools are always free for visitors. The API is for automation and integrations, with rate limits and quotas tied to your developer plan.',
  },
] as const;
