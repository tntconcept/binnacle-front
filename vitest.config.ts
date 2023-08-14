import { defineConfig } from 'vitest/config'

process.env.TZ = 'UTC'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-utils/setup-tests.ts'
  }
})
