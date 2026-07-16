# Architecture

## Overview

CG Waste Data is a Vite, React, and TypeScript single-page application for construction and demolition waste intelligence. It combines authenticated dashboards, project and manifest workflows, AI-assisted waste analysis, circular marketplace discovery, EDGE-oriented design consulting, compliance tooling, and realtime Supabase-backed operational views.

## Runtime architecture

```text
Browser
  |
  | React 19 SPA mounted by index.tsx
  v
App.tsx
  |
  |-- Supabase Auth session detection
  |-- Profile lookup from public.users
  |-- Main Layout navigation
  |-- TanStack Query cache/provider
  |
  +--> Feature modules in components/
  |
  +--> Supabase client in lib/supabaseClient.ts
  |
  +--> AI service wrappers in services/
```

## Frontend entry points

- `index.html` provides the root DOM element and static page shell.
- `index.tsx` creates the React root, configures `QueryClientProvider`, and mounts `App`.
- `App.tsx` owns authentication session state, profile loading, route-like view switching, realtime notification overlay, and the floating Live Assistant launcher.
- `components/Layout.tsx` provides authenticated navigation for Dashboard, Field Operations, Projects, Waste Tracking, Digital Twin, Intelligence, Design Consultant, Compliance Engine, Marketplace, Education Hub, and Settings.

## Feature module map

| Area | Primary files | Responsibility |
| --- | --- | --- |
| Authentication | `components/Auth.tsx`, `App.tsx` | Login, signup, onboarding, session handling, profile fallback |
| Landing | `components/views/LandingView.tsx` | Public marketing and access request experience |
| Dashboard | `components/Dashboard.tsx`, `lib/platformData.ts` | KPIs, material breakdowns, diversion metrics, manifest status summaries |
| Projects | `components/views/ProjectsView.tsx` | Project overview and map/list presentation |
| Waste Tracking | `App.tsx`, `components/Workflows.tsx` | Manifest creation and live logistics board backed by `waste_logs` |
| Field Operations | `components/FieldOperations.tsx` | Field capture, routing, demolition scan concepts, operational risk tooling |
| Intelligence | `components/Intelligence.tsx`, `services/geminiService.ts` | AI waste classification and structured analytics |
| Digital Twin | `components/DigitalTwin.tsx` | What-if simulation, risk radar, ESG opportunity analysis |
| Digital EDGE | `components/DigitalEDGE.tsx`, `types.ts` | EDGE project setup, material streams, BIM extraction, financial analysis |
| Compliance | `components/ComplianceEngine.tsx` | Regulatory health, reporting, permit workflows, role-gated actions |
| Marketplace | `components/Marketplace.tsx`, `lib/suppliers.ts` | Sustainable supplier discovery and logistics hub |
| Education | `components/EducationHub.tsx` | Training and green construction education |
| Creative Studio | `components/CreativeStudio.tsx`, `services/geminiService.ts` | AI media generation/editing UX |
| Settings | `components/Settings.tsx` | Profile, notifications, legal content, logout |
| Notifications | `components/RealtimeNotifications.tsx` | Toast-style realtime workflow and hazard alerts |

## State management

The application uses local React state for UI state and TanStack Query for server data. Query configuration is centralized in `index.tsx` with a five-minute stale time and disabled window-focus refetching.

Important query-backed areas include:

- Platform metrics from `lib/platformData.ts`.
- Waste manifest board data in `App.tsx`.
- Supabase-backed profile loading in `App.tsx`.

## Data layer

The data layer uses Supabase Auth, Postgres, and Realtime.

- `lib/supabaseClient.ts` creates the Supabase client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `database-schema.sql` is the recommended schema for full setup.
- `schema.sql` is a smaller prototype schema retained for reference.

Primary tables are:

- `users`
- `projects`
- `edge_projects`
- `notifications`
- `waste_logs`

Realtime publications are intended for:

- `projects`
- `waste_logs`
- `notifications`

## Authentication and authorization

Authentication uses Supabase Auth.

1. `App.tsx` calls `supabase.auth.getSession()` on startup.
2. If a session exists, the app loads the profile from `public.users`.
3. If no session exists, the user sees `LandingView` and can open `Auth`.
4. Auth state changes are handled through `supabase.auth.onAuthStateChange()`.

The frontend currently performs role checks for selected UX controls, such as Compliance Engine automated reporting. Production enforcement should be implemented in Supabase Row Level Security policies and server-side workflows.

## Realtime architecture

The Waste Tracking board subscribes to `public:waste_logs` changes. Inserts, updates, and deletes invalidate the `manifests` query so the UI refreshes from Supabase.

Notification and project realtime support are prepared in the comprehensive schema and can be expanded in the UI as the product matures.

## AI architecture

The AI service is implemented in `services/geminiService.ts` and delegates text generation to `services/openRouterService.ts`.

Key points:

- The service exposes Gemini-like model names and generation functions for UI compatibility.
- Text and JSON generation are routed to OpenRouter chat completions.
- Image-aware prompts can include base64 image data.
- Video generation currently returns a placeholder video response.
- AI features require `VITE_OPENROUTER_API_KEY` for live calls.

## Build architecture

Vite is configured by `vite.config.ts`.

- React plugin: `@vitejs/plugin-react`
- Dev server: `0.0.0.0:3000`
- Alias: `@` points to repository root
- Compatibility definitions expose `GEMINI_API_KEY` through `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

## Production hardening priorities

- Enforce tenant-aware RLS policies across all data tables.
- Move sensitive business logic and official submissions to server-side functions.
- Add unit and integration tests for metrics, classification, auth, and mutations.
- Split large frontend chunks with dynamic imports.
- Replace placeholder AI video generation with a production backend integration.
- Add audit tables for compliance actions and manifest verification.
