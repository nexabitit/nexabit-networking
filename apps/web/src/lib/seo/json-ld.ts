import { CATEGORIES, SITE_CONFIG, TOOLS } from '@nexabit/shared';

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
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: SITE_CONFIG.description,
    url: baseUrl,
    author: { '@type': 'Organization', name: SITE_CONFIG.company },
    featureList: CATEGORIES.map((c) => c.name).join(', '),
  };
}

export function toolJsonLd(tool: {
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  faq?: Array<{ question: string; answer: string }>;
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
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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

export function generateLlmsTxt(): string {
  const lines = [
    `# ${SITE_CONFIG.name}`,
    '',
    `> ${SITE_CONFIG.description}`,
    '',
    `Nexabit Network Utilities (${baseUrl}) is maintained by ${SITE_CONFIG.company}.`,
    'All tools are free, open source (MIT), and available via web UI and REST API.',
    '',
    '## Key pages',
    `- [Home](${baseUrl}/): Landing page with search and categories`,
    `- [All tools](${baseUrl}/tools): Complete tool directory`,
    `- [API documentation](${baseUrl}/api-docs): REST API reference`,
    `- [Health check](${baseUrl}/api/v1/health): API status`,
    '',
    '## Categories',
    ...CATEGORIES.map(
      (c) => `- [${c.name}](${baseUrl}/category/${c.slug}): ${c.description}`,
    ),
    '',
    '## Tools',
    ...TOOLS.map(
      (t) => `- [${t.name}](${baseUrl}/tools/${t.slug}): ${t.description}`,
    ),
    '',
    '## API',
    `- Base: ${baseUrl}/api/v1`,
    '- DNS lookup: GET /api/v1/dns/lookup?domain=example.com&type=A',
    '- SSL check: GET /api/v1/ssl/check?hostname=example.com',
    '- IP lookup: GET /api/v1/network/ip-lookup?ip=8.8.8.8',
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
    answer:
      'Nexabit Network Utilities is a free, open-source collection of 35+ online tools for networking, DNS, SSL/TLS, cybersecurity, and software development. It is built and maintained by Nexabit IT Solutions.',
  },
  {
    question: 'Are Nexabit Network Utilities free to use?',
    answer:
      'Yes. Every tool on Nexabit Network Utilities is completely free. The project is open source under the MIT license with a public REST API.',
  },
  {
    question: 'What tools are available on Nexabit Network Utilities?',
    answer:
      'The platform includes DNS lookup, SSL checker, CIDR calculator, WHOIS lookup, password generator, JSON formatter, port checker, SPF/DKIM/DMARC checkers, and many more across networking, DNS, SSL, security, developer, and DevOps categories.',
  },
  {
    question: 'Does Nexabit Network Utilities have an API?',
    answer:
      'Yes. Nexabit Network Utilities provides a REST API at /api/v1 with endpoints for DNS, SSL, network diagnostics, and webhooks. Documentation is available at /api-docs.',
  },
  {
    question: 'Who built Nexabit Network Utilities?',
    answer:
      'Nexabit Network Utilities is built by Nexabit IT Solutions, an IT services company specializing in networking, cloud infrastructure, and cybersecurity.',
  },
] as const;
