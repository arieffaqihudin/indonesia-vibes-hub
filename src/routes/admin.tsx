import { Outlet, createFileRoute, redirect, useRouterState } from "@tanstack/react-router";

import { CmsProvider } from "@/lib/cms/store";
import { CmsShell } from "@/components/cms/CmsShell";
import { supabase } from "@/integrations/supabase/client";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (PUBLIC_ADMIN_PATHS.has(location.pathname)) return;
    if (window.localStorage.getItem("iv-cms-remember") === "false" && !window.sessionStorage.getItem("iv-cms-session-active")) {
      await supabase.auth.signOut();
      throw redirect({ to: "/admin/login", search: { redirect: location.href } });
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login", search: { redirect: location.href } });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return <Outlet />;
  if (pathname.startsWith("/admin/preview/")) return <CmsProvider><Outlet /></CmsProvider>;
  return <CmsProvider><CmsShell><Outlet /></CmsShell></CmsProvider>;
}
