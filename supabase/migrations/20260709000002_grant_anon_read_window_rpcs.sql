-- Allow anon to read windows by UUID (UUID is secret enough; needed for Share + Result pages)
CREATE OR REPLACE FUNCTION public.get_window_full(_id uuid)
RETURNS TABLE(id uuid, code text, name text, self_words text[], owner_id uuid, owner_type text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, code, name, self_words, owner_id, owner_type, created_at
  FROM public.windows
  WHERE id = _id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_window_full(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_self_window(uuid) TO anon, authenticated;
