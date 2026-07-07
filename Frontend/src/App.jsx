/**
 App.jsx — Root Application Component
 *
 This is the top-level component that:
 1. Owns the global `habits` state (single source of truth).
 2. Defines streak calculation logic.
 3. Provides handler functions for adding, toggling, and deleting habits.
 4. Sets up client-side routing with React Router.

 =>State is passed down to child components via props ("prop drilling"):
 App → HabitList → HabitCard
 */

import React, { useState, useEffect } from 'react';
import HabitList from './Components/HabitList.jsx';   // Dashboard component showing all habits
import { sampleHabits } from './data/sampleHabits';   // Initial seed data for habits
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'; // Client-side routing
import AddHabitForm from './Components/AddHabitForm.jsx'; // Form component for creating new habits

// ─────────────────────────────────────────────────────────
// STREAK CALCULATION
// ─────────────────────────────────────────────────────────

/**
 * calculateStreak — Counts consecutive completed days ending at today (or yesterday).
 *
 * Algorithm:
 *   1. If neither today nor yesterday is in the completedDates list, return 0 (streak is broken).
 *   2. Determine the starting point:
 *      - If today IS completed → start from today.
 *      - If only yesterday IS completed → start from yesterday.
 *   3. Walk backwards day-by-day. For each day found in completedDates, increment the streak.
 *      Stop at the first missing day.
 *
 * @param {string[]} completedDates - Array of date strings (e.g., "Mon Jun 30 2026")
 * @returns {number} The current streak length in days
 */
function calculateStreak(completedDates) {
  // Guard clause: no completions means no streak
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }

  let streak = 0;           // Accumulator for consecutive days
  let currentDate = new Date(); // Reference to "right now"

  // ── Build date strings for today and yesterday ──
  const todayString = currentDate.toDateString();        // e.g., "Mon Jun 30 2026"

  let yesterdayDate = new Date();
  yesterdayDate.setDate(currentDate.getDate() - 1);      // Go back one day
  const yesterdayString = yesterdayDate.toDateString();   // e.g., "Sun Jun 29 2026"

  // ── Early exit: streak is broken if neither today nor yesterday is completed ──
  if (!completedDates.includes(todayString) && !completedDates.includes(yesterdayString)) {
    return 0;
  }

  // ── Determine the starting date for the backward walk ──
  // If completed today → start from today
  // If NOT completed today (but yesterday is) → start from yesterday
  let checkDate = new Date();
  if (!completedDates.includes(todayString)) {
    checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday
  }

  // ── Walk backwards, counting consecutive completed days ──
  while (true) {
    const dateStr = checkDate.toDateString();

    if (completedDates.includes(dateStr)) {
      // This day is completed — extend the streak
      streak = streak + 1;
      // Move to the previous day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // First missed day → streak ends here
      break;
    }
  }

  return streak;
}

// ─────────────────────────────────────────────────────────
// SVG ICON COMPONENTS
// ─────────────────────────────────────────────────────────

/**
 * LeafIcon — A decorative leaf SVG used in the app header.
 * Accepts an optional `className` prop to control sizing.
 */
const LeafIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#659287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.9 9-12z"/>
    <path d="M6 15s-2-2 0-6c2-4 7-7 11-7"/>
  </svg>
);

// ─────────────────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────────────────

/**
 * App — The root component of the application.
 *
 * Responsibilities:
 *   - Manages the `habits` state array (single source of truth)
 *   - Recalculates streaks on initial load
 *   - Provides add / toggle / delete handler functions
 *   - Configures React Router routes
 */
export default function App() {
  // ── STATE ──
  // Initialize habits from the seed data file (sampleHabits.jsx)
  const [habits, setHabits] = useState(sampleHabits);

  // ── SIDE EFFECT: Recalculate all streaks on first render ──
  // This ensures stale streak values in the seed data are corrected
  // when the app is opened on a new day.
  useEffect(() => {
    setHabits(prevHabits => {
      return prevHabits.map(habit => {
        const currentStreak = calculateStreak(habit.completedDates);
        return {
          ...habit,                  // Spread existing habit properties
          streak: currentStreak      // Overwrite streak with the freshly calculated value
        };
      });
    });
  }, []); // Empty dependency array → runs only once on mount

  // ── HANDLER: Add a new habit to the list ──
  const handleAddHabit = (newHabit) => {
    setHabits([...habits, newHabit]); // Append the new habit to the end of the array
  };

  // ── HANDLER: Toggle today's completion for a specific habit ──
  const handleToggleHabit = (habitId) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toDateString(); // e.g., "Mon Jun 30 2026"
        const alreadyCompleted = habit.completedDates.includes(today);

        let updatedCompletions;
        if (alreadyCompleted) {
          // Already completed today → remove today's date (untick)
          updatedCompletions = habit.completedDates.filter(date => date !== today);
        } else {
          // Not completed today → add today's date (tick)
          updatedCompletions = [...habit.completedDates, today];
        }

        // Recalculate streak based on the updated completions list
        const updatedStreak = calculateStreak(updatedCompletions);

        return {
          ...habit,
          completedDates: updatedCompletions,
          streak: updatedStreak
        };
      }
      // Return other habits unchanged
      return habit;
    }));
  };

  // ── HANDLER: Delete a habit by its ID ──
  const handleDeleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  // ── RENDER ──
  // BrowserRouter enables client-side URL routing without full page reloads
  return (
    <BrowserRouter>
      {/* Sticky header — always visible regardless of route */}
      <Title />

      {/* Primary routes */}
      <Routes>
        {/* Home route: displays the habit dashboard */}
        <Route path="/" element={
          <HabitList 
            habits={habits} 
            onAddHabit={handleAddHabit}
            onTickHabit={handleToggleHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        } />

        {/* Add habit route: shows the form as a full page */}
        <Route path="/AddHabitForm" element={
          <AddHabitFormWrapper 
            onAdd={handleAddHabit}
          />
        } />
      </Routes>

      {/* Separate Routes block for the habit detail page (placeholder) */}
      <Routes>
        <Route path="/habit/:id" element={<div>Habit Details Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

// ─────────────────────────────────────────────────────────
// WRAPPER COMPONENT: AddHabitFormWrapper
// ─────────────────────────────────────────────────────────

/**
 * AddHabitFormWrapper — A thin wrapper around AddHabitForm that provides
 * navigation behaviour (redirect to home after submit or cancel).
 *
 * useNavigate() can only be called inside a component rendered within
 * <BrowserRouter>, so we need this wrapper instead of using navigate
 * directly in App.
 *
 * @param {Function} onAdd - Callback from App to add the new habit to state
 */
function AddHabitFormWrapper({ onAdd }) {
  const navigate = useNavigate(); // React Router hook for programmatic navigation

  return (
    <AddHabitForm 
      onAdd={(habit) => {
        onAdd(habit);      // Add the habit to App's state
        navigate('/');     // Redirect back to the dashboard
      }}
      onCancel={() => navigate('/')} // Cancel → go back to dashboard
    />
  );
}

// ─────────────────────────────────────────────────────────
// PRESENTATIONAL COMPONENT: Title
// ─────────────────────────────────────────────────────────

/**
 * Title — The sticky header bar displayed at the top of every page.
 * Contains the app logo (LeafIcon), app name, and tagline.
 */
function Title() {
  return (
    <div className="header-bar sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {/* App logo icon */}
          <LeafIcon className="w-8 h-8" />

          {/* App title */}
          <h1 style={{ color: '#3f6258' }} className="text-3xl font-extrabold tracking-tight">
            Habit Tracker
          </h1>

          {/* Tagline / subtitle */}
          <span className="text-sm ml-2" style={{ color: '#88bda4' }}>
            Build positive habits, one day at a time
          </span>
        </div>
      </div>
    </div>
  );
}