import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // This ensures the build output is placed in the `apps/frontend/dist/` folder
    rollupOptions: {
      input: 'index.html' // Customize the entry point if needed
    }
  }
})
