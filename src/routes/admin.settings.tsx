import { createFileRoute } from "@tanstack/react-router";
import { PageHeading, abtn, field, useConfirm } from "@/components/admin/primitives";
import { useAdmin } from "@/lib/admin/store";
import { can } from "@/lib/admin/types";
import { adminHead } from "@/lib/admin/head";

export const Route = createFileRoute("/admin/settings")({ head: adminHead("Settings", "Manage your CMS preferences."), component: Settings });
function Settings() {
  const admin = useAdmin(); const { confirm, dialog } = useConfirm();
  return <div className="max-w-3xl"><PageHeading title="Settings" description="Profile and CMS preferences." />
    <section className="border-t border-border py-5"><h2 className="mb-4 text-sm font-semibold text-ink">Profile</h2><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs text-muted-foreground">Name<input className={`${field} mt-1`} value={admin.user.name} onChange={(event) => admin.updateUser(admin.user.id, { name: event.target.value })} /></label><label className="text-xs text-muted-foreground">Role<input className={`${field} mt-1`} value={admin.user.role} readOnly /></label></div></section>
    <section className="border-t border-border py-5"><h2 className="text-sm font-semibold text-ink">Demo content</h2><p className="mt-1 text-sm text-muted-foreground">Restore the original CMS records and discard changes made in this browser.</p><button type="button" className={`${abtn.danger} mt-4`} disabled={!can(admin.role, "configure")} onClick={() => confirm("Reset all demo content to its original state?", admin.resetPrototype)}>Reset demo content</button></section>{dialog}
  </div>;
}