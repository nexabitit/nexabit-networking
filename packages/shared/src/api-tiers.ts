export type ApiTier = 'free' | 'pro' | 'team' | 'enterprise';

export interface ApiTierDefinition {
  id: ApiTier;
  name: string;
  rateLimit: number;
  description: string;
  priceLabel: string;
  features: string[];
}

export const API_TIERS: ApiTierDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    rateLimit: 60,
    description: 'Anonymous and registered free access for tools and light API use.',
    priceLabel: '$0',
    features: ['60 requests / minute', 'All public tools', 'Workspace in browser', 'Community support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    rateLimit: 300,
    description: 'Higher limits for engineers running frequent diagnostics and automation.',
    priceLabel: 'Contact us',
    features: [
      '300 requests / minute',
      'API key authentication',
      'Usage analytics',
      'MSP CSV exports',
      'Email support',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    rateLimit: 1000,
    description: 'Shared dashboards and monitoring for IT teams and MSPs.',
    priceLabel: 'Contact us',
    features: [
      '1,000 requests / minute',
      'Team workspace',
      'Multi-domain watchlists',
      'Audit PDF reports',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    rateLimit: 5000,
    description: 'Custom limits, white-label exports, and managed implementation.',
    priceLabel: 'Custom',
    features: [
      'Custom rate limits',
      'White-label reports',
      'Scheduled monitoring',
      'Dedicated support',
      'Nexabit managed services',
    ],
  },
];

export function getTierDefinition(tier: string): ApiTierDefinition {
  return API_TIERS.find((t) => t.id === tier) ?? API_TIERS[0];
}

export function getRateLimitForTier(tier: string): number {
  return getTierDefinition(tier).rateLimit;
}
