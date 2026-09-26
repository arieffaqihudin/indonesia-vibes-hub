ALTER POLICY "Read access roles" ON public.cms_access_roles USING (
  public.cms_can(auth.uid(), 'access')
  OR public.cms_can(auth.uid(), 'users')
  OR id IN (
    SELECT u.access_role_id
    FROM public.cms_users AS u
    WHERE u.auth_user_id = auth.uid()
      AND u.active
      AND u.deleted_at IS NULL
  )
);