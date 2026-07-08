# Embers — Habit Tracker

A small, dependency-free habit tracker for the browser. Add a habit, tap a
day to mark it done, and watch your streak build.

![status](https://img.shields.io/badge/status-active-brightgreen)

## Features

- Add and remove habits
- Tap any of the last 7 days to toggle it complete
- Live current-streak and best-streak counts per habit
- Data is saved in your browser via `localStorage` — no account, no server
- Fully keyboard accessible, responsive down to mobile

## Getting started

No build tools or dependencies. Just open `index.html` in a browser:

```bash
git clone https://github.com/<your-username>/embers-habit-tracker.git
cd embers-habit-tracker
open index.html   # or just double-click the file
```

## How it works

- `index.html` — page structure and the `<template>` used for each habit card
- `styles.css` — the visual design (ink/paper/ember color system)
- `script.js` — state management, streak calculation, and rendering, all
  persisted to `localStorage` under the `embers.habits.v1` key

Streaks are computed by walking backward from today (`currentStreak`) and by
scanning all recorded dates for the longest run (`bestStreak`).

## Ideas for extending it

- Sync habits across devices with a small backend
- Weekly/monthly view instead of a fixed 7-day window
- Reminders via the Notifications API
- Export/import data as JSON

## License

MIT — see [LICENSE](LICENSE).
