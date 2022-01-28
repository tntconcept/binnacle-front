import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import env from 'vite-plugin-env-compatible'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/binnacle/',
  build: {
    outDir: 'build',
    target: 'esnext'
  },
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: ['babel-plugin-transform-typescript-metadata'],
        parserOpts: {
          plugins: ['decorators-legacy']
        }
      }
    }),
    svgrPlugin(),
    env({
      prefix: 'REACT_APP_'
    }),
    VitePWA({
      registerType: 'autoUpdate'
    })
  ]
})
