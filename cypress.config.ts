import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  watchForFileChanges: false,
  experimentalFetchPolyfill: false,
  retries: {
    runMode: 2,
    openMode: 0
  },
  viewportWidth: 1536,
  viewportHeight: 960,
  e2e: {
    baseUrl: 'http://localhost:3000/tnt',
    specPattern: 'cypress/tests/**/*test.{js,jsx,ts,tsx}'
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})
