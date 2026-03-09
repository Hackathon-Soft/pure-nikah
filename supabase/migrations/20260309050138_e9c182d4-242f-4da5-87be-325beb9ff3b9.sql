-- Public notices / safety alerts table
CREATE TABLE public.public_notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'info', -- info, warning, safety, maintenance
  is_active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 0,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone
);

ALTER TABLE public.public_notices ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read active notices
CREATE POLICY "Anyone can view active notices"
  ON public.public_notices FOR SELECT
  USING (is_active = true);

-- Admins can manage notices
CREATE POLICY "Admins can insert notices"
  ON public.public_notices FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update notices"
  ON public.public_notices FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete notices"
  ON public.public_notices FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can also see inactive notices
CREATE POLICY "Admins can view all notices"
  ON public.public_notices FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));