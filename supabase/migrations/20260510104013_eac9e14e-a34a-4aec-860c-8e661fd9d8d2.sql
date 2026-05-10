
-- Add 'admin' to app_role enum if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='admin' AND enumtypid='public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'admin';
  END IF;
END$$;

-- Claims table
CREATE TABLE IF NOT EXISTS public.coach_payment_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL,
  plan text NOT NULL CHECK (plan IN ('starter','growth')),
  lynk_order_ref text,
  proof_url text,
  note text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_note text,
  access_code text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_claims_status ON public.coach_payment_claims(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_claims_user ON public.coach_payment_claims(user_id);

ALTER TABLE public.coach_payment_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user inserts own claim" ON public.coach_payment_claims
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user reads own claim" ON public.coach_payment_claims
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "admin reads all claims" ON public.coach_payment_claims
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin updates claims" ON public.coach_payment_claims
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_claims_updated_at
  BEFORE UPDATE ON public.coach_payment_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Allow user_roles to be granted by admin (needed eventually); keep restrictive for now.

-- Approve RPC
CREATE OR REPLACE FUNCTION public.approve_payment_claim(_claim_id uuid, _admin_note text DEFAULT NULL)
RETURNS TABLE(access_code text, recipient_email text, plan text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  rec public.coach_payment_claims%ROWTYPE;
  new_code text;
  attempts int := 0;
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT * INTO rec FROM public.coach_payment_claims WHERE id = _claim_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Claim not found'; END IF;
  IF rec.status <> 'pending' THEN RAISE EXCEPTION 'Claim already processed'; END IF;

  -- Generate unique code JW-XXXXXX
  LOOP
    new_code := 'JW-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.coach_access_codes WHERE code = new_code);
    attempts := attempts + 1;
    IF attempts > 10 THEN RAISE EXCEPTION 'Could not generate unique code'; END IF;
  END LOOP;

  INSERT INTO public.coach_access_codes (code, note)
  VALUES (new_code, 'claim:' || _claim_id::text);

  UPDATE public.coach_payment_claims
     SET status = 'approved',
         access_code = new_code,
         admin_note = _admin_note,
         reviewed_by = uid,
         reviewed_at = now()
   WHERE id = _claim_id;

  access_code := new_code;
  recipient_email := rec.email;
  plan := rec.plan;
  RETURN NEXT;
END;
$$;

-- Reject RPC
CREATE OR REPLACE FUNCTION public.reject_payment_claim(_claim_id uuid, _admin_note text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.coach_payment_claims
     SET status = 'rejected',
         admin_note = _admin_note,
         reviewed_by = uid,
         reviewed_at = now()
   WHERE id = _claim_id AND status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Claim not found or already processed'; END IF;
END;
$$;
