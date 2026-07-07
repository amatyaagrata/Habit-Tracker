/**
 * sampleHabits.jsx — Seed / Persistent Habit Data
 *
 * This file serves as the application's data store during development.
 * It exports an array of habit objects that are loaded as the initial state
 * in App.jsx via:
 *   const [habits, setHabits] = useState(sampleHabits);
 *
 * ── How persistence works ──
 * The custom Vite server plugin (`habitsApi` in vite.config.js) exposes a
 * POST /api/habits endpoint. When habits are added or modified, the plugin
 * overwrites this file on disk so that data survives a browser refresh.
 *
 * ── Habit Object Shape ──
 * Each habit has the following fields:
 *
 * @typedef {Object} Habit
 * @property {number}   id             - Unique identifier (timestamp-based for new habits)
 * @property {string}   name           - Display name of the habit (e.g., "Read for 30 minutes")
 * @property {string}   frequency      - How often to track: "daily" | "weekly"
 * @property {number}   streak         - Consecutive-day count (recalculated on app load)
 * @property {string[]} completedDates - Array of date strings in `Date.toDateString()` format
 *                                       e.g., ["Mon Jun 23 2026", "Tue Jun 24 2026"]
 * @property {string}   createdAt      - ISO 8601 timestamp of when the habit was created
 */

export const sampleHabits = [
  {
    // Habit 1: Reading — currently on a 7-day streak
    "id": 1,
    "name": "Read for 30 minutes",
    "frequency": "daily",
    "streak": 7,
    "completedDates": [
      "Tue Jun 23 2026",
      "Wed Jun 24 2026",
      "Thu Jun 25 2026",
      "Fri Jun 26 2026",
      "Sat Jun 27 2026",
      "Sun Jun 28 2026",
      "Mon Jun 29 2026"
    ],
    "createdAt": "2026-05-30T05:57:36.989Z"
  },
  {
    // Habit 2: Exercise — streak is 0 because recent days were missed
    "id": 2,
    "name": "Exercise (30 min)",
    "frequency": "daily",
    "streak": 0,
    "completedDates": [
      "Tue Jun 23 2026",
      "Thu Jun 25 2026",
      "Sat Jun 27 2026",
      "Sun Jun 28 2026"
    ],
    "createdAt": "2026-06-09T05:57:36.989Z"
  },
  {
    // Habit 3: Meditation — streak is 0 because Jun 29 was missed
    "id": 3,
    "name": "Meditate (10 min)",
    "frequency": "daily",
    "streak": 0,
    "completedDates": [
      "Wed Jun 24 2026",
      "Thu Jun 25 2026",
      "Fri Jun 26 2026",
      "Sat Jun 27 2026",
      "Sun Jun 28 2026"
    ],
    "createdAt": "2026-06-14T05:57:36.989Z"
  }
];

// Default export allows this module to also be imported without destructuring
export default sampleHabits;
