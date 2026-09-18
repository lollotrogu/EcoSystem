import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const isPages = mode === 'pages';
  const base = './';

  return {
    define: {
      'import.meta.env.VITE_STATIC_SITE': JSON.stringify(isPages),
      'import.meta.env.VITE_ASSET_BASE': JSON.stringify('./assets/'),
    },
    plugins: [
      react(),
      {
        name: 'portable-ecosistem-build',
        transformIndexHtml(html) {
          return html.replace('href="/assets/img/immagine_home.png"', 'href="./assets/img/immagine_home.png"');
        },
        closeBundle() {
          const publicAssets = path.resolve(__dirname, '../public/assets');
          const distDir = path.resolve(__dirname, '../public/dist');
          const distAssets = path.resolve(distDir, 'assets');
          const rootAssets = path.resolve(__dirname, '../assets');
          const rootIndex = path.resolve(__dirname, '../index.html');
          const rootNoJekyll = path.resolve(__dirname, '../.nojekyll');
          const pagesDist = path.resolve(__dirname, '../pages-dist');

          // 1. Assicura che public/dist/assets contenga tutti gli asset didattici (img, pdf, data)
          if (fs.existsSync(publicAssets)) {
            fs.cpSync(publicAssets, distAssets, { recursive: true });
          }

          // 2. Copia distAssets completo (JS, CSS, img, pdf, data) nella root per deploy branch GitHub Pages
          if (fs.existsSync(distAssets)) {
            fs.cpSync(distAssets, rootAssets, { recursive: true });
          }
          const distIndex = path.resolve(distDir, 'index.html');
          if (fs.existsSync(distIndex)) {
            fs.copyFileSync(distIndex, rootIndex);
          }
          fs.writeFileSync(rootNoJekyll, '');

          // 3. Genera pages-dist per eventuale deploy da GitHub Actions
          if (!fs.existsSync(pagesDist)) fs.mkdirSync(pagesDist, { recursive: true });
          fs.cpSync(distDir, pagesDist, { recursive: true });
          fs.writeFileSync(path.resolve(pagesDist, '.nojekyll'), '');
        },
      },
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
    base,
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
  };
});

