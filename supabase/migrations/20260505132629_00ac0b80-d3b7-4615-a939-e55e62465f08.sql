ALTER TABLE public.windows ADD COLUMN IF NOT EXISTS referral_source text;

DROP FUNCTION IF EXISTS public.create_window(text,text,text,text,int,text,text[],text);

CREATE OR REPLACE FUNCTION public.create_window(
  _name text, _email text, _whatsapp text, _occupation text,
  _age int, _gender text, _self_words text[], _code text, _referral_source text DEFAULT NULL
) RETURNS TABLE (id uuid, code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.windows (name, email, whatsapp, occupation, age, gender, self_words, code, referral_source)
  VALUES (_name, _email, _whatsapp, _occupation, _age, _gender, _self_words, upper(_code), _referral_source)
  RETURNING windows.id, windows.code INTO new_id, code;
  id := new_id;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_window(text,text,text,text,int,text,text[],text,text) TO anon, authenticated;