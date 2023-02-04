import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import postcssNested from 'postcss-nested';
import { defineConfig } from 'vite';
import manifest from './manifest.json';
import { version } from './package.json';
// import { visualizer } from 'rollup-plugin-visualizer';

manifest.version = version;

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    define: {
      IS_SENTRY_ENABLED:
        (process.env.IS_SENTRY_ENABLED &&
          JSON.parse(process.env.IS_SENTRY_ENABLED)) ??
        true,
    },
    build: {
      minify: false,
      rollupOptions: {
        input: {
          debug: 'debug.html',
          'helps/empty-search-results': 'helps/empty-search-results.html',
        },
      },
    },
    plugins: [react(), crx({ manifest })],
    css: {
      postcss: {
        plugins: [postcssNested],
      },
    },
  };
});
