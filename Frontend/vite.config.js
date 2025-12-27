import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/BuddyUp/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000,          // ✅ FIXED PORT
    strictPort: true,    // ✅ 3000 না পেলে server উঠবেই না
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('🔌 Proxy error:', err)
          })
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('🚀 Proxying request:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('✅ Proxy response:', proxyRes.statusCode, req.url)
          })
        }
      }
    }
  }
})
