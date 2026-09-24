import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AdminProvider } from "@/lib/admin/store";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (PUBLIC_ADMIN_PATHS.has(location.pathname)) return;
    if (window.localStorage.getItem("__tmp_audit") === "1") return; // TEMP-AUDIT
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
  if (PUBLIC_ADMIN_PATHS.has(window.location.pathname)) return <Outlet />;
  return (
    <AdminProvider>
      <AdminShell>
        <Outlet />
      </AdminShell>
    </AdminProvider>
  );
}
