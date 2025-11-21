import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Server } from 'lucide-react'
export default defineConfig({
plugins: [
react(),
tailwindcss(),
],server:{port:3000}

})