import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Use the repo name as base path in production so assets resolve correctly on GitHub Pages
  base: mode === 'production' ? '/neural-entrainment-system/' : '/',
  plugins: [react()],
}))