import { defineConfig } from 'vitest/config'
import svgr from 'vite-plugin-svgr'

process.env.TZ = 'UTC'

export default defineConfig({
  plugins: [svgr()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-utils/setup-tests.ts'
  }
})
