/**
 * Application Configuration
 */

import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),

  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'neural_entrainment',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cors: {
    // Support multiple origins via comma-separated list in CORS_ORIGIN
    // Example: CORS_ORIGIN=http://localhost:5173,https://crisiscore-systems.github.io
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
          .map((o) => o.trim())
          .filter(Boolean)
      : ['http://localhost:5173'],
  },

  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_TIMEWINDOW || '900000', 10), // 15 minutes
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  features: {
    // When true, skip connecting to PostgreSQL (dev-only convenience)
    disableDatabase: process.env.DISABLE_DATABASE === 'true',
    // When true, skip connecting to Redis and use in-memory cache
    disableRedis: process.env.DISABLE_REDIS === 'true',
  },
} as const;
