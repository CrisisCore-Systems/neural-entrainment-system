/**
 * Session Routes
 * Handles neural entrainment session management
 */

import { FastifyPluginAsync } from 'fastify';

export const sessionRoutes: FastifyPluginAsync = (fastify) => {
  /**
   * GET /api/sessions
   * Get user's session history
   */
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const decoded = (await request.jwtVerify()) as { userId: string };

        const result = await fastify.pg.query(
          `SELECT s.*, p.name as protocol_name
         FROM sessions s
         JOIN protocols p ON s.protocol_id = p.id
         WHERE s.user_id = $1
         ORDER BY s.started_at DESC
         LIMIT 50`,
          [decoded.userId]
        );

        return reply.send({ sessions: result.rows });
      } catch (error) {
        fastify.log.error(error, 'Get sessions error');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  /**
   * POST /api/sessions
   * Create new session
   */
  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const decoded = (await request.jwtVerify()) as { userId: string };
        const { protocolId } = request.body as { protocolId: string };

        const result = await fastify.pg.query(
          `INSERT INTO sessions (user_id, protocol_id, status)
         VALUES ($1, $2, 'active')
         RETURNING *`,
          [decoded.userId, protocolId]
        );

        const session = result.rows[0];

        // Cache active session in Redis
        await fastify.redis.setex(
          `session:${session.id}`,
          3600, // 1 hour
          JSON.stringify(session)
        );

        return reply.code(201).send({ session });
      } catch (error) {
        fastify.log.error(error, 'Create session error');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  /**
   * PUT /api/sessions/:id
   * Update session (mark as completed/stopped, save metrics)
   */
  fastify.put(
    '/:id',
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const decoded = (await request.jwtVerify()) as { userId: string };
        const { id } = request.params as { id: string };
        const { status, end_time, real_time_metrics } = request.body as {
          status?: string;
          end_time?: string;
          real_time_metrics?: {
            coherence_avg: number;
            focus_avg: number;
            arousal_avg: number;
            load_avg: number;
            valence_avg: number;
          };
        };

        // Update session
        const updateResult = await fastify.pg.query(
          `UPDATE sessions 
         SET status = COALESCE($1, status),
             ended_at = COALESCE($2::timestamptz, ended_at),
             completed = CASE WHEN $1 = 'completed' THEN true ELSE completed END,
             duration = CASE WHEN $2::timestamptz IS NOT NULL 
                        THEN EXTRACT(EPOCH FROM ($2::timestamptz - started_at))
                        ELSE duration END,
             real_time_metrics = COALESCE($3::jsonb, real_time_metrics),
             avg_coherence = COALESCE($4, avg_coherence),
             avg_focus = COALESCE($5, avg_focus)
         WHERE id = $6 AND user_id = $7
         RETURNING *`,
          [
            status,
            end_time,
            real_time_metrics ? JSON.stringify(real_time_metrics) : null,
            real_time_metrics?.coherence_avg,
            real_time_metrics?.focus_avg,
            id,
            decoded.userId,
          ]
        );

        if (updateResult.rows.length === 0) {
          return reply.code(404).send({ error: 'Session not found' });
        }

        const session = updateResult.rows[0];

        // If session completed, increment protocol usage_count
        if (status === 'completed') {
          await fastify.pg.query(
            `UPDATE protocols 
           SET usage_count = usage_count + 1 
           WHERE id = $1`,
            [session.protocol_id]
          );
          fastify.log.info(`Incremented usage_count for protocol ${session.protocol_id}`);
        }

        // Clear cached stats
        await fastify.redis.del(`stats:${decoded.userId}`);

        return reply.send({ session });
      } catch (error) {
        fastify.log.error(error, 'Update session error');
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return reply.code(500).send({
          error: 'Internal server error',
          message: errorMessage,
        });
      }
    }
  );

  /**
   * GET /api/sessions/stats
   * Get user's session statistics
   */
  fastify.get(
    '/stats',
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const decoded = (await request.jwtVerify()) as { userId: string };

        // Check Redis cache first
        const cached = await fastify.redis.get(`stats:${decoded.userId}`);
        if (cached) {
          return reply.send(JSON.parse(cached));
        }

        const result = await fastify.pg.query(
          `SELECT 
          COUNT(*) as total_sessions,
          SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_sessions,
          SUM(duration) as total_duration,
          AVG(avg_coherence) as avg_coherence,
          AVG(avg_focus) as avg_focus
         FROM sessions
         WHERE user_id = $1`,
          [decoded.userId]
        );

        const stats = result.rows[0];

        // Cache for 5 minutes
        await fastify.redis.setex(`stats:${decoded.userId}`, 300, JSON.stringify(stats));

        return reply.send(stats);
      } catch (error) {
        fastify.log.error(error, 'Get stats error');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
};
