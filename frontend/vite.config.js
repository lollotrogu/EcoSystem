import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-ecosistem-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const cleanUrl = req.url ? req.url.split('?')[0] : '';
          if (cleanUrl.startsWith('/assets/')) {
            const relPath = cleanUrl.replace(/^\/assets\//, '');
            const filePath = path.resolve(__dirname, '../public/assets', decodeURIComponent(relPath));
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const mimeTypes = {
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.webp': 'image/webp',
                '.avif': 'image/avif',
                '.pdf': 'application/pdf',
                '.json': 'application/json',
                '.css': 'text/css',
                '.js': 'application/javascript',
              };
              const ext = path.extname(filePath).toLowerCase();
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      },
    },
  ],
  base: process.env.VITE_BASE || '/dist/',
  build: {
    outDir: '../public/dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});

