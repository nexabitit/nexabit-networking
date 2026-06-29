# Phase 1 Implementation — Site Audit

Based on `network-nexabitit-site-audit.md`. Test locally before deploying to Vercel.

## Phase 1 scope (current)

| Item | Status |
|------|--------|
| Rewrite hero and CTA structure | Done |
| Trust & credibility strip | Done |
| Job-based category labels | Done |
| Workflow paths (DNS, SSL, IP, DevOps) | Done |
| Sticky global search in header | Done |
| Quick-launch chips (IP, DNS, SSL, etc.) | Done |
| Standardized tool workspace layout | Done |
| Universal export (copy, download, share) | Done |
| Result summary card | Done |
| Related tools on tool pages | Done (existing) |
| Business CTA → Nexabit IT Solutions | Done |
| Input examples on key tools | Partial (IP, CIDR) |

## Local testing

```bash
npx pnpm@9.15.9 install
npx pnpm@9.15.9 run build:vercel
npx pnpm@9.15.9 --filter @nexabit/web dev
```

### Checklist

- [ ] Homepage hero shows audit headline and CTAs
- [ ] Trust strip links to GitHub, API, Nexabit
- [ ] Quick-launch chips navigate to tools
- [ ] Header search works on desktop and mobile
- [ ] Workflow path cards link to tools and categories
- [ ] Category cards show use-case labels
- [ ] Tool page: result summary + Copy JSON + Download + Share link
- [ ] `/tools/ip-lookup` and `/tools/cidr-calculator` export works
- [ ] Business CTA section at bottom of homepage
- [ ] FAQ accordion works

## Phase 2 (next — after Phase 1 sign-off)

See `PHASE_2_IMPLEMENTATION.md` — implemented.

## Phase 3 (later)

- API keys and rate tiers
- Team dashboards
- Paid monitoring and PDF reports
- MSP exports

## Deploy to Vercel

Only after Phase 1 local testing passes. See `DEPLOYMENT.md`.
