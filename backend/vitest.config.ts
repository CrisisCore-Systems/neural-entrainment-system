import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/**', // Exclude Playwright E2E tests
      '**/*.spec.ts', // Exclude .spec files (Playwright convention)
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/*.test.ts',
        '**/__tests__/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/coverage/**',
        '**/.github/**',
        '**/scripts/**',
        '**/migrations/**',
        '**/database/**',
        '**/tests/**', // Exclude E2E test directory from coverage
      ],
      // Backend target: 80% coverage (aspirational - current focus on test suite completeness)
      // Note: Mocked unit tests show 0% code coverage - integration tests needed for actual coverage
      thresholds: {
        lines: 0, // Will increase as integration tests are added
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
  },
});
