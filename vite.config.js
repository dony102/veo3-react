import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ganti 'veo3-react' sesuai nama repository kamu di GitHub
export default defineConfig({
  base: '/veo3-react/',
  plugins: [react()],
})
