import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  keyHash: text('key_hash').notNull().unique(),
  name: text('name').notNull(),
  tier: text('tier').notNull().default('free'),
  rateLimit: integer('rate_limit').notNull().default(60),
  isActive: boolean('is_active').notNull().default(true),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const toolUsage = pgTable('tool_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  toolSlug: text('tool_slug').notNull(),
  ipHash: text('ip_hash'),
  apiKeyId: uuid('api_key_id').references(() => apiKeys.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  toolSlug: text('tool_slug'),
  message: text('message').notNull(),
  email: text('email'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
