/**
 * Fastify Type Declarations
 * Extends Fastify types with our custom decorators
 */

import { PostgresDb } from '@fastify/postgres';
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    pg: PostgresDb;
    redis: {
      get(key: string): Promise<string | null>;
      set(key: string, value: string): Promise<void>;
      setex(key: string, seconds: number, value: string): Promise<void>;
      del(key: string): Promise<void>;
      ping(): Promise<string>;
    };
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
