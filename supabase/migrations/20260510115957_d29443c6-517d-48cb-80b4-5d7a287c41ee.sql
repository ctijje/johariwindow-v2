CREATE OR REPLACE FUNCTION public.claim_coach_role()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RAISE EXCEPTION 'Deprecated: gunakan redeem_coach_code dengan access code dari admin';
END;
$function$;