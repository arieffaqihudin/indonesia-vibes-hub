import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AdminProvider } from "@/lib/admin/store";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  // Internal workspace state lives in the browser for this prototype.
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminProvider>
      <AdminShell>
        <Outlet />
      </AdminShell>
    </AdminProvider>
  );
}
