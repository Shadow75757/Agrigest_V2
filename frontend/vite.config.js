import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },

  // Forward API + WebSocket requests to Flask server
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.198:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://192.168.1.198:5000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
