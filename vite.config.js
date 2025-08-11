import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/veo3-react/',   // <- HARUS sama persis dengan nama repo
  plugins: [react()],
})
