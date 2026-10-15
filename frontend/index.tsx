import React from 'react';
import ReactDOM from 'react-dom/client';
import './src/index.css';
import App from './App';
import { installStaleChunkReload } from './lib/staleChunk';

// A page chunk that disappeared in a deploy reloads the page once instead of failing (lib/staleChunk.ts).
installStaleChunkReload();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
