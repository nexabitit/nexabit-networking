-- Nexabit Network Utilities — Neon PostgreSQL schema
-- Run in Neon SQL Editor or: pnpm --filter @nexabit/db db:push

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free',
  rate_limit INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug TEXT NOT NULL,
  ip_hash TEXT,
  api_key_id UUID REFERENCES api_keys(id),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tool_usage_slug ON tool_usage(tool_slug);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created ON tool_usage(created_at);

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug TEXT,
  message TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
