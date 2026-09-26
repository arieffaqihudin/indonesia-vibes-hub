import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { adminHead } from "@/lib/admin/head";
import { ALL_MENUS, MENU_GROUPS, type MenuKey } from "@/lib/cms/access";
import { logActivity } from "@/lib/cms/activity";
import { refreshAccount, useCmsAccount } from "@/lib/cms/role";
import { formatWhen } from "@/lib/cms/store";
import { Confirm, Modal } from "@/components/cms/Modal";
import { EmptyState, Field, PageHeader, TextArea, TextInput, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/access")({
  head: adminHead("Access", "Who can open which parts of the CMS."),
  component: AccessPage,
});

type Role = { id: string; name: string; description: string; menus: string[]; is_system: boolean; updated_at: string; users: number };

export const rolesQuery = {
  queryKey: ["cms-access-roles"],
  queryFn: async (): Promise<Role[]> => {
    const [{ data: roles, error }, { data: users }] = await Promise.all([
      supabase.from("cms_access_roles").select("*").order("created_at"),
      supabase.from("cms_users").select("access_role_id").is("deleted_at", null),
    ]);
    if (error) throw error;
    return (roles ?? []).map((r) => ({ ...r, users: (users ?? []).filter((u) => u.access_role_id === r.id).length }));
  },
};

function AccessPage() {
  const { data: roles = [], isLoading } = useQuery(rolesQuery);
  const [editing, setEditing] = useState<Role | "new" | null>(null);
  return <div className="mx-auto max-w-4xl">
    <PageHeader title="Access" description="Choose which parts of the CMS each access role can open." actions={<button type="button" className={btn.primary} onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Add Access</button>} />
    {isLoading ? <p className="py-8 text-sm text-muted-foreground">Loading…</p> : !roles.length ? <EmptyState title="No access roles yet" action={<button type="button" className={btn.primary} onClick={() => setEditing("new")}>Add Access</button>} /> :
      <div className="divide-y divide-border border-y border-border">
        <div className="hidden grid-cols-[minmax(0,1fr)_7rem_9rem_5rem] gap-4 px-2 py-2 text-xs font-medium text-muted-foreground sm:grid"><span>Access Name</span><span>Users</span><span>Last Updated</span><span className="text-right">Action</span></div>
        {roles.map((r) => <button key={r.id} type="button" onClick={() => setEditing(r)} className="grid w-full gap-1 px-2 py-3 text-left transition-colors hover:bg-sand active:bg-blush sm:grid-cols-[minmax(0,1fr)_7rem_9rem_5rem] sm:items-center sm:gap-4">
          <span className="min-w-0"><span className="flex items-center gap-1.5 text-sm font-medium text-ink">{r.name}{r.is_system ? <Lock className="h-3 w-3 text-muted-foreground" aria-label="Protected" /> : null}</span>{r.description ? <span className="block truncate text-xs text-muted-foreground">{r.description}</span> : null}</span>
          <span className="text-sm text-ink">{r.users} {r.users === 1 ? "User" : "Users"}</span>
          <span className="text-xs text-muted-foreground sm:text-sm">{formatWhen(r.updated_at)}</span>
          <span className="hidden text-right text-sm font-medium text-primary sm:block">Edit</span>
        </button>)}
      </div>}
    {editing ? <AccessForm role={editing === "new" ? null : editing} onClose={() => setEditing(null)} /> : null}
  </div>;
}

function AccessForm({ role, onClose }: { role: Role | null; onClose: () => void }) {
  const qc = useQueryClient();
  const account = useCmsAccount();
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [menus, setMenus] = useState<Set<string>>(new Set(role?.menus ?? ["dashboard", "profile"]));
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<null | "delete" | "self">(null);
  const locked = Boolean(role?.is_system);
  const toggle = (k: MenuKey, on: boolean) => setMenus((m) => { const n = new Set(m); if (on) n.add(k); else n.delete(k); return n; });

  // Is this the role the signed-in person currently uses?
  const isOwnRole = Boolean(role && account && account.role === role.name);
  const losesAdmin = isOwnRole && ["access", "users", "profile"].some((k) => !menus.has(k));

  async function save(force = false) {
    if (!name.trim()) return void toast.error("Give this access role a name.");
    if (losesAdmin && !force) return void setConfirm("self");
    setBusy(true);
    const payload = { name: name.trim().slice(0, 80), description: description.trim().slice(0, 300), menus: ALL_MENUS.map((m) => m.key).filter((k) => menus.has(k)) };
    const { error } = role ? await supabase.from("cms_access_roles").update(payload).eq("id", role.id) : await supabase.from("cms_access_roles").insert(payload);
    setBusy(false);
    if (error) return void toast.error(error.code === "23505" ? "An access role with this name already exists." : "Couldn't save this access role.");
    void logActivity(role ? "Access Role Updated" : "Access Role Created", "Access", payload.name);
    toast.success(role ? "Access updated" : "Access created");
    await qc.invalidateQueries({ queryKey: ["cms-access-roles"] });
    if (isOwnRole) void refreshAccount();
    onClose();
  }

  async function remove() {
    if (!role) return;
    setBusy(true);
    const { error } = await supabase.from("cms_access_roles").delete().eq("id", role.id);
    setBusy(false);
    if (error) return void toast.error("Couldn't delete this access role.");
    void logActivity("Access Role Deleted", "Access", role.name);
    await qc.invalidateQueries({ queryKey: ["cms-access-roles"] });
    toast.success("Access deleted"); onClose();
  }

  return <Modal wide title={role ? `Edit ${role.name}` : "Add Access"} onClose={onClose} footer={<>
    {role && !locked ? <button type="button" onClick={() => setConfirm("delete")} className={`${btn.ghost} mr-auto text-deep-red`}>Delete</button> : null}
    <button type="button" onClick={onClose} className={btn.secondary}>Cancel</button>
    <button type="button" disabled={busy} onClick={() => void save()} className={btn.primary}>{busy ? "Saving…" : "Save"}</button>
  </>}>
    <div className="space-y-4">
      <Field label="Access Name" htmlFor="an"><TextInput id="an" value={name} onChange={setName} placeholder="e.g. Content Editor" /></Field>
      <Field label="Description" htmlFor="ad"><TextArea id="ad" rows={2} value={description} onChange={setDescription} placeholder="What this role is for" /></Field>
      <div>
        <p className="text-xs font-medium text-ink">Menu Access</p>
        {locked ? <p className="mt-1 text-xs text-muted-foreground">Administrator is a protected role and always keeps access to everything.</p> : null}
        <div className="mt-2 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {MENU_GROUPS.map((g, i) => {
            const all = g.items.every((it) => menus.has(it.key));
            return <fieldset key={g.label ?? i} disabled={locked} className="disabled:opacity-60">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <legend className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{g.label ?? "General"}</legend>
                {g.items.length > 1 ? <label className="flex min-h-11 items-center gap-2 text-xs text-muted-foreground sm:min-h-8"><input type="checkbox" checked={all} onChange={(e) => g.items.forEach((it) => toggle(it.key, e.target.checked))} className="h-4 w-4 accent-primary" />Select All</label> : null}
              </div>
              <div className="mt-1">{g.items.map((it) => <label key={it.key} className="flex min-h-11 items-center gap-2.5 text-sm text-ink sm:min-h-9"><input type="checkbox" checked={locked || menus.has(it.key)} onChange={(e) => toggle(it.key, e.target.checked)} className="h-4 w-4 accent-primary" />{it.label}</label>)}</div>
            </fieldset>;
          })}
        </div>
      </div>
    </div>
    {confirm === "delete" && role ? (role.users > 0
      ? <Confirm title="Can't delete yet" text={<>This access role is currently used by {role.users} {role.users === 1 ? "user" : "users"}. Please assign {role.users === 1 ? "that user" : "those users"} to another access role before deleting.</>} confirmLabel="" onClose={() => setConfirm(null)} />
      : <Confirm danger title={`Delete ${role.name}?`} text="This access role will be removed. This can't be undone." confirmLabel="Delete" busy={busy} onConfirm={() => void remove()} onClose={() => setConfirm(null)} />) : null}
    {confirm === "self" ? <Confirm danger title="Remove your own access?" text="You are using this access role. Unticking Access, User or Profile will lock you out of those areas, and you may not be able to undo it yourself." confirmLabel="Save anyway" onConfirm={() => { setConfirm(null); void save(true); }} onClose={() => setConfirm(null)} /> : null}
  </Modal>;
}
