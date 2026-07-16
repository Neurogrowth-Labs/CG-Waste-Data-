# Backend Schema

## Overview

The application uses Supabase Auth, Postgres, and Realtime. The recommended setup script is `database-schema.sql`, which contains the most complete schema for users, projects, EDGE projects, notifications, waste logs, triggers, realtime publications, and Row Level Security.

`schema.sql` is a smaller prototype schema and should only be used for reference or very early demos.

## Extensions

The comprehensive schema enables UUID support:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Tables

### `public.users`

Stores application profile data linked to Supabase Auth users.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `UUID` | Primary key, references `auth.users(id)` |
| `email` | `TEXT` | User email |
| `full_name` | `TEXT` | Display/legal name |
| `organization` | `TEXT` | Organization name |
| `role` | `TEXT` | Example values: `manager`, `executive`, `auditor`, `hauler`, `contractor` |
| `jurisdiction` | `TEXT` | Regulatory jurisdiction |
| `standards` | `TEXT[]` | Selected standards, such as ISO or ESG reporting |
| `mfa_method` | `TEXT` | Preferred MFA method |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | Last update timestamp |

### `public.projects`

Stores construction project records.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `UUID` | Primary key |
| `name` | `TEXT` | Required project name |
| `location` | `TEXT` | Project location |
| `status` | `TEXT` | Defaults to `Planning` in comprehensive schema |
| `construction_phase` | `TEXT` | Project phase |
| `hazmat_status` | `TEXT` | Hazardous material status |
| `compliance_status` | `TEXT` | Compliance state |
| `owner_id` | `UUID` | References `public.users(id)` |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |

### `public.edge_projects`

Stores project-level records for Digital EDGE and design consulting workflows.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `UUID` | Primary key |
| `name` | `TEXT` | Required project name |
| `type` | `TEXT` | Project type |
| `budget` | `NUMERIC` | Budget value |
| `timeline` | `TEXT` | Timeline descriptor |
| `sustainability_target` | `TEXT` | Target certification or outcome |
| `owner_id` | `UUID` | References `public.users(id)` |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |

### `public.notifications`

Stores workflow, hazard, and system alerts.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `UUID` | Primary key |
| `title` | `TEXT` | Required notification title |
| `message` | `TEXT` | Notification body |
| `type` | `TEXT` | Notification category |
| `severity` | `TEXT` | Severity level |
| `is_read` | `BOOLEAN` | Defaults to `FALSE` |
| `user_id` | `UUID` | References `public.users(id)` |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |

### `public.waste_logs`

Stores manifests, material stream logs, logistics information, and audit notes.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `UUID` | Primary key |
| `project_id` | `UUID` | References `public.projects(id)` |
| `material_type` | `TEXT` | Updated material field |
| `material` | `TEXT` | Legacy/frontend material field |
| `weight_kg` | `NUMERIC` | Weight in kilograms |
| `weight` | `NUMERIC` | Weight in tons for frontend compatibility |
| `destination` | `TEXT` | Waste destination |
| `contractor` | `TEXT` | Contractor name |
| `hauler` | `TEXT` | Hauler name |
| `status` | `TEXT` | Defaults to `Pending` |
| `manifest_number` | `TEXT` | Auto-generated if missing |
| `type` | `TEXT` | Waste or manifest type |
| `notes` | `TEXT` | Freeform notes |
| `logged_by` | `UUID` | References `public.users(id)` |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |

## Triggers and functions

### `generate_manifest_number()`

Automatically assigns a manifest number when `waste_logs.manifest_number` is missing.

Format:

```text
MNF-YYMMDD-XXXX
```

### `sync_waste_fields()`

Keeps old and new frontend/backend field names compatible:

- Copies `material_type` to `material` or `material` to `material_type` when one is missing.
- Converts `weight_kg` to `weight` or `weight` to `weight_kg` when one is missing.
- Copies `contractor` to `hauler` or `hauler` to `contractor` when one is missing.

## Realtime

The comprehensive schema recreates the `supabase_realtime` publication and adds:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.waste_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
```

The frontend currently subscribes to `waste_logs` changes for the Waste Tracking logistics board.

## Row Level Security

The comprehensive schema enables RLS on:

- `public.users`
- `public.projects`
- `public.edge_projects`
- `public.notifications`
- `public.waste_logs`

It then creates broad authenticated-user policies for all tables. This is acceptable for a prototype but should be hardened before production.

## Production policy recommendations

Recommended policy improvements:

- Add `organization_id` or `tenant_id` to all business tables.
- Limit users to their tenant's rows.
- Limit profile writes to the owner or an administrator.
- Restrict compliance submissions to `admin` and `manager` roles.
- Restrict regulator access by jurisdiction.
- Add audit tables for official reports, verification events, and manifest status changes.
- Avoid using the service role key in browser code.

## Applying the schema

1. Open Supabase SQL editor.
2. Paste the contents of `database-schema.sql`.
3. Run the script.
4. Verify tables, triggers, publications, and policies.
5. Test Auth signup/login and profile lookup.
6. Insert a test `waste_logs` row and verify manifest number generation.
