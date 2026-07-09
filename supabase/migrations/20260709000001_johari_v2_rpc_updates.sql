-- 1) create_window v2: accept new ranking + purpose params
DROP FUNCTION IF EXISTS public.create_window(text,text,text,text,integer,text,text[],text,text);
CREATE OR REPLACE FUNCTION public.create_window(
  _name                   text,
  _email                  text,
  _whatsapp               text,
  _occupation             text,
  _age                    integer,
  _gender                 text,
  _self_words             text[],
  _code                   text,
  _referral_source        text    DEFAULT NULL,
  _self_words_ranked      text[]  DEFAULT '{}',
  _self_anchor_reason     text    DEFAULT NULL,
  _self_context           text    DEFAULT NULL,
  _assessment_purposes    text[]  DEFAULT '{}',
  _assessment_purpose_other text  DEFAULT NULL
)
RETURNS TABLE(id uuid, code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  uid    uuid := auth.uid();
BEGIN
  INSERT INTO public.windows (
    name, email, whatsapp, occupation, age, gender,
    self_words, code, referral_source, owner_id, owner_type,
    self_words_ranked, self_anchor_reason, self_context,
    assessment_purposes, assessment_purpose_other
  )
  VALUES (
    _name, _email, _whatsapp, _occupation,
    CASE WHEN _age BETWEEN 10 AND 120 THEN _age ELSE NULL END,
    _gender, _self_words, upper(_code), _referral_source, uid, 'self',
    _self_words_ranked, _self_anchor_reason, _self_context,
    _assessment_purposes, _assessment_purpose_other
  )
  RETURNING windows.id, windows.code INTO new_id, code;
  id := new_id;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_window(text,text,text,text,integer,text,text[],text,text,text[],text,text,text[],text)
  TO anon, authenticated;

-- 2) get_self_window v2: return ranking + purpose fields
DROP FUNCTION IF EXISTS public.get_self_window(uuid);
CREATE OR REPLACE FUNCTION public.get_self_window(_id uuid)
RETURNS TABLE (
  id                    uuid,
  code                  text,
  name                  text,
  self_words            text[],
  self_words_ranked     text[],
  self_anchor_reason    text,
  self_context          text,
  assessment_purposes   text[],
  created_at            timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    id, code, name,
    self_words,
    COALESCE(self_words_ranked, '{}'),
    self_anchor_reason,
    self_context,
    COALESCE(assessment_purposes, '{}'),
    created_at
  FROM public.windows
  WHERE id = _id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_self_window(uuid) TO authenticated;

-- 3) get_peer_words v2: return all peer fields needed for result + report
DROP FUNCTION IF EXISTS public.get_peer_words(uuid);
CREATE OR REPLACE FUNCTION public.get_peer_words(_window_id uuid)
RETURNS TABLE (
  peer_name             text,
  words                 text[],
  words_ranked          text[],
  peer_behavior_example text,
  peer_unseen_quality   text,
  created_at            timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    peer_name,
    words,
    COALESCE(words_ranked, '{}'),
    peer_behavior_example,
    peer_unseen_quality,
    created_at
  FROM public.peer_responses
  WHERE window_id = _window_id
  ORDER BY created_at ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_peer_words(uuid) TO anon, authenticated;
