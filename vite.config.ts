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
      SETNRY_ARGS: {
        dsn: isDevelopment
          ? 'https://cba3c32ae1404f56a39f5cb4102beb64@o49171.ingest.sentry.io/4504401197989888'
          : 'https://f3a64ab117364c0cab0e2edf79c51113@o49171.ingest.sentry.io/4504401230823424',
        release: version,
      },
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
