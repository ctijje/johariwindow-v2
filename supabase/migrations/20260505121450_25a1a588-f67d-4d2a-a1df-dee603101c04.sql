DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP FUNCTION IF EXISTS public.is_team_owner(uuid, uuid);

-- Tighten user_roles insert policy to coach only
DROP POLICY IF EXISTS "users insert own roles" ON public.user_roles;
CREATE POLICY "users insert own roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'coach'::app_role);