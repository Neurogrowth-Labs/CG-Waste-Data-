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
-- 10. KYC / FACE RECOGNITION SECURITY BACKEND
-- Supports FaceOnLive Windows SDK integrations for identity proofing and gate access.
-- Store encrypted object references and hashes only; avoid persisting raw biometric media.
-- ==============================================================================
DO $$ BEGIN
  CREATE TYPE public.kyc_status AS ENUM ('pending', 'approved', 'manual_review', 'rejected', 'expired');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.kyc_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject_type TEXT NOT NULL DEFAULT 'user' CHECK (subject_type IN ('user', 'driver', 'contractor', 'supplier', 'staff')),
  legal_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'national_id', 'drivers_license', 'employee_badge')),
  document_number_hash TEXT NOT NULL,
  face_template_hash TEXT,
  face_template_storage_path TEXT,
  provider TEXT NOT NULL DEFAULT 'faceonlive_windows',
  provider_repository TEXT NOT NULL DEFAULT 'https://github.com/FaceOnLive/Face-Recognition-SDK-Windows.git',
  consent_captured_at TIMESTAMPTZ,
  consent_version TEXT NOT NULL DEFAULT 'kyc-biometric-v1',
  status public.kyc_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (document_number_hash)
);

CREATE TABLE IF NOT EXISTS public.kyc_verification_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kyc_profile_id UUID NOT NULL REFERENCES public.kyc_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'faceonlive_windows',
  match_score NUMERIC(5,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  liveness_score NUMERIC(5,2) NOT NULL CHECK (liveness_score >= 0 AND liveness_score <= 100),
  anti_spoofing_status TEXT NOT NULL,
  decision public.kyc_status NOT NULL,
  audit_id TEXT NOT NULL UNIQUE,
  audit_payload_hash TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kyc_profiles_user_status ON public.kyc_profiles(user_id, status);
CREATE INDEX IF NOT EXISTS idx_kyc_sessions_profile_created ON public.kyc_verification_sessions(kyc_profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kyc_sessions_decision ON public.kyc_verification_sessions(decision);

CREATE OR REPLACE FUNCTION sync_kyc_profile_status()
RETURNS trigger AS $$
BEGIN
  UPDATE public.kyc_profiles
  SET status = NEW.decision,
      face_template_hash = COALESCE(public.kyc_profiles.face_template_hash, NEW.audit_payload_hash),
      updated_at = NOW()
  WHERE id = NEW.kyc_profile_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_sync_kyc_profile_status ON public.kyc_verification_sessions;
CREATE TRIGGER trigger_sync_kyc_profile_status
  AFTER INSERT ON public.kyc_verification_sessions
  FOR EACH ROW EXECUTE PROCEDURE sync_kyc_profile_status();

ALTER PUBLICATION supabase_realtime ADD TABLE public.kyc_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kyc_verification_sessions;

ALTER TABLE public.kyc_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verification_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own KYC profile" ON public.kyc_profiles
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'manager', 'auditor', 'regulator')));
CREATE POLICY "Privileged users can manage KYC profiles" ON public.kyc_profiles
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'manager', 'auditor')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'manager', 'auditor')));
CREATE POLICY "Users can read their own KYC sessions" ON public.kyc_verification_sessions
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'manager', 'auditor', 'regulator')));
CREATE POLICY "Privileged users can create KYC sessions" ON public.kyc_verification_sessions
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'manager', 'auditor')));

-- ==============================================================================
-- 10. ORGANIZATION TENANCY (required by demolition geointelligence)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. DEMOLITION GEOINTELLIGENCE (WGS 84 / EPSG:4326 GeoJSON)
-- Device gateway credentials and CV model secrets are intentionally never stored here.
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS postgis;

DO $$ BEGIN
  CREATE TYPE public.device_type AS ENUM ('drone', 'ground_robot');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.device_connection_status AS ENUM ('disconnected', 'connecting', 'connected', 'streaming', 'detecting', 'connection_lost', 'reconnecting');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.detection_verification_status AS ENUM ('ai_detected', 'pending_verification', 'human_verified', 'rejected', 'unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.material_taxonomy (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE NULLS NOT DISTINCT (organization_id, name)
);

CREATE TABLE IF NOT EXISTS public.demolition_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  geometry JSONB NOT NULL CHECK (geometry->>'type' IN ('Polygon', 'MultiPolygon')),
  geography geography(Geometry, 4326) NOT NULL,
  area_square_meters NUMERIC NOT NULL CHECK (area_square_meters >= 0),
  estimated_waste_volume NUMERIC CHECK (estimated_waste_volume >= 0),
  estimated_recyclable_volume NUMERIC CHECK (estimated_recyclable_volume >= 0),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_demolition_areas_project ON public.demolition_areas(project_id, status);
CREATE INDEX IF NOT EXISTS idx_demolition_areas_geography ON public.demolition_areas USING GIST(geography);

CREATE TABLE IF NOT EXISTS public.field_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  demolition_area_id UUID REFERENCES public.demolition_areas(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  device_type public.device_type NOT NULL,
  adapter_type TEXT NOT NULL,
  connection_status public.device_connection_status NOT NULL DEFAULT 'disconnected',
  battery_percent NUMERIC CHECK (battery_percent BETWEEN 0 AND 100),
  last_telemetry_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_field_devices_project ON public.field_devices(project_id, connection_status);

CREATE TABLE IF NOT EXISTS public.device_telemetry (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.field_devices(id) ON DELETE CASCADE,
  event_id UUID NOT NULL,
  position geography(Point, 4326) NOT NULL,
  latitude NUMERIC NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude NUMERIC NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  altitude_meters NUMERIC,
  heading NUMERIC CHECK (heading >= 0 AND heading < 360),
  speed_kmh NUMERIC CHECK (speed_kmh >= 0),
  telemetry JSONB NOT NULL DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (device_id, event_id)
);
CREATE INDEX IF NOT EXISTS idx_device_telemetry_device_time ON public.device_telemetry(device_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_device_telemetry_position ON public.device_telemetry USING GIST(position);

CREATE TABLE IF NOT EXISTS public.material_detections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  demolition_area_id UUID REFERENCES public.demolition_areas(id) ON DELETE SET NULL,
  source_device_id UUID REFERENCES public.field_devices(id) ON DELETE SET NULL,
  material_taxonomy_id UUID REFERENCES public.material_taxonomy(id) ON DELETE SET NULL,
  material_type TEXT NOT NULL,
  material_category TEXT,
  confidence_score NUMERIC NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
  geometry geography(Geometry, 4326) NOT NULL,
  latitude NUMERIC NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude NUMERIC NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  image_video_reference TEXT,
  quantity_estimate NUMERIC CHECK (quantity_estimate >= 0),
  unit TEXT,
  verification_status public.detection_verification_status NOT NULL DEFAULT 'ai_detected',
  processing_status TEXT NOT NULL DEFAULT 'completed',
  source_event_id UUID NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_device_id, source_event_id)
);
CREATE INDEX IF NOT EXISTS idx_material_detections_project_time ON public.material_detections(project_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_material_detections_geometry ON public.material_detections USING GIST(geometry);

CREATE TABLE IF NOT EXISTS public.detection_verification_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  detection_id UUID NOT NULL REFERENCES public.material_detections(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  previous_value JSONB NOT NULL,
  new_value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.current_user_can_manage_project(target_project_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.projects p WHERE p.id = target_project_id AND (p.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'manager', 'site_manager'))));
$$;

ALTER TABLE public.material_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demolition_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detection_verification_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users read demolition taxonomy" ON public.material_taxonomy FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers manage demolition taxonomy" ON public.material_taxonomy FOR ALL USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'manager', 'site_manager'))) WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'manager', 'site_manager')));
CREATE POLICY "Authorized users read demolition areas" ON public.demolition_areas FOR SELECT USING (public.current_user_can_manage_project(project_id));
CREATE POLICY "Authorized users manage demolition areas" ON public.demolition_areas FOR ALL USING (public.current_user_can_manage_project(project_id)) WITH CHECK (public.current_user_can_manage_project(project_id));
CREATE POLICY "Authorized users read field devices" ON public.field_devices FOR SELECT USING (public.current_user_can_manage_project(project_id));
CREATE POLICY "Authorized users manage field devices" ON public.field_devices FOR ALL USING (public.current_user_can_manage_project(project_id)) WITH CHECK (public.current_user_can_manage_project(project_id));
CREATE POLICY "Authorized users read telemetry" ON public.device_telemetry FOR SELECT USING (public.current_user_can_manage_project(project_id));
CREATE POLICY "Authorized users read detections" ON public.material_detections FOR SELECT USING (public.current_user_can_manage_project(project_id));
CREATE POLICY "Authorized users manage detections" ON public.material_detections FOR ALL USING (public.current_user_can_manage_project(project_id)) WITH CHECK (public.current_user_can_manage_project(project_id));
CREATE POLICY "Authorized users read verification audit" ON public.detection_verification_audit FOR SELECT USING (EXISTS (SELECT 1 FROM public.material_detections d WHERE d.id = detection_id AND public.current_user_can_manage_project(d.project_id)));

ALTER PUBLICATION supabase_realtime ADD TABLE public.demolition_areas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.field_devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.device_telemetry;
ALTER PUBLICATION supabase_realtime ADD TABLE public.material_detections;

-- Keep derived spatial columns and timestamps canonical even when integrations submit GeoJSON.
CREATE OR REPLACE FUNCTION public.sync_demolition_area_geography()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.geography := ST_SetSRID(ST_GeomFromGeoJSON(NEW.geometry::text), 4326)::geography;
  NEW.area_square_meters := ST_Area(NEW.geography);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trigger_sync_demolition_area_geography ON public.demolition_areas;
CREATE TRIGGER trigger_sync_demolition_area_geography BEFORE INSERT OR UPDATE OF geometry ON public.demolition_areas FOR EACH ROW EXECUTE PROCEDURE public.sync_demolition_area_geography();

CREATE OR REPLACE FUNCTION public.sync_field_device_timestamp()
RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at := NOW(); RETURN NEW; END; $$;
DROP TRIGGER IF EXISTS trigger_sync_field_device_timestamp ON public.field_devices;
CREATE TRIGGER trigger_sync_field_device_timestamp BEFORE UPDATE ON public.field_devices FOR EACH ROW EXECUTE PROCEDURE public.sync_field_device_timestamp();
