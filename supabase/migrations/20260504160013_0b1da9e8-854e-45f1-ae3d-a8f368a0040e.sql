
DROP VIEW IF EXISTS public.windows_public;

CREATE OR REPLACE FUNCTION public.get_window_by_code(_code text)
RETURNS TABLE (id uuid, code text, name text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, code, name, created_at
  FROM public.windows
  WHERE code = upper(_code)
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_window_by_id(_id uuid)
RETURNS TABLE (id uuid, code text, name text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, code, name, created_at
  FROM public.windows
  WHERE id = _id
  LIMIT 1;
$$;

-- Owner needs their own self_words + email-less full data; simplest: another function
CREATE OR REPLACE FUNCTION public.get_self_window(_id uuid)
RETURNS TABLE (id uuid, code text, name text, self_words text[], created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, code, name, self_words, created_at
  FROM public.windows
  WHERE id = _id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_window_by_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_window_by_id(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_self_window(uuid) TO anon, authenticated;
