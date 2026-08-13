import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global Unhandled Error Handler for visible debugging on screen
window.addEventListener('error', (event) => {
  console.error("Global Error Caught:", event.error || event.message);
  const root = document.getElementById('root');
  if (root && (!root.children.length || root.innerHTML.includes('SQL Play Global JavaScript Exception') === false)) {
    // Only replace if React root failed to render visible UI
    if (document.querySelector('.min-h-screen') === null) {
      root.innerHTML = `
        <div style="color: #f87171; background: #0b0f19; padding: 2rem; font-family: monospace; min-height: 100vh;">
          <h2 style="font-size: 1.5rem; color: #ef4444;">SQL Play Global JavaScript Exception</h2>
          <p style="color: #cbd5e1; margin: 1rem 0;">A runtime error occurred before React mounted:</p>
          <pre style="background: #020617; padding: 1rem; border-radius: 0.5rem; color: #fca5a5; overflow-x: auto; white-space: pre-wrap;">
            ${event.error ? (event.error.stack || event.error.toString()) : event.message}
          </pre>
          <button onclick="localStorage.clear(); window.location.reload();" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
            Reset Cache & Reload
          </button>
        </div>
      `;
    }
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error("Global Promise Rejection Caught:", event.reason);
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    document.body.innerHTML = "<h1 style='color:red; padding: 20px;'>Root element #root not found!</h1>";
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
} catch (err) {
  console.error("Startup Error:", err);
  document.body.innerHTML = `
    <div style="color: #ef4444; background: #020617; padding: 2rem; font-family: monospace;">
      <h1>Application Startup Error</h1>
      <pre>${err.stack || err.toString()}</pre>
    </div>
  `;
}
