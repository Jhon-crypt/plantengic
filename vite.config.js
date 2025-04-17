import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Make sure we look for .env files in the root directory
  envDir: '.',
  // Enable HMR for fast development
  server: {
    hmr: true
  }
})
