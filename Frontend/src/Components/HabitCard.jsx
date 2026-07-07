/**
 * HabitCard.jsx — Individual Habit Card Component
 *
 * Renders a single habit as a glassmorphic card with:
 *   1. Habit name, frequency label, and creation date
 *   2. A streak badge showing consecutive completed days
 *   3. A 7-day mini calendar strip showing completion status for the last week
 *   4. A toggle button to mark/unmark today's completion
 *   5. A delete button to remove the habit
 *
 * Props received from HabitList:
 *   - habit:    The individual habit data object
 *   - onTick:   Callback to toggle today's completion (called with habit.id)
 *   - onDelete: Callback to delete this habit (called with habit.id)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Router hook (available for future navigation needs)

// ─────────────────────────────────────────────────────────
// SVG ICON COMPONENTS
// ─────────────────────────────────────────────────────────

/**
 * FlameIcon — Flame/fire SVG for the streak badge.
 * Uses `currentColor` so it inherits the parent's text colour.
 */
const FlameIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

/**
 * CheckCircleIcon — Solid filled circle with checkmark.
 * Used in the 7-day calendar strip for completed days.
 */
const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

/**
 * CircleIcon — Semi-transparent empty circle.
 * Used in the 7-day calendar strip for missed/uncompleted days.
 */
const CircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" opacity="0.2" stroke="none">
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

/**
 * CheckIcon — Simple checkmark polyline.
 * Used inside the "Completed Today" toggle button.
 */
const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/**
 * TrashIcon — Trash can icon for the delete button.
 * Stroked outline style for a clean, minimal look.
 */
const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

// ─────────────────────────────────────────────────────────
// MAIN HABITCARD COMPONENT
// ─────────────────────────────────────────────────────────

/**
 * HabitCard — Displays a single habit's information and controls.
 *
 * @param {Object}   habit    - The habit data object containing:
 *   @param {number}   habit.id             - Unique identifier
 *   @param {string}   habit.name           - Display name (e.g., "Read for 30 minutes")
 *   @param {string}   habit.frequency      - "daily" or "weekly"
 *   @param {number}   habit.streak         - Current consecutive day count
 *   @param {string[]} habit.completedDates - Array of date strings when completed
 *   @param {string}   habit.createdAt      - ISO date string of creation
 * @param {Function} onTick   - Callback invoked with habit.id to toggle today's completion
 * @param {Function} onDelete - Callback invoked with habit.id to delete the habit
 */
const HabitCard = ({ habit, onTick, onDelete }) => {
  
  // ── LOCAL STATE ──
  // Tracks whether the card is currently animating (micro-interaction on tick)
  const [isTicking, setIsTicking] = useState(false);
  
  // React Router navigation hook (declared for potential future use, e.g., habit details page)
  const navigate = useNavigate();
  
  // ── HANDLER: Toggle today's completion ──
  /**
   * handleTick — Called when the user clicks the completion toggle button.
   * Triggers a brief scale animation and calls the parent's toggle callback.
   */
  const handleTick = () => {
    setIsTicking(true);    // Start the pulse-scale CSS animation
    onTick(habit.id);      // Tell App to add/remove today from completedDates
    // Reset animation state after 300ms (matches the CSS animation duration)
    setTimeout(() => setIsTicking(false), 300);
  };

  // ── HELPER: Format frequency for display ──
  /**
   * getFrequencyLabel — Converts the stored frequency value to a capitalised label.
   * @param {string} frequency - "daily" or "weekly"
   * @returns {string} "Daily" or "Weekly"
   */
  const getFrequencyLabel = (frequency) => {
    return frequency === 'daily' ? 'Daily' : 'Weekly';
  };

  // ── HELPER: Generate last 7 calendar days ──
  /**
   * getLast7Days — Creates an array of Date objects for the past 7 days (including today).
   * The array is ordered oldest-first: [6 days ago, 5 days ago, ..., yesterday, today].
   * @returns {Date[]} Array of 7 Date objects
   */
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i); // Subtract 'i' days from today
      days.push(date);
    }
    return days;
  };

  // ── HELPER: Check if a date is today ──
  /**
   * isToday — Compares a Date object to today's date (ignoring time).
   * @param {Date} date - The date to check
   * @returns {boolean} True if the date is today
   */
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // ── HELPER: Check if a date is in the habit's completed list ──
  /**
   * isCompleted — Checks whether the given date's string representation
   * exists in the habit's completedDates array.
   * @param {Date} date - The date to check
   * @returns {boolean} True if the date was completed
   */
  const isCompleted = (date) => {
    const dateStr = date.toDateString(); // e.g., "Mon Jun 30 2026"
    return habit.completedDates?.includes(dateStr) || false;
  };

  // ── PRE-COMPUTED VALUES ──
  const last7Days = getLast7Days();            // Array of the last 7 Date objects
  const todayCompleted = isCompleted(new Date()); // Whether today is marked as completed
  const streakCount = habit.streak || 0;        // Current streak (default to 0 if undefined)

  // ── RENDER ──
  return (
    // Card container — applies pulse animation class when the tick button is clicked
    <div className={`habit-card ${isTicking ? 'animate-pulse-scale' : ''}`}>
      
      {/* ──────────── CARD HEADER ──────────── */}
      {/* Habit name + metadata on the left, streak badge + delete on the right */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Habit display name */}
          <h3 className="text-lg font-semibold" style={{ color: '#2d4a41' }}>{habit.name}</h3>
          
          {/* Frequency label and creation date */}
          <p className="text-sm mt-1" style={{ color: '#88bda4' }}>
            {getFrequencyLabel(habit.frequency)} &middot; Created {new Date(habit.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Right side: streak badge and delete button */}
        <div className="flex items-center space-x-3">
          {/* Streak badge — pill-shaped indicator showing current streak count */}
          <div className="streak-badge">
            <FlameIcon className="w-3.5 h-3.5" />
            {streakCount} day streak
          </div>
          
          {/* Delete button — red-tinted icon button */}
          <button
            onClick={() => onDelete(habit.id)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer flex items-center justify-center"
            title="Delete Habit"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ──────────── 7-DAY MINI CALENDAR STRIP ──────────── */}
      {/* Horizontal row of 7 circles representing the last week's completion status */}
      <div className="mt-4">
        {/* Strip header: "Last 7 Days" label and total completions count */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium" style={{ color: '#769e8f' }}>Last 7 Days</span>
          <span className="text-xs" style={{ color: '#b1d3b9' }}>
            {habit.completedDates?.length || 0} total completions
          </span>
        </div>
        
        {/* Day circles — one column per day */}
        <div className="flex justify-between gap-1">
          {last7Days.map((date, index) => {
            // Pre-compute status for this specific day
            const completed = isCompleted(date);                                    // Was this day completed?
            const today = isToday(date);                                            // Is this day today?
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon", "Tue"
            const dayNum = date.getDate();                                           // e.g., 28, 29, 30

            return (
              // Column: day name → circle → day number
              <div key={index} className="flex flex-col items-center gap-1">
                {/* Abbreviated weekday name */}
                <span className="text-xs" style={{ color: '#88bda4' }}>{dayLabel}</span>
                
                {/* Completion circle — green if completed, gray if missed, outlined if today */}
                <div
                  className={`day-tick ${completed ? 'day-tick-completed' : 'day-tick-missed'} ${
                    today ? 'day-tick-today' : ''
                  }`}
                >
                  {completed ? (
                    <CheckCircleIcon className="w-4 h-4" />  // ✓ Filled check circle
                  ) : (
                    <CircleIcon className="w-4 h-4" />        // ○ Empty circle
                  )}
                </div>

                {/* Numeric day of the month */}
                <span className="text-[10px]" style={{ color: '#b1d3b9' }}>{dayNum}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──────────── COMPLETION TOGGLE BUTTON ──────────── */}
      {/* Full-width button at the bottom of the card */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(177, 211, 185, 0.3)' }}>
        <button
          onClick={handleTick}
          // Dynamic styling:
          //   - 'btn-completed' (darker green) when today is already completed
          //   - 'btn-primary' (standard teal) when today is not yet completed
          className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
            todayCompleted ? 'btn-completed' : 'btn-primary'
          }`}
        >
          {todayCompleted ? (
            // ── Completed state: show checkmark and "click to untick" hint ──
            <span className="flex items-center justify-center gap-2">
              <CheckIcon className="w-4 h-4" />
              Completed Today (Click to Untick)
            </span>
          ) : (
            // ── Not completed state: simple call-to-action ──
            'Tick Today'
          )}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;