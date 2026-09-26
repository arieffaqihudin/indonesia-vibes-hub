CREATE TABLE public.cms_access_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  menus text[] NOT NULL DEFAULT '{}',
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_access_roles TO authenticated;
GRANT ALL ON public.cms_access_roles TO service_role;
ALTER TABLE public.cms_access_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.cms_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  access_role_id uuid REFERENCES public.cms_access_roles(id) ON DELETE RESTRICT,
  active boolean NOT NULL DEFAULT true,
  avatar_url text,
  invited_at timestamptz,
  first_login_at timestamptz,
  last_login_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX cms_users_email_live ON public.cms_users (lower(email)) WHERE deleted_at IS NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_users TO authenticated;
GRANT ALL ON public.cms_users TO service_role;
ALTER TABLE public.cms_users ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.cms_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid,
  actor_name text NOT NULL DEFAULT '',
  action text NOT NULL,
  module text NOT NULL,
  item text NOT NULL DEFAULT '',
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  device text NOT NULL DEFAULT ''
);
CREATE INDEX cms_activity_created ON public.cms_activity (created_at DESC);
GRANT SELECT, INSERT ON public.cms_activity TO authenticated;
GRANT ALL ON public.cms_activity TO service_role;
ALTER TABLE public.cms_activity ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.cms_all_menus() RETURNS text[] LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT ARRAY['dashboard','articles','heritage','topics','collections','people','experience','collaborations','homepage','pages','access','users','activity','profile']
$$;

CREATE OR REPLACE FUNCTION public.cms_menus(_uid uuid) RETURNS text[] LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN public.has_role(_uid, 'admin') THEN public.cms_all_menus()
    ELSE COALESCE((
      SELECT CASE WHEN r.is_system THEN public.cms_all_menus() ELSE r.menus END
      FROM public.cms_users u JOIN public.cms_access_roles r ON r.id = u.access_role_id
      WHERE u.auth_user_id = _uid AND u.active AND u.deleted_at IS NULL LIMIT 1
    ), ARRAY[]::text[])
  END
$$;

CREATE OR REPLACE FUNCTION public.cms_can(_uid uuid, _menu text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _menu = ANY(public.cms_menus(_uid))
$$;

-- System role always keeps every menu
CREATE OR REPLACE FUNCTION public.cms_access_roles_guard() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.is_system THEN NEW.menus := public.cms_all_menus(); END IF;
  IF TG_OP = 'UPDATE' THEN NEW.is_system := OLD.is_system; END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER cms_access_roles_guard BEFORE INSERT OR UPDATE ON public.cms_access_roles FOR EACH ROW EXECUTE FUNCTION public.cms_access_roles_guard();

CREATE OR REPLACE FUNCTION public.cms_touch() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
CREATE TRIGGER cms_users_touch BEFORE UPDATE ON public.cms_users FOR EACH ROW EXECUTE FUNCTION public.cms_touch();

CREATE POLICY "Read access roles" ON public.cms_access_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Manage access roles insert" ON public.cms_access_roles FOR INSERT TO authenticated WITH CHECK (public.cms_can(auth.uid(), 'access') AND NOT is_system);
CREATE POLICY "Manage access roles update" ON public.cms_access_roles FOR UPDATE TO authenticated USING (public.cms_can(auth.uid(), 'access')) WITH CHECK (public.cms_can(auth.uid(), 'access'));
CREATE POLICY "Manage access roles delete" ON public.cms_access_roles FOR DELETE TO authenticated USING (public.cms_can(auth.uid(), 'access') AND NOT is_system);

CREATE POLICY "Read own or managed users" ON public.cms_users FOR SELECT TO authenticated USING (auth_user_id = auth.uid() OR public.cms_can(auth.uid(), 'users'));
CREATE POLICY "Manage users insert" ON public.cms_users FOR INSERT TO authenticated WITH CHECK (public.cms_can(auth.uid(), 'users'));
CREATE POLICY "Manage users update" ON public.cms_users FOR UPDATE TO authenticated USING (public.cms_can(auth.uid(), 'users')) WITH CHECK (public.cms_can(auth.uid(), 'users'));

CREATE POLICY "Log own activity" ON public.cms_activity FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());
CREATE POLICY "Read activity" ON public.cms_activity FOR SELECT TO authenticated USING (public.cms_can(auth.uid(), 'activity'));

-- Called after every successful sign-in: links the auth account, records first/last login.
CREATE OR REPLACE FUNCTION public.cms_record_login(_device text DEFAULT '') RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _email text; _row public.cms_users;
BEGIN
  SELECT email INTO _email FROM auth.users WHERE id = auth.uid();
  IF _email IS NULL THEN RETURN false; END IF;
  UPDATE public.cms_users SET auth_user_id = auth.uid(), first_login_at = COALESCE(first_login_at, now()), last_login_at = now()
    WHERE deleted_at IS NULL AND active AND (auth_user_id = auth.uid() OR (auth_user_id IS NULL AND lower(email) = lower(_email)))
    RETURNING * INTO _row;
  IF _row.id IS NULL THEN RETURN public.has_role(auth.uid(), 'admin'); END IF;
  INSERT INTO public.cms_activity(actor_id, actor_name, action, module, item, device) VALUES (auth.uid(), _row.name, 'Login', 'Account', _row.name, left(_device, 200));
  RETURN true;
END $$;

-- Current user's own profile + permissions.
CREATE OR REPLACE FUNCTION public.cms_me() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'menus', public.cms_menus(auth.uid()),
    'user', (SELECT to_jsonb(u) || jsonb_build_object('role_name', r.name) FROM public.cms_users u LEFT JOIN public.cms_access_roles r ON r.id = u.access_role_id WHERE u.auth_user_id = auth.uid() AND u.deleted_at IS NULL LIMIT 1)
  )
$$;

CREATE OR REPLACE FUNCTION public.cms_update_profile(_name text, _phone text, _avatar text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF length(trim(_name)) = 0 OR length(_name) > 120 OR length(_phone) > 40 OR length(coalesce(_avatar,'')) > 200000 THEN RAISE EXCEPTION 'Invalid profile'; END IF;
  UPDATE public.cms_users SET name = trim(_name), phone = trim(_phone), avatar_url = _avatar WHERE auth_user_id = auth.uid() AND deleted_at IS NULL;
END $$;

INSERT INTO public.cms_access_roles(name, description, menus, is_system) VALUES
  ('Administrator', 'Full CMS access, including users and access.', public.cms_all_menus(), true),
  ('Editor', 'Create, edit and publish all content.', ARRAY['dashboard','articles','heritage','topics','collections','people','experience','collaborations','homepage','pages','profile'], false),
  ('Contributor', 'Create and edit content.', ARRAY['dashboard','articles','heritage','profile'], false);

INSERT INTO public.cms_users(auth_user_id, name, email, access_role_id, first_login_at, last_login_at)
SELECT u.id, COALESCE(p.display_name, u.raw_user_meta_data->>'display_name', split_part(u.email,'@',1)), u.email,
  (SELECT id FROM public.cms_access_roles WHERE name = CASE WHEN ur.role = 'admin' THEN 'Administrator' WHEN ur.role = 'editor' THEN 'Editor' ELSE 'Contributor' END),
  u.last_sign_in_at, u.last_sign_in_at
FROM auth.users u JOIN public.user_roles ur ON ur.user_id = u.id LEFT JOIN public.profiles p ON p.id = u.id;