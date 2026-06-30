import React, { useState } from 'react';
import HabitCard from './HabitCard';
import AddHabitForm from './AddHabitForm';
import { useNavigate } from 'react-router-dom';

/* ── SVG ICONS (Icons for dashboard headers/stats) ── */

// PlusIcon: Displays a '+' sign for the create button
const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

// SproutIcon: Cute green sprout shown when the habit list is empty
const SproutIcon = ({ className = "w-14 h-14" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#88bda4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 20h10"/>
    <path d="M10 20c5.5-2.5 0.8-6.4 3-10"/>
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
  </svg>
);

// ChartIcon: Icon for the "Total Habits" stats box
const ChartIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#659287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="4" height="8" rx="1"/>
    <rect x="10" y="8" width="4" height="12" rx="1"/>
    <rect x="17" y="4" width="4" height="16" rx="1"/>
  </svg>
);

// TargetIcon: Icon for the "Today's Progress" stats box
const TargetIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#659287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

// FlameIcon: Icon for the "Longest Streak" stats box
const FlameIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#659287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

/* ── MAIN HABITLIST COMPONENT ── */
// Receives:
// - `habits`: The array of habits from the parent state (App.jsx)
// - `onAddHabit`: Handler to add a habit (passed to AddHabitForm if rendering as modal)
// - `onTickHabit`: Handler to toggle completion (passed to HabitCard)
// - `onDeleteHabit`: Handler to delete a habit (passed to HabitCard - Prop Drilling)
const HabitList = ({ habits, onAddHabit, onTickHabit, onDeleteHabit }) => {
  
  // Local state to toggle showing the AddHabitForm modal overlay
  const [showAddForm, setShowAddForm] = useState(false);

  // 1. Calculate sum of all streaks in the habits list using array.reduce()
  const totalStreak = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0);
  
  // 2. Count how many habits are completed today by filtering and checking if today's date is in completedDates
  const completedToday = habits.filter(habit => 
    habit.completedDates?.includes(new Date().toDateString())
  ).length;

  // React router navigate function to redirect pages
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header section with top completion stats and New Habit button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          {/* Displays progress, e.g. "2/5 completed today" */}
          <p style={{ color: '#527a6f' }}>
            {completedToday}/{habits.length} completed today &middot; {totalStreak} total streak days
          </p>
        </div>
        
        {/* Click redirects the browser to '/AddHabitForm' route */}
        <button
          onClick={() => {
            navigate('/AddHabitForm');
            setShowAddForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          New Habit
        </button>
      </div>

      {/* Stats Cards Section (3 boxes representing the current state summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1: Total Habits count */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <ChartIcon className="w-4 h-4" />
            <p className="text-sm" style={{ color: '#769e8f' }}>Total Habits</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#3f6258' }}>{habits.length}</p>
        </div>
        
        {/* Card 2: Today's completion percentage (progress bar calculation) */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <TargetIcon className="w-4 h-4" />
            <p className="text-sm" style={{ color: '#769e8f' }}>Today's Progress</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#659287' }}>
            {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
          </p>
        </div>
        
        {/* Card 3: Longest individual streak in the list using Math.max() */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <FlameIcon className="w-4 h-4" />
            <p className="text-sm" style={{ color: '#769e8f' }}>Longest Streak</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#659287' }}>
            {habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0} days
          </p>
        </div>
      </div>

      {/* Habit List Grid Rendering */}
      {habits.length === 0 ? (
        // If there are zero habits: Show a beautiful empty state
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
        // If there are habits: Map over them and render a HabitCard for each habit
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onTick={onTickHabit}
              onDelete={onDeleteHabit} // Prop Drilling: Passing callback down
            />
          ))}
        </div>
      )}

      {/* Add Habit Modal: Displays overlay modal if showAddForm is true */}
      {showAddForm && (
        <AddHabitForm 
          onAdd={(habit) => {
            onAddHabit(habit); // Add the habit to state in parent
            setShowAddForm(false); // Close the modal
          }}
          onCancel={() => setShowAddForm(false)} // Close the modal
        />
      )}
    </div>
  );
};

export default HabitList;

export default HabitList;