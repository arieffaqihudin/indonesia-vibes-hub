import { Outlet, createFileRoute, redirect, useRouterState } from "@tanstack/react-router";

import { CmsProvider } from "@/lib/cms/store";
import { CmsShell } from "@/components/cms/CmsShell";
import { supabase } from "@/integrations/supabase/client";

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
    if (verifiedUserId === session.user.id) return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login", search: { redirect: location.href } });
    verifiedUserId = data.user.id;
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return <Outlet />;
  if (pathname.startsWith("/admin/preview/")) return <CmsProvider><Outlet /></CmsProvider>;
  return <CmsProvider><CmsShell><Outlet /></CmsShell></CmsProvider>;
}
