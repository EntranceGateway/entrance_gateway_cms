import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@http": path.resolve(__dirname, "./src/http"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@auth": path.resolve(__dirname, "./src/auth"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.entrancegateway.com',
        changeOrigin: true,
        secure: false,
      },
    },
  }

})