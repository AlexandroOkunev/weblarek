import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      base: './',
      scss: {
        loadPaths: [
          './src/scss'
        ],
      },
    },
  },
})