/**
 * vite.config.js — Vite Build Tool Configuration
 *
 * This file configures Vite (the build tool and dev server) for the project.
 * It registers three plugins:
 *   1. react()      — Enables JSX transforms and React Fast Refresh (HMR)
 *   2. tailwindcss() — Integrates Tailwind CSS v4 directly into the Vite pipeline
 *   3. habitsApi()   — A custom plugin that adds a small HTTP API to the dev server
 *
 * ── Custom Habits API Plugin ──
 * During development, there is no real backend database. To give the app
 * basic persistence (surviving browser refreshes), we use a Vite server
 * middleware plugin. It intercepts requests to /api/habits and writes the
 * data directly back to `src/data/sampleHabits.jsx` on disk.
 *
 * Supported endpoints:
 *   POST /api/habits  — Append a single new habit to the file
 *   PUT  /api/habits  — Overwrite the entire habits array in the file
 */

import { defineConfig } from 'vite'        // Vite's config factory function
import react from '@vitejs/plugin-react'   // Official Vite plugin for React (JSX + Fast Refresh)
import tailwindcss from '@tailwindcss/vite' // Tailwind CSS v4 Vite integration
import fs from 'fs'                         // Node.js built-in: file system read/write
import path from 'path'                     // Node.js built-in: resolve absolute file paths

// ─────────────────────────────────────────────────────────
// CUSTOM VITE PLUGIN: habitsApi
// ─────────────────────────────────────────────────────────

/**
 * habitsApi — A Vite server plugin that provides a lightweight REST-like API
 * for persisting habit data to the source file during development.
 *
 * How it works:
 *   - Vite's `configureServer` hook lets plugins add custom Express-style
 *     middleware to the development server.
 *   - When the React app sends a POST or PUT request to /api/habits,
 *     this middleware reads the JSON body and writes it to sampleHabits.jsx.
 *   - On the next page refresh, React loads the updated file as initial state.
 *
 * @returns {Object} A Vite plugin object with a `name` and `configureServer` hook
 */
function habitsApi() {
  return {
    name: 'habits-api', // Plugin identifier shown in Vite's logs

    /**
     * configureServer — Vite hook called when the dev server starts.
     * Used to inject custom middleware into the server's request pipeline.
     *
     * @param {import('vite').ViteDevServer} server - The Vite dev server instance
     */
    configureServer(server) {
      // Register middleware for the /api/habits path
      server.middlewares.use('/api/habits', (req, res) => {

        // ── Method guard: only accept POST and PUT ──
        if (req.method !== 'POST' && req.method !== 'PUT') {
          res.statusCode = 405; // 405 Method Not Allowed
          res.end('Only POST and PUT requests are allowed');
          return;
        }

        // ── Step 1: Read the incoming request body ──
        // HTTP request bodies arrive as a stream of chunks, so we collect
        // all chunks into a single string before parsing.
        let body = '';
        req.on('data', chunk => {
          body += chunk; // Accumulate each data chunk
        });

        // ── Step 2: Process the body once all chunks have arrived ──
        req.on('end', () => {
          try {
            const data = JSON.parse(body); // Parse the JSON string into a JS object/array

            // Resolve the absolute path to the data source file
            const filePath = path.resolve(__dirname, 'src/data/sampleHabits.jsx');

            if (Array.isArray(data)) {
              // ── PUT behaviour: replace the entire array ──
              // Serialise the full habits array back into valid JSX module syntax
              const fileContent = `export const sampleHabits = ${JSON.stringify(data, null, 2)};\nexport default sampleHabits;\n`;
              fs.writeFileSync(filePath, fileContent, 'utf-8');
            } else {
              // ── POST behaviour: append a single new habit ──
              // Read the current file content as a string
              let fileContent = fs.readFileSync(filePath, 'utf-8');

              // Find the position of the closing `];` of the array
              const closingBracketIndex = fileContent.lastIndexOf('];');

              if (closingBracketIndex !== -1) {
                // Format the new habit object with consistent indentation
                const newHabitText = `,\n  ` + JSON.stringify(data, null, 2).replace(/\n/g, '\n  ');

                // Splice the new habit text before `];`
                fileContent = 
                  fileContent.slice(0, closingBracketIndex) +  // Everything before `];`
                  newHabitText + '\n' +                         // The new habit entry
                  fileContent.slice(closingBracketIndex);       // `];` and anything after
                fs.writeFileSync(filePath, fileContent, 'utf-8');
              }
            }

            // ── Step 3: Send success response ──
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));

          } catch (err) {
            // ── Error handling: log the error and return a 500 status ──
            console.error('Error saving habit:', err);
            res.statusCode = 500; // 500 Internal Server Error
            res.end(JSON.stringify({ error: 'Failed to save habit' }));
          }
        });
      });
    }
  };
}

// ─────────────────────────────────────────────────────────
// VITE CONFIG EXPORT
// ─────────────────────────────────────────────────────────

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),         // React JSX support and Hot Module Replacement
    tailwindcss(),   // Tailwind CSS v4 processing via Vite
    habitsApi()      // Custom dev-server API for habit persistence
  ],
})
