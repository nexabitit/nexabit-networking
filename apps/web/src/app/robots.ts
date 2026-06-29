import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@nexabit/shared';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `https://${SITE_CONFIG.domain}/sitemap.xml`,
  };
}
