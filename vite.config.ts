import { crx, defineManifest } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import postcssNested from 'postcss-nested';
import { defineConfig } from 'vite';

// import manifest from './public/manifest.json';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'Notion Search',
  description: '__MSG_DESCRIPTION__',
  default_locale: 'en',
  version: '1.3.5',
  options_page: 'options.html',
  action: {
    default_icon: 'images/icon38.png',
    default_popup: 'search.html',
  },
  background: {
    service_worker: '/src/background/main.ts',
  },
  permissions: ['storage', 'unlimitedStorage', 'commands'],
  host_permissions: ['https://www.notion.so/*'],
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Ctrl+Shift+N',
        mac: 'MacCtrl+Shift+N',
      },
      description: 'Open the popup',
    },
    'open-search-page': {
      description: 'Open the search page in new a tab',
    },
  },
  icons: {
    '16': 'images/icon16.png',
    '32': 'images/icon32.png',
    '48': 'images/icon48.png',
    '128': 'images/icon128.png',
  },
});

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
        release: manifest.version,
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
