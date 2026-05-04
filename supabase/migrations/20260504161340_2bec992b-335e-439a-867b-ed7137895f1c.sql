
ALTER TABLE public.windows DROP CONSTRAINT IF EXISTS words_count;
ALTER TABLE public.windows ADD CONSTRAINT words_count CHECK (array_length(self_words,1) BETWEEN 5 AND 20);

ALTER TABLE public.peer_responses DROP CONSTRAINT IF EXISTS peer_words_count;
ALTER TABLE public.peer_responses ADD CONSTRAINT peer_words_count CHECK (array_length(words,1) BETWEEN 5 AND 20);

CREATE OR REPLACE FUNCTION public.create_window(
  _name text, _email text, _whatsapp text, _occupation text,
  _age int, _gender text, _self_words text[], _code text
) RETURNS TABLE (id uuid, code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.windows (name, email, whatsapp, occupation, age, gender, self_words, code)
  VALUES (_name, _email, _whatsapp, _occupation, _age, _gender, _self_words, upper(_code))
  RETURNING windows.id, windows.code INTO new_id, code;
  id := new_id;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_window(text,text,text,text,int,text,text[],text) TO anon, authenticated;
