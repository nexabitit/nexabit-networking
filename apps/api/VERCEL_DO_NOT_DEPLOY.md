# DO NOT deploy this folder to Vercel

The NestJS API in `apps/api` is for **Docker / VPS only**.

Deploy **`apps/web`** instead — it includes the website and serverless API at `/api/v1/*`.

If `network.nexabitit.com` returns:

```json
{"message":"Cannot GET /","error":"Not Found","statusCode":404}
```

your domain is attached to the **wrong** Vercel project. See [DEPLOYMENT.md](../../DEPLOYMENT.md#fix-domain-404-cannot-get-).
