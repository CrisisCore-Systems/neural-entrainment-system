/**
 * PostgreSQL Database Plugin
 */

import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyPostgres from '@fastify/postgres';
import { config } from '../config/index.js';

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyPostgres, {
    connectionString: config.database.url || 
      `postgresql://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`,
  });

  // Test connection
  try {
    await fastify.pg.query('SELECT NOW()');
    fastify.log.info('PostgreSQL connected successfully');
  } catch (error) {
    fastify.log.error(error, 'PostgreSQL connection failed');
    throw error;
  }
};

// Export with fastify-plugin to avoid encapsulation
export default fp(dbPlugin);
