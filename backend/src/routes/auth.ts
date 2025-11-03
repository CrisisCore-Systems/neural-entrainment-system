/**
 * Authentication Routes
 * Handles user registration, login, and token management
 */

import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  username: z.string().min(3).max(100),
  medicalDisclaimerAccepted: z.boolean(),
  hasEpilepsy: z.boolean().optional(),
  hasHeartCondition: z.boolean().optional(),
  hasMentalHealthCondition: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/auth/register
   * Register new user
   */
  fastify.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);

      // Check if medical disclaimer accepted
      if (!body.medicalDisclaimerAccepted) {
        return reply.code(400).send({
          error: 'Medical disclaimer must be accepted',
        });
      }

      // Check if user already exists
      const existingUser = await fastify.pg.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [body.email, body.username]
      );

      if (existingUser.rows.length > 0) {
        return reply.code(409).send({
          error: 'User with this email or username already exists',
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(body.password, 10);

      // Create user
      const result = await fastify.pg.query(
        `INSERT INTO users (
          email, password_hash, username,
          medical_disclaimer_accepted, medical_disclaimer_date,
          has_epilepsy, has_heart_condition, has_mental_health_condition
        ) VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7)
        RETURNING id, email, username, created_at`,
        [
          body.email,
          passwordHash,
          body.username,
          body.medicalDisclaimerAccepted,
          body.hasEpilepsy || false,
          body.hasHeartCondition || false,
          body.hasMentalHealthCondition || false,
        ]
      );

      const user = result.rows[0];

      // Create default preferences
      await fastify.pg.query(
        'INSERT INTO user_preferences (user_id) VALUES ($1)',
        [user.id]
      );

      // Generate JWT token
      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      // Cache user session in Redis
      await fastify.redis.setex(
        `user_session:${user.id}`,
        604800, // 7 days
        JSON.stringify({ userId: user.id, email: user.email })
      );

      return reply.code(201).send({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.created_at,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation error',
          details: error.errors,
        });
      }
      fastify.log.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return reply.code(500).send({ 
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  });

  /**
   * POST /api/auth/login
   * User login
   */
  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);

      // Find user
      const result = await fastify.pg.query(
        `SELECT id, email, username, password_hash, is_active, is_verified
         FROM users WHERE email = $1`,
        [body.email]
      );

      if (result.rows.length === 0) {
        return reply.code(401).send({
          error: 'Invalid email or password',
        });
      }

      const user = result.rows[0];

      // Check if account is active
      if (!user.is_active) {
        return reply.code(403).send({
          error: 'Account is disabled',
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(body.password, user.password_hash);
      if (!validPassword) {
        return reply.code(401).send({
          error: 'Invalid email or password',
        });
      }

      // Update last login
      await fastify.pg.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      );

      // Generate JWT token
      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      // Cache session in Redis
      await fastify.redis.setex(
        `user_session:${user.id}`,
        604800, // 7 days
        JSON.stringify({ userId: user.id, email: user.email })
      );

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isVerified: user.is_verified,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation error',
          details: error.errors,
        });
      }
      fastify.log.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return reply.code(500).send({ 
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  });

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  fastify.get('/me', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const decoded = await request.jwtVerify() as { userId: string };

      const result = await fastify.pg.query(
        `SELECT id, email, username, created_at, last_login, is_verified,
                gateway_access, gateway_level, gateway_training_completed, total_standard_sessions
         FROM users WHERE id = $1`,
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'User not found' });
      }

      return reply.send({ user: result.rows[0] });
    } catch (error) {
      fastify.log.error('Get user error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/auth/logout
   * Logout user (clear Redis cache)
   */
  fastify.post('/logout', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const decoded = await request.jwtVerify() as { userId: string };
      
      // Remove session from Redis
      await fastify.redis.del(`user_session:${decoded.userId}`);

      return reply.send({ message: 'Logged out successfully' });
    } catch (error) {
      fastify.log.error('Logout error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};
