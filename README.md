# Clinical Notes

A Single-Page App for managing clinical psychology client records, session notes, follow-ups, and attachments — built for a single clinician.

## Tech stack

- **React 19 + TypeScript** (strict mode) with Vite 8
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router v7** (BrowserRouter)
- **Firebase 12** (Auth, Firestore, Storage) — optional; the app runs with in-memory mock data when Firebase isn't configured
- **Vitest + Testing Library** for unit/component tests, **oxlint** for linting

## Getting started

```bash
npm install
npm run dev        # start the Vite dev server
```

Other scripts:

```bash
npm run test       # run the Vitest suite once
npm run lint       # lint with oxlint
npm run typecheck  # TypeScript project check
npm run build      # typecheck + production build into dist/
npm run preview    # preview the production build locally
```

## Running without Firebase

When the `VITE_FIREBASE_*` variables are missing, the app boots into a limited state: sign-in falls back to a demo button and data cannot load (the Firestore repositories throw a clear configuration error). Populate `.env` from `.env.example` to connect to your Firebase project.

## Enabling Firebase persistence

1. Create a Firebase project and enable:
   - **Google sign-in** in Authentication
   - **Firestore** (production mode) with owner-only security rules
2. Copy `.env.example` to `.env` and fill in the values:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_OWNER_EMAIL=you@gmail.com
```

3. `VITE_OWNER_EMAIL` gates access to a single Google account: any other signed-in email is signed out immediately, and the Firestore security rules deny their requests server-side.
4. The app persists to Firestore via `src/repositories/firebase/*` (clients/sessions/followUps/attachments). Attachments are **metadata only** for now; file uploads are deferred.

## Architecture

```
src/
├── auth/            Authentication context, protected/public routes, owner gate
├── contexts/        DataContext — loads all data and exposes CRUD
├── repositories/    Repository interfaces + Firestore implementations
├── firebase/        Lazy Firebase app/auth/db/storage singletons
├── types/           Domain model types (Client, Session, FollowUp, Attachment)
├── components/      UI primitives, forms, layout, dashboard/listing widgets
├── pages/           Route components
└── lib/             Formatting helpers
```

Data flows through repository interfaces so a mock and a real backend are interchangeable:

- `ClientRepository`, `SessionRepository`, `FollowUpRepository`, `AttachmentRepository`
- `src/services/repositories.ts` selects the active implementation (currently Firestore)
- `src/repositories/firebase/*` implement CRUD against Cloud Firestore; deleting a client cascades to its sessions, follow-ups, and attachments

## Deployment

Deploying is handled by the GitHub Actions workflow in `.github/workflows/deploy.yml`. On every push to `main` it installs dependencies, lints, tests, builds, then publishes `dist/` to GitHub Pages.

The build uses Vite's **relative base (`./`)**, so the app works when served from a subpath (e.g. `https://<user>.github.io/<repo>/`) as well as from the site root. Because the router uses HTML5 history, deep links are handled with the SPA fallback:

1. A missing path triggers `404.html`, which saves the requested URL and redirects back to the app root.
2. `index.html` restores the saved URL with `history.replaceState`, so React Router renders the right page.

Enable Pages in the repo settings under **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Data model

- **Client** — code, name, contact details, status (ACTIVE / INACTIVE)
- **Session** — client link, event type, date/time, duration, clinical note sections, follow-up date
- **FollowUp** — client link, scheduled date, status, notes
- **Attachment** — client link, name/type/size (metadata only; file contents deferred)

## Disclaimer

This is a practice project for a clinical workflow. Persistence goes to Firestore under owner-only security rules; the repository layer should still be reviewed for production use. It is not a substitute for a medical records system.