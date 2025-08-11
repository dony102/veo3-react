import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/veo3-react/', // sesuai nama repo GitHub kamu
  plugins: [react()],
})
