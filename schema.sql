-- Supabase Schema for DigitalEDGE App

-- 1. Users Table (Stores user profiles linked to Firebase Auth UID)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Firebase UID
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
    owner_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
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
    material_type TEXT,
    weight_kg NUMERIC,
    destination TEXT,
    contractor TEXT,
    notes TEXT,
    logged_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    source TEXT,
    evidence_status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime for the tables
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.waste_logs;

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_logs ENABLE ROW LEVEL SECURITY;

-- Create Policies (Example: Users can read/write their own data)
-- For a production app, you might want more complex policies.

-- Users policies
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid()::text = id);

CREATE POLICY "Users can insert their own profile" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid()::text = id);

-- Projects policies
-- Note: Since we are using Firebase Auth, Supabase's native auth.uid() might not match if you aren't passing a custom JWT. 
-- Assuming you connected Supabase with an Anon Key and bypass RLS or use a custom integration, you might need to adjust these. 
-- If you are using anon key + Firebase Auth without custom JWTs, you may need to disable RLS or write custom policies.
-- If disabling RLS for prototyping:
-- alter table public.users disable row level security;
-- alter table public.projects disable row level security;
-- alter table public.waste_logs disable row level security;
