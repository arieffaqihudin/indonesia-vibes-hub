import { supabase } from "@/integrations/supabase/client";

export type CmsUser = {
  id: string; auth_user_id: string | null; name: string; email: string; phone: string; access_role_id: string | null;
  active: boolean; avatar_url: string | null; invited_at: string | null; first_login_at: string | null; last_login_at: string | null;
  created_at: string; updated_at: string; role_name: string;
};

export const usersQuery = {
  queryKey: ["cms-users"],
  queryFn: async (): Promise<CmsUser[]> => {
    const { data, error } = await supabase.from("cms_users").select("*, cms_access_roles(name)").is("deleted_at", null).order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(({ cms_access_roles, ...u }) => ({ ...u, role_name: (cms_access_roles as { name: string } | null)?.name ?? "—" }));
  },
};

export const rolesListQuery = {
  queryKey: ["cms-access-roles-list"],
  queryFn: async () => (await supabase.from("cms_access_roles").select("id,name").order("created_at")).data ?? [],
};
