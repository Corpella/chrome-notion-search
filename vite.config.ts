import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import postcssNested from 'postcss-nested';
import { defineConfig } from 'vite';
import manifest from './manifest.json';
import { version } from './package.json';
// import { visualizer } from 'rollup-plugin-visualizer';

const getHtmlFiles = (dir: string) => {
  return Object.fromEntries(
    fs.readdirSync(dir).map((html) => {
      html = `${dir}/${html}`;
      return [html.replace(/\.html$/, ''), html];
    }),
  );
};

manifest.version = version;

export default defineConfig({
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
        ...getHtmlFiles('helps'),
        ...getHtmlFiles('notices'),
      },
    },
  },
  plugins: [react(), crx({ manifest })],
  css: {
    postcss: {
      plugins: [postcssNested],
    },
  },
});
