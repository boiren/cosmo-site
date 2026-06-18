import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Geliştirme proxy hedefi: VITE_API_URL || localhost:5000
  const proxyTarget = (env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

  return {
    plugins: [react()],

    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      outDir:    'dist',
      sourcemap: false,
      // Büyük chunk uyarısını 1MB'a çıkar
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Vendor kodunu ayır — daha hızlı cache
          manualChunks: {
            vendor:  ['react', 'react-dom', 'react-router-dom'],
            ui:      ['react-hot-toast', 'axios'],
          },
        },
      },
    },

    preview: {
      port: 4173,
    },
  }
})
