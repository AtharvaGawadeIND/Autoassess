import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server proxies /api/* to the FastAPI backend so the browser
// never has to deal with CORS during local development.
// In production, set VITE_API_BASE_URL instead (see src/api/client.js).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
