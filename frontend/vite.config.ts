import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    ...(mode === 'development' && {
      proxy: {
        '/api': {
          target: 'http://backend:3001',
          changeOrigin: true,
        },
      },
    }),
  },
}));
