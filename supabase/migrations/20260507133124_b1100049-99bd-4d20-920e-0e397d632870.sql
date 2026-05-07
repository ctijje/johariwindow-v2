
-- 1) RPC: get coach roster with status (self done + peer count)
CREATE OR REPLACE FUNCTION public.get_coach_roster()
RETURNS TABLE(
  mentee_id uuid,
  mentee_name text,
  mentee_email text,
  mentee_whatsapp text,
  status text,
  notes text,
  window_id uuid,
  code text,
  self_done boolean,
  peer_count integer,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cm.id,
         cm.mentee_name,
         cm.mentee_email,
         cm.mentee_whatsapp,
         cm.status,
         cm.notes,
         w.id,
         w.code,
         (COALESCE(array_length(w.self_words, 1), 0) > 0) AS self_done,
         (SELECT COUNT(*)::int FROM public.peer_responses pr WHERE pr.window_id = w.id) AS peer_count,
         cm.created_at
  FROM public.coach_mentees cm
  JOIN public.windows w ON w.id = cm.window_id
  WHERE cm.coach_id = auth.uid()
  ORDER BY cm.created_at DESC;
$$;

-- 2) RPC: client opens their assigned window via code (public)
CREATE OR REPLACE FUNCTION public.get_client_window(_code text)
RETURNS TABLE(id uuid, code text, name text, self_done boolean, owner_type text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id,
         code,
         name,
         (COALESCE(array_length(self_words, 1), 0) > 0) AS self_done,
         owner_type
  FROM public.windows
  WHERE code = upper(_code)
  LIMIT 1;
$$;

-- 3) RPC: client submits self words (one-shot fill on coach-owned window)
CREATE OR REPLACE FUNCTION public.submit_client_self(_code text, _self_words text[], _name text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE wid uuid;
BEGIN
  UPDATE public.windows
     SET self_words = _self_words,
         name = COALESCE(NULLIF(trim(_name), ''), name)
   WHERE code = upper(_code)
     AND owner_type = 'coach'
     AND COALESCE(array_length(self_words, 1), 0) = 0
   RETURNING id INTO wid;

  IF wid IS NULL THEN
    RAISE EXCEPTION 'Self assessment already completed or window not found';
  END IF;

  RETURN wid;
END;
$$;
