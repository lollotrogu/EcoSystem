import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const isPages = mode === 'pages';
  const repository = (process.env.GITHUB_REPOSITORY || 'lollotrogu/EcoSystem').split('/')[1];
  const pagesBase = process.env.VITE_BASE || (repository.endsWith('.github.io') ? '/' : `/${repository}/`);
  const base = isPages ? pagesBase : (process.env.VITE_BASE || '/dist/');
  return {
  define: {
    'import.meta.env.VITE_STATIC_SITE': JSON.stringify(isPages),
    'import.meta.env.VITE_ASSET_BASE': JSON.stringify(isPages ? `${base}assets/` : '/assets/'),
  },
  plugins: [
    react(),
    [{
      name: 'portable-assets',
      transformIndexHtml(html) {
        if (isPages) return html.replace('href="/assets/img/immagine_home.png"', `href="${base}assets/img/immagine_home.png"`);
        return html
          .replace(/src="\/dist\/assets\//g, 'src="./assets/')
          .replace(/href="\/dist\/assets\//g, 'href="./assets/')
          .replace('href="/assets/img/immagine_home.png"', 'href="../assets/img/immagine_home.png"');
      },
      closeBundle() {
        const target = isPages ? '../pages-dist/assets' : '../public/dist/assets';
        fs.cpSync(path.resolve(__dirname, '../public/assets'), path.resolve(__dirname, target), { recursive: true });
        if (isPages) fs.writeFileSync(path.resolve(__dirname, '../pages-dist/.nojekyll'), '');
      },
    }],
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
    outDir: isPages ? '../pages-dist' : '../public/dist',
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
