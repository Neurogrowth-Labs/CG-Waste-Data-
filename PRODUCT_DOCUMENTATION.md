# CG Waste Data Platform Product Documentation

## 1. Product overview

CG Waste Data is a React and Supabase-powered intelligence platform for construction, demolition, and green-building waste operations. The product centralizes project setup, waste stream classification, manifest creation, live logistics, compliance reporting, circular materials sourcing, EDGE-focused design consulting, education, and AI-assisted decision support in one web application.

The platform is designed for organizations that need to reduce landfill disposal, improve material recovery, document audit evidence, coordinate haulers and recyclers, and align construction waste operations with environmental regulations and green-building certification workflows.

## 2. Target users and stakeholder personas

The application supports a multi-stakeholder operating model:

- **Site managers and field teams** capture site conditions, classify waste, create manifests, and monitor operational risks.
- **Project managers** oversee project profiles, waste diversion, compliance scores, hazardous material status, and active manifests.
- **Executives** monitor portfolio-level performance, ESG outcomes, BIM-linked design intelligence, and organizational impact.
- **Transporters and haulers** coordinate dispatches, route optimization, job confirmations, and compliance records.
- **Recyclers and processors** manage intake, contamination review, recovered material pricing, and marketplace matches.
- **Regulators and auditors** review regulatory health, automated reporting, permit workflows, and enforcement signals.
- **Investors and asset owners** inspect material lifecycle traceability, ROI indicators, audit trails, and circular value recovery.
- **Design consultants** use EDGE-oriented workflows to evaluate construction material streams, BIM quantities, circular strategies, and financial benefits.

## 3. Product goals

The product is organized around six core outcomes:

1. **Digitize waste operations** by converting manual construction waste tracking into structured projects, manifests, waste logs, and dashboards.
2. **Increase diversion and circularity** by classifying waste streams and recommending reuse, recycling, and marketplace pathways.
3. **Improve compliance confidence** through regulatory health checks, permit workflows, reporting controls, and role-based submission restrictions.
4. **Connect ecosystem participants** across site teams, transporters, recyclers, suppliers, regulators, and investors.
5. **Support green-building design** through EDGE-style material modeling, BIM quantity upload workflows, and financial impact analysis.
6. **Add AI decision support** for classification, diagnostics, analytics, creative generation, and live assistant interactions.

## 4. Technology stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19, TypeScript, Vite | Single-page web application and development tooling |
| Styling | Tailwind-style utility classes | Responsive dashboard and workflow UI |
| Data fetching | TanStack React Query | Cached Supabase queries and dashboard metrics |
| Backend/data | Supabase Auth, Postgres, Realtime | Authentication, profile data, projects, waste logs, notifications, realtime updates |
| AI services | OpenRouter-compatible service wrapper | Text, JSON, and image-aware generation used by platform AI features |
| Maps/geospatial | Leaflet and React Leaflet | Project and logistics map experiences |
| Charts | Recharts | Dashboard and analytics visualizations |
| Icons | Lucide React | Product iconography |

## 5. Application navigation

Authenticated users access the main platform through a shared layout with the following product areas:

- **Dashboard**: role-aware command center for KPIs, waste totals, diversion, charts, and operational summaries.
- **Field Operations**: mobile-oriented tools for site capture, routing, demolition scan concepts, and field workflows.
- **Projects**: project overview in list and map modes.
- **Waste Tracking**: digital manifest wizard and live logistics board.
- **Digital Twin**: what-if simulator, strategic radar, risk alerts, and decision intelligence.
- **Intelligence**: AI waste analytics engine for classification and diagnostics.
- **Design Consultant**: Digital EDGE project setup, material strategy, BIM quantity extraction, and financial analysis.
- **Compliance Engine**: regulatory status, reports, permit workflows, and restricted automated submissions.
- **Marketplace**: sustainable supplier database and logistics integration hub.
- **Education Hub**: training content, green construction standards, and sustainability performance education.
- **Settings**: user profile, notifications, policies, terms, and logout controls.

Unauthenticated visitors see the public landing page and can request access to the authentication flow.

## 6. Authentication and onboarding

The authentication experience supports both login and signup patterns. Signup is structured as a guided onboarding workflow:

1. **Identity**: full legal name, work email, and password capture.
2. **Organization**: organization name and role selection.
3. **Compliance**: jurisdiction and standards selection, including ISO 14001, ISO 9001, ISO 27001, and ESG reporting.
4. **Security**: security hardening and MFA preference capture.

Supabase Auth manages sessions. After a session is detected, the application loads the user's profile from the `users` table and maps profile fields such as full name, role, organization, jurisdiction, and standards into the local user model. If profile retrieval fails, the app falls back to an offline-safe user state.

## 7. Core product modules

### 7.1 Landing page

The landing page introduces the platform as an intelligence layer for construction waste. It positions five major solution pillars:

- CG Waste Intelligence Cloud
- C&D Waste Digital Twin Monitoring
- Green Compliance Management Suite
- Construction Waste Marketplace
- Edge Building Design Consultancy

It also communicates the platform's value for tracking, classifying, optimizing, and preparing for green-building certification programs such as Green Star and BREEAM.

### 7.2 Dashboard

The dashboard is the authenticated command center. It uses platform metrics derived from waste logs to present operational performance, including total waste, diverted waste, diversion rate, active manifests, in-transit manifests, verified logs, rejected logs, and material breakdowns.

The dashboard is designed to support role-aware views and executive summaries while retaining operational visibility for project managers and field users.

### 7.3 Projects

The Projects module provides an overview of construction projects and supports list and map modes. Project records include name, location, status, construction phase, hazardous material status, compliance status, ownership, and creation metadata.

This module anchors the platform's downstream workflows because waste logs can be associated with a project.

### 7.4 Waste Tracking

Waste Tracking provides the core manifest and logistics workflow. It includes:

- A **New Waste Manifest** workflow for capturing waste movement details.
- A **Live Logistics Board** that queries recent `waste_logs` records.
- Realtime refresh behavior using Supabase Postgres change subscriptions.
- Manifest status display for pending, in-transit, verified, and rejected movements.
- Material, weight, hauler, destination, creation time, and manifest number visibility.

The database can auto-generate manifest numbers in the format `MNF-YYMMDD-XXXX` when new waste logs do not provide one.

### 7.5 Field Operations

Field Operations focuses on site-level execution. It includes concepts for:

- Waste pile capture and classification.
- Multi-pathway routing.
- Live topographical demolition scans.
- Plan-versus-actual impact review.
- Site generation logs.
- Live waste command dashboards.
- Risk engine feedback for field decisions.

This area is intended for mobile or tablet use by teams in active construction and demolition environments.

### 7.6 Intelligence

The Intelligence module exposes the AI Waste Analytics Engine. Its primary purpose is to analyze user-provided material descriptions and classify them into the platform's waste taxonomy.

The classifier uses the official waste class list and returns structured waste stream outputs that can include category, type, subtype, quantity, hazard level, recyclability score, carbon impact, reuse potential, and recommended disposal or redirection pathway.

### 7.7 Digital Twin

The Digital Twin module provides decision intelligence experiences including:

- What-if simulation setup.
- Baseline and parameter selection.
- Simulation readiness visualization.
- Strategic radar and risk alerts.
- Immediate threat detection.
- ESG opportunity identification.

It is intended to help teams explore operational and strategic outcomes before changing field, logistics, or procurement plans.

### 7.8 Digital EDGE / Design Consultant

The Design Consultant module focuses on green-building and EDGE-aligned material strategy. It supports:

- EDGE project setup.
- Project target levels such as Certified, Advanced, and Zero Carbon.
- Material stream modeling for concrete, steel, timber, glass, plastics, brick, excavation, and hazardous streams.
- Baseline versus improved quantity comparison.
- Disposal method and recovery percentage tracking.
- Evidence status management.
- BIM quantity upload and extraction workflows.
- Financial estimates such as potential revenue, avoided cost, and net benefit.

This module is especially relevant to design teams and consultants who need to reduce construction waste early in the project lifecycle.

### 7.9 Compliance Engine

The Compliance Engine gives users a regulatory health and reporting workspace. It includes:

- Regulatory health scorecards for NEMA, DFFE waste regulations, and local municipal bylaws.
- Active permit workflow cards.
- Automated report generation controls.
- Role-based access restrictions for sensitive reporting functions.
- A live API integration concept for regulatory submission workflows.

Automated NEMA reporting controls are restricted to users with `admin` or `manager` roles.

### 7.10 Marketplace

The Marketplace module contains a global sustainable materials supplier database and logistics integration hub. Supplier records include company name, category, material class, region, country, website, scale, specialty, contact details, certifications, carbon rating, and pricing index.

The marketplace supports circular procurement by helping teams find lower-carbon, bio-based, recycled, certified, or specialist material suppliers.

### 7.11 Education Hub

The Education Hub provides learning and awareness content. Example areas include:

- African Green Construction Standards 2026.
- Designing for Deconstruction.
- IoT Waste Tracking Basics.
- Global Circular Networks.
- City-level sustainability performance.

This module supports user enablement, internal training, and broader sustainability literacy.

### 7.12 Creative Studio

Creative Studio exposes AI-assisted media generation and editing workflows. It supports:

- Video generation mode.
- Image generation mode.
- Image editing mode.
- Prompt input.
- Optional source image upload.
- Aspect ratio and image size controls.

The current service implementation routes AI text and image-aware generation through an OpenRouter-backed wrapper and uses placeholder behavior for video generation when a native video backend is not available.

### 7.13 Live Assistant and notifications

Authenticated users can open a floating Live Assistant from the main layout. The application also includes realtime toast-style notifications for workflow and hazard alerts.

Notifications are backed by the `notifications` table and can be enabled for realtime database updates through Supabase publications.

### 7.14 Settings

Settings provides user-facing controls for:

- Profile settings.
- Notification preferences.
- Privacy policy.
- Terms of service.
- Logout.
- Profile refresh after update.

## 8. Waste taxonomy

The platform defines 19 top-level waste classes:

1. Municipal Solid Waste
2. Construction & Demolition Waste
3. Industrial Waste
4. Hazardous Waste
5. Electronic Waste
6. Organic / Biodegradable Waste
7. Recyclable Waste
8. Non-Recyclable Waste
9. Inert Waste
10. Liquid Waste
11. Gaseous Waste
12. Medical / Healthcare Waste
13. Agricultural Waste
14. Mining & Extractive Waste
15. Radioactive Waste
16. Packaging Waste
17. Special / Bulky Waste
18. Digital / Data Waste
19. Demolition-Specific Waste Streams

Each class contains subtypes that help AI classification, material routing, carbon estimation, and compliance review.

## 9. Data model

### 9.1 Primary tables

The recommended comprehensive Supabase schema defines these primary tables:

- **`users`**: profile records linked to Supabase Auth users.
- **`projects`**: construction project records.
- **`edge_projects`**: design consultant and EDGE-focused project records.
- **`notifications`**: workflow, hazard, and system alerts.
- **`waste_logs`**: waste manifests, logistics records, and material audit logs.

### 9.2 Key waste log fields

`waste_logs` stores the operational data used by tracking, dashboards, and realtime boards:

- `project_id`
- `material_type`
- `material`
- `weight_kg`
- `weight`
- `destination`
- `contractor`
- `hauler`
- `status`
- `manifest_number`
- `type`
- `notes`
- `logged_by`
- `created_at`

Database triggers synchronize legacy and updated field names. For example, `material` and `material_type` are mirrored, `weight` and `weight_kg` are converted, and `hauler` and `contractor` are synchronized.

### 9.3 Realtime

The comprehensive schema recreates the `supabase_realtime` publication and adds:

- `projects`
- `waste_logs`
- `notifications`

The frontend subscribes to `waste_logs` changes so the logistics board updates after inserts, updates, or deletes.

### 9.4 Security model

The comprehensive schema enables Row Level Security for users, projects, edge projects, notifications, and waste logs, then grants access to authenticated users. This is suitable for a prototype or controlled environment but should be tightened before production multi-tenant rollout.

Recommended production improvements include:

- Restricting users to their own organization or tenant.
- Separating read/write policies by role.
- Limiting regulator and auditor access to authorized jurisdictions.
- Requiring manager or admin role for official submissions.
- Auditing all report generation and manifest verification actions.

## 10. Environment configuration

Create a local `.env.local` file using `.env.example` as a guide:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENROUTER_API_KEY=optional-openrouter-key
```

The Vite configuration also exposes `GEMINI_API_KEY` through `process.env.API_KEY` and `process.env.GEMINI_API_KEY` for compatibility with generated AI Studio patterns. The current AI service code expects `VITE_OPENROUTER_API_KEY` for OpenRouter calls.

## 11. Local development

### 11.1 Prerequisites

- Node.js
- npm
- A Supabase project if testing authentication, database persistence, realtime boards, or profile flows
- Optional OpenRouter API key for AI features

### 11.2 Install dependencies

```bash
npm install
```

### 11.3 Run the development server

```bash
npm run dev
```

The Vite server is configured for port `3000` and host `0.0.0.0`.

### 11.4 Build for production

```bash
npm run build
```

### 11.5 Preview the production build

```bash
npm run preview
```

## 12. Setup checklist for a new deployment

1. Create or select a Supabase project.
2. Run `database-schema.sql` in the Supabase SQL editor.
3. Confirm Supabase Auth is enabled.
4. Configure authentication providers, including Google OAuth if required.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the frontend environment.
6. Add `VITE_OPENROUTER_API_KEY` if AI features should be live.
7. Install dependencies with `npm install`.
8. Run `npm run build` to validate the production bundle.
9. Deploy the Vite application to the chosen hosting platform.
10. Validate login, profile load, project read/write, waste manifest creation, realtime updates, and AI classification.

## 13. AI capabilities

The AI service layer provides a compatibility wrapper with methods that look similar to Gemini-style generation calls while internally routing text generation through OpenRouter.

Current AI-backed or AI-oriented capabilities include:

- Waste material classification from free-text descriptions.
- Structured JSON output for waste stream analysis.
- Recyclability and hazard assessment guidance.
- Suggested reuse, recycling, or disposal pathway recommendations.
- Image-aware prompting when base64 image data is provided.
- Creative image generation and editing workflows.
- Placeholder video generation behavior.

If the OpenRouter key is missing, AI service calls throw a configuration error or return a fallback message depending on the calling wrapper path.

## 14. Key workflows

### 14.1 New user onboarding

1. Visitor opens the landing page.
2. Visitor requests access.
3. User logs in or completes signup.
4. Supabase creates or authenticates the session.
5. App fetches the profile from `users`.
6. Authenticated layout loads the dashboard.

### 14.2 Waste manifest tracking

1. User opens Waste Tracking.
2. User creates a new manifest.
3. A `waste_logs` row stores material, weight, hauler, destination, and status.
4. Database trigger fills missing manifest number and synchronized fields.
5. Supabase realtime change invalidates the manifests query.
6. Live Logistics Board refreshes with the latest records.

### 14.3 AI waste classification

1. User enters a waste description.
2. AI prompt includes the platform waste class taxonomy.
3. Model returns structured waste stream JSON.
4. UI can present material class, subtype, quantity, hazard level, recyclability, carbon impact, reuse potential, and recommended pathway.

### 14.4 Compliance reporting

1. User opens Compliance Engine.
2. User reviews regulatory health and active permit workflows.
3. User switches to automated reports.
4. The application checks whether the user's role is `admin` or `manager`.
5. Unauthorized users see an access restriction overlay.
6. Authorized users can proceed with reporting workflows.

### 14.5 EDGE material strategy

1. User sets up an EDGE project.
2. User models material streams or uploads BIM quantity data.
3. Platform compares baseline and improved quantities.
4. Disposal method, recovery percentage, and evidence status are tracked.
5. Financial cards estimate revenue, avoided cost, and net benefit.
6. Outputs support design decisions and certification evidence preparation.

## 15. Operational metrics

The platform metrics layer normalizes recent waste logs into:

- Total waste.
- Diverted waste.
- Diversion rate.
- Active manifests.
- In-transit count.
- Verified count.
- Rejected count.
- Material breakdown by weight.

A log is counted as diverted when its status indicates verified, recycled, reused, or diverted, or when the material is commonly divertible, such as concrete, metal, steel, wood, timber, glass, or brick.

## 16. Known implementation notes

- The repository contains both `schema.sql` and `database-schema.sql`; `database-schema.sql` is the more comprehensive schema and includes users, projects, EDGE projects, notifications, waste logs, triggers, realtime configuration, and RLS policies.
- Some views in `components/views` appear to represent richer persona demos that are not all directly mounted in the primary navigation.
- Video generation currently returns a placeholder video URL rather than calling a production video model endpoint.
- The Supabase client uses safe fallback values when environment variables are absent, but real authentication and persistence require valid Supabase configuration.
- The current RLS policies are broad and should be hardened for production tenancy and regulatory-grade access control.

## 17. Recommended product roadmap

### Near term

- Add automated tests for waste classification parsing, metric normalization, and manifest creation.
- Add form validation and user feedback for all write workflows.
- Connect project creation and manifest creation to production Supabase mutations where demo-only flows remain.
- Add organization-level tenancy to the database.
- Add robust loading, empty, and error states across all query-backed views.

### Medium term

- Implement strict role-based policies in Supabase.
- Add full audit logs for compliance report generation and manifest verification.
- Replace placeholder video generation with a production media generation provider.
- Add document export for manifests, diversion reports, and compliance evidence packs.
- Add geospatial route optimization and hauler dispatch integrations.

### Long term

- Add regulator portals with jurisdiction-scoped review queues.
- Add carbon accounting integrations and verified EPD data sources.
- Add BIM platform integrations for Autodesk/Revit workflows.
- Add marketplace transaction workflows, payment hooks, and supplier verification.
- Add multi-region regulatory frameworks beyond the initial NEMA, DFFE, municipal bylaw, Green Star, BREEAM, and EDGE-oriented concepts.

## 18. Glossary

- **C&D waste**: Construction and demolition waste.
- **Diversion rate**: Percentage of waste diverted from landfill through reuse, recycling, or recovery.
- **EDGE**: Excellence in Design for Greater Efficiencies, a green-building certification system.
- **Manifest**: A structured record that tracks waste material movement from source to destination.
- **MRF**: Material recovery facility.
- **NEMA**: National Environmental Management Act.
- **Realtime**: Supabase Postgres change events pushed to the frontend over WebSockets.
- **RLS**: Row Level Security in Postgres/Supabase.
