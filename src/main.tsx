import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling
const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  // Show error message on page
  root.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>Error Loading Application</h1>
      <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
    </div>
  `;
}
