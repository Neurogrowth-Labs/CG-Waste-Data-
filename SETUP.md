# Setup

## Prerequisites

Install the following before running the project locally:

- Node.js 18 or newer
- npm
- A Supabase project for authentication, persistence, and realtime features
- Optional OpenRouter API key for AI features

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

Update `.env.local` with your project values:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENROUTER_API_KEY=optional-openrouter-key
```

See `ENVIRONMENT.md` for detailed variable behavior.

## 3. Configure Supabase

1. Open your Supabase project.
2. Go to the SQL editor.
3. Run the contents of `database-schema.sql`.
4. Confirm the following tables exist:
   - `users`
   - `projects`
   - `edge_projects`
   - `notifications`
   - `waste_logs`
5. Confirm Supabase Auth is enabled.
6. Configure Google OAuth if you want Google login to work.
7. Confirm Realtime is enabled for `projects`, `waste_logs`, and `notifications`.

## 4. Start the development server

```bash
npm run dev
```

The Vite dev server is configured to listen on `0.0.0.0:3000`.

## 5. Open the application

Open the local URL printed by Vite, usually:

```text
http://localhost:3000
```

## 6. Validate the main workflows

After the app loads, validate these flows:

- Public landing page renders for unauthenticated users.
- Request access opens authentication.
- Email/password login works with Supabase Auth.
- Signup captures identity, organization, compliance, and security details.
- Authenticated dashboard loads.
- Waste Tracking displays the live logistics board.
- Creating or updating `waste_logs` in Supabase refreshes the board.
- AI features return results when `VITE_OPENROUTER_API_KEY` is configured.

## 7. Build locally

```bash
npm run build
```

A successful build writes production assets to `dist/`.

## 8. Preview the production build

```bash
npm run preview
```

## Troubleshooting

### Supabase calls return placeholder or fail

Check that `.env.local` contains valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values. The client has fallback values so the app can render, but real data requires a configured Supabase project.

### AI calls fail

Set `VITE_OPENROUTER_API_KEY` and restart the dev server. Environment variables are read at build/dev server startup.

### Realtime board does not update

Confirm the `waste_logs` table is part of the `supabase_realtime` publication and that the authenticated user can read the table under the active RLS policies.

### Build warns about `/index.css`

The current `index.html` references `/index.css`, which is not present at build time. Vite leaves it unresolved. The build still completes, but this should be cleaned up when consolidating global styles.
