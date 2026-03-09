
-- Add nickname/display_name and registration_type columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS display_name text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS registration_type text DEFAULT 'self',
  ADD COLUMN IF NOT EXISTS registered_by_name text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS registered_by_relation text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS show_in_search boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_online_status boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_non_verified_views boolean DEFAULT false;
