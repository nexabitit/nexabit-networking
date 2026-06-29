import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  },
  serverExternalPackages: ['whois-json'],
  transpilePackages: [
    '@nexabit/shared',
    '@nexabit/validators',
    '@nexabit/crypto',
    '@nexabit/networking',
    '@nexabit/api-client',
    '@nexabit/api-core',
    '@nexabit/db',
  ],
};

export default nextConfig;
