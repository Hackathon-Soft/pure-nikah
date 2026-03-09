
-- Fix the overly permissive INSERT policy
DROP POLICY "System can insert flagged messages" ON public.flagged_messages;

-- Only allow users to insert flags for their own messages (edge function uses service role anyway)
CREATE POLICY "Users can flag own sent messages"
  ON public.flagged_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);
