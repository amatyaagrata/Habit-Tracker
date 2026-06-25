import React, { useState } from 'react';
import HabitList from './components/HabitList';
import { sampleHabits } from './data/sampleHabits';

/* ── SVG Icons (inline) ─────────────────────── */
const LeafIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#659287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.9 9-12z"/>
    <path d="M6 15s-2-2 0-6c2-4 7-7 11-7"/>
  </svg>
);

export default function App() {
  const [habits, setHabits] = useState(sampleHabits);

  const handleAddHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  const handleTickHabit = (habitId) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toDateString();
        const alreadyCompleted = habit.completedDates.includes(today);
        
        if (!alreadyCompleted) {
          const newStreak = (habit.streak || 0) + 1;
          return {
            ...habit,
            completedDates: [...habit.completedDates, today],
            streak: newStreak
          };
        }
        return habit;
      }
      return habit;
    }));
  };

  return (
    <div className="min-h-screen">
      <Title />
      <HabitList 
        habits={habits} 
        onAddHabit={handleAddHabit}
        onTickHabit={handleTickHabit}
      />
    </div>
  );
}

function Title() {
  return (
    <div className="header-bar sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <LeafIcon className="w-8 h-8" />
          <h1 style={{ color: '#3f6258' }} className="text-3xl font-extrabold tracking-tight">
            Habit Tracker
          </h1>
          <span className="text-sm ml-2" style={{ color: '#88bda4' }}>
            Build positive habits, one day at a time
          </span>
        </div>
      </div>
    </div>
  );
}