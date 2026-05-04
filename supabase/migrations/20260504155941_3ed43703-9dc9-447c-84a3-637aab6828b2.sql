
-- WINDOWS table
CREATE TABLE public.windows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  whatsapp text NOT NULL,
  occupation text NOT NULL,
  age int NOT NULL,
  gender text NOT NULL,
  self_words text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT name_len CHECK (char_length(name) BETWEEN 1 AND 100),
  CONSTRAINT email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT whatsapp_len CHECK (char_length(whatsapp) BETWEEN 5 AND 32),
  CONSTRAINT age_range CHECK (age BETWEEN 10 AND 120),
  CONSTRAINT words_count CHECK (array_length(self_words,1) BETWEEN 4 AND 8),
  CONSTRAINT code_format CHECK (code ~ '^[A-Z0-9]{5}$')
);

ALTER TABLE public.windows ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can create a window
CREATE POLICY "anyone can create window"
  ON public.windows FOR INSERT
  WITH CHECK (true);

-- Block direct reads of the windows table (PII protection)
CREATE POLICY "no direct select"
  ON public.windows FOR SELECT
  USING (false);

-- Public view exposing only safe fields
CREATE VIEW public.windows_public
WITH (security_invoker = off) AS
  SELECT id, code, name, created_at
  FROM public.windows;

GRANT SELECT ON public.windows_public TO anon, authenticated;

-- PEER RESPONSES
CREATE TABLE public.peer_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  window_id uuid NOT NULL REFERENCES public.windows(id) ON DELETE CASCADE,
  peer_name text,
  words text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT peer_words_count CHECK (array_length(words,1) BETWEEN 4 AND 8),
  CONSTRAINT peer_name_len CHECK (peer_name IS NULL OR char_length(peer_name) <= 80)
);

ALTER TABLE public.peer_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit peer response"
  ON public.peer_responses FOR INSERT
  WITH CHECK (true);

-- Reading peer responses is public (only words + optional peer_name; no PII).
-- Owner uses the window_id from session storage to load these.
CREATE POLICY "peer responses readable"
  ON public.peer_responses FOR SELECT
  USING (true);

CREATE INDEX peer_responses_window_idx ON public.peer_responses(window_id);
