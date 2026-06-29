# Contributing to Nexabit Network Utilities

Thank you for your interest in contributing to this open-source project!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/nexabit-networking.git`
3. Install dependencies: `pnpm install`
4. Copy environment: `cp .env.example .env`
5. Start development: `pnpm dev`

## Development

### Monorepo Structure

```
apps/
  web/     # Next.js frontend
  api/     # NestJS REST API
packages/
  shared/       # Tool definitions and site config
  validators/   # IP, CIDR, chmod validation
  crypto/       # Hashing, encoding, passwords
  networking/   # DNS helpers, curl, regex
  api-client/   # TypeScript API client
```

### Adding a New Tool

1. Add tool definition to `packages/shared/src/tools.ts`
2. Implement client logic in `packages/` if reusable
3. Add API endpoint in `apps/api` if server-side needed
4. Create UI component in `apps/web/src/components/tools/`
5. Register in `apps/web/src/components/tools/tool-renderer.tsx`

### Code Style

- TypeScript strict mode
- Prettier formatting: `pnpm format`
- Match existing patterns and naming conventions

### Pull Requests

1. Create a feature branch from `main`
2. Write clear commit messages
3. Ensure CI passes (`pnpm build`, `pnpm test`)
4. Open a PR with description of changes

## Reporting Issues

Use GitHub Issues for bugs and feature requests. Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, browser)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
