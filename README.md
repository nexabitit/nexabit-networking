# Nexabit Network Utilities

[![CI](https://github.com/nexabitit/nexabit-networking/actions/workflows/ci.yml/badge.svg)](https://github.com/nexabitit/nexabit-networking/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**network.nexabitit.com** — Free, open-source networking, DNS, SSL, security, and developer utilities by [Nexabit IT Solutions](https://nexabitit.com).

## Features

- **35+ tools** across networking, DNS, SSL/TLS, security, developer, and DevOps categories
- **API-first** — REST API with OpenAPI documentation and rate limiting
- **SEO optimized** — Individual landing pages per tool with structured data
- **Dark mode** — Responsive UI built with Next.js and Tailwind CSS
- **Open source** — MIT licensed, contributions welcome

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4 |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL (Phase 2+) |
| Cache | Redis (Phase 2+) |
| Monorepo | pnpm workspaces, Turborepo |
| Deployment | Docker, GitHub Actions |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Development

```bash
# Install dependencies
pnpm install

# Build shared packages
pnpm --filter @nexabit/shared build
pnpm --filter @nexabit/validators build
pnpm --filter @nexabit/crypto build
pnpm --filter @nexabit/networking build

# Start API (port 4000) and Web (port 3000)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the web app and [http://localhost:4000/api/docs](http://localhost:4000/api/docs) for API documentation.

### Docker

```bash
cp .env.example .env
docker compose up --build
```

## Project Structure

```
nexabit-networking/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS REST API
├── packages/
│   ├── shared/       # Tool registry & site config
│   ├── validators/   # IP, CIDR, chmod validators
│   ├── crypto/       # Hash, encode, password utils
│   ├── networking/   # DNS, curl, regex helpers
│   └── api-client/   # TypeScript API client
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Tools (Phase 1)

### Networking
IP Lookup · CIDR Calculator · IPv4/IPv6 Validator · Port Checker · Ping · Traceroute · WHOIS · ASN Lookup

### DNS
DNS Lookup · SPF · DKIM · DMARC · Propagation

### SSL/TLS
SSL Checker · Expiry Checker · PEM Decoder · CSR Generator

### Security
Password Generator · Strength Checker · Hash Generator · JWT Decoder · Base64 · URL/HTML Encode · UUID

### Developer
JSON/YAML/XML Formatter · Regex Tester · cURL Generator · Webhook Tester

### DevOps
chmod Calculator · Cron Generator · Docker Compose Validator · Kubernetes YAML Validator

## API

Base URL: `http://localhost:4000/api/v1`

```bash
# Example: DNS lookup
curl "http://localhost:4000/api/v1/dns/lookup?domain=google.com&type=A"

# Example: SSL check
curl "http://localhost:4000/api/v1/ssl/check?hostname=google.com"
```

Full documentation at `/api/docs` (Swagger UI).

## Roadmap

| Phase | Scope |
|-------|-------|
| **Phase 1** (current) | 35 core tools, docs, GitHub, CI/CD |
| Phase 2 | 80 tools, blog, analytics, user accounts |
| Phase 3 | 150+ tools, monitoring, API keys |
| Phase 4 | Enterprise features, SaaS, mobile app |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT © [Nexabit IT Solutions](https://nexabitit.com)
