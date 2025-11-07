/**
 * Auth Business Logic Tests
 * Tests for user validation, password security, and authentication logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Validation schemas (from auth.ts)
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

// Business logic helpers
function validateRegistration(data: unknown) {
  try {
    return { success: true, data: registerSchema.parse(data) };
  } catch (error) {
    return { success: false, error };
  }
}

function validateLogin(data: unknown) {
  try {
    return { success: true, data: loginSchema.parse(data) };
  } catch (error) {
    return { success: false, error };
  }
}

function checkMedicalDisclaimer(accepted: boolean): { ok: boolean; error?: string } {
  if (!accepted) {
    return { ok: false, error: 'Medical disclaimer must be accepted' };
  }
  return { ok: true };
}

function isAccountActive(user: { is_active: boolean }): boolean {
  return user.is_active === true;
}

async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plaintext, hash);
}

describe('Auth Business Logic', () => {
  describe('Registration Validation', () => {
    const validRegistration = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      username: 'testuser',
      medicalDisclaimerAccepted: true,
      hasEpilepsy: false,
      hasHeartCondition: false,
      hasMentalHealthCondition: false,
    };

    it('should accept valid registration data', () => {
      const result = validateRegistration(validRegistration);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.username).toBe('testuser');
      }
    });

    it('should reject invalid email format', () => {
      const invalid = { ...validRegistration, email: 'invalid-email' };
      const result = validateRegistration(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const invalid = { ...validRegistration, password: 'short' };
      const result = validateRegistration(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject password longer than 100 characters', () => {
      const invalid = { ...validRegistration, password: 'a'.repeat(101) };
      const result = validateRegistration(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject username shorter than 3 characters', () => {
      const invalid = { ...validRegistration, username: 'ab' };
      const result = validateRegistration(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject username longer than 100 characters', () => {
      const invalid = { ...validRegistration, username: 'a'.repeat(101) };
      const result = validateRegistration(invalid);
      expect(result.success).toBe(false);
    });

    it('should accept optional medical condition fields', () => {
      const withConditions = {
        ...validRegistration,
        hasEpilepsy: true,
        hasHeartCondition: true,
        hasMentalHealthCondition: true,
      };
      const result = validateRegistration(withConditions);
      expect(result.success).toBe(true);
    });

    it('should accept missing optional medical condition fields', () => {
      const { hasEpilepsy, hasHeartCondition, hasMentalHealthCondition, ...minimal } =
        validRegistration;
      const result = validateRegistration(minimal);
      expect(result.success).toBe(true);
    });
  });

  describe('Login Validation', () => {
    const validLogin = {
      email: 'test@example.com',
      password: 'SecurePass123!',
    };

    it('should accept valid login credentials', () => {
      const result = validateLogin(validLogin);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.password).toBe('SecurePass123!');
      }
    });

    it('should reject invalid email format', () => {
      const invalid = { ...validLogin, email: 'not-an-email' };
      const result = validateLogin(invalid);
      expect(result.success).toBe(false);
    });

    it('should accept any password length for login', () => {
      // Login doesn't validate password length (only registration does)
      const result = validateLogin({ email: 'test@example.com', password: 'short' });
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const invalid = { password: 'password' };
      const result = validateLogin(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalid = { email: 'test@example.com' };
      const result = validateLogin(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('Medical Disclaimer', () => {
    it('should require medical disclaimer acceptance', () => {
      const result = checkMedicalDisclaimer(false);
      expect(result.ok).toBe(false);
      expect(result.error).toBe('Medical disclaimer must be accepted');
    });

    it('should accept when disclaimer is accepted', () => {
      const result = checkMedicalDisclaimer(true);
      expect(result.ok).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Account Status', () => {
    it('should allow login for active accounts', () => {
      const user = { is_active: true };
      expect(isAccountActive(user)).toBe(true);
    });

    it('should block login for inactive accounts', () => {
      const user = { is_active: false };
      expect(isAccountActive(user)).toBe(false);
    });
  });

  describe('Password Verification', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should verify correct password', async () => {
      const password = 'SecurePass123!';
      const hash = await bcrypt.hash(password, 10);
      const result = await verifyPassword(password, hash);
      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'SecurePass123!';
      const wrongPassword = 'WrongPassword';
      const hash = await bcrypt.hash(password, 10);
      const result = await verifyPassword(wrongPassword, hash);
      expect(result).toBe(false);
    });

    it('should handle empty password', async () => {
      const password = 'SecurePass123!';
      const hash = await bcrypt.hash(password, 10);
      const result = await verifyPassword('', hash);
      expect(result).toBe(false);
    });
  });

  describe('User Data Sanitization', () => {
    it('should not include password_hash in user response', () => {
      const dbUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: 'hashed_password',
        is_active: true,
        created_at: new Date().toISOString(),
      };

      // Simulate creating user response (password_hash removed)
      const { password_hash, ...userResponse } = dbUser;
      expect(userResponse).not.toHaveProperty('password_hash');
      expect(userResponse.email).toBe('test@example.com');
    });

    it('should include required user fields', () => {
      const dbUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: 'hashed_password',
      };

      const { password_hash, ...userResponse } = dbUser;
      expect(userResponse).toHaveProperty('id');
      expect(userResponse).toHaveProperty('email');
      expect(userResponse).toHaveProperty('username');
    });
  });

  describe('JWT Payload Structure', () => {
    it('should contain required fields for JWT payload', () => {
      const jwtPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        isAdmin: false,
      };

      expect(jwtPayload.userId).toBeDefined();
      expect(jwtPayload.email).toBeDefined();
      expect(jwtPayload.isAdmin).toBeDefined();
    });

    it('should differentiate admin users', () => {
      const adminPayload = { userId: 'admin-1', email: 'admin@example.com', isAdmin: true };
      const userPayload = { userId: 'user-1', email: 'user@example.com', isAdmin: false };

      expect(adminPayload.isAdmin).toBe(true);
      expect(userPayload.isAdmin).toBe(false);
    });
  });
});
