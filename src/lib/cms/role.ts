import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export type CmsRole = "Administrator" | "Editor" | "Contributor";

export const ROLE_INFO: { role: CmsRole; text: string }[] = [
  { role: "Administrator", text: "Full CMS access, including settings and users." },
  { role: "Editor", text: "Create, edit and publish all content." },
  { role: "Contributor", text: "Create and edit own content. Cannot publish." },
];

let cached: { role: CmsRole; assigned: boolean; email: string; name: string; mustChangePassword: boolean } | null = null;

/** Reads the signed-in account and its role. Accounts without a role row get the least access (Contributor). */
export function useCmsAccount() {
  const [account, setAccount] = useState(cached);
  useEffect(() => {
    if (cached) return;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const roles = (rows ?? []).map((r) => r.role as string);
      const role: CmsRole = roles.includes("admin") ? "Administrator" : roles.includes("editor") ? "Editor" : roles.includes("contributor") ? "Contributor" : "Contributor";
      const name = (user.user_metadata["display_name"] as string | undefined) ?? (user.user_metadata["full_name"] as string | undefined) ?? user.email?.split("@")[0] ?? "Editor";
      cached = { role, assigned: roles.length > 0, email: user.email ?? "", name, mustChangePassword: user.user_metadata["must_change_password"] === true };
      setAccount(cached);
    })();
  }, []);
  return account;
}

export const clearAccountCache = () => { cached = null; };
