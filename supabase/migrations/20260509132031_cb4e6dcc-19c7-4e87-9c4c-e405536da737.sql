-- 1) Tighten user_roles: remove direct INSERT policy, add SECURITY DEFINER claim function
DROP POLICY IF EXISTS "users insert own roles" ON public.user_roles;

CREATE OR REPLACE FUNCTION public.claim_coach_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'coach'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_coach_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_coach_role() TO authenticated;

-- 2) Tighten peer_responses: remove public SELECT, add owner-only SELECT, expose safe RPCs
DROP POLICY IF EXISTS "peer responses readable" ON public.peer_responses;

CREATE POLICY "owner reads peer responses"
ON public.peer_responses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.windows w
    WHERE w.id = peer_responses.window_id
      AND w.owner_id = auth.uid()
  )
);

-- Aggregate-only RPC: returns just words arrays. Used by anonymous flows that
-- only have the window code from the URL (Result/Profile/Story/WindowView/Share count).
CREATE OR REPLACE FUNCTION public.get_peer_words(_window_id uuid)
RETURNS TABLE(words text[])
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT words FROM public.peer_responses WHERE window_id = _window_id;
$$;

REVOKE ALL ON FUNCTION public.get_peer_words(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_peer_words(uuid) TO anon, authenticated;

-- Owner-only RPC: returns peer_name + words. Used on Share page by the window owner.
CREATE OR REPLACE FUNCTION public.get_peer_responses_owner(_window_id uuid)
RETURNS TABLE(peer_name text, words text[], created_at timestamptz)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.windows w
    WHERE w.id = _window_id AND w.owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY
  SELECT pr.peer_name, pr.words, pr.created_at
  FROM public.peer_responses pr
  WHERE pr.window_id = _window_id
  ORDER BY pr.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_peer_responses_owner(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_peer_responses_owner(uuid) TO authenticated;