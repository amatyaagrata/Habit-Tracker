import React, { useState, useEffect } from 'react';
import HabitList from './Components/HabitList.jsx';
import { sampleHabits } from './data/sampleHabits';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import AddHabitForm from './Components/AddHabitForm.jsx';

// ── BEGINNER FRIENDLY STREAK CALCULATION ──
// Calculates consecutive days completed up to today
function calculateStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date();
  
  // Get date strings for today and yesterday
  const todayString = currentDate.toDateString();
  
  let yesterdayDate = new Date();
  yesterdayDate.setDate(currentDate.getDate() - 1);
  const yesterdayString = yesterdayDate.toDateString();

  // If the habit was not completed today AND not completed yesterday, the streak is broken (0)
  if (!completedDates.includes(todayString) && !completedDates.includes(yesterdayString)) {
    return 0;
  }

  // Choose our starting date to check backwards:
  // If completed today, start checking backwards from today.
  // If not completed today (but was completed yesterday), start from yesterday.
  let checkDate = new Date();
  if (!completedDates.includes(todayString)) {
    checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday
  }

  // Loop backwards day-by-day and count how many consecutive days are completed
  while (true) {
    const dateStr = checkDate.toDateString();
    
    // If this date is in the completions list, we increase the streak
    if (completedDates.includes(dateStr)) {
      streak = streak + 1;
      // Move checkDate to the previous day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // As soon as we find a day that was missed, we stop counting
      break;
    }
  }

  return streak;
}

/* SVG Icons */
const LeafIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#659287" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.9 9-12z"/>
    <path d="M6 15s-2-2 0-6c2-4 7-7 11-7"/>
  </svg>
);

export default function App() {
  // Use React state to hold the habits list
  const [habits, setHabits] = useState(sampleHabits);

  // useEffect runs once when the app loads (on initial mount)
  useEffect(() => {
    // We check all habits and reset their streak to 0 if they are broken
    setHabits(prevHabits => {
      return prevHabits.map(habit => {
        const currentStreak = calculateStreak(habit.completedDates);
        return {
          ...habit,
          streak: currentStreak // update streak with correct calculated value
        };
      });
    });
  }, []);

  // Handler to add a new habit
  const handleAddHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  // Handler to toggle completion of today's date
  const handleToggleHabit = (habitId) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toDateString();
        const alreadyCompleted = habit.completedDates.includes(today);
        
        let updatedCompletions;
        if (alreadyCompleted) {
          // If already completed, remove today's date (untick)
          updatedCompletions = habit.completedDates.filter(date => date !== today);
        } else {
          // If not completed, add today's date (tick)
          updatedCompletions = [...habit.completedDates, today];
        }

        // Calculate the new streak based on the updated completions list
        const updatedStreak = calculateStreak(updatedCompletions);

        return {
          ...habit,
          completedDates: updatedCompletions,
          streak: updatedStreak
        };
      }
      return habit;
    }));
  };

  // Handler to delete a habit
  const handleDeleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  return (
    <BrowserRouter>
      <Title />
      <Routes>
        <Route path="/" element={
          <HabitList 
            habits={habits} 
            onAddHabit={handleAddHabit}
            onTickHabit={handleToggleHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        } />
        <Route path="/AddHabitForm" element={
          <AddHabitFormWrapper 
            onAdd={handleAddHabit}
          />
        } />
      </Routes>
      <Routes>
        <Route path="/habit/:id" element={<div>Habit Details Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

// Simple wrapper component to handle navigation on submit or cancel
function AddHabitFormWrapper({ onAdd }) {
  const navigate = useNavigate();
  return (
    <AddHabitForm 
      onAdd={(habit) => {
        onAdd(habit);
        navigate('/');
      }}
      onCancel={() => navigate('/')}
    />
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