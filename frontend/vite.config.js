import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':     ['framer-motion', 'lucide-react'],
          'vendor-net':    ['axios'],
          'admin-panel':   [
            './src/pages/admin/AdminDashboard.jsx',
            './src/pages/admin/AdminProperties.jsx',
            './src/pages/admin/AdminProjects.jsx',
            './src/pages/admin/AdminAgents.jsx',
            './src/pages/admin/AdminLeads.jsx',
            './src/pages/admin/AdminUsers.jsx',
            './src/pages/admin/AdminBlog.jsx',
            './src/pages/admin/AdminTestimonials.jsx',
            './src/pages/admin/AdminFaq.jsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});

