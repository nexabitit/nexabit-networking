# Phase 2 Implementation — Retention & New Tools

Based on `network-nexabitit-site-audit.md` Phase 2. Test locally before deploy (commit after all phases).

## Phase 2 scope

| Item | Status |
|------|--------|
| Saved recent checks (localStorage) | Done |
| Favorites (star on tool pages) | Done |
| Workspace hub (`/workspace`) | Done |
| Watchlists (SSL, domain, endpoint) | Done |
| Client-side alerts on watchlist checks | Done |
| Bulk DNS lookup (CSV / paste) | Done |
| HTTP security headers checker | Done |
| SSL expiry monitor tool | Done |

## New tools

- `/tools/http-security-headers` — HSTS, CSP, X-Frame-Options, grade A–F
- `/tools/bulk-dns-lookup` — up to 50 domains per run, CSV upload
- `/tools/ssl-expiry-monitor` — multi-hostname watchlist + batch check

## Local testing

```bash
npx pnpm@9.15.9 install
npx pnpm@9.15.9 run build:vercel
npx pnpm@9.15.9 --filter @nexabit/web dev
```

### Checklist

- [ ] Run IP lookup → appears under "Recently used" on homepage
- [ ] Star a tool → shows in Favorites on homepage and `/workspace`
- [ ] `/workspace` — add SSL hostname, run Check SSL, see status
- [ ] `/tools/bulk-dns-lookup` — paste domains, run, export JSON
- [ ] `/tools/http-security-headers` — check a URL, see grade in summary
- [ ] `/tools/ssl-expiry-monitor` — add hosts, check all, alerts for expiring certs
- [ ] Header nav includes Workspace link

## Phase 3 (next)

See `PHASE_3_IMPLEMENTATION.md` — implemented.

## Deploy

After Phase 3 sign-off — single commit + Vercel deploy. See `DEPLOYMENT.md`.
