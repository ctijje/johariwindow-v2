
CREATE OR REPLACE FUNCTION public.submit_peer_response(_code text, _peer_name text, _words text[])
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  wid uuid;
  rid uuid;
BEGIN
  IF _words IS NULL OR array_length(_words, 1) < 1 OR array_length(_words, 1) > 60 THEN
    RAISE EXCEPTION 'Invalid words count';
  END IF;

  SELECT id INTO wid FROM public.windows WHERE code = upper(_code) LIMIT 1;
  IF wid IS NULL THEN
    RAISE EXCEPTION 'Window not found';
  END IF;

  INSERT INTO public.peer_responses (window_id, peer_name, words)
  VALUES (wid, NULLIF(trim(COALESCE(_peer_name, '')), ''), _words)
  RETURNING id INTO rid;

  RETURN rid;
END;
$$;
