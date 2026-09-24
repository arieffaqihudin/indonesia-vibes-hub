import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AdminProvider } from "@/lib/admin/store";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
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
