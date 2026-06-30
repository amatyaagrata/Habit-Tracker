import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── SVG ICONS (Re-usable visual components) ────────────────── */

// FlameIcon: Displays the orange flame indicator for streaks
const FlameIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

// CheckCircleIcon: Displays a solid completed checkmark circle for past completions
const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

// CircleIcon: Displays an empty transparent circle for missed or uncompleted days
const CircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" opacity="0.2" stroke="none">
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

// CheckIcon: Small checkmark symbol used inside the main "Completed Today" button
const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// TrashIcon: Standard trash can symbol for the delete button
const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

/* ── MAIN HABITCARD COMPONENT ── */
// Receives:
// - `habit`: The individual habit object (name, streak, completedDates, frequency, etc.)
// - `onTick`: Callback function to toggle completion state in parent state
// - `onDelete`: Callback function to delete this habit in parent state
const HabitCard = ({ habit, onTick, onDelete }) => {
  
  // Local state to trigger a micro-animation scaling effect when clicked
  const [isTicking, setIsTicking] = useState(false);
  
  // React Router hook for navigating between paths (unused in this component but declared)
  const navigate = useNavigate();
  
  // handleTick runs when the user clicks the completion toggle button
  const handleTick = () => {
    setIsTicking(true); // Trigger scale animation
    onTick(habit.id);   // Call the parent's function to add/remove today from list
    // Reset animation state after 300 milliseconds
    setTimeout(() => setIsTicking(false), 300);
  };

  // Converts raw frequency value (like 'daily') into capitalized text ('Daily')
  const getFrequencyLabel = (frequency) => {
    return frequency === 'daily' ? 'Daily' : 'Weekly';
  };

  // Returns an array containing the Date objects for the last 7 calendar days (including today)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      // Go back 'i' days
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days; // Array of 7 Dates (oldest first, today last)
  };

  // Checks if a given Date matches today's date
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Checks if a given Date's date string is included in the habit's completedDates array
  const isCompleted = (date) => {
    const dateStr = date.toDateString();
    return habit.completedDates?.includes(dateStr) || false;
  };

  // Pre-calculate data needed for rendering
  const last7Days = getLast7Days(); // Array of last 7 days
  const todayCompleted = isCompleted(new Date()); // Is today completed? (true/false)
  const streakCount = habit.streak || 0; // Current computed streak number

  return (
    // Habit Card Container - triggers bounce/scale animation if user clicked tick button
    <div className={`habit-card ${isTicking ? 'animate-pulse-scale' : ''}`}>
      
      {/* Header section: Title, frequency and streak badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Habit Name */}
          <h3 className="text-lg font-semibold" style={{ color: '#2d4a41' }}>{habit.name}</h3>
          
          {/* Frequency & Creation Date */}
          <p className="text-sm mt-1" style={{ color: '#88bda4' }}>
            {getFrequencyLabel(habit.frequency)} &middot; Created {new Date(habit.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Streak badge & Delete button container */}
        <div className="flex items-center space-x-3">
          {/* Streak indicator badge */}
          <div className="streak-badge">
            <FlameIcon className="w-3.5 h-3.5" />
            {streakCount} day streak
          </div>
          
          {/* Delete button: calls onDelete callback with this habit's ID */}
          <button
            onClick={() => onDelete(habit.id)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer flex items-center justify-center"
            title="Delete Habit"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7-Day Mini Calendar Strip (horizontal timeline) */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium" style={{ color: '#769e8f' }}>Last 7 Days</span>
          {/* Total times this habit was ever checked */}
          <span className="text-xs" style={{ color: '#b1d3b9' }}>
            {habit.completedDates?.length || 0} total completions
          </span>
        </div>
        
        {/* Days grid container */}
        <div className="flex justify-between gap-1">
          {last7Days.map((date, index) => {
            const completed = isCompleted(date);
            const today = isToday(date);
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., 'Mon', 'Tue'
            const dayNum = date.getDate(); // e.g., 29, 30

            return (
              // Individual day column
              <div key={index} className="flex flex-col items-center gap-1">
                {/* Day name (e.g. 'Tue') */}
                <span className="text-xs" style={{ color: '#88bda4' }}>{dayLabel}</span>
                
                {/* Circle Tick container: styled green/solid if completed, transparent/gray if missed */}
                <div
                  className={`day-tick ${completed ? 'day-tick-completed' : 'day-tick-missed'} ${
                    today ? 'day-tick-today' : ''
                  }`}
                >
                  {completed ? (
                    <CheckCircleIcon className="w-4 h-4" /> // Checked icon
                  ) : (
                    <CircleIcon className="w-4 h-4" />     // Empty icon
                  )}
                </div>
                {/* Day number (e.g. '30') */}
                <span className="text-[10px]" style={{ color: '#b1d3b9' }}>{dayNum}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Tick Toggle Button (turns green if today completed) */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(177, 211, 185, 0.3)' }}>
        <button
          onClick={handleTick}
          // Dynamically sets the button class:
          // If completed today: applies green style 'btn-completed'
          // If not completed: applies default teal style 'btn-primary'
          className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
            todayCompleted ? 'btn-completed' : 'btn-primary'
          }`}
        >
          {todayCompleted ? (
            // Content if completed
            <span className="flex items-center justify-center gap-2">
              <CheckIcon className="w-4 h-4" />
              Completed Today (Click to Untick)
            </span>
          ) : (
            // Content if not completed
            'Tick Today'
          )}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;