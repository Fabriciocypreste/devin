import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
    // Otimização de Imagens (apenas em build de produção)
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 75,
        progressive: true,
      },
      pngquant: {
        quality: [0.7, 0.8],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: true,
          },
        ],
      },
      webp: {
        quality: 75,
      },
    }),
    
    // Compressão Gzip
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 10kb
      algorithm: 'gzip',
      ext: '.gz',
    }),
    
    // Compressão Brotli (melhor que gzip)
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    
    // Visualizador de bundle (apenas em build)
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  build: {
    // Otimizações de build
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs em produção
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    
    // Code Splitting Otimizado
    rollupOptions: {
      output: {
        // Divisão manual de chunks
        manualChunks: {
          // Vendor chunks (bibliotecas externas)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI Libraries
          'ui-vendor': [
            'lucide-react',
            'sonner',
          ],
          
          // Radix UI (componentes shadcn)
          'radix-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          
          // Video e Media
          'media-vendor': [
            'hls.js',
            'video.js',
          ],
          
          // Charts e visualizações
          'charts-vendor': [
            'recharts',
          ],
          
          // Utilities
          'utils-vendor': [
            'date-fns',
            'clsx',
            'tailwind-merge',
          ],
        },
        
        // Nomear chunks de forma consistente
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Organizar assets por tipo
          if (assetInfo.name) {
            if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(assetInfo.name)) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            if (/\.css$/i.test(assetInfo.name)) {
              return 'assets/css/[name]-[hash][extname]';
            }
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    
    // Aumentar limite de warning para chunks grandes
    chunkSizeWarningLimit: 1000, // 1000kb conforme requisito
    
    // Sourcemaps apenas em desenvolvimento
    sourcemap: false,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Otimizar assets
    assetsInlineLimit: 4096, // 4kb - inline pequenos assets como base64
    
    // Reportar compressed size
    reportCompressedSize: true,
  },
  
  // Otimizações do servidor de desenvolvimento
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: true,
    // Permitir CORS e links externos
    cors: true,
    proxy: {
      // Proxy para M3U8/IPTV streams
      '/proxy-stream': {
        target: 'https://chemorena.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy-stream/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying:', req.method, req.url);
          });
        },
      },
      // Proxy para arquivos M3U
      '/filmes': {
        target: 'https://chemorena.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
    // Permitir links externos e recursos IPTV
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Range',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
    },
  },
  
  // Preview server
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: true,
  },
  
  // Otimizações de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
    ],
    exclude: [
      // Excluir dependências problemáticas
    ],
  },
  
  // Garantir que JSONs sejam servidos corretamente
  assetsInclude: ['**/*.json'],
  
  // Public dir para assets estáticos
  publicDir: 'public',
  
  // Resolve aliases
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/components',
      '@utils': '/utils',
      '@styles': '/styles',
    },
  },
  
  // CSS
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        // Otimizações CSS
      },
    },
  },
});