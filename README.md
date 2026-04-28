# Habit Tracker PWA

A mobile-first Progressive Web App for building and tracking daily habits.
Built with Next.js App Router, TypeScript, Tailwind CSS, and localStorage
for fully local, deterministic persistence.

---

## Project Overview

This app allows a user to:
- Sign up and log in with email and password
- Create, edit, and delete daily habits
- Mark habits complete for today
- View a live streak count per habit
- Reload the app and retain all data
- Install the app to their home screen as a PWA
- Load the app shell offline after one visit

Authentication and persistence are entirely local — no external database
or auth service is used. This keeps the app deterministic and fully testable.

---

## Setup Instructions

**Requirements:**
- Node.js 18 or higher
- npm 9 or higher

**Clone and install:**

```bash
git clone https://github.com/Bluey-ships-it/habit-tracker.git
cd habit-tracker
npm install
```

**Install Playwright browsers:**

```bash
npx playwright install --with-deps
```

---

## Run Instructions

**Start the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Build for production:**

```bash
npm run build
npm run start
```

---

## Test Instructions

**Run all tests:**

```bash
npm test
```

**Run unit tests only (with coverage):**

```bash
npm run test:unit
```

**Run integration tests only:**

```bash
npm run test:integration
```

**Run end-to-end tests only:**

```bash
npm run test:e2e
```

> For E2E tests, make sure the dev server is running on port 3000.
> Playwright will start it automatically if it is not already running.

**View coverage report:**

After running `npm run test:unit`, open:

```
coverage/index.html
```

in your browser to see the full line coverage report.

---

## Local Persistence Structure

All data is stored in the browser's `localStorage` under three keys:

### `habit-tracker-users`
Stores an array of registered users.
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "password": "plaintext",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### `habit-tracker-session`
Stores the currently active session, or `null` when logged out.
```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`
Stores an array of all habits across all users.
Each habit belongs to a user via `userId`.
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Drink Water",
    "description": "Stay hydrated",
    "frequency": "daily",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "completions": ["2026-04-25", "2026-04-26"]
  }
]
```

`completions` contains unique `YYYY-MM-DD` date strings.
The dashboard filters habits by `userId` so each user only sees their own.

---

## PWA Implementation

The app meets the basic PWA installability and offline requirements:

**`public/manifest.json`**
Defines the app name, icons, display mode, and theme color.
Linked in the root layout via a `<link rel="manifest">` tag.

**`public/sw.js`**
A custom service worker that:
- Caches the app shell on install (`/`, `/login`, `/signup`, `/dashboard`)
- Serves cached pages when offline
- Falls back to `/` if a specific cached route is not found
- Cleans up old caches on activation

**`ServiceWorkerRegister.tsx`**
A client component mounted in the root layout that registers `sw.js`
via `navigator.serviceWorker.register()` on first load.

**Icons**
- `public/icons/icon-192.png` — 192×192px app icon
- `public/icons/icon-512.png` — 512×512px app icon

After visiting the app once in a supported browser, the service worker
caches the shell. On subsequent visits without a network connection,
the app loads from cache without crashing.

---

## Trade-offs and Limitations

**Passwords are stored in plaintext**
This is intentional for this stage. The spec requires local-only auth
with no external service. In a production app, passwords would be hashed.

**No token expiry**
Sessions persist in localStorage until the user explicitly logs out.
There is no timeout or expiry mechanism.

**Single frequency type**
Only `daily` frequency is implemented as required by the spec.
Weekly or custom frequencies are not supported in this stage.

**No conflict resolution**
If the same user opens the app in two tabs and makes changes,
the last write wins. There is no sync or conflict resolution.

**Offline limitations**
The service worker caches the app shell but not dynamic data.
localStorage data is always available since it is local, but if the
app shell cache is cleared, the app will not load offline until
the user visits again while online.

---

## Test File Map

| Test File | Location | What It Verifies |
|---|---|---|
| `slug.test.ts` | `tests/unit/` | `getHabitSlug` converts habit names to URL-safe slugs correctly |
| `validators.test.ts` | `tests/unit/` | `validateHabitName` rejects empty and long names, returns trimmed valid values |
| `streaks.test.ts` | `tests/unit/` | `calculateCurrentStreak` counts consecutive days correctly, handles duplicates and gaps |
| `habits.test.ts` | `tests/unit/` | `toggleHabitCompletion` adds and removes dates, never mutates the original object |
| `auth-flow.test.tsx` | `tests/integration/` | Signup creates a session, duplicate email is rejected, login stores session, wrong password shows error |
| `habit-form.test.tsx` | `tests/integration/` | Habit name validation, create renders card, edit preserves immutable fields, delete requires confirmation, completion updates streak |
| `app.spec.ts` | `tests/e2e/` | Full user journeys: splash redirect, auth guard, signup, login, habit CRUD, persistence after reload, logout, offline shell |

---

## Folder Structure

```
src/
  app/
    page.tsx              # Splash route
    login/page.tsx        # Login route
    signup/page.tsx       # Signup route
    dashboard/page.tsx    # Protected dashboard
    layout.tsx            # Root layout
    globals.css           # Global styles
  components/
    auth/
      LoginForm.tsx
      SignupForm.tsx
    habits/
      HabitCard.tsx
      HabitForm.tsx
    shared/
      SplashScreen.tsx
      ServiceWorkerRegister.tsx
  lib/
    slug.ts
    validators.ts
    streaks.ts
    habits.ts
  types/
    auth.ts
    habit.ts
    index.ts

tests/
  unit/
    slug.test.ts
    validators.test.ts
    streaks.test.ts
    habits.test.ts
  integration/
    auth-flow.test.tsx
    habit-form.test.tsx
  e2e/
    app.spec.ts

public/
  manifest.json
  sw.js
  icons/
    icon-192.png
    icon-512.png
```