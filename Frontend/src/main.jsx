/**
 * main.jsx — Application Entry Point
 *
 * This is the very first JavaScript file that runs when the browser loads the app.
 * It mounts the root React component (<App />) into the DOM element with id="root"
 * (defined in index.html).
 *
 * StrictMode is a development-only wrapper that highlights potential problems
 * in the application (e.g., deprecated APIs, unexpected side effects).
 */

import { StrictMode } from 'react'        // React's development helper wrapper
import { createRoot } from 'react-dom/client' // Modern React 18 root API (replaces ReactDOM.render)
import './index.css'                        // Global styles & Tailwind CSS imports
import App from './App.jsx'                 // Root application component

// Find the <div id="root"> in index.html and mount the React tree into it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
