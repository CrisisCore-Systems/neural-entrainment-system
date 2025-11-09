/**
 * Monetization Plan Routes
 * Handles submissions and retrieval of monetization plans
 */

import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

// Validation schema for monetization plan
const monetizationPlanSchema = z.object({
  businessIdea: z.string().min(10, 'Business idea must be at least 10 characters'),
  targetAudience: z.string().optional(),
  availableResources: z.string().optional(),
  timelineGoals: z.string().optional(),
  industryMarket: z.string().optional(),
  businessModelPreference: z.string().optional(),
  additionalContext: z.string().optional(),
});

export const monetizationRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/monetization/plans
   * Create a new monetization plan submission
   */
  fastify.post('/plans', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      // Validate input
      const validatedData = monetizationPlanSchema.parse(request.body);
      const decoded = (await request.jwtVerify()) as { userId: string };
      const userId = decoded.userId;

      fastify.log.info(`Creating monetization plan for user ${userId}`);

      if (!fastify.pg) {
        return reply.code(500).send({ error: 'Database connection not available' });
      }

      // Insert into database
      const result = await fastify.pg.query(
        `INSERT INTO monetization_plans (
          user_id, business_idea, target_audience, available_resources,
          timeline_goals, industry_market, business_model_preference,
          additional_context, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, created_at`,
        [
          userId,
          validatedData.businessIdea,
          validatedData.targetAudience || null,
          validatedData.availableResources || null,
          validatedData.timelineGoals || null,
          validatedData.industryMarket || null,
          validatedData.businessModelPreference || null,
          validatedData.additionalContext || null,
          'draft'
        ]
      );

      const plan = result.rows[0];
      fastify.log.info(`Monetization plan created: ${plan.id}`);

      return reply.code(201).send({
        success: true,
        planId: plan.id,
        createdAt: plan.created_at,
        message: 'Monetization plan submitted successfully',
      });
    } catch (error) {
      fastify.log.error(error, 'Create monetization plan error');
      
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation error',
          details: error.errors,
        });
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return reply.code(500).send({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  });

  /**
   * GET /api/monetization/plans
   * Get all monetization plans for the authenticated user
   */
  fastify.get('/plans', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const decoded = (await request.jwtVerify()) as { userId: string };
      const userId = decoded.userId;

      fastify.log.info(`Fetching monetization plans for user ${userId}`);

      if (!fastify.pg) {
        return reply.code(500).send({ error: 'Database connection not available' });
      }

      const result = await fastify.pg.query(
        `SELECT id, business_idea, target_audience, available_resources,
                timeline_goals, industry_market, business_model_preference,
                additional_context, status, created_at, updated_at
         FROM monetization_plans
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return reply.send({
        plans: result.rows,
      });
    } catch (error) {
      fastify.log.error(error, 'Get monetization plans error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return reply.code(500).send({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  });

  /**
   * GET /api/monetization/plans/:id
   * Get a specific monetization plan
   */
  fastify.get('/plans/:id', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const decoded = (await request.jwtVerify()) as { userId: string };
      const userId = decoded.userId;

      fastify.log.info(`Fetching monetization plan ${id} for user ${userId}`);

      if (!fastify.pg) {
        return reply.code(500).send({ error: 'Database connection not available' });
      }

      const result = await fastify.pg.query(
        `SELECT id, business_idea, target_audience, available_resources,
                timeline_goals, industry_market, business_model_preference,
                additional_context, generated_plan, status, created_at, updated_at
         FROM monetization_plans
         WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Monetization plan not found' });
      }

      return reply.send({
        plan: result.rows[0],
      });
    } catch (error) {
      fastify.log.error(error, 'Get monetization plan error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return reply.code(500).send({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  });
};
