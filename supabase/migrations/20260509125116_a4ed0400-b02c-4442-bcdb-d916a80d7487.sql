-- Update create_window to auto-attach to authenticated user when self
CREATE OR REPLACE FUNCTION public.create_window(_name text, _email text, _whatsapp text, _occupation text, _age integer, _gender text, _self_words text[], _code text, _referral_source text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, code text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_id uuid;
  uid uuid := auth.uid();
BEGIN
  INSERT INTO public.windows (name, email, whatsapp, occupation, age, gender, self_words, code, referral_source, owner_id, owner_type)
  VALUES (
    _name,
    _email,
    _whatsapp,
    _occupation,
    CASE WHEN _age BETWEEN 10 AND 120 THEN _age ELSE NULL END,
    _gender,
    _self_words,
    upper(_code),
    _referral_source,
    uid,
    'self'
  )
  RETURNING windows.id, windows.code INTO new_id, code;
  id := new_id;
  RETURN NEXT;
END;
$function$;

-- Update insert policy on windows to allow self windows with owner_id = auth.uid()
DROP POLICY IF EXISTS "create window guarded" ON public.windows;
CREATE POLICY "create window guarded"
ON public.windows
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (owner_type = 'self' AND (owner_id IS NULL OR owner_id = auth.uid()))
  OR (owner_type = 'coach' AND owner_id = auth.uid() AND auth.uid() IS NOT NULL)
);

-- RPC: list current user's self windows
CREATE OR REPLACE FUNCTION public.get_my_windows()
RETURNS TABLE(id uuid, code text, name text, created_at timestamptz)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id, code, name, created_at
  FROM public.windows
  WHERE owner_id = auth.uid() AND owner_type = 'self'
  ORDER BY created_at DESC;
$$;