import React, { useState } from 'react';

/* ── SVG Icons ───────────────────────────────── */
const FlameIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const CircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" opacity="0.2" stroke="none">
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const HabitCard = ({ habit, onTick }) => {
  const [isTicking, setIsTicking] = useState(false);

  const handleTick = () => {
    setIsTicking(true);
    onTick(habit.id);
    setTimeout(() => setIsTicking(false), 300);
  };

  const getFrequencyLabel = (frequency) => {
    return frequency === 'daily' ? 'Daily' : 'Weekly';
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCompleted = (date) => {
    const dateStr = date.toDateString();
    return habit.completedDates?.includes(dateStr) || false;
  };

  const last7Days = getLast7Days();
  const todayCompleted = isCompleted(new Date());
  const streakCount = habit.streak || 0;

  return (
    <div className={`habit-card ${isTicking ? 'animate-pulse-scale' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold" style={{ color: '#2d4a41' }}>{habit.name}</h3>
          <p className="text-sm mt-1" style={{ color: '#88bda4' }}>
            {getFrequencyLabel(habit.frequency)} &middot; Created {new Date(habit.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="streak-badge">
            <FlameIcon className="w-3.5 h-3.5" />
            {streakCount} day streak
          </div>
        </div>
      </div>

      {/* 7-Day Mini Calendar Strip */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium" style={{ color: '#769e8f' }}>Last 7 Days</span>
          <span className="text-xs" style={{ color: '#b1d3b9' }}>
            {habit.completedDates?.length || 0} total completions
          </span>
        </div>
        <div className="flex justify-between gap-1">
          {last7Days.map((date, index) => {
            const completed = isCompleted(date);
            const today = isToday(date);
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();

            return (
              <div key={index} className="flex flex-col items-center gap-1">
                <span className="text-xs" style={{ color: '#88bda4' }}>{dayLabel}</span>
                <div
                  className={`day-tick ${completed ? 'day-tick-completed' : 'day-tick-missed'} ${
                    today ? 'day-tick-today' : ''
                  }`}
                >
                  {completed ? (
                    <CheckCircleIcon className="w-4 h-4" />
                  ) : (
                    <CircleIcon className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[10px]" style={{ color: '#b1d3b9' }}>{dayNum}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tick Button */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(177, 211, 185, 0.3)' }}>
        <button
          onClick={handleTick}
          disabled={todayCompleted}
          className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
            todayCompleted
              ? 'btn-primary'
              : 'btn-primary'
          }`}
          style={todayCompleted ? {
            background: 'linear-gradient(135deg, #b1d3b9, #e6f2dd)',
            color: '#3f6258',
            cursor: 'not-allowed'
          } : {}}
        >
          {todayCompleted ? (
            <span className="flex items-center justify-center gap-2">
              <CheckIcon className="w-4 h-4" />
              Completed Today
            </span>
          ) : (
            'Tick Today'
          )}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;