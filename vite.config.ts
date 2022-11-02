import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import env from 'vite-plugin-env-compatible'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import eslintPlugin from '@nabla/vite-plugin-eslint'
import replace from '@rollup/plugin-replace'

const pwaOptions: Partial<VitePWAOptions> = {
  manifest: {
    name: 'Binnacle',
    short_name: 'Binnacle',

    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192px.png', // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/pwa-512px.png', // <== don't remove slash, for testing
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'pwa-512px.png', // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html'
  }
}

const replaceOptions = { __DATE__: new Date().toISOString() }
const claims = process.env.CLAIMS === 'true'
const reload = process.env.RELOAD_SW === 'true'
const selfDestroying = process.env.SW_DESTROY === 'true'

if (process.env.SW === 'true') {
  pwaOptions.srcDir = 'src'
  pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'
  pwaOptions.strategies = 'injectManifest'
}

if (claims) pwaOptions.registerType = 'autoUpdate'

if (reload) {
  // @ts-expect-error just ignore
  replaceOptions.__RELOAD_SW__ = 'true'
}

if (selfDestroying) pwaOptions.selfDestroying = selfDestroying

export default defineConfig({
  base: '/',
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
    VitePWA(pwaOptions),
    replace(replaceOptions) as any,

    eslintPlugin()
  ]
})
