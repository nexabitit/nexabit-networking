import { CATEGORIES, SITE_CONFIG } from '@nexabit/shared';

export interface CategoryComparison {
  title: string;
  items: Array<{ label: string; detail: string }>;
}

export const CATEGORY_COMPARISONS: Partial<Record<string, CategoryComparison>> = {
  dns: {
    title: 'DNS tools — when to use which',
    items: [
      {
        label: 'DNS Lookup vs DNS Propagation',
        detail:
          'DNS Lookup queries authoritative or default resolvers for the current answer. DNS Propagation compares multiple public resolvers to detect cache lag after changes.',
      },
      {
        label: 'SPF vs DKIM vs DMARC',
        detail:
          'SPF authorizes sending IPs. DKIM signs messages cryptographically. DMARC defines policy and reporting when SPF/DKIM fail. Use all three for strong email authentication.',
      },
    ],
  },
  ssl: {
    title: 'SSL tools — when to use which',
    items: [
      {
        label: 'SSL Checker vs SSL Expiry',
        detail:
          'SSL Checker inspects the full certificate chain and TLS details for one hostname now. SSL Expiry focuses on days remaining and renewal urgency.',
      },
      {
        label: 'SSL Expiry vs SSL Expiry Monitor',
        detail:
          'SSL Expiry is a single-host check. SSL Expiry Monitor supports tracking multiple hostnames via Workspace watchlists for ongoing operational review.',
      },
    ],
  },
  networking: {
    title: 'Networking tools — when to use which',
    items: [
      {
        label: 'Ping vs Traceroute',
        detail:
          'Ping tests reachability and round-trip time to the destination. Traceroute shows each hop along the path to locate where latency or loss begins.',
      },
      {
        label: 'IP Lookup vs WHOIS vs ASN Lookup',
        detail:
          'IP Lookup returns geolocation and network context. WHOIS returns domain registration data. ASN Lookup maps IPs or prefixes to autonomous system operators.',
      },
    ],
  },
};

export const CATEGORY_FAQ: Partial<
  Record<string, Array<{ question: string; answer: string }>>
> = {
  dns: [
    {
      question: 'How do I troubleshoot DNS propagation issues?',
      answer:
        'Compare authoritative DNS Lookup results with DNS Propagation across resolvers. If authoritative is correct but resolvers differ, wait for TTL expiry or reduce TTL before future changes.',
    },
    {
      question: 'How do I check SPF records?',
      answer:
        'Use the SPF Checker on Nexabit Network Utilities. Enter your domain and review mechanisms, lookup count, and syntax before sending production email.',
    },
  ],
  ssl: [
    {
      question: 'How do I verify SSL certificate expiry?',
      answer:
        'Run SSL Checker or SSL Expiry for a single host, or add domains to Workspace and use SSL Expiry Monitor for recurring operational checks.',
    },
  ],
};

export function categoryBreadcrumbJsonLd(slug: string, label: string) {
  const baseUrl = `https://${SITE_CONFIG.domain}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: label, item: `${baseUrl}/category/${slug}` },
    ],
  };
}

export function categoryFaqJsonLd(faq: Array<{ question: string; answer: string }>) {
  if (!faq.length) return null;
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

export function getCategoryMeta(category: (typeof CATEGORIES)[number]) {
  const baseUrl = `https://${SITE_CONFIG.domain}`;
  return {
    title: `${category.useCaseLabel} — Free ${category.name} Tools`,
    description: `${category.description} Browse free ${category.name.toLowerCase()} utilities on ${SITE_CONFIG.name}. No sign-up required for browser tools.`,
    alternates: { canonical: `${baseUrl}/category/${category.slug}` },
    openGraph: {
      title: `${category.useCaseLabel} | ${SITE_CONFIG.name}`,
      description: category.description,
      url: `${baseUrl}/category/${category.slug}`,
    },
  };
}
