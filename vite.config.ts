import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import eslintPlugin from '@nabla/vite-plugin-eslint'

const pwaOptions: Partial<VitePWAOptions> = {
  manifest: {
    name: 'TNT Concept',
    short_name: 'TNT',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192px.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512px.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
}

export default defineConfig({
  base: '/tnt/',
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties']
        }
      }
    }),
    svgrPlugin(),
    VitePWA(pwaOptions),
    eslintPlugin()
  ]
})
