import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      // forward all /api calls from http://localhost:5173 to your server
      '/api': {
        target: 'http://3.110.216.196',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
