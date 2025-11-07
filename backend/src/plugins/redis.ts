/**
 * Redis Cache Plugin (Optional)
 * Falls back to in-memory cache if Redis unavailable
 */

import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyRedis from '@fastify/redis';
import { config } from '../config/index.js';
import net from 'node:net';

function probeRedisConnectivity(
  host: string,
  port: number,
  timeoutMs = 600
): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeoutMs);
    socket.on('connect', () => {
      clearTimeout(timer);
      socket.end();
      resolve(true);
    });
    socket.on('error', () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

// In-memory fallback cache
const memoryCache = new Map<string, { value: string; expiry: number }>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of memoryCache.entries()) {
    if (data.expiry < now) {
      memoryCache.delete(key);
    }
  }
}, 60000);

// In-memory cache implementation
const inMemoryCache = {
  get(key: string): Promise<string | null> {
    const data = memoryCache.get(key);
    if (!data) return Promise.resolve(null);
    if (data.expiry < Date.now()) {
      memoryCache.delete(key);
      return Promise.resolve(null);
    }
    return Promise.resolve(data.value);
  },

  set(key: string, value: string): Promise<void> {
    memoryCache.set(key, { value, expiry: Date.now() + 86400000 }); // 24 hours default
    return Promise.resolve();
  },

  setex(key: string, seconds: number, value: string): Promise<void> {
    memoryCache.set(key, { value, expiry: Date.now() + seconds * 1000 });
    return Promise.resolve();
  },

  del(key: string): Promise<void> {
    memoryCache.delete(key);
    return Promise.resolve();
  },

  ping(): Promise<string> {
    return Promise.resolve('PONG');
  },
};

const redisPlugin: FastifyPluginAsync = async (fastify) => {
  // If disabled by feature flag, use in-memory cache
  if (config.features.disableRedis) {
    fastify.log.warn('Redis disabled via DISABLE_REDIS=true (using in-memory cache)');
    (fastify as any).decorate('redis', inMemoryCache as any);
    return;
  }

  // Decide connection target
  const targetUrl = process.env.REDIS_URL || '';
  let host = config.redis.host;
  let port = config.redis.port;
  if (targetUrl) {
    try {
      const u = new URL(targetUrl);
      host = u.hostname || host;
      port = u.port ? parseInt(u.port, 10) : port;
    } catch (error) {
      // URL parsing failed, use default host/port
      fastify.log.debug('Failed to parse Redis URL, using default host/port');
    }
  }

  // Quick TCP probe to avoid startup hangs and plugin timeouts
  const reachable = await probeRedisConnectivity(host, port, 700);

  if (!reachable) {
    fastify.log.warn(`Redis not reachable at ${host}:${port}, using in-memory cache`);
    (fastify as any).decorate('redis', inMemoryCache as any);
    return;
  }

  // Register @fastify/redis with lazy connect to avoid blocking startup
  try {
    const opts = targetUrl
      ? { url: config.redis.url, lazyConnect: true, connectTimeout: 1000, maxRetriesPerRequest: 0 }
      : {
          host: config.redis.host,
          port: config.redis.port,
          lazyConnect: true,
          connectTimeout: 1000,
          maxRetriesPerRequest: 0,
        };
    await fastify.register(fastifyRedis, opts as any);
    fastify.log.info(`Redis enabled (lazy connect) at ${host}:${port}`);
  } catch (err) {
    fastify.log.warn('Redis plugin registration failed, falling back to in-memory cache');
    fastify.log.debug({ err }, 'Redis registration error');
    (fastify as any).decorate('redis', inMemoryCache as any);
  }
};

// Export with fastify-plugin to avoid encapsulation
export default fp(redisPlugin);
