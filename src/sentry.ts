import * as Sentry from '@sentry/browser';
import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (IS_SENTRY_ENABLED)
    Sentry.init({
      dsn: import.meta.env.DEV
        ? 'https://cba3c32ae1404f56a39f5cb4102beb64@o49171.ingest.sentry.io/4504401197989888'
        : 'https://f3a64ab117364c0cab0e2edf79c51113@o49171.ingest.sentry.io/4504401230823424',
      release: chrome.runtime.getManifest().version,
      integrations: [
        new BrowserTracing(),
        new CaptureConsoleIntegration({
          levels: ['warn', 'error'],
        }),
      ],
    });
};
