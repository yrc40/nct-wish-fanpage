import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/nct-wish-fanpage/',
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache', // Use Cache-Control instead of Expires
      'Content-Security-Policy': "frame-ancestors 'self'", // Use CSP instead of X-Frame-Options
    }
  },
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
      'Content-Security-Policy': "frame-ancestors 'self'",
    }
  }
})
