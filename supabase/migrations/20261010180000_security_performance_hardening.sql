-- Security and performance hardening after the initial backend deployment.

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON public.blocked_users(blocked_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON public.conversations(user2_id);
CREATE INDEX IF NOT EXISTS idx_favorites_profile ON public.favorites(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON public.profile_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_success_stories_created_by ON public.success_stories(created_by);
CREATE INDEX IF NOT EXISTS idx_verification_requests_reviewed_by ON public.verification_requests(reviewed_by);

DROP POLICY IF EXISTS "Admins can manage success stories" ON public.success_stories;
CREATE POLICY "Admins can create success stories"
  ON public.success_stories FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update success stories"
  ON public.success_stories FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete success stories"
  ON public.success_stories FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage verification requests" ON public.verification_requests;
CREATE POLICY "Admins can delete verification requests"
  ON public.verification_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all notices" ON public.public_notices;

DROP POLICY IF EXISTS "Users can manage own profile photos" ON public.profile_photos;
DROP POLICY IF EXISTS "Admins can view profile photos" ON public.profile_photos;
CREATE POLICY "Users can view own profile photos"
  ON public.profile_photos FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create own profile photos"
  ON public.profile_photos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile photos"
  ON public.profile_photos FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile photos"
  ON public.profile_photos FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can view profile photos"
  ON public.profile_photos FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
