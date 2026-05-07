CREATE OR REPLACE FUNCTION public.create_window(
  _name text, _email text, _whatsapp text, _occupation text,
  _age int, _gender text, _self_words text[], _code text, _referral_source text DEFAULT NULL
)
RETURNS TABLE(id uuid, code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.windows (name, email, whatsapp, occupation, age, gender, self_words, code, referral_source)
  VALUES (
    _name,
    _email,
    _whatsapp,
    _occupation,
    CASE WHEN _age BETWEEN 10 AND 120 THEN _age ELSE NULL END,
    _gender,
    _self_words,
    upper(_code),
    _referral_source
  )
  RETURNING windows.id, windows.code INTO new_id, code;
  id := new_id;
  RETURN NEXT;
END;
$$;