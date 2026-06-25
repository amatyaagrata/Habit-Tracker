import React, { useState } from 'react';

/* ── SVG Icons ───────────────────────────────── */
const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CalendarDailyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <circle cx="12" cy="15" r="2" fill="currentColor"/>
  </svg>
);

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

const AddHabitForm = ({ onAdd, onCancel }) => {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!habitName.trim()) {
      newErrors.name = 'Habit name is required';
    } else if (habitName.trim().length < 3) {
      newErrors.name = 'Habit name must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newHabit = {
      id: Date.now(),
      name: habitName.trim(),
      frequency: frequency,
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    onAdd(newHabit);
    setHabitName('');
    setFrequency('daily');
  };

  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center p-4 z-50 animate-bounce-in">
      <div className="modal-content max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#2d4a41' }}>Create New Habit</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full transition-colors cursor-pointer"
            style={{ color: '#88bda4' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(177, 211, 185, 0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Habit Name Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: '#527a6f' }}>
              Habit Name
            </label>
            <input
              type="text"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
              style={errors.name ? { borderColor: '#e57373', boxShadow: '0 0 0 3px rgba(229,115,115,0.15)' } : {}}
              placeholder="e.g., Read for 30 minutes"
              autoFocus
            />
            {errors.name && (
              <p className="mt-1.5 text-sm" style={{ color: '#e57373' }}>{errors.name}</p>
            )}
          </div>

          {/* Frequency Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#527a6f' }}>
              Frequency
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`freq-btn ${frequency === 'daily' ? 'freq-btn-active' : ''}`}
              >
                <CalendarDailyIcon className="w-6 h-6" />
                Daily
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`freq-btn ${frequency === 'weekly' ? 'freq-btn-active' : ''}`}
              >
                <CalendarWeeklyIcon className="w-6 h-6" />
                Weekly
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
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