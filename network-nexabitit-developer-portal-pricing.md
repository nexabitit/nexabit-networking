# Nexabit Network Utilities — Developer Login, API Key Access, and Pricing Plan

## Overview

Nexabit Network Utilities has already matured into a multi-phase platform, and the next logical step is to introduce a gated developer portal where only logged-in team members and external developers can access API keys, usage visibility, and plan-based pricing details.[cite:22][cite:27][cite:31] This approach is aligned with common API monetization patterns in 2026, where free tiers are used for product discovery while higher limits, better retention, and team features are reserved for paid plans.[cite:22][cite:23][cite:31]

The portal should not block public tool usage on the website. Instead, it should gate only the API program: API key creation, usage dashboards, request history, rate limits, plan upgrades, billing, and team-level management.[cite:22][cite:23]

## Recommended access model

The access model should have three layers:

1. **Public visitor** — can browse tools, read docs, and use the web UI without login.
2. **Developer account** — must log in to create and manage API keys, view API pricing, monitor usage, and upgrade plans.
3. **Internal team/admin** — can create internal keys, manage customers, change plan limits, revoke keys, and review usage or abuse.

This pattern mirrors common developer portal behavior, where self-service access begins with account creation but operational controls stay behind authenticated dashboards.[cite:22][cite:27]

## Login system scope

The login system should be built as a **developer portal**, not as a generic user account system. The goal is to support API consumers and internal Nexabit operators, not to require authentication for the regular website audience.[cite:27][cite:29]

### Authentication flows

Recommended flows:

- Email + password login for external developers.
- Google or GitHub social login as an optional fast-path for developers.
- Role-based internal login for Nexabit team members.
- Email verification before API key generation.
- Password reset and basic account recovery.
- Optional 2FA for paid and admin accounts.

### User roles

| Role | Purpose | Access |
|---|---|---|
| Visitor | Public website user | Browse tools, docs, public pages only |
| Developer Free | Individual evaluator | 1 app, limited API keys, limited monthly requests |
| Developer Paid | Production consumer | More requests, more keys, better support |
| Team | Shared company or startup use | Multiple members, multiple apps, shared usage views |
| Admin | Nexabit internal operations | Full plan, key, abuse, billing, and support control |

## Portal pages to add

The developer portal should include these pages after login:

- **Dashboard** — current plan, monthly usage, request count, error count, remaining quota, recent API activity.
- **API Keys** — create, reveal once, rotate, revoke, label, and assign per app/environment.
- **Applications** — app name, environment, callback/domain notes, linked keys.
- **Pricing** — visible only after login if that is the chosen business rule.
- **Usage & Analytics** — requests over time, endpoint usage, status codes, quota consumption.
- **Billing** — current plan, invoices, upgrade/downgrade, payment method.
- **Docs** — endpoint documentation and examples.
- **Support** — issue/report request form, rate-limit appeal, enterprise enquiry.

This structure follows common developer portal expectations where onboarding, credential issuance, usage monitoring, and pricing live inside one account area.[cite:22][cite:27][cite:29]

## API key rules

API keys should be generated only after login and email verification. The keys should be shown once at creation, hashed in storage, and always tied to a user account and an application record for traceability and abuse handling.[cite:24][cite:31]

Recommended key policies:

- One-click key creation per application.
- Reveal only once at creation.
- Store only hashed key values in the database.
- Support key rotation and revocation.
- Allow separate keys for dev, staging, and production.
- Apply plan-specific rate limits and monthly quotas.
- Log last-used time, IP summary, and top endpoints.
- Allow emergency suspend for abuse or unusual traffic.

## Recommended pricing strategy

For this platform, the best model is **freemium + tiered monthly plans + enterprise custom**. That matches modern API pricing patterns, where a free tier helps developers test quickly, and paid tiers unlock higher quotas, more keys, team members, and production-grade usage.[cite:22][cite:23][cite:31]

Because the user has a strong preference for avoiding unnecessary subscription complexity and likes clear pricing, the plans should stay simple, predictable, and transparent.[cite:17] The pricing should therefore be quota-based and monthly, with annual discounts only as an optional later addition.[cite:17][cite:31]

## Suggested pricing plans

The following structure is designed for an India-based developer audience while still remaining commercially sensible for SMBs, agencies, and technical teams.

| Plan | Monthly price | Best for | Included requests | Rate limit | Apps | API keys | Team seats | Support |
|---|---:|---|---:|---:|---:|---:|---:|---|
| Free | ₹0 | Testing and hobby use | 10,000 / month | 2 RPS | 1 | 1 | 1 | Community/email |
| Starter | ₹999 | Solo developers and small projects | 100,000 / month | 10 RPS | 3 | 5 | 1 | Standard email |
| Growth | ₹2,999 | Production apps and agencies | 500,000 / month | 25 RPS | 10 | 20 | 3 | Priority email |
| Team | ₹7,999 | Startups, MSPs, and internal teams | 2,000,000 / month | 50 RPS | 25 | 50 | 10 | Priority + onboarding |
| Enterprise | Custom | High-volume or compliance-heavy users | Custom | Custom | Custom | Custom | Custom | SLA + custom support |

This style of packaging is consistent with API plan structures that combine free access, request quotas, rate limits, app limits, and team-based scaling.[cite:22][cite:23][cite:31]

## Why this pricing works

### Free plan

A free plan is important because developers want to test quickly before committing. Common API portals use the free plan to offer limited monthly calls, low RPS, and a small number of apps or keys so users can validate functionality before upgrading.[cite:22][cite:23][cite:36]

Recommended Free plan features:

- 10,000 API requests per month.
- 2 RPS.
- 1 application.
- 1 API key.
- Basic usage dashboard.
- 7-day analytics retention.
- No SLA.
- No bulk endpoints or monitoring APIs.

### Starter plan

This should be the main entry paid plan. It must be affordable enough for individual developers and freelancers while clearly better than free in quota and practical usability.[cite:31][cite:35]

Recommended Starter features:

- 100,000 requests per month.
- 10 RPS.
- 3 applications.
- 5 API keys.
- 30-day analytics retention.
- Email support.
- Access to all standard endpoints.

### Growth plan

This tier should target startups, SaaS products, agencies, and small production deployments. It should be the commercial sweet spot for most serious users.[cite:31][cite:35]

Recommended Growth features:

- 500,000 requests per month.
- 25 RPS.
- 10 applications.
- 20 API keys.
- 3 seats.
- 90-day analytics retention.
- Priority email support.
- Access to monitoring and bulk endpoints.

### Team plan

This plan should be designed for internal IT teams, MSPs, and agencies with multiple operators or customer environments. The real value here is team access, quota scale, and centralized management.[cite:27][cite:29][cite:31]

Recommended Team features:

- 2,000,000 requests per month.
- 50 RPS.
- 25 applications.
- 50 API keys.
- 10 seats.
- 180-day analytics retention.
- Priority support and onboarding.
- Shared usage visibility.
- Role-based member permissions.

### Enterprise plan

Enterprise should not have public numeric pricing if the service may include custom support, legal review, SLA, dedicated limits, custom endpoints, or compliance commitments. This follows standard enterprise API monetization practice where needs vary too widely for one flat public price.[cite:22][cite:31]

Recommended Enterprise features:

- Custom quota and rate limits.
- Dedicated support.
- SLA.
- Custom retention and export policy.
- Invoice billing.
- Optional isolated infrastructure.
- Optional managed onboarding.

## Pricing visibility rule

Because the requirement is to show pricing only after login, the site can keep the public website focused on tools and documentation while moving plan comparison into the developer dashboard. This is technically workable, but from a conversion perspective it is usually better to keep at least a summary pricing teaser visible publicly, while requiring login only for plan activation and API key creation.[cite:27][cite:29]

Two workable options:

| Option | Public visibility | Logged-in visibility | Best use |
|---|---|---|---|
| Closed pricing | Public users see “Login to view API pricing” | Full plan table after login | Useful if pricing may change frequently or if audience is tightly controlled |
| Hybrid pricing | Public users see starting prices and plan names | Full limits, upgrades, and billing after login | Better for conversion and trust |

The recommended option is **hybrid pricing**, because developers usually expect at least some idea of cost before creating an account.[cite:27][cite:31]

## Recommended business rules

The following business rules will keep the portal simple and secure:

- API access requires verified login.
- Free users get one live key only.
- Paid users can create multiple keys based on plan.
- Keys are tied to applications.
- Monthly quotas reset automatically.
- RPS limits are enforced per key.
- Suspicious usage triggers temporary throttling or review.
- Admins can revoke keys instantly.
- Upgrades apply immediately; downgrades apply at next billing cycle.
- Free users lose access to high-cost endpoints if abuse risk is high.

These controls align with common free-tier and quota-enforcement patterns used in API programs today.[cite:23][cite:30][cite:31]

## Recommended portal UX flow

A clean onboarding flow should be:

1. Developer clicks **Get API Access**.
2. Developer signs up or logs in.
3. Email is verified.
4. Developer lands on dashboard.
5. Pricing card or current plan is shown.
6. Developer creates first application.
7. Developer generates API key.
8. Developer copies key once and tests via docs or playground.
9. Usage meter appears immediately.
10. Upgrade prompts appear near quota thresholds.

This flow keeps onboarding fast while still preserving security and plan controls.[cite:22][cite:27]

## Recommended technical architecture

Given the current product direction and the user’s technical stack preferences, the portal can be built as a separate authenticated app or as a gated section inside the existing site. A separate app such as `developers.network.nexabitit.com` or `network.nexabitit.com/developer` would keep concerns cleaner and make future scaling easier.[cite:19]

Recommended backend capabilities:

- Auth service.
- Role and permission system.
- API key issuance and hashing.
- Rate limiting middleware.
- Usage metering.
- Billing integration.
- Plan entitlement checks.
- Admin management panel.
- Audit logs.

## Best first launch

The most practical first release would include:

- Email/password login.
- Email verification.
- Free, Starter, Growth, and Team plans.
- API key management.
- Monthly request quotas.
- Usage dashboard.
- Stripe or Razorpay subscription integration.
- Admin panel for plan changes and key revocation.

This first release is enough to make the API commercially usable without overbuilding from day one.[cite:31][cite:35]

## Final recommendation

The strongest model for Nexabit Network Utilities is to keep the public tools open, but gate API access behind a dedicated developer login. Pricing should be simple and transparent, with a free plan for evaluation, paid monthly tiers for production, and a custom enterprise tier for larger teams or managed-service use cases.[cite:22][cite:23][cite:31]

For launch, the best pricing table is:

- Free — ₹0
- Starter — ₹999/month
- Growth — ₹2,999/month
- Team — ₹7,999/month
- Enterprise — Custom

This structure is simple enough for Indian developers to understand quickly, while still giving Nexabit room to monetize production usage and team workflows effectively.[cite:17][cite:31]
