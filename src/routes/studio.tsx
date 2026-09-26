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

const PUBLIC_STUDIO_PATHS = new Set(["/studio/login", "/studio/forgot-password", "/studio/reset-password"]);

export const Route = createFileRoute("/studio")({
  ssr: false,
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  beforeLoad: async ({ location }) => {
    if (PUBLIC_STUDIO_PATHS.has(location.pathname)) return;
    if (window.localStorage.getItem("iv-cms-remember") === "false" && !window.sessionStorage.getItem("iv-cms-session-active")) {
      await supabase.auth.signOut();
      throw redirect({ to: "/studio/login", search: { redirect: location.href } });
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { verifiedUserId = null; throw redirect({ to: "/studio/login", search: { redirect: location.href } }); }
    if (verifiedUserId !== session.user.id) {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) throw redirect({ to: "/studio/login", search: { redirect: location.href } });
      const key = `iv-cms-login:${data.user.id}`;
      if (!window.sessionStorage.getItem(key)) {
        const { data: allowed } = await supabase.rpc("cms_record_login", { _device: navigator.userAgent });
        if (!allowed) {
          await supabase.auth.signOut(); clearAccountCache();
          throw redirect({ to: "/studio/login", search: { denied: "1" } as never });
        }
        window.sessionStorage.setItem(key, "1");
        clearAccountCache();
      }
      verifiedUserId = data.user.id;
    }
    // Permission check per module (the database also enforces sensitive data permissions).
    if (location.pathname.startsWith("/studio/preview/")) return;
    const menu = menuForPath(location.pathname);
    if (!menu) return;
    const account = await loadAccount();
    const menus = account?.menus ?? [];
    if (!menus.includes(menu)) {
      const first = ALL_MENUS.find((m) => menus.includes(m.key));
      throw redirect({ to: (first?.to ?? "/studio/profile") as never, replace: true });
    }
  },
  component: StudioLayout,
});

function StudioLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (PUBLIC_STUDIO_PATHS.has(pathname)) return <Outlet />;
  if (pathname.startsWith("/studio/preview/")) return <CmsProvider><Outlet /></CmsProvider>;
  return <CmsProvider><CmsShell><Outlet /></CmsShell></CmsProvider>;
}
