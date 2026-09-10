import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['mycourse.test', '.mycourse.test', 'api.mycourse.test', 'localhost', '127.0.0.1'],
    cors: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'vendor-ui';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'vendor-charts';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
