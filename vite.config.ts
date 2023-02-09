import type { ManifestV3Export } from '@crxjs/vite-plugin';
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import postcssNested from 'postcss-nested';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';
import manifest from './manifest.json';
import { version } from './package.json';

const ENABLES_SENTRY = getEnv('ENABLES_SENTRY') ?? true;
const ENABLES_VISUALIZER = getEnv('ENABLES_VISUALIZER') ?? false;

manifest.version = version;

export default defineConfig({
  define: {
    ENABLES_SENTRY,
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
  plugins: [
    react(),
    crx({ manifest: manifest as ManifestV3Export }),
    ...(ENABLES_VISUALIZER ? [visualizer() as PluginOption] : []),
  ],
  css: {
    postcss: {
      plugins: [postcssNested],
    },
  },
});

// utils

function getEnv(name: string): string | undefined {
  const val = process.env[name];
  return val === undefined ? val : JSON.parse(val);
}

function getHtmlFiles(dir: string) {
  return Object.fromEntries(
    fs.readdirSync(dir).map((html) => {
      html = `${dir}/${html}`;
      return [html.replace(/\.html$/, ''), html];
    }),
  );
}
