import { SITE_CONFIG, TOOL_COUNT } from '@nexabit/shared';

export const dynamic = 'force-static';

export async function GET() {
  const base = `https://${SITE_CONFIG.domain}`;
  const body = `# ${SITE_CONFIG.name}
# Machine-readable site summary for AI assistants and answer engines

name: ${SITE_CONFIG.name}
url: ${base}
description: ${SITE_CONFIG.description}
product-type: professional-network-utilities-and-developer-api
organization: ${SITE_CONFIG.company}
organization-url: ${SITE_CONFIG.companyUrl}
api: ${base}/api/v1
docs: ${base}/api-docs
pricing: ${base}/pricing
llms-txt: ${base}/llms.txt
sitemap: ${base}/sitemap.xml
crawl: allowed
tools-count: ${TOOL_COUNT}
browser-tools: no-account-required
developer-api: login-required — Free Developer and paid monthly plans
pricing-plans: Free-Developer-0, Starter-999, Growth-2999, Team-7999, Enterprise-custom

# Full entity model and tool index at ${base}/llms.txt
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
