/**
 * Test Helper - Creates test Fastify instance with mocks
 * Simplifies route testing with proper mocking
 */

import Fastify, { FastifyInstance } from 'fastify';
import { vi } from 'vitest';

export interface TestAppOptions {
  mockPgQuery?: ReturnType<typeof vi.fn>;
  mockRedisSetex?: ReturnType<typeof vi.fn>;
  mockRedisDel?: ReturnType<typeof vi.fn>;
  mockRedisGet?: ReturnType<typeof vi.fn>;
  mockJwtSign?: ReturnType<typeof vi.fn>;
  mockJwtVerify?: ReturnType<typeof vi.fn>;
}

export async function createTestApp(options: TestAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // Disable logging in tests
  });

  // Mock PostgreSQL plugin
  const mockPgQuery = options.mockPgQuery || vi.fn();
  app.decorate('pg', {
    query: mockPgQuery,
  });

  // Mock Redis plugin
  const mockRedisSetex = options.mockRedisSetex || vi.fn().mockResolvedValue('OK');
  const mockRedisDel = options.mockRedisDel || vi.fn().mockResolvedValue(1);
  const mockRedisGet = options.mockRedisGet || vi.fn().mockResolvedValue(null);

  app.decorate('redis', {
    setex: mockRedisSetex,
    del: mockRedisDel,
    get: mockRedisGet,
  });

  // Mock JWT plugin
  const mockJwtSign =
    options.mockJwtSign ||
    vi.fn().mockReturnValue('mock_jwt_token_' + Math.random().toString(36).substring(7));
  const mockJwtVerify =
    options.mockJwtVerify ||
    vi.fn().mockReturnValue({ userId: 'user-123', email: 'test@example.com' });

  app.decorate('jwt', {
    sign: mockJwtSign,
    verify: mockJwtVerify,
  });

  // Mock authenticate middleware
  app.decorate('authenticate', async function (request: any) {
    // Simulate JWT verification
    request.user = mockJwtVerify();
  });

  // Add jwtVerify method to request
  app.decorateRequest('jwtVerify', async function () {
    return mockJwtVerify();
  });

  return app;
}

export function createMockUser(overrides: Partial<any> = {}) {
  return {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    password_hash: 'hashed_password',
    is_active: true,
    is_verified: true,
    is_admin: false,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockSession(overrides: Partial<any> = {}) {
  return {
    id: 'session-123',
    user_id: 'user-123',
    protocol_id: 'protocol-1',
    status: 'active',
    started_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockProtocol(overrides: Partial<any> = {}) {
  return {
    id: 'protocol-123',
    name: 'Deep Focus',
    description: 'Enhanced concentration and mental clarity',
    category: 'focus',
    difficulty: 'intermediate',
    safety_rating: 5,
    total_duration: 25,
    average_rating: 4.5,
    usage_count: 150,
    phases: [],
    is_public: true,
    ...overrides,
  };
}
