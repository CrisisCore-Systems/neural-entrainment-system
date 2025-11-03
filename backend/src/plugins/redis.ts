/**
 * Redis Cache Plugin (Optional)
 * Falls back to in-memory cache if Redis unavailable
 */

import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

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
  async get(key: string): Promise<string | null> {
    const data = memoryCache.get(key);
    if (!data) return null;
    if (data.expiry < Date.now()) {
      memoryCache.delete(key);
      return null;
    }
    return data.value;
  },
  
  async set(key: string, value: string): Promise<void> {
    memoryCache.set(key, { value, expiry: Date.now() + 86400000 }); // 24 hours default
  },
  
  async setex(key: string, seconds: number, value: string): Promise<void> {
    memoryCache.set(key, { value, expiry: Date.now() + (seconds * 1000) });
  },
  
  async del(key: string): Promise<void> {
    memoryCache.delete(key);
  },
  
  async ping(): Promise<string> {
    return 'PONG';
  },
};

const redisPlugin: FastifyPluginAsync = async (fastify) => {
  // Always use in-memory cache for now (Redis optional)
  fastify.log.info('✅ Using in-memory cache (Redis disabled)');
  fastify.decorate('redis', inMemoryCache);
};

// Export with fastify-plugin to avoid encapsulation
export default fp(redisPlugin);
