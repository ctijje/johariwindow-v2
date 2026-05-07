
-- 1) Tighten windows INSERT
DROP POLICY IF EXISTS "anyone can create window" ON public.windows;
CREATE POLICY "create window guarded"
ON public.windows
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (owner_type = 'self' AND owner_id IS NULL)
  OR (owner_type = 'coach' AND owner_id = auth.uid() AND auth.uid() IS NOT NULL)
);

-- 2) Tighten peer_responses INSERT
DROP POLICY IF EXISTS "anyone can submit peer response" ON public.peer_responses;
CREATE POLICY "submit peer response guarded"
ON public.peer_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (
  array_length(words, 1) BETWEEN 1 AND 60
  AND EXISTS (SELECT 1 FROM public.windows w WHERE w.id = window_id)
);

-- 3) Revoke EXECUTE from anon on functions that should require auth
REVOKE EXECUTE ON FUNCTION public.get_window_by_id(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_self_window(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_window_full(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_coach_roster() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.get_window_by_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_self_window(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_window_full(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_coach_roster() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
