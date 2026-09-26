import { Outlet, createFileRoute, redirect, useRouterState } from "@tanstack/react-router";

import { CmsProvider } from "@/lib/cms/store";
import { CmsShell } from "@/components/cms/CmsShell";
import { supabase } from "@/integrations/supabase/client";
import { ALL_MENUS, menuForPath } from "@/lib/cms/access";
import { clearAccountCache, loadAccount } from "@/lib/cms/role";

/** Server-verified once per session; later CMS page changes only read the local session. */
let verifiedUserId: string | null = null;
if (typeof window !== "undefined") supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || !session) verifiedUserId = null;
});

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (PUBLIC_ADMIN_PATHS.has(location.pathname)) return;
    if (window.localStorage.getItem("iv-cms-remember") === "false" && !window.sessionStorage.getItem("iv-cms-session-active")) {
      await supabase.auth.signOut();
      throw redirect({ to: "/admin/login", search: { redirect: location.href } });
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { verifiedUserId = null; throw redirect({ to: "/admin/login", search: { redirect: location.href } }); }
    if (verifiedUserId !== session.user.id) {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) throw redirect({ to: "/admin/login", search: { redirect: location.href } });
      const key = `iv-cms-login:${data.user.id}`;
      if (!window.sessionStorage.getItem(key)) {
        const { data: allowed } = await supabase.rpc("cms_record_login", { _device: navigator.userAgent });
        if (!allowed) {
          await supabase.auth.signOut(); clearAccountCache();
          throw redirect({ to: "/admin/login", search: { denied: "1" } as never });
        }
        window.sessionStorage.setItem(key, "1");
        clearAccountCache();
      }
      verifiedUserId = data.user.id;
    }
    // Permission check per module (the database enforces the same rules for users, access and activity).
    if (location.pathname.startsWith("/admin/preview/")) return;
    const menu = menuForPath(location.pathname);
    if (!menu) return;
    const account = await loadAccount();
    const menus = account?.menus ?? [];
    if (!menus.includes(menu)) {
      const first = ALL_MENUS.find((m) => menus.includes(m.key));
      throw redirect({ to: (first?.to ?? "/admin/profile") as never, replace: true });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return <Outlet />;
  if (pathname.startsWith("/admin/preview/")) return <CmsProvider><Outlet /></CmsProvider>;
  return <CmsProvider><CmsShell><Outlet /></CmsShell></CmsProvider>;
}
