# Deployment

## Overview

CG Waste Data is deployed as a static Vite application backed by Supabase services. The frontend build output is generated in `dist/` and can be hosted by any static hosting provider that supports environment variables at build time.

## Deployment prerequisites

- Node.js and npm available in the build environment.
- Supabase project configured with `database-schema.sql`.
- Required frontend environment variables configured in the hosting provider.
- Optional OpenRouter key configured if AI features should be live.

## Required environment variables

Configure these in the deployment platform:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Optional:

```bash
VITE_OPENROUTER_API_KEY=your-openrouter-key
GEMINI_API_KEY=your-gemini-key-if-needed
```

See `ENVIRONMENT.md` for details.

## Build command

```bash
npm install
npm run build
```

If the platform separates install and build phases, use:

```bash
npm install
```

as the install command and:

```bash
npm run build
```

as the build command.

## Output directory

```text
dist
```

## Preview command

```bash
npm run preview
```

Use this locally to validate the production bundle before deploying.

## Supabase deployment steps

1. Create or select a Supabase project.
2. Run `database-schema.sql` in the SQL editor.
3. Verify the `users`, `projects`, `edge_projects`, `notifications`, and `waste_logs` tables.
4. Verify the manifest and field synchronization triggers.
5. Verify `projects`, `waste_logs`, and `notifications` are in the realtime publication.
6. Confirm Row Level Security policies match the intended environment.
7. Configure Auth providers and redirect URLs.
8. Add the deployed frontend URL to Supabase Auth redirect settings.

## Static host settings

For common static hosts, use:

| Setting | Value |
| --- | --- |
| Framework | Vite / React |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 18+ recommended |

## Post-deployment validation

After deploying, validate:

- Public landing page loads.
- Authentication opens and redirects correctly.
- Supabase session persists after refresh.
- Profile data loads from `public.users`.
- Dashboard renders without runtime errors.
- Waste Tracking board reads `waste_logs`.
- Realtime updates refresh the Waste Tracking board.
- Compliance Engine role restrictions behave as expected.
- AI features work if `VITE_OPENROUTER_API_KEY` is configured.
- Browser console is free of unexpected errors.

## Production security checklist

Before production launch:

- Harden Row Level Security beyond broad authenticated-user access.
- Add tenant or organization scoping to business tables.
- Ensure no service-role keys are exposed to browser code.
- Configure trusted Auth redirect URLs only.
- Add audit logging for compliance reports and manifest verification.
- Review CORS and API key restrictions for AI providers.
- Rotate any key that was shared in local files, logs, or chat.

## Known deployment warnings

The current build may warn that `/index.css` does not exist at build time. Vite leaves it unresolved and still produces the bundle. This should be cleaned up in a future styling pass.

The current build may also warn that some chunks exceed 500 kB after minification. Production deployments can still proceed, but code splitting should be considered as the application grows.

## Rollback guidance

If a deployment fails validation:

1. Revert to the previous known-good frontend deployment in the hosting provider.
2. Do not roll back database migrations unless a migration explicitly caused the issue.
3. If schema rollback is required, first export affected data.
4. Restore environment variables to previous values if the failure is configuration-related.
5. Re-run post-deployment validation after rollback.
