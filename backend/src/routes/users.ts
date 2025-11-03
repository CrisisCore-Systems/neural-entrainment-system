/**
 * User Routes
 * Handles user profile and preferences
 */

import { FastifyPluginAsync } from 'fastify';

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /api/users/preferences
   * Get user preferences
   */
  fastify.get('/preferences', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const decoded = await request.jwtVerify() as { userId: string };

      const result = await fastify.pg.query(
        'SELECT * FROM user_preferences WHERE user_id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Preferences not found' });
      }

      return reply.send({ preferences: result.rows[0] });
    } catch (error) {
      fastify.log.error('Get preferences error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  /**
   * PUT /api/users/preferences
   * Update user preferences
   */
  fastify.put('/preferences', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const decoded = await request.jwtVerify() as { userId: string };
      const preferences = request.body as Record<string, any>;

      // Build dynamic update query
      const fields = Object.keys(preferences);
      const values = Object.values(preferences);
      const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

      await fastify.pg.query(
        `UPDATE user_preferences SET ${setClause} WHERE user_id = $1`,
        [decoded.userId, ...values]
      );

      return reply.send({ message: 'Preferences updated successfully' });
    } catch (error) {
      fastify.log.error('Update preferences error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};
