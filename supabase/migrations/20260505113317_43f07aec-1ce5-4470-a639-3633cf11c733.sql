
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'coach', 'team_lead');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND role IN ('coach','team_lead'));

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles readable by owner" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles upsert by owner" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles update by owner" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Extend windows for ownership
ALTER TABLE public.windows
  ADD COLUMN owner_type text NOT NULL DEFAULT 'self',
  ADD COLUMN owner_id uuid;

-- Coach mentees
CREATE TABLE public.coach_mentees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  window_id uuid NOT NULL REFERENCES public.windows(id) ON DELETE CASCADE,
  mentee_name text NOT NULL,
  mentee_email text,
  mentee_whatsapp text,
  notes text,
  status text NOT NULL DEFAULT 'invited',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coach_mentees ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER coach_mentees_set_updated_at
BEFORE UPDATE ON public.coach_mentees
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "coach reads own mentees" ON public.coach_mentees
  FOR SELECT TO authenticated USING (auth.uid() = coach_id);
CREATE POLICY "coach inserts own mentees" ON public.coach_mentees
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = coach_id AND public.has_role(auth.uid(), 'coach'));
CREATE POLICY "coach updates own mentees" ON public.coach_mentees
  FOR UPDATE TO authenticated USING (auth.uid() = coach_id);
CREATE POLICY "coach deletes own mentees" ON public.coach_mentees
  FOR DELETE TO authenticated USING (auth.uid() = coach_id);

-- Teams
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER teams_set_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "owner reads teams" ON public.teams
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "owner creates teams" ON public.teams
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'team_lead'));
CREATE POLICY "owner updates teams" ON public.teams
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "owner deletes teams" ON public.teams
  FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  window_id uuid REFERENCES public.windows(id) ON DELETE SET NULL,
  member_name text NOT NULL,
  member_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_team_owner(_team_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.teams WHERE id = _team_id AND owner_id = _user_id)
$$;

CREATE POLICY "team owner reads members" ON public.team_members
  FOR SELECT TO authenticated USING (public.is_team_owner(team_id, auth.uid()));
CREATE POLICY "team owner inserts members" ON public.team_members
  FOR INSERT TO authenticated WITH CHECK (public.is_team_owner(team_id, auth.uid()));
CREATE POLICY "team owner updates members" ON public.team_members
  FOR UPDATE TO authenticated USING (public.is_team_owner(team_id, auth.uid()));
CREATE POLICY "team owner deletes members" ON public.team_members
  FOR DELETE TO authenticated USING (public.is_team_owner(team_id, auth.uid()));

-- Allow coach/team owners to read their owned windows
CREATE POLICY "owner reads own windows" ON public.windows
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);

-- Helper RPC: full window data for owner
CREATE OR REPLACE FUNCTION public.get_window_full(_id uuid)
RETURNS TABLE(id uuid, code text, name text, self_words text[], owner_id uuid, owner_type text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, code, name, self_words, owner_id, owner_type, created_at
  FROM public.windows
  WHERE id = _id
  LIMIT 1;
$$;
