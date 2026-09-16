import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Separa las librerías pesadas para que el bundle inicial no las arrastre.
        manualChunks(id: string) {
          if (id.includes('node_modules/echarts') || id.includes('node_modules/vue-echarts')) {
            return 'echarts'
          }
          if (id.includes('node_modules/ant-design-vue') || id.includes('node_modules/@ant-design')) {
            return 'antd'
          }
          return undefined
        },
      },
    },
  },
})
