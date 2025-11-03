/**
 * Protocol Routes
 * Manages neural entrainment protocols
 */

import { FastifyPluginAsync } from 'fastify';

export const protocolRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /api/protocols
   * Get all public protocols
   */
  fastify.get('/', async (request, reply) => {
    try {
      fastify.log.info('Fetching protocols...');
      
      if (!fastify.pg) {
        fastify.log.error('PostgreSQL client not available');
        return reply.code(500).send({ error: 'Database connection not available' });
      }

      const result = await fastify.pg.query(
        `SELECT id, name, description, category, difficulty, safety_rating, 
                total_duration, average_rating, usage_count, phases
         FROM protocols
         WHERE is_public = true
         ORDER BY usage_count DESC`
      );

      fastify.log.info(`Found ${result.rows.length} protocols`);
      return reply.send({ protocols: result.rows });
    } catch (error) {
      fastify.log.error('Get protocols error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return reply.code(500).send({ 
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  });

  /**
   * GET /api/protocols/:id
   * Get specific protocol with full phase configuration
   */
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const result = await fastify.pg.query(
        'SELECT * FROM protocols WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Protocol not found' });
      }

      return reply.send({ protocol: result.rows[0] });
    } catch (error) {
      fastify.log.error('Get protocol error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};
