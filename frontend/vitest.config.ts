import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/test/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/coverage/**',
        '**/main.tsx',
        '**/*.config.{ts,js}',
        '**/public/**',
      ],
      // Frontend target: 70% coverage
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
