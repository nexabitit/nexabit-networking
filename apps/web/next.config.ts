import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@nexabit/shared',
    '@nexabit/validators',
    '@nexabit/crypto',
    '@nexabit/networking',
    '@nexabit/api-client',
  ],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
};

export default nextConfig;
