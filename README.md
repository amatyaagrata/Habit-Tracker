# 🌿 Habit Tracker

A beautiful, modern habit-tracking web application built with **React** and **Vite**. Track your daily and weekly habits, visualise streaks, and build positive routines — one day at a time.

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0_alpha-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Habit Dashboard** | View all your habits at a glance with real-time stats |
| **Add / Delete Habits** | Create new habits with a name and frequency (daily or weekly) |
| **Daily Completion Toggle** | Tick/untick today's completion with a single click |
| **Streak Tracking** | Automatic streak calculation — consecutive days are counted and displayed |
| **7-Day Mini Calendar** | Each habit card shows the last 7 days with completion status |
| **Stats Overview** | Dashboard cards for Total Habits, Today's Progress (%), and Longest Streak |
| **Glassmorphism UI** | Premium frosted-glass design with smooth micro-animations |
| **Responsive Layout** | Works seamlessly on desktop, tablet, and mobile |
| **Server-Side Persistence** | A custom Vite plugin writes habits back to the source data file during development |

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/) with JSX
- **Build Tool**: [Vite 5](https://vite.dev/)
- **Styling**: [Tailwind CSS v4 (alpha)](https://tailwindcss.com/) + custom CSS component layer
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: Custom inline SVG components + [React Icons](https://react-icons.github.io/react-icons/)
- **Font**: [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/Habit-Tracker.git
cd Habit-Tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

### Other Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Build a production-optimised bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all `.js` and `.jsx` files |

---

## 📁 Project Structure

```
Habit-Tracker/
├── public/
│   ├── favicon.svg              # Browser tab icon
│   └── icons.svg                # Shared SVG icon sprite
│
├── src/
│   ├── assets/
│   │   └── vite.svg             # Vite logo asset
│   │
│   ├── Components/
│   │   ├── AddHabitForm.jsx     # Modal form to create a new habit
│   │   ├── HabitCard.jsx        # Individual habit card with 7-day calendar
│   │   └── HabitList.jsx        # Dashboard: stats + grid of HabitCards
│   │
│   ├── data/
│   │   └── sampleHabits.jsx     # Initial seed data (also written to by the API plugin)
│   │
│   ├── utils/                   # (Reserved for future utility functions)
│   │
│   ├── App.jsx                  # Root component: routing, state management, streak logic
│   ├── App.css                  # Legacy / scaffold styles
│   ├── index.css                # Global design system (Tailwind theme + component classes)
│   └── main.jsx                 # React DOM entry point
│
├── index.html                   # HTML shell loaded by Vite
├── vite.config.js               # Vite config + custom habits-api server plugin
├── eslint.config.js             # ESLint flat config for React
├── package.json                 # Dependencies and scripts
└── README.md                    # ← You are here
```

---

## 🧩 Component Architecture

```
App (state owner)
├── Title                        # Sticky header bar with app name
├── HabitList (route: /)         # Dashboard view
│   ├── Stats Cards (×3)         # Total Habits · Today's Progress · Longest Streak
│   ├── HabitCard (×N)           # One card per habit
│   │   ├── 7-Day Calendar       # Last 7 days completion circles
│   │   └── Tick Button          # Toggle today's completion
│   └── AddHabitForm (modal)     # In-page modal for creating habits
└── AddHabitForm (route: /AddHabitForm)
                                 # Full-page form variant (via wrapper)
```

### Data Flow

1. **State lives in `App.jsx`** — the `habits` array is managed via `useState`.
2. **Props are drilled down** through `HabitList` → `HabitCard` for toggle/delete callbacks.
3. **Streak calculation** runs on mount (`useEffect`) and on every toggle to keep streaks accurate.
4. **The Vite plugin** (`habitsApi` in `vite.config.js`) provides a `POST /api/habits` endpoint that writes changes directly to the `sampleHabits.jsx` source file during development.

---

## 🎨 Design System

The app uses a **nature-inspired green palette** defined as CSS custom properties in `index.css`:

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#f2f8f5` | Lightest background |
| `primary-200` | `#b1d3b9` | Borders, subtle fills |
| `primary-500` | `#659287` | Primary interactive colour |
| `primary-700` | `#3f6258` | Headings, strong text |
| `primary-900` | `#1a322a` | Darkest accent |

### Key CSS Components

- `.habit-card` — Glassmorphic card with backdrop blur
- `.streak-badge` — Pill-shaped streak counter
- `.day-tick` / `.day-tick-completed` / `.day-tick-missed` — 7-day calendar circles
- `.btn-primary` / `.btn-completed` / `.btn-secondary` — Button variants
- `.modal-overlay` / `.modal-content` — Full-screen modal with blur
- `.input-field` / `.freq-btn` — Form controls

---

## 🔮 Future Improvements

- [ ] Persistent storage (localStorage or backend database)
- [ ] Habit categories and colour coding
- [ ] Weekly / monthly analytics charts
- [ ] Notifications and reminders
- [ ] Dark mode toggle
- [ ] User authentication

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  🌱 <em>Build positive habits, one day at a time.</em>
</p>
