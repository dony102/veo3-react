import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ubah base saat deploy ke GitHub Pages project pages: base: '/NAMA_REPO/'
export default defineConfig({
  plugins: [react()],
  // base: '/veo3-react/',
})
