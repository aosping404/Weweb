import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false
    },
    middlewareMode: false,
    port: 9989,
    host: '0.0.0.0'
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      external: []
    },
    outDir: 'dist'
  },
  preview: {
    port: 9989,
    host: '0.0.0.0'
  }
})
