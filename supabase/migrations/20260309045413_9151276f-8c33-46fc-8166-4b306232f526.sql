-- Wali (Chaperone) participants table for conversations
CREATE TABLE public.wali_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  wali_email text NOT NULL,
  wali_user_id uuid,
  invited_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, accepted, declined
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, wali_email)
);

-- Enable RLS
ALTER TABLE public.wali_participants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Conversation participants can view walis"
  ON public.wali_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = wali_participants.conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
    OR auth.uid() = wali_user_id
  );

CREATE POLICY "Conversation participants can invite walis"
  ON public.wali_participants FOR INSERT
  WITH CHECK (
    auth.uid() = invited_by
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

CREATE POLICY "Invited user can update their wali participation"
  ON public.wali_participants FOR UPDATE
  USING (auth.uid() = wali_user_id);

CREATE POLICY "Inviter can remove pending walis"
  ON public.wali_participants FOR DELETE
  USING (auth.uid() = invited_by AND status = 'pending');