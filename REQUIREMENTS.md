# Requirements — Going Live

## Services

| Service | Plan | Purpose |
|---------|------|---------|
| **Vercel** | Hobby (free) | Host Next.js web + serverless API |
| **Neon** | Free | PostgreSQL for usage logs, API keys (Phase 2) |
| **GitHub** | Free | Source code, CI, open source |
| **Domain** | Your registrar | `network.nexabitit.com` |

## Vercel Hobby limits (relevant)

| Limit | Value | Our usage |
|-------|-------|-----------|
| Serverless Functions | 12 per deployment | **6** (consolidated catch-all routes) |
| Function duration | 10s default, 60s max (Pro) | 30s configured for network tools |
| Bandwidth | 100 GB/month | Sufficient for early traffic |
| Builds | 6000 min/month | Monorepo build ~2–3 min |

## Environment variables

### Required for production

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon pooled PostgreSQL connection string |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `RATE_LIMIT` | `60` | API requests per minute per IP |
| `NEXT_PUBLIC_API_URL` | *(empty)* | Leave empty for same-origin `/api` |

### Local development only

| Variable | Description |
|----------|-------------|
| `PORT` | NestJS API port (4000) if using `apps/api` |
| `CORS_ORIGIN` | NestJS CORS (http://localhost:3000) |

## Node.js

- **Version:** 20.x or 22.x
- **Package manager:** pnpm 9.x (via `npx pnpm@9.15.9` if not installed globally)

## Browser support

- Chrome, Firefox, Safari, Edge (last 2 versions)
- Mobile responsive

## What NOT to deploy on Vercel

- `apps/api` (NestJS) — use Docker/VPS instead
- Redis — not required for Phase 1; add Upstash later for distributed rate limiting

## DNS records (example)

After adding domain in Vercel:

```
Type   Name      Value
CNAME  network   cname.vercel-dns.com
```

Exact values shown in Vercel dashboard.

## Security notes

- Never commit `.env` or `DATABASE_URL` to Git
- Use Neon **pooled** connection string on Vercel
- API keys stored as hashes only (Phase 2 schema ready in `packages/db`)
