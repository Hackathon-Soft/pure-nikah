
-- Fix interests policies
DROP POLICY IF EXISTS "Users can view interests involving them" ON public.interests;
DROP POLICY IF EXISTS "Users can send interests" ON public.interests;
DROP POLICY IF EXISTS "Recipients can update interest status" ON public.interests;
DROP POLICY IF EXISTS "Senders can delete their pending interests" ON public.interests;

CREATE POLICY "Users can view interests involving them" ON public.interests FOR SELECT TO authenticated USING ((auth.uid() = from_user_id) OR (auth.uid() = to_user_id));
CREATE POLICY "Users can send interests" ON public.interests FOR INSERT TO authenticated WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Recipients can update interest status" ON public.interests FOR UPDATE TO authenticated USING (auth.uid() = to_user_id);
CREATE POLICY "Senders can delete their pending interests" ON public.interests FOR DELETE TO authenticated USING ((auth.uid() = from_user_id) AND (status = 'pending'));

-- Fix favorites policies
DROP POLICY IF EXISTS "Users can view their favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can add favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can remove favorites" ON public.favorites;

CREATE POLICY "Users can view their favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix conversations policies
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversations;

CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT TO authenticated USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id));
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user1_id) OR (auth.uid() = user2_id));
CREATE POLICY "Users can update their conversations" ON public.conversations FOR UPDATE TO authenticated USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

-- Fix messages policies
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can mark messages as read" ON public.messages;

CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())));
CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR INSERT TO authenticated WITH CHECK ((auth.uid() = sender_id) AND EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())));
CREATE POLICY "Users can mark messages as read" ON public.messages FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())) AND sender_id <> auth.uid());

-- Fix notifications policies
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;

CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix blocked_users policies
DROP POLICY IF EXISTS "Users can view their blocks" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can block others" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can unblock" ON public.blocked_users;

CREATE POLICY "Users can view their blocks" ON public.blocked_users FOR SELECT TO authenticated USING (auth.uid() = blocker_id);
CREATE POLICY "Users can block others" ON public.blocked_users FOR INSERT TO authenticated WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Users can unblock" ON public.blocked_users FOR DELETE TO authenticated USING (auth.uid() = blocker_id);

-- Fix profile_views policies
DROP POLICY IF EXISTS "Users can see who viewed them" ON public.profile_views;
DROP POLICY IF EXISTS "Users can record views" ON public.profile_views;

CREATE POLICY "Users can see who viewed them" ON public.profile_views FOR SELECT TO authenticated USING ((auth.uid() = viewed_id) OR (auth.uid() = viewer_id));
CREATE POLICY "Users can record views" ON public.profile_views FOR INSERT TO authenticated WITH CHECK (auth.uid() = viewer_id);
