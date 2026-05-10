
CREATE TABLE public.coach_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  note text,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role manages codes"
  ON public.coach_access_codes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "user reads own redeemed code"
  ON public.coach_access_codes FOR SELECT
  TO authenticated
  USING (used_by = auth.uid());

CREATE OR REPLACE FUNCTION public.redeem_coach_code(_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  rec public.coach_access_codes%ROWTYPE;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO rec FROM public.coach_access_codes
   WHERE code = upper(trim(_code))
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Code tidak valid';
  END IF;

  IF rec.used_by IS NOT NULL THEN
    IF rec.used_by = uid THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (uid, 'coach'::app_role)
      ON CONFLICT (user_id, role) DO NOTHING;
      RETURN;
    END IF;
    RAISE EXCEPTION 'Code sudah digunakan';
  END IF;

  IF rec.expires_at IS NOT NULL AND rec.expires_at < now() THEN
    RAISE EXCEPTION 'Code sudah kedaluwarsa';
  END IF;

  UPDATE public.coach_access_codes
     SET used_by = uid, used_at = now()
   WHERE id = rec.id;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'coach'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
