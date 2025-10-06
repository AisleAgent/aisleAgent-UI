import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      port: 5173,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
          
          // Ant Design
          if (id.includes('node_modules/antd')) {
            // Split heavy components
            if (id.includes('/table/') || id.includes('/es/table')) {
              return 'antd-table'
            }
            if (id.includes('/calendar/') || id.includes('/es/calendar')) {
              return 'antd-calendar'
            }
            if (id.includes('/drawer/') || id.includes('/es/drawer')) {
              return 'antd-drawer'
            }
            // Core components
            return 'antd-core'
          }
          
          // Ant Design Icons
          if (id.includes('@ant-design/icons')) {
            return 'antd-icons'
          }
          
          // Date utilities
          if (id.includes('node_modules/dayjs')) {
            return 'dayjs'
          }
          
          // RC Components (Ant Design dependencies)
          if (id.includes('node_modules/rc-')) {
            return 'rc-components'
          }
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Use esbuild for faster minification
    minify: 'esbuild',
  },
})
