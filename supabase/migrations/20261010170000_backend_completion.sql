-- PureNikah backend completion: missing fields, privacy-safe discovery,
-- verification, photos, hidden profiles, testimonials, and storage policies.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS is_married BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_photo BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_state ON public.profiles(state);
CREATE INDEX IF NOT EXISTS idx_profiles_discovery ON public.profiles(profile_completed, show_in_search, is_banned, is_married);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    first_name,
    gender,
    registration_type,
    registered_by_name,
    registered_by_relation
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'gender', ''),
    COALESCE(NEW.raw_user_meta_data->>'registration_type', 'self'),
    NULLIF(NEW.raw_user_meta_data->>'registered_by_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'registered_by_relation', '')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    gender = EXCLUDED.gender,
    registration_type = EXCLUDED.registration_type,
    registered_by_name = EXCLUDED.registered_by_name,
    registered_by_relation = EXCLUDED.registered_by_relation;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true)
AS
SELECT
  id,
  user_id,
  first_name,
  last_name,
  date_of_birth,
  gender,
  height,
  city,
  state,
  country,
  marital_status,
  bio,
  sect,
  religious_practice,
  education,
  profession,
  languages,
  caste,
  preferred_age_min,
  preferred_age_max,
  willing_to_relocate,
  is_verified,
  in_person_verified,
  photo_privacy,
  has_photo,
  profile_completed,
  show_in_search,
  is_banned,
  is_married,
  created_at,
  updated_at
FROM public.profiles
WHERE profile_completed = true
  AND COALESCE(show_in_search, true) = true
  AND COALESCE(is_banned, false) = false;

GRANT SELECT ON public.public_profiles TO authenticated;

CREATE TABLE IF NOT EXISTS public.hidden_from_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hidden_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_owner_id, hidden_email)
);
ALTER TABLE public.hidden_from_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view hidden profile rules" ON public.hidden_from_users;
DROP POLICY IF EXISTS "Users can create hidden profile rules" ON public.hidden_from_users;
DROP POLICY IF EXISTS "Users can delete hidden profile rules" ON public.hidden_from_users;
CREATE POLICY "Users can view hidden profile rules"
  ON public.hidden_from_users FOR SELECT TO authenticated
  USING (auth.uid() = profile_owner_id OR lower(auth.email()) = lower(hidden_email));
CREATE POLICY "Users can create hidden profile rules"
  ON public.hidden_from_users FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = profile_owner_id);
CREATE POLICY "Users can delete hidden profile rules"
  ON public.hidden_from_users FOR DELETE TO authenticated
  USING (auth.uid() = profile_owner_id);
CREATE INDEX IF NOT EXISTS idx_hidden_from_users_email ON public.hidden_from_users(lower(hidden_email));

CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_names TEXT NOT NULL,
  location TEXT,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view approved success stories" ON public.success_stories;
DROP POLICY IF EXISTS "Admins can manage success stories" ON public.success_stories;
CREATE POLICY "Anyone can view approved success stories"
  ON public.success_stories FOR SELECT
  USING (is_approved = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage success stories"
  ON public.success_stories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_success_stories_updated_at
  BEFORE UPDATE ON public.success_stories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cnic_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  cnic_front_path TEXT NOT NULL,
  cnic_back_path TEXT NOT NULL,
  selfie_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users can create own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users can update own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Admins can manage verification requests" ON public.verification_requests;
CREATE POLICY "Users can view own verification requests"
  ON public.verification_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own verification requests"
  ON public.verification_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own verification requests"
  ON public.verification_requests FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status IN ('rejected', 'expired'))
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage verification requests"
  ON public.verification_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX IF NOT EXISTS idx_verification_requests_user ON public.verification_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON public.verification_requests(status, created_at DESC);
CREATE TRIGGER update_verification_requests_updated_at
  BEFORE UPDATE ON public.verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.profile_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL UNIQUE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  privacy TEXT NOT NULL DEFAULT 'blur_until_accepted' CHECK (privacy IN ('public', 'blur_until_accepted', 'private')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own profile photos" ON public.profile_photos;
DROP POLICY IF EXISTS "Admins can view profile photos" ON public.profile_photos;
CREATE POLICY "Users can manage own profile photos"
  ON public.profile_photos FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view profile photos"
  ON public.profile_photos FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX IF NOT EXISTS idx_profile_photos_user ON public.profile_photos(user_id, is_primary DESC, created_at);

INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-docs', 'verification-docs', false)
ON CONFLICT (id) DO UPDATE SET public = false;
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Users can upload own verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view profile photos" ON storage.objects;
CREATE POLICY "Users can upload own verification documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'verification-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view own verification documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'verification-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Admins can view verification documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'verification-docs' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can manage own profile photos"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Admins can view profile photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'profile-photos' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.platform_settings (key, value, description)
VALUES
  ('daily_messages_limit', '50', 'Maximum messages a user can send per day'),
  ('daily_profile_views_limit', '30', 'Maximum profiles a user can view per day'),
  ('daily_interests_limit', '10', 'Maximum interests a user can send per day'),
  ('daily_favorites_limit', '20', 'Maximum favorites a user can add per day'),
  ('message_cooldown_seconds', '5', 'Minimum seconds between messages')
ON CONFLICT (key) DO NOTHING;
