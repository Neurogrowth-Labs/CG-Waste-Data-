-- Comprehensive App Schema (Copy & Paste this entirely into the Supabase SQL Editor)
-- Designed for full role-based authentication, real-time data sync, and database management.

-- Enable UUID extension natively
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. USERS TABLE (Linked with Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  organization TEXT,
  role TEXT, -- e.g., 'manager', 'executive', 'auditor', 'hauler', 'contractor'
  jurisdiction TEXT,
  standards TEXT[],
  mfa_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. PROJECTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'Planning',
  construction_phase TEXT,
  hazmat_status TEXT,
  compliance_status TEXT,
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. DIGITAL EDGE PROJECTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.edge_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  budget NUMERIC,
  timeline TEXT,
  sustainability_target TEXT,
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. NOTIFICATIONS TABLE (For workflow and hazard alerts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT,
  severity TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. WASTE LOGS & MANIFESTS TABLE
-- Combines logistics, lifecycle streams, and material auditing variables
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.waste_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,

  -- Material Classifications (Supports both legacy/new frontend endpoints)
  material_type TEXT,
  material TEXT,
  weight_kg NUMERIC,
  weight NUMERIC,

  -- Contractors & Logistics
  destination TEXT,
  contractor TEXT,
  hauler TEXT,

  -- Track & Trace
  status TEXT DEFAULT 'Pending',
  manifest_number TEXT,
  type TEXT,
  notes TEXT,

  logged_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. AUTOMATION TRIGGERS
-- Auto-generate official Manifest IDs when a waste log is created without one
-- ==============================================================================
CREATE OR REPLACE FUNCTION generate_manifest_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.manifest_number IS NULL THEN
    -- Creates format: MNF-YYMMDD-XXXX
    NEW.manifest_number := 'MNF-' || to_char(NOW(), 'YYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::text, 1, 4));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_manifest_number ON public.waste_logs;
CREATE TRIGGER trigger_manifest_number
  BEFORE INSERT ON public.waste_logs
  FOR EACH ROW EXECUTE PROCEDURE generate_manifest_number();

-- Synchronization Trigger: Ensure legacy UI variable names match updated fields
CREATE OR REPLACE FUNCTION sync_waste_fields()
RETURNS trigger AS $$
BEGIN
  -- Sync material terminology
  IF NEW.material IS NULL AND NEW.material_type IS NOT NULL THEN
    NEW.material := NEW.material_type;
  ELSIF NEW.material_type IS NULL AND NEW.material IS NOT NULL THEN
    NEW.material_type := NEW.material;
  END IF;

  -- Sync weight calculations (frontend uses either 'weight_kg' or 'weight' as tons)
  IF NEW.weight IS NULL AND NEW.weight_kg IS NOT NULL THEN
    NEW.weight := NEW.weight_kg / 1000;
  ELSIF NEW.weight_kg IS NULL AND NEW.weight IS NOT NULL THEN
    NEW.weight_kg := NEW.weight * 1000;
  END IF;

  -- Sync contractors names / hauler names
  IF NEW.hauler IS NULL AND NEW.contractor IS NOT NULL THEN
    NEW.hauler := NEW.contractor;
  ELSIF NEW.contractor IS NULL AND NEW.hauler IS NOT NULL THEN
    NEW.contractor := NEW.hauler;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_waste_fields ON public.waste_logs;
CREATE TRIGGER trigger_sync_waste_fields
  BEFORE INSERT OR UPDATE ON public.waste_logs
  FOR EACH ROW EXECUTE PROCEDURE sync_waste_fields();

-- ==============================================================================
-- 7. REALTIME DATABASE CONFIGURATION
-- Forces PostgreSQL to push changes through WebSockets instantly
-- ==============================================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.waste_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures data operates cleanly based on the logged-in User ID (Auth UID)
-- ==============================================================================
-- Explicitly enable RLS across all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edge_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_logs ENABLE ROW LEVEL SECURITY;

-- Production Policy Grants (Allows logged-in users to access and construct data)
-- For strict permissions down the road, `auth.uid() IS NOT NULL` can be scaled to `role = 'manager'`
CREATE POLICY "Enable all for authenticated users" ON public.users FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for authenticated projects" ON public.projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for authenticated edge" ON public.edge_projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for authenticated notifications" ON public.notifications FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for authenticated logs" ON public.waste_logs FOR ALL USING (auth.uid() IS NOT NULL);

-- ==============================================================================
-- 9. USER SETTINGS TABLE
-- Real-time user preferences shared across all signed-in sessions/devices.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  notification_preferences JSONB NOT NULL DEFAULT '{"compliance_alerts": true, "manifest_updates": true, "weekly_reports": true, "marketing_updates": false}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_settings;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own settings" ON public.user_settings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 10. ORGANIZATIONS, MEMBERSHIP, AUDIT, TELEMETRY, AND BIOMETRIC OPERATIONS
-- Production foundations for tenant isolation, role-connected workflows, realtime
-- vehicle/scanner updates, and defensible audit trails.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'manager',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (organization_id, user_id)
);

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE public.waste_logs ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  previous_value JSONB,
  new_value JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vehicle_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  waste_log_id UUID REFERENCES public.waste_logs(id) ON DELETE CASCADE,
  vehicle_id TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  speed_kmh NUMERIC,
  heading NUMERIC,
  event_type TEXT DEFAULT 'position',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scan_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  waste_log_id UUID REFERENCES public.waste_logs(id) ON DELETE SET NULL,
  scanner_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  result JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.biometric_consent_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  subject_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  consent_status TEXT NOT NULL DEFAULT 'granted',
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.biometric_verification_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  subject_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  gate_device_id TEXT NOT NULL,
  decision TEXT NOT NULL,
  confidence NUMERIC,
  audit_seal TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.organizations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.organization_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicle_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scan_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.biometric_verification_events;

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_verification_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read their organizations" ON public.organizations
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = id AND m.user_id = auth.uid()));
CREATE POLICY "Members can read organization membership" ON public.organization_members
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = organization_id AND m.user_id = auth.uid()));
CREATE POLICY "Members can read audit events" ON public.audit_events
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = audit_events.organization_id AND m.user_id = auth.uid()));
CREATE POLICY "Members can read vehicle locations" ON public.vehicle_locations
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = vehicle_locations.organization_id AND m.user_id = auth.uid()));
CREATE POLICY "Members can manage scan sessions" ON public.scan_sessions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = scan_sessions.organization_id AND m.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = scan_sessions.organization_id AND m.user_id = auth.uid()));
CREATE POLICY "Users can read their biometric consent" ON public.biometric_consent_records
  FOR SELECT USING (subject_user_id = auth.uid());
CREATE POLICY "Members can read biometric verification events" ON public.biometric_verification_events
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.organization_members m WHERE m.organization_id = biometric_verification_events.organization_id AND m.user_id = auth.uid()));
