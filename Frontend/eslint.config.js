/**
 * eslint.config.js — ESLint Flat Configuration
 *
 * This file configures ESLint using the new "flat config" format introduced in ESLint v9+.
 * It replaces the older `.eslintrc.*` file style.
 *
 * Active rule sets:
 *   1. js.configs.recommended      — Core JavaScript best practices
 *                                     (e.g., no unused variables, no undef)
 *   2. reactHooks.configs.flat.recommended
 *                                  — Enforces the Rules of Hooks
 *                                     (e.g., hooks must be called at top level, not inside loops)
 *   3. reactRefresh.configs.vite   — Warns if a file's exports are incompatible with
 *                                     Vite's React Fast Refresh (HMR)
 *
 * Scope:
 *   - Lints all `.js` and `.jsx` files in the project
 *   - Ignores the `dist/` build output folder (no need to lint compiled code)
 *
 * To run: `npm run lint`
 */

import js from '@eslint/js'                            // Core JS recommended rules
import globals from 'globals'                          // Pre-defined global variable sets (browser, node, etc.)
import reactHooks from 'eslint-plugin-react-hooks'     // Plugin: Rules of Hooks enforcement
import reactRefresh from 'eslint-plugin-react-refresh' // Plugin: React Fast Refresh compatibility
import { defineConfig, globalIgnores } from 'eslint/config' // ESLint flat config helpers

export default defineConfig([
  // ── Ignore the compiled output directory ──
  // We never want to lint the production build artifacts in dist/
  globalIgnores(['dist']),

  {
    // ── File scope: lint all JS and JSX files ──
    files: ['**/*.{js,jsx}'],

    // ── Extend from multiple rule sets ──
    extends: [
      js.configs.recommended,                    // Standard JS lint rules
      reactHooks.configs.flat.recommended,       // Hook usage rules (e.g., dependency arrays)
      reactRefresh.configs.vite,                 // HMR-compatible export rules
    ],

    // ── Language options ──
    languageOptions: {
      globals: globals.browser, // Make browser globals (window, document, fetch, etc.) available
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX syntax parsing
        },
      },
    },
  },
])
