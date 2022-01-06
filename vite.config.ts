import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'esbuild',
    target: "esnext",
  },
  plugins: [vue()],
})
