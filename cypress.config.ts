import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 1536,
  viewportHeight: 960,
  e2e: {
    baseUrl: 'http://localhost:3000/tnt',
    specPattern: 'cypress/tests/**/*.e2e.{js,jsx,ts,tsx}'
  },
  component: {
    specPattern: 'src/**/*.int.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
})
