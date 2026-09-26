import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { MenuKey } from "./access";

export type Account = {
  cmsUserId: string | null;
  role: string;
  assigned: boolean;
  email: string;
  name: string;
  phone: string;
  avatar: string | null;
  active: boolean;
  lastLogin: string | null;
  menus: MenuKey[];
  mustChangePassword: boolean;
};

let pending: Promise<Account | null> | null = null;
let cached: Account | null = null;
const subs = new Set<(a: Account | null) => void>();

async function load(): Promise<Account | null> {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;
  const { data: me } = await supabase.rpc("cms_me");
  const m = (me ?? {}) as { menus?: MenuKey[]; user?: Record<string, unknown> | null };
  const u = m.user ?? null;
  const fallback = (user.user_metadata["display_name"] as string | undefined) ?? user.email?.split("@")[0] ?? "Editor";
  cached = {
    cmsUserId: (u?.["id"] as string) ?? null,
    role: (u?.["role_name"] as string) ?? (m.menus?.length ? "Administrator" : "No access"),
    assigned: Boolean(u?.["access_role_id"]) || Boolean(m.menus?.length),
    email: user.email ?? "",
    name: (u?.["name"] as string) ?? fallback,
    phone: (u?.["phone"] as string) ?? "",
    avatar: (u?.["avatar_url"] as string | null) ?? null,
    active: u ? Boolean(u["active"]) : true,
    lastLogin: (u?.["last_login_at"] as string | null) ?? null,
    menus: m.menus ?? [],
    mustChangePassword: user.user_metadata["must_change_password"] === true,
  };
  const current = cached;
  subs.forEach((f) => f(current));
  return current;
}

/** Loads (once) the signed-in account with its permitted menus. */
export function loadAccount(force = false): Promise<Account | null> {
  if (cached && !force) return Promise.resolve(cached);
  if (!pending) pending = load().finally(() => { pending = null; });
  return pending;
}

export function useCmsAccount() {
  const [account, setAccount] = useState(cached);
  useEffect(() => {
    subs.add(setAccount);
    if (cached) setAccount(cached); else void loadAccount();
    return () => { subs.delete(setAccount); };
  }, []);
  return account;
}

export const clearAccountCache = () => { cached = null; };
export const refreshAccount = () => loadAccount(true);
