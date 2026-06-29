import { SITE_CONFIG, TOOL_COUNT } from '@nexabit/shared';

export const dynamic = 'force-static';

export async function GET() {
  const base = `https://${SITE_CONFIG.domain}`;
  const body = `# ${SITE_CONFIG.name}
# Machine-readable site summary for AI assistants and answer engines

name: ${SITE_CONFIG.name}
url: ${base}
description: ${SITE_CONFIG.description}
license: MIT
api: ${base}/api/v1
docs: ${base}/api-docs
llms-txt: ${base}/llms.txt
sitemap: ${base}/sitemap.xml
organization: ${SITE_CONFIG.company}
organization-url: ${SITE_CONFIG.companyUrl}
github: ${SITE_CONFIG.githubUrl}
crawl: allowed
tools-count: ${TOOL_COUNT}
browser-tools: free, no login
developer-api: gated — free and paid plans, keys at /developers/login
categories: networking, dns, ssl, security, developer, devops

# Full tool index and entity model at ${base}/llms.txt
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
