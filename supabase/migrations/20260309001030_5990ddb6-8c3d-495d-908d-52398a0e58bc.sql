CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settings"
  ON public.platform_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update settings"
  ON public.platform_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings"
  ON public.platform_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.platform_settings (key, value, description) VALUES
  ('daily_messages_limit', '50', 'Max messages a user can send per day'),
  ('daily_profile_views_limit', '30', 'Max profiles a user can view per day'),
  ('daily_interests_limit', '10', 'Max interests a user can send per day'),
  ('daily_favorites_limit', '20', 'Max favorites a user can add per day'),
  ('message_cooldown_seconds', '5', 'Min seconds between messages');