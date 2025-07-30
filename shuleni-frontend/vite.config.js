import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; object-src 'none';"
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          chartjs: ['chart.js', 'react-chartjs-2'],
          bootstrap: ['react-bootstrap', 'bootstrap']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    global: 'globalThis',
  }
})
