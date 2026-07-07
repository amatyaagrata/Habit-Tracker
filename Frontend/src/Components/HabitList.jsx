/**
 * HabitList.jsx — Dashboard Component
 *
 * This component renders the main habit tracking dashboard, which includes:
 *   1. A header bar with completion stats and a "New Habit" button
 *   2. Three summary stat cards (Total Habits, Today's Progress, Longest Streak)
 *   3. A responsive grid of HabitCard components (or an empty state)
 *   4. An optional modal overlay for the AddHabitForm
 *
 * Props received from App.jsx:
 *   - habits:        Array of habit objects
 *   - onAddHabit:    Callback to add a new habit
 *   - onTickHabit:   Callback to toggle today's completion
 *   - onDeleteHabit: Callback to remove a habit
 */

import React, { useState } from 'react';
import HabitCard from './HabitCard';       // Individual habit card component
import AddHabitForm from './AddHabitForm'; // Modal form for creating new habits
import { useNavigate } from 'react-router-dom'; // Programmatic navigation hook

// ─────────────────────────────────────────────────────────
// SVG ICON COMPONENTS
// ─────────────────────────────────────────────────────────

/**
 * PlusIcon — Renders a "+" symbol for the "New Habit" button.
 * @param {string} className - Tailwind size classes (default: "w-5 h-5")
 */
const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

/**
 * SproutIcon — Decorative sprout illustration for the empty state.
 * Displayed when the user has no habits yet.
 */
const SproutIcon = ({ className = "w-14 h-14" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#88bda4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 20h10"/>
    <path d="M10 20c5.5-2.5 0.8-6.4 3-10"/>
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
  </svg>
);

/**
 * ChartIcon — Bar chart icon for the "Total Habits" stats card.
 */
const ChartIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#659287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="4" height="8" rx="1"/>
    <rect x="10" y="8" width="4" height="12" rx="1"/>
    <rect x="17" y="4" width="4" height="16" rx="1"/>
  </svg>
);

/**
 * TargetIcon — Bullseye/target icon for the "Today's Progress" stats card.
 */
const TargetIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#659287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

/**
 * FlameIcon — Fire/flame icon for the "Longest Streak" stats card.
 */
const FlameIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#659287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

// ─────────────────────────────────────────────────────────
// MAIN HABITLIST COMPONENT
// ─────────────────────────────────────────────────────────

/**
 * HabitList — The main dashboard view.
 *
 * @param {Object[]} habits       - Array of habit objects from App state
 * @param {Function} onAddHabit   - Callback to add a new habit to App state
 * @param {Function} onTickHabit  - Callback to toggle today's completion for a habit
 * @param {Function} onDeleteHabit - Callback to delete a habit from App state
 */
const HabitList = ({ habits, onAddHabit, onTickHabit, onDeleteHabit }) => {
  
  // ── LOCAL STATE ──
  // Controls visibility of the AddHabitForm modal overlay
  const [showAddForm, setShowAddForm] = useState(false);

  // ── COMPUTED VALUES ──

  // Sum of all individual streak values across all habits
  // Array.reduce() iterates over every habit and accumulates their streak values
  const totalStreak = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0);
  
  // Count of habits that have today's date in their completedDates array
  const completedToday = habits.filter(habit => 
    habit.completedDates?.includes(new Date().toDateString())
  ).length;

  // React Router's navigate function — used to redirect to the AddHabitForm route
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* ──────────── HEADER SECTION ──────────── */}
      {/* Shows completion stats on the left and "New Habit" button on the right */}
      <div className="flex justify-between items-center mb-8">
        <div>
          {/* Summary text: "2/5 completed today · 12 total streak days" */}
          <p style={{ color: '#527a6f' }}>
            {completedToday}/{habits.length} completed today &middot; {totalStreak} total streak days
          </p>
        </div>
        
        {/* New Habit button — navigates to the AddHabitForm route */}
        <button
          onClick={() => {
            navigate('/AddHabitForm');   // Navigate to the add habit page
            setShowAddForm(true);        // Also set local state (used for modal mode)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          New Habit
        </button>
      </div>

      {/* ──────────── STATS CARDS SECTION ──────────── */}
      {/* Three cards in a responsive 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Card 1: Total number of habits */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <ChartIcon className="w-4 h-4" />
            <p className="text-sm" style={{ color: '#769e8f' }}>Total Habits</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#3f6258' }}>{habits.length}</p>
        </div>
        
        {/* Card 2: Today's completion percentage */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <TargetIcon className="w-4 h-4" />
            <p className="text-sm" style={{ color: '#769e8f' }}>Today's Progress</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#659287' }}>
            {/* Calculate percentage: (completed / total) × 100, rounded to nearest integer */}
            {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
          </p>
        </div>
        
        {/* Card 3: Longest individual streak among all habits */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <FlameIcon className="w-4 h-4" />
            <p className="text-sm" style={{ color: '#769e8f' }}>Longest Streak</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#659287' }}>
            {/* Math.max() with spread operator finds the highest streak value */}
            {habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0} days
          </p>
        </div>
      </div>

      {/* ──────────── HABIT CARDS GRID ──────────── */}
      {habits.length === 0 ? (
        // ── EMPTY STATE ──
        // Displayed when the user has no habits — encourages them to create one
        <div className="text-center py-16 modal-content" style={{ padding: '4rem 2rem' }}>
          <SproutIcon className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold" style={{ color: '#3f6258' }}>No habits yet</h3>
          <p className="mt-2" style={{ color: '#88bda4' }}>Start building positive habits today!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary mt-6"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        // ── POPULATED STATE ──
        // Renders a responsive 1-2 column grid of HabitCard components
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => (
            <HabitCard 
              key={habit.id}           // Unique key for React's reconciliation
              habit={habit}            // The habit data object
              onTick={onTickHabit}     // Toggle completion callback (prop drilling)
              onDelete={onDeleteHabit} // Delete habit callback (prop drilling)
            />
          ))}
        </div>
      )}

      {/* ──────────── ADD HABIT MODAL ──────────── */}
      {/* Conditionally rendered overlay modal for creating a new habit */}
      {showAddForm && (
        <AddHabitForm 
          onAdd={(habit) => {
            onAddHabit(habit);        // Add the new habit to App's state
            setShowAddForm(false);    // Close the modal
          }}
          onCancel={() => setShowAddForm(false)} // Close the modal without adding
        />
      )}
    </div>
  );
};

export default HabitList;