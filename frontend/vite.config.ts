import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The landing page is a lazy route, so the browser could not discover its chunk
 * until the entry bundle had downloaded, parsed and executed — a full extra
 * round trip in front of the homepage's Largest Contentful Paint. This plugin
 * emits <link rel="modulepreload"> for that chunk and its direct dependencies,
 * which is what Vite would do automatically for a static import, without
 * forcing the landing code into every other route's download.
 */
function preloadLandingChunk(): Plugin {
  return {
    name: 'preload-landing-chunk',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return;

        const chunks = Object.values(bundle).filter(
          (item): item is Extract<typeof item, { type: 'chunk' }> => item.type === 'chunk',
        );
        const landing = chunks.find((chunk) =>
          chunk.facadeModuleId?.includes('DaVeenciLandingPage'),
        );
        if (!landing) return;

        // Only the landing chunk itself. Browsers that support modulepreload
        // walk its dependency graph from here; preloading all ~18 transitive
        // chunks by hand would just contend with the CSS and fonts that the
        // first paint actually waits on.
        return [
          {
            tag: 'link',
            attrs: { rel: 'modulepreload', crossorigin: '', href: `/${landing.fileName}` },
            injectTo: 'head' as const,
          },
        ];
      },
    },
  };
}

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    plugins: [react(), preloadLandingChunk()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
