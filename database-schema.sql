-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Maps to Firebase Auth UID)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL PRIMARY KEY, -- Maps to Firebase Auth UID
  email TEXT,
  full_name TEXT,
  organization TEXT,
  role TEXT,
  jurisdiction TEXT,
  standards TEXT[],
  mfa_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'Planning',
  construction_phase TEXT,
  hazmat_status TEXT,
  compliance_status TEXT,
  owner_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Digital EDGE Projects Table
CREATE TABLE IF NOT EXISTS public.edge_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  budget NUMERIC,
  timeline TEXT,
  sustainability_target TEXT,
  owner_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Notifications Table (For Realtime Streams)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT,
  severity TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Waste Tracking Logs Table
CREATE TABLE IF NOT EXISTS public.waste_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  material_type TEXT,
  weight_kg NUMERIC,
  destination TEXT,
  contractor TEXT,
  notes TEXT,
  logged_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Realtime publication for Notifications & Projects
-- Go to Supabase Dashboard -> Database -> Replication and enable these if needed.
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;

-- Set up Row Level Security (RLS) policies [Optional/Basic configuration]
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edge_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_logs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read and insert (Development permissive policies)
CREATE POLICY "Enable read access for all auth users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Enable update for users based on id" ON public.users FOR ALL USING (true);

CREATE POLICY "Enable all for projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Enable all for edge_projects" ON public.edge_projects FOR ALL USING (true);
CREATE POLICY "Enable all for notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Enable all for waste_logs" ON public.waste_logs FOR ALL USING (true);
