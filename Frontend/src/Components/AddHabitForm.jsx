/**
 * AddHabitForm.jsx — New Habit Creation Form Component
 *
 * Renders a full-screen modal overlay containing a form to create a new habit.
 * The form includes:
 *   1. A text input for the habit name (with validation)
 *   2. A frequency selector (Daily or Weekly) using toggle buttons
 *   3. Cancel and Create action buttons
 *
 * Props:
 *   - onAdd:    Callback function invoked with the new habit object on successful submission
 *   - onCancel: Callback function invoked when the user cancels (closes the form)
 *
 * The form performs client-side validation:
 *   - Habit name is required
 *   - Habit name must be at least 3 characters long
 */

import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────
// SVG ICON COMPONENTS
// ─────────────────────────────────────────────────────────

/**
 * CloseIcon — "X" symbol for the close/dismiss button in the modal header.
 */
const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/**
 * CheckIcon — Checkmark symbol used inside the "Create Habit" submit button.
 */
const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/**
 * CalendarDailyIcon — Calendar with a dot, representing "daily" frequency.
 * The centered dot symbolises a single day.
 */
const CalendarDailyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <circle cx="12" cy="15" r="2" fill="currentColor"/>
  </svg>
);

/**
 * CalendarWeeklyIcon — Calendar with horizontal lines, representing "weekly" frequency.
 * The lines symbolise multiple days in a week.
 */
const CalendarWeeklyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="7" y1="14" x2="17" y2="14"/>
    <line x1="7" y1="18" x2="13" y2="18"/>
  </svg>
);

// ─────────────────────────────────────────────────────────
// MAIN ADDHABITFORM COMPONENT
// ─────────────────────────────────────────────────────────

/**
 * AddHabitForm — Modal form for creating a new habit.
 *
 * @param {Function} onAdd    - Called with the new habit object when the form is submitted successfully
 * @param {Function} onCancel - Called when the user clicks Cancel or the close (X) button
 */
const AddHabitForm = ({ onAdd, onCancel }) => {
  // ── FORM STATE ──
  const [habitName, setHabitName] = useState('');       // Controlled input for the habit name
  const [frequency, setFrequency] = useState('daily');  // Selected frequency: 'daily' or 'weekly'
  const [errors, setErrors] = useState({});             // Validation error messages keyed by field name

  // ── VALIDATION ──
  /**
   * validate — Checks form inputs and populates the errors state.
   * @returns {boolean} True if the form is valid (no errors), false otherwise
   */
  const validate = () => {
    const newErrors = {};

    // Rule 1: Name must not be empty
    if (!habitName.trim()) {
      newErrors.name = 'Habit name is required';
    }
    // Rule 2: Name must be at least 3 characters
    else if (habitName.trim().length < 3) {
      newErrors.name = 'Habit name must be at least 3 characters';
    }

    setErrors(newErrors);
    // Return true if newErrors has no keys (i.e., no validation errors)
    return Object.keys(newErrors).length === 0;
  };

  // ── FORM SUBMISSION ──
  /**
   * handleSubmit — Handles the form submission event.
   * Prevents default form behaviour, validates inputs, and creates a new habit object.
   *
   * The new habit object structure:
   *   {
   *     id: number,            — Unique ID based on current timestamp (Date.now())
   *     name: string,          — Trimmed habit name
   *     frequency: string,     — 'daily' or 'weekly'
   *     streak: number,        — Starts at 0
   *     completedDates: [],    — Empty array (no completions yet)
   *     createdAt: string,     — ISO date string of when the habit was created
   *   }
   *
   * @param {Event} e - The form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();              // Prevent the browser from reloading the page
    if (!validate()) return;         // Stop if validation fails

    // Build the new habit data object
    const newHabit = {
      id: Date.now(),                // Use current timestamp as a unique identifier
      name: habitName.trim(),        // Clean whitespace from both ends
      frequency: frequency,          // 'daily' or 'weekly'
      streak: 0,                     // New habits start with zero streak
      completedDates: [],            // No completions yet
      createdAt: new Date().toISOString(), // ISO timestamp for "created at"
    };

    onAdd(newHabit);                 // Pass the new habit up to the parent component
    setHabitName('');                 // Reset the name input
    setFrequency('daily');           // Reset frequency back to default
  };

  // ── RENDER ──
  return (
    // Full-screen modal overlay with frosted glass background
    <div className="fixed inset-0 modal-overlay flex items-center justify-center p-4 z-50 animate-bounce-in">
      {/* Modal content card */}
      <div className="modal-content max-w-md w-full p-6">

        {/* ──────────── MODAL HEADER ──────────── */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#2d4a41' }}>Create New Habit</h2>
          {/* Close button — calls onCancel to dismiss the modal */}
          <button
            onClick={onCancel}
            className="p-2 rounded-full transition-colors cursor-pointer"
            style={{ color: '#88bda4' }}
            // Inline hover effect: add subtle background on mouse enter, remove on leave
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(177, 211, 185, 0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ──────────── FORM ──────────── */}
        <form onSubmit={handleSubmit}>

          {/* ── Habit Name Input ── */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: '#527a6f' }}>
              Habit Name
            </label>
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)} // Update state on every keystroke
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
              // Apply red border styling if there's a validation error
              style={errors.name ? { borderColor: '#e57373', boxShadow: '0 0 0 3px rgba(229,115,115,0.15)' } : {}}
              placeholder="e.g., Read for 30 minutes"
              autoFocus // Automatically focus this input when the modal opens
            />
            {/* Validation error message (shown only when errors.name exists) */}
            {errors.name && (
              <p className="mt-1.5 text-sm" style={{ color: '#e57373' }}>{errors.name}</p>
            )}
          </div>

          {/* ── Frequency Selector ── */}
          {/* Two toggle buttons: Daily and Weekly */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#527a6f' }}>
              Frequency
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Daily button — highlighted when frequency === 'daily' */}
              <button
                type="button"                              // Prevent form submission on click
                onClick={() => setFrequency('daily')}      // Set frequency to 'daily'
                className={`freq-btn ${frequency === 'daily' ? 'freq-btn-active' : ''}`}
              >
                <CalendarDailyIcon className="w-6 h-6" />
                Daily
              </button>

              {/* Weekly button — highlighted when frequency === 'weekly' */}
              <button
                type="button"                              // Prevent form submission on click
                onClick={() => setFrequency('weekly')}     // Set frequency to 'weekly'
                className={`freq-btn ${frequency === 'weekly' ? 'freq-btn-active' : ''}`}
              >
                <CalendarWeeklyIcon className="w-6 h-6" />
                Weekly
              </button>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex gap-3">
            {/* Cancel button — dismisses the form without saving */}
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>

            {/* Submit button — validates and creates the new habit */}
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <CheckIcon />
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitForm;