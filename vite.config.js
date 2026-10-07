import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/lc-graphql': {
        target: 'https://leetcode.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/lc-graphql/, '/graphql'),
        headers: {
          Referer: 'https://leetcode.com',
        },
      },
    },
  },
})
