CREATE OR REPLACE FUNCTION public.window_exists(_window_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.windows
    WHERE id = _window_id
  )
$$;

DROP POLICY IF EXISTS "submit peer response guarded" ON public.peer_responses;
DROP POLICY IF EXISTS "anyone can submit peer response" ON public.peer_responses;

CREATE POLICY "submit peer response guarded"
ON public.peer_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (
  array_length(words, 1) BETWEEN 1 AND 60
  AND public.window_exists(window_id)
);