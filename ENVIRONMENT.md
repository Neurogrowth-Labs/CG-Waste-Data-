# Environment Configuration

## Required variables

### `VITE_SUPABASE_URL`

Supabase project URL used by `lib/supabaseClient.ts`.

Example:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
```

Without this value, the app falls back to `https://example.supabase.co`, which is only suitable for local UI rendering and will not support real authentication or database operations.

### `VITE_SUPABASE_ANON_KEY`

Supabase anonymous public API key used by the browser client.

Example:

```bash
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Without this value, the app falls back to `missing-anon-key`, which is not usable for real Supabase requests.

## Optional variables

### `VITE_OPENROUTER_API_KEY`

OpenRouter API key used by `services/openRouterService.ts` for AI-backed text, JSON, and image-aware generation.

Example:

```bash
VITE_OPENROUTER_API_KEY=sk-or-v1-...
```

If this value is missing, AI calls that route through OpenRouter will fail with a configuration error or fallback response depending on the call path.

### `GEMINI_API_KEY`

The Vite configuration exposes this value as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` for compatibility with AI Studio-style generated code. The current OpenRouter service path does not require it for normal AI calls.

Example:

```bash
GEMINI_API_KEY=your-gemini-key
```

## Local file setup

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Then fill in real values:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENROUTER_API_KEY=optional-openrouter-key
```

## Vite variable behavior

Only variables prefixed with `VITE_` are automatically exposed to browser code through `import.meta.env`.

This project reads:

- `import.meta.env.VITE_SUPABASE_URL`
- `import.meta.env.VITE_SUPABASE_ANON_KEY`
- `import.meta.env.VITE_OPENROUTER_API_KEY`

The Vite config separately defines selected `process.env` compatibility values at build time.

## Security notes

- Supabase anon keys are public browser keys and must be protected by Row Level Security policies.
- Do not place service-role keys in Vite environment variables.
- Do not commit `.env.local` or any file containing real secrets.
- Rotate keys if they are accidentally exposed.
- Use hosting-provider secret management for deployed environments.

## Environment matrix

| Environment | Required values | Notes |
| --- | --- | --- |
| Local UI-only demo | None | App can render with fallbacks, but data/auth calls are not real |
| Local Supabase development | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Required for Auth, profile, projects, waste logs, and realtime |
| Local AI development | Supabase values plus `VITE_OPENROUTER_API_KEY` | Required for live AI calls |
| Production | Supabase values and optional AI key | Configure in hosting-provider environment settings |
