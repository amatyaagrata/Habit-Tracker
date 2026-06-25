export const sampleHabits = [
  {
    id: 1,
    name: 'Read for 30 minutes',
    frequency: 'daily',
    streak: 7,
    completedDates: [
      new Date(Date.now() - 6 * 86400000).toDateString(),
      new Date(Date.now() - 5 * 86400000).toDateString(),
      new Date(Date.now() - 4 * 86400000).toDateString(),
      new Date(Date.now() - 3 * 86400000).toDateString(),
      new Date(Date.now() - 2 * 86400000).toDateString(),
      new Date(Date.now() - 1 * 86400000).toDateString(),
      new Date().toDateString(),
    ],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 2,
    name: 'Exercise (30 min)',
    frequency: 'daily',
    streak: 3,
    completedDates: [
      new Date(Date.now() - 6 * 86400000).toDateString(),
      new Date(Date.now() - 4 * 86400000).toDateString(),
      new Date(Date.now() - 2 * 86400000).toDateString(),
      new Date(Date.now() - 1 * 86400000).toDateString(),
    ],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 3,
    name: 'Meditate (10 min)',
    frequency: 'daily',
    streak: 5,
    completedDates: [
      new Date(Date.now() - 5 * 86400000).toDateString(),
      new Date(Date.now() - 4 * 86400000).toDateString(),
      new Date(Date.now() - 3 * 86400000).toDateString(),
      new Date(Date.now() - 2 * 86400000).toDateString(),
      new Date(Date.now() - 1 * 86400000).toDateString(),
    ],
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];
