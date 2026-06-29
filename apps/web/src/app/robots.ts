import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@nexabit/shared';

/** AI & search crawlers explicitly allowed for SEO, GEO, and AEO */
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended',
  'Googlebot',
  'Bingbot',
  'anthropic-ai',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Applebot',
  'Applebot-Extended',
  'cohere-ai',
  'FacebookBot',
  'meta-externalagent',
  'YouBot',
  'Bytespider',
  'CCBot',
  'Diffbot',
  'Amazonbot',
];

export default function robots(): MetadataRoute.Robots {
  const base = `https://${SITE_CONFIG.domain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/v1/dev/webhook-test'],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/' as const,
        disallow: [] as string[],
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: SITE_CONFIG.domain,
  };
}
