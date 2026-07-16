# Contributing

## Development principles

- Keep the product focused on construction, demolition, circularity, compliance, and green-building waste workflows.
- Prefer typed TypeScript interfaces for shared data structures.
- Keep Supabase schema expectations documented when data shapes change.
- Do not commit secrets, generated build output, or local environment files.
- Avoid adding dependencies unless they clearly reduce complexity or support a product requirement.

## Repository structure

```text
.
├── App.tsx
├── index.tsx
├── components/
│   ├── views/
│   └── *.tsx
├── lib/
├── services/
├── types.ts
├── database-schema.sql
├── schema.sql
├── vite.config.ts
└── *.md
```

## Branch workflow

1. Create a feature branch from the current mainline branch.
2. Make focused changes.
3. Run the relevant checks.
4. Commit with a clear message.
5. Open a pull request with summary and testing notes.

## Setup for contributors

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with Supabase and optional OpenRouter values. See `SETUP.md` and `ENVIRONMENT.md`.

## Coding conventions

- Use React functional components.
- Use TypeScript for component props, service payloads, and shared models.
- Keep imports at the top of the file.
- Do not wrap imports in `try/catch` blocks.
- Prefer small helper functions for transformation logic.
- Use descriptive component and variable names.
- Preserve existing visual language unless intentionally redesigning a module.

## Data and schema changes

When changing backend data shapes:

1. Update `database-schema.sql` if the production schema changes.
2. Update `BACKEND_SCHEMA.md` with table, column, trigger, or policy changes.
3. Update TypeScript interfaces in `types.ts` or related modules.
4. Update queries/mutations that consume the changed shape.
5. Document migration or backfill needs in the pull request.

## Environment changes

When adding or changing environment variables:

1. Update `.env.example`.
2. Update `ENVIRONMENT.md`.
3. Confirm the variable is safe to expose in browser code if it uses the `VITE_` prefix.
4. Never add private service keys to frontend environment variables.

## Testing expectations

At minimum, run:

```bash
npm run build
```

When applicable, also manually verify:

- Authentication and onboarding.
- Dashboard loading.
- Waste Tracking realtime board.
- AI classification or generation flows.
- Compliance role restrictions.
- Project list/map behavior.

## Pull request checklist

Include the following in each PR:

- Summary of user-facing changes.
- Summary of technical changes.
- Testing commands and results.
- Screenshots for perceptible UI changes.
- Notes for migrations, environment variables, or deployment changes.
- Known limitations or follow-up work.

## Documentation checklist

Update documentation when touching:

- Architecture or module boundaries: `ARCHITECTURE.md`
- Local setup: `SETUP.md`
- Environment variables: `ENVIRONMENT.md`
- Database schema: `BACKEND_SCHEMA.md`
- Deployment process: `DEPLOYMENT.md`
- Product behavior: `PRODUCT_DOCUMENTATION.md`
