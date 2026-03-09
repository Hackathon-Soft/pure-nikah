
-- Create flagged_messages table for AI content moderation
CREATE TABLE public.flagged_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  reason TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.flagged_messages ENABLE ROW LEVEL SECURITY;

-- Admins can view all flagged messages
CREATE POLICY "Admins can view flagged messages"
  ON public.flagged_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update flagged messages (resolve/dismiss)
CREATE POLICY "Admins can update flagged messages"
  ON public.flagged_messages FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Service role inserts (from edge function) - allow authenticated insert for edge function
CREATE POLICY "System can insert flagged messages"
  ON public.flagged_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);
