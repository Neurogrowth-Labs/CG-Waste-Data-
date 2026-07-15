-- Supabase Schema for CG Data Waste App

-- 1. Users Table (Stores user profiles linked to Supabase Auth UID)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id), -- Supabase Auth UID
    full_name TEXT,
    email TEXT,
    organization TEXT,
    role TEXT DEFAULT 'manager',
    jurisdiction TEXT,
    standards TEXT[],
    mfa_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    construction_phase TEXT,
    status TEXT DEFAULT 'Active',
    compliance_status TEXT,
    hazmat_status TEXT DEFAULT 'Clear',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Waste Logs Table (Combines Manifests, Streams, and Audit Logs)
CREATE TABLE IF NOT EXISTS public.waste_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    material TEXT,
    weight NUMERIC,
    hauler TEXT,
    destination TEXT,
    status TEXT DEFAULT 'Pending',
    manifest_number TEXT,
    type TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: The frontend expects 'material', 'weight', 'hauler', 'destination', 'status', 'manifest_number', 'type'
-- in the waste_logs table (see TrackingView and DigitalEDGE). This table now correctly reflects those columns.

-- Enable Realtime for the tables
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.waste_logs;

-- For an initial prototype, we disable RLS to prevent "loading forever" or permission denied errors.
-- Once everything works, you can enable RLS and add proper policies.
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_logs DISABLE ROW LEVEL SECURITY;
