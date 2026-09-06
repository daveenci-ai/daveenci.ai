import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    // Frontend modules under test import their deps (date-fns-tz) from
    // frontend/node_modules; root resolution needs to find them there too.
    preserveSymlinks: false,
  },
});
