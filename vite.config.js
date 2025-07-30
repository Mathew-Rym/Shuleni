import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          chartjs: ['chart.js', 'react-chartjs-2'],
          bootstrap: ['react-bootstrap', 'bootstrap'],
          router: ['react-router-dom'],
          fontawesome: ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons']
        },
        // Ensure consistent chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    // Improve build performance
    target: 'esnext'
  },
  define: {
    global: 'globalThis',
    // Ensure production mode
    'process.env.NODE_ENV': '"production"'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@fortawesome/react-fontawesome']
  }
})
