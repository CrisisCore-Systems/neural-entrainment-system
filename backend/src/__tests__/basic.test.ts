import { describe, it, expect } from 'vitest';

describe('Backend Configuration', () => {
  it('should have NODE_ENV defined', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should pass basic math test', () => {
    expect(2 + 2).toBe(4);
  });
});
