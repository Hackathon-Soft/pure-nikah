-- Photo access requests table for private/blurred photo access
CREATE TABLE public.photo_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  profile_owner_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  responded_at timestamp with time zone,
  UNIQUE (requester_id, profile_owner_id)
);

-- Enable RLS
ALTER TABLE public.photo_access_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own access requests"
  ON public.photo_access_requests FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = profile_owner_id);

CREATE POLICY "Users can create access requests"
  ON public.photo_access_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Profile owners can update access requests"
  ON public.photo_access_requests FOR UPDATE
  USING (auth.uid() = profile_owner_id);

CREATE POLICY "Users can delete their own pending requests"
  ON public.photo_access_requests FOR DELETE
  USING (auth.uid() = requester_id AND status = 'pending');