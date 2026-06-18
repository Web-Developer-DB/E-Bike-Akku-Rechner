import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

/**
 * Browser entry point for the React app.
 *
 * Vite loads this file from index.html. It creates the React root and mounts the
 * App component into the <div id="root"> element.
 */
createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * Register the service worker only in production builds.
 *
 * During development, service workers can cache old files and make debugging
 * confusing. In production, the service worker enables the PWA offline shell.
 */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    /** Ignore registration errors so the app still works without offline mode. */
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
