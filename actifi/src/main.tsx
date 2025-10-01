import React from 'react';
import { createRoot } from 'react-dom/client';
import './frontend/index.css';
import App from './frontend/App';

// Initialize the application
const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Root element found, rendering React app...');
  createRoot(rootElement).render(<App />);
  console.log('React app rendered successfully!');
} else {
  console.error('Root element not found!');
}
