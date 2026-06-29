# Phase 3 Implementation — API Keys, Teams & MSP

Based on `network-nexabitit-site-audit.md` Phase 3.

## Phase 3 scope

| Item | Status |
|------|--------|
| API rate tiers (free / pro / team / enterprise) | Done |
| API key create, verify, usage endpoints | Done |
| Rate limiting by API key tier | Done |
| Team dashboard (`/team`) | Done |
| Developers hub (`/developers`) | Done |
| MSP CSV exports (watchlist, recent checks) | Done |
| Audit PDF report (print-to-PDF) | Done |
| Team profile (localStorage) | Done |
| Nexabit consulting CTA | Done |
| DB schema: teams table | Done (`002_teams.sql`) |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/account/tiers` | Rate tier definitions |
| POST | `/api/v1/account/keys` | Create free API key (needs `DATABASE_URL`) |
| GET | `/api/v1/account/verify` | Verify key (`X-API-Key`) |
| GET | `/api/v1/account/usage` | 7-day usage by tool |

## Rate limits

| Tier | Limit |
|------|-------|
| Free | 60 / min |
| Pro | 300 / min |
| Team | 1,000 / min |
| Enterprise | 5,000 / min |

Pro/Team/Enterprise upgrades: contact Nexabit IT Solutions.

## Database setup (API keys)

1. Create Neon project and set `DATABASE_URL` in Vercel
2. Run `packages/db/sql/001_initial.sql`
3. Run `packages/db/sql/002_teams.sql`

## Local testing

```bash
# Optional: set DATABASE_URL in apps/web/.env.local
npx pnpm@9.15.9 run build:vercel
npx pnpm@9.15.9 --filter @nexabit/web dev
```

### Checklist

- [ ] `/developers` — pricing tiers + create API key (with DB)
- [ ] `/team` — team profile, MSP exports, workspace
- [ ] API call with `X-API-Key` header works
- [ ] `/api/v1/account/verify` returns tier info
- [ ] Export watchlist CSV and audit PDF report
- [ ] Header links: Team, Developers

## Deploy

After all phases sign-off — commit and deploy to Vercel. See `DEPLOYMENT.md`.

Set `DATABASE_URL` on the Vercel web project for API key provisioning.
