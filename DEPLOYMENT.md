# Deployment Guide — Nexabit Network Utilities

This guide covers deploying **network.nexabitit.com** on **Vercel (Hobby)** with **Neon PostgreSQL**.

## Important: Why you saw 404 on Vercel

The NestJS app in `apps/api` is a **long-running server**. It does **not** work on Vercel serverless. Deploying it as a separate Vercel project (`nexabit-networking-api.vercel.app`) causes `Cannot GET /` because:

- Vercel expects serverless functions or a Next.js app
- NestJS has no route at `/` (only `/api/v1/...`)

**Solution:** Deploy **one** Vercel project from `apps/web`. The API lives in Next.js Route Handlers at `/api/v1/*`.

---

## Architecture on Vercel Hobby

| Component | Where it runs |
|-----------|---------------|
| Website (35 tools) | Next.js static/SSR pages |
| REST API | 6 serverless functions (under 12 limit) |
| Database | Neon PostgreSQL (external) |
| NestJS `apps/api` | Docker/VPS only (optional) |

### Serverless functions used (6 of 12 Hobby limit)

| Function | Routes |
|----------|--------|
| `/api` | API info root |
| `/api/v1/health` | Health check |
| `/api/v1/network/[[...action]]` | ip-lookup, port-check, ping, whois, etc. |
| `/api/v1/dns/[[...action]]` | lookup, spf, dkim, dmarc, propagation |
| `/api/v1/ssl/[[...action]]` | check, expiry |
| `/api/v1/dev/[[...action]]` | webhook-test |

---

## Prerequisites

- [GitHub](https://github.com) account with this repo pushed
- [Vercel](https://vercel.com) account (Hobby/free)
- [Neon](https://neon.tech) account (free tier)
- Domain `network.nexabitit.com` (DNS access at your registrar)

---

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Vercel serverless API and deployment docs"
git push origin main
```

---

## Step 2: Create Neon Database

1. Go to [console.neon.tech](https://console.neon.tech) → **New Project**
2. Name: `nexabit-network`
3. Region: choose closest to your Vercel region (`iad1` = US East)
4. Copy the **pooled** connection string (important for serverless)
5. Open **SQL Editor** and run the schema from:
   ```
   packages/db/sql/001_initial.sql
   ```

Or from your machine (with `DATABASE_URL` set):

```bash
npx pnpm@9.15.9 --filter @nexabit/db db:push
```

---

## Step 3: Deploy to Vercel

### Delete or ignore the old API project

Remove the separate `nexabit-networking-api` Vercel project, or stop using it. You only need **one** project.

### Create the web project

1. [vercel.com/new](https://vercel.com/new) → Import your GitHub repo
2. **Root Directory:** `apps/web` ← critical
3. **Framework Preset:** Next.js (auto-detected)
4. **Build Command:** (uses `apps/web/vercel.json`)
   ```
   cd ../.. && npx pnpm@9.15.9 run build:vercel
   ```
5. **Install Command:**
   ```
   cd ../.. && npx pnpm@9.15.9 install
   ```

### Environment variables (Vercel → Settings → Environment Variables)

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Neon pooled connection string | Recommended |
| `RATE_LIMIT` | `60` | Optional |
| `NEXT_PUBLIC_API_URL` | *(leave empty)* | Use same-origin API |

Do **not** set `NEXT_PUBLIC_API_URL` unless API is on a different domain.

6. Click **Deploy**

---

## Step 4: Verify deployment

After deploy, test these URLs (replace with your Vercel URL):

```
https://YOUR-PROJECT.vercel.app/
https://YOUR-PROJECT.vercel.app/api
https://YOUR-PROJECT.vercel.app/api/v1/health
https://YOUR-PROJECT.vercel.app/api/v1/dns/lookup?domain=google.com&type=A
https://YOUR-PROJECT.vercel.app/tools/dns-lookup
```

Expected `/api` response:

```json
{
  "name": "Nexabit Network Utilities API",
  "version": "1.0.0",
  "status": "ok",
  "platform": "vercel-serverless"
}
```

---

## Step 5: Custom domain

1. Vercel project → **Settings** → **Domains**
2. Add `network.nexabitit.com`
3. At your DNS provider, add the records Vercel shows (usually `CNAME` → `cname.vercel-dns.com`)
4. Wait for SSL certificate (automatic)

Optional: add `www.network.nexabitit.com` redirect to apex.

---

## Step 6: Local development

### Option A — Full stack on Vercel-style (recommended)

```bash
cp .env.example .env
# Set DATABASE_URL to your Neon dev branch

npx pnpm@9.15.9 install
npx pnpm@9.15.9 run build:vercel
npx pnpm@9.15.9 --filter @nexabit/web dev
```

API available at `http://localhost:3000/api/v1/...`

### Option B — Separate NestJS API (Docker)

```bash
npx pnpm@9.15.9 --filter @nexabit/api dev
# Set NEXT_PUBLIC_API_URL=http://localhost:4000 in .env
```

---

## Serverless limitations

These tools return an informative message on Vercel (no ICMP/shell access):

- **Ping** — use Port Checker or external monitoring
- **Traceroute** — deploy NestJS on VPS for full diagnostics

All other API tools work on Vercel.

---

## Monitoring & analytics (Phase 2)

With `DATABASE_URL` set, API calls are logged to `tool_usage` in Neon. Query example:

```sql
SELECT tool_slug, COUNT(*) AS hits
FROM tool_usage
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY tool_slug
ORDER BY hits DESC;
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `404 Cannot GET /` on API subdomain | Use single `apps/web` deploy; visit `/api` not `/` on old API project |
| Build fails on Vercel | Ensure Root Directory = `apps/web` and install runs from monorepo root |
| DNS lookup timeout | Vercel function timeout is 30s; check domain spelling |
| DB errors in logs | Verify pooled Neon URL; run `001_initial.sql` |
| Rate limit 429 | Default 60/min per IP; adjust `RATE_LIMIT` env var |
| Exceeded 12 functions | Do not add per-endpoint route files; use catch-all `[[...action]]` only |

---

## Production checklist

- [ ] Single Vercel project from `apps/web`
- [ ] Old `nexabit-networking-api` project removed or archived
- [ ] `DATABASE_URL` set in Vercel
- [ ] Neon schema applied (`001_initial.sql`)
- [ ] Custom domain `network.nexabitit.com` configured
- [ ] `/api/v1/health` returns `ok`
- [ ] Tool pages load and API tools return data
- [ ] GitHub repo public (for open source)
- [ ] LICENSE and README visible on GitHub

---

## Cost estimate (Hobby tier)

| Service | Cost |
|---------|------|
| Vercel Hobby | Free |
| Neon Free | Free (0.5 GB storage) |
| Domain | Your registrar |
| **Total** | **$0/month** to start |

Upgrade Vercel Pro or Neon when you need more bandwidth, functions, or storage.
