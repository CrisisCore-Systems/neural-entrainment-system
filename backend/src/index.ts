/**
 * Main Application Entry Point
 * CrisisCore Neural Interface Backend
 */

import Fastify, { FastifyBaseLogger } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import dbPlugin from './plugins/database.js';
import redisPlugin from './plugins/redis.js';
import authMiddleware from './middleware/auth.js';
import { authRoutes } from './routes/auth.js';
import { sessionRoutes } from './routes/sessions.js';
import { protocolRoutes } from './routes/protocols.js';
import { userRoutes } from './routes/users.js';

// Initialize Fastify with logger
const fastify = Fastify({
  logger: logger as FastifyBaseLogger,
  trustProxy: true,
});

/**
 * Register plugins and middleware
 */
async function registerPlugins() {
  // Security
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Disable for WebSocket support
  });

  // CORS
  await fastify.register(cors, {
    origin: config.cors.origin,
    credentials: true,
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
  });

  // JWT authentication
  await fastify.register(jwt, {
    secret: config.jwt.secret,
  });

  // WebSocket support
  await fastify.register(websocket);

  // Database connection
  if (!config.features.disableDatabase) {
    await fastify.register(dbPlugin);
  } else {
    fastify.log.warn('Database disabled via DISABLE_DATABASE=true (dev mode)');
  }

  // Redis connection
  await fastify.register(redisPlugin);

  // Auth middleware
  await fastify.register(authMiddleware);
}

/**
 * Register application routes
 */
async function registerRoutes() {
  // Health check
  fastify.get('/health', () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(sessionRoutes, { prefix: '/api/sessions' });
  await fastify.register(protocolRoutes, { prefix: '/api/protocols' });
  await fastify.register(userRoutes, { prefix: '/api/users' });
}

/**
 * Start server
 */
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const address = await fastify.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    fastify.log.info(`Server listening at ${address}`);
    fastify.log.info(`Environment: ${config.env}`);
    const allowedOrigins = Array.isArray(config.cors.origin)
      ? (config.cors.origin as string[]).join(', ')
      : (config.cors.origin as string);
    fastify.log.info(`CORS origins: ${allowedOrigins}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
async function gracefulShutdown(signal: string) {
  fastify.log.info(`${signal} received, closing server gracefully...`);
  try {
    await fastify.close();
    fastify.log.info('Server closed successfully');
    process.exit(0);
  } catch (err) {
    fastify.log.error(err, 'Error during shutdown');
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start the server
start();
