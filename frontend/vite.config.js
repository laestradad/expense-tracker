import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Forward all /api requests to Flask backend
      '/auth': 'http://localhost:5000',
      '/api': 'http://localhost:5000'
    }
  }
})
