import { createRoot } from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { ENABLE_SENTRY } from './store';
import App from './App';

// https://sentry.io/onboarding/faniak/setup-docs/

if (ENABLE_SENTRY) {
  Sentry.init({
    dsn: "https://2798e6fe5db64fec95169d0c7c78745d@o1334115.ingest.sentry.io/6600281",
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
