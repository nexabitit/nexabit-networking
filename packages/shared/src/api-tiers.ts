export type ApiTier = 'free' | 'starter' | 'growth' | 'team' | 'enterprise';

export interface ApiTierDefinition {
  id: ApiTier;
  name: string;
  /** Requests per second — converted to per-minute rate limits in middleware */
  requestsPerSecond: number;
  monthlyQuota: number;
  maxApps: number;
  maxApiKeys: number;
  teamSeats: number;
  analyticsRetentionDays: number;
  description: string;
  bestFor: string;
  priceLabel: string;
  priceMonthlyInr: number | null;
  support: string;
  features: string[];
  /** Legacy alias used in rate-limit responses */
  rateLimit: number;
}

function tier(
  def: Omit<ApiTierDefinition, 'rateLimit'> & { requestsPerSecond: number },
): ApiTierDefinition {
  return { ...def, rateLimit: def.requestsPerSecond * 60 };
}

export const API_TIERS: ApiTierDefinition[] = [
  tier({
    id: 'free',
    name: 'Free',
    requestsPerSecond: 2,
    monthlyQuota: 10_000,
    maxApps: 1,
    maxApiKeys: 1,
    teamSeats: 1,
    analyticsRetentionDays: 7,
    description: 'Testing and hobby use — evaluate the API before upgrading.',
    bestFor: 'Testing and hobby use',
    priceLabel: '₹0',
    priceMonthlyInr: 0,
    support: 'Community / email',
    features: [
      '10,000 requests / month',
      '2 requests / second',
      '1 application · 1 API key',
      '7-day analytics retention',
      'Standard endpoints',
    ],
  }),
  tier({
    id: 'starter',
    name: 'Starter',
    requestsPerSecond: 10,
    monthlyQuota: 100_000,
    maxApps: 3,
    maxApiKeys: 5,
    teamSeats: 1,
    analyticsRetentionDays: 30,
    description: 'Affordable entry for solo developers and small projects.',
    bestFor: 'Solo developers and small projects',
    priceLabel: '₹999/mo',
    priceMonthlyInr: 999,
    support: 'Standard email',
    features: [
      '100,000 requests / month',
      '10 requests / second',
      '3 applications · 5 API keys',
      '30-day analytics retention',
      'All standard endpoints',
    ],
  }),
  tier({
    id: 'growth',
    name: 'Growth',
    requestsPerSecond: 25,
    monthlyQuota: 500_000,
    maxApps: 10,
    maxApiKeys: 20,
    teamSeats: 3,
    analyticsRetentionDays: 90,
    description: 'Production apps, agencies, and serious automation workloads.',
    bestFor: 'Production apps and agencies',
    priceLabel: '₹2,999/mo',
    priceMonthlyInr: 2999,
    support: 'Priority email',
    features: [
      '500,000 requests / month',
      '25 requests / second',
      '10 applications · 20 API keys',
      '3 team seats',
      '90-day analytics · bulk & monitoring APIs',
    ],
  }),
  tier({
    id: 'team',
    name: 'Team',
    requestsPerSecond: 50,
    monthlyQuota: 2_000_000,
    maxApps: 25,
    maxApiKeys: 50,
    teamSeats: 10,
    analyticsRetentionDays: 180,
    description: 'MSPs, startups, and internal IT with shared visibility.',
    bestFor: 'Startups, MSPs, and internal teams',
    priceLabel: '₹7,999/mo',
    priceMonthlyInr: 7999,
    support: 'Priority + onboarding',
    features: [
      '2,000,000 requests / month',
      '50 requests / second',
      '25 applications · 50 API keys',
      '10 team seats · shared usage views',
      '180-day analytics · MSP exports',
    ],
  }),
  tier({
    id: 'enterprise',
    name: 'Enterprise',
    requestsPerSecond: 100,
    monthlyQuota: 0,
    maxApps: 0,
    maxApiKeys: 0,
    teamSeats: 0,
    analyticsRetentionDays: 365,
    description: 'Custom quota, SLA, compliance, and dedicated support.',
    bestFor: 'High-volume or compliance-heavy users',
    priceLabel: 'Custom',
    priceMonthlyInr: null,
    support: 'SLA + custom support',
    features: [
      'Custom quota and rate limits',
      'Dedicated support and SLA',
      'Custom retention and export policy',
      'Invoice billing · optional isolated infra',
    ],
  }),
];

/** Map legacy tier ids from earlier releases */
const LEGACY_TIER_MAP: Record<string, ApiTier> = {
  pro: 'starter',
};

export function normalizeTierId(tier: string): ApiTier {
  const mapped = LEGACY_TIER_MAP[tier] ?? tier;
  if (API_TIERS.some((t) => t.id === mapped)) return mapped as ApiTier;
  return 'free';
}

export function getTierDefinition(tier: string): ApiTierDefinition {
  return API_TIERS.find((t) => t.id === normalizeTierId(tier)) ?? API_TIERS[0];
}

export function getRateLimitForTier(tier: string): number {
  return getTierDefinition(tier).rateLimit;
}

export function getMaxApiKeysForTier(tier: string): number {
  const def = getTierDefinition(tier);
  return def.maxApiKeys || 999;
}

export function getMonthlyQuotaForTier(tier: string): number {
  return getTierDefinition(tier).monthlyQuota;
}

export function hasTeamAccess(tier: string): boolean {
  const id = normalizeTierId(tier);
  return id === 'team' || id === 'enterprise' || id === 'growth';
}
