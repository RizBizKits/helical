# Helical

A calm little habit tracker. **Habits are steps** — each check-in climbs your staircase, and steps you already took stay with you even after quiet weeks.

## Screenshots

### Empty

![Empty Helical — wordmark, climb, and first-habit prompt](./screenshots/empty-state.png)

### Populated week

![Helical with habits checked across the rolling week](./screenshots/populated-week.png)

### Mobile

![Helical stacked mobile layout](./screenshots/mobile-layout.png)

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

Production build:

```bash
npm run build
npm start
```

## What you can do

- Create, rename, and remove habits
- Mark (or undo) completion for any day in the rolling 7-day week
- See lifetime steps on the looking-up stairwell — missed days never erase past climbs
- Watch climb stats rotate through steps, pace, and habits
- Use it comfortably on phone or desktop

## How data is stored

Everything lives in your browser’s `localStorage` under the key `helical.habits.v1`:

- Habit names and ids
- Completion history as unique `(habitId, date)` pairs using **local calendar** dates (`YYYY-MM-DD`)

Nothing is sent to a server. Clearing site data for this origin also clears Helical.

## Reset to empty

Use **Reset** in the footer and confirm, or run this in the browser console on the Helical tab:

```js
localStorage.removeItem("helical.habits.v1")
location.reload()
```

## Refresh screenshots

With the app running on port `43127`:

```bash
node scripts/capture-readme-screenshots.cjs
```
