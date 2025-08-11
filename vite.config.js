import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ganti 'veo3-react' dengan nama repo kamu
export default defineConfig({
  base: '/veo3-react/',
  plugins: [react()],
})

