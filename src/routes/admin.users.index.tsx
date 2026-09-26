import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { adminHead } from "@/lib/admin/head";
import { logActivity } from "@/lib/cms/activity";
import { inviteCmsUser } from "@/lib/cms/users.functions";
import { rolesListQuery, usersQuery } from "@/lib/cms/users";
import { Confirm, Modal, fmtDateTime } from "@/components/cms/Modal";
import { ActiveLabel, ConnectionLabel } from "@/components/cms/UserBadges";
import { FilterSearch } from "@/components/cms/FilterBar";
import { EmptyState, Field, PageHeader, Select, TextInput, Toggle, btn } from "@/components/cms/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/users/")({
  head: adminHead("Users", "People who can sign in to the CMS."),
  component: UsersPage,
});

function UsersPage() {
  const { data: users = [], isLoading } = useQuery(usersQuery);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const rows = useMemo(() => { const t = q.trim().toLowerCase(); return t ? users.filter((u) => `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(t)) : users; }, [q, users]);
  const cols = "md:grid-cols-[minmax(0,1.6fr)_8rem_8rem_6rem_7rem_9rem_3rem]";
  return <div>
    <PageHeader title="Users" description="People who can sign in to the CMS." actions={<button type="button" className={btn.primary} onClick={() => setAdding(true)}><Plus className="h-4 w-4" />Add User</button>} />
    <div className="mb-4 max-w-sm"><FilterSearch value={q} onChange={setQ} placeholder="Search users…" label="Search users" /></div>
    {isLoading ? <p className="py-8 text-sm text-muted-foreground">Loading…</p> : !rows.length ? <EmptyState filtered={Boolean(q && users.length)} title={q && users.length ? "No users match your search" : "No users yet"} text={q && users.length ? "Try a different name or email." : undefined} action={!users.length ? <button type="button" className={btn.primary} onClick={() => setAdding(true)}>Add User</button> : undefined} /> :
      <div className="divide-y divide-border border-y border-border">
        <div className={cn("hidden gap-4 px-2 py-2 text-xs font-medium text-muted-foreground md:grid", cols)}><span>User</span><span>Phone Number</span><span>Access</span><span>Account</span><span>Login Status</span><span>Last Login</span><span className="text-right">Action</span></div>
        {rows.map((u) => <button key={u.id} type="button" onClick={() => void navigate({ to: "/admin/users/$id", params: { id: u.id } })} className={cn("grid w-full gap-1 px-2 py-3 text-left transition-colors hover:bg-sand active:bg-blush md:items-center md:gap-4", cols)}>
          <span className="min-w-0"><span className="block truncate text-sm font-medium text-ink">{u.name}</span><span className="block truncate text-xs text-muted-foreground">{u.email}</span><span className="md:hidden"><ConnectionLabel connected={Boolean(u.first_login_at)} /></span></span>
          <span className="hidden text-sm text-ink md:block">{u.phone || "—"}</span>
          <span className="text-xs text-ink md:text-sm">{u.role_name}<span className="text-muted-foreground md:hidden"> · {u.active ? "Active" : "Inactive"} · Last login {fmtDateTime(u.last_login_at)}</span></span>
          <span className="hidden md:block"><ActiveLabel active={u.active} /></span>
          <span className="hidden md:block"><ConnectionLabel connected={Boolean(u.first_login_at)} /></span>
          <span className="hidden text-sm text-muted-foreground md:block">{fmtDateTime(u.last_login_at)}</span>
          <span className="hidden text-right text-sm font-medium text-primary md:block">Edit</span>
        </button>)}
      </div>}
    {adding ? <AddUser onClose={() => setAdding(false)} /> : null}
  </div>;
}

const schema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(120),
  email: z.string().trim().email("Enter a valid email.").max(255),
  phone: z.string().trim().max(40).regex(/^[0-9+()\-\s]*$/, "Use numbers only."),
  access_role_id: z.string().uuid("Choose an access role."),
});

function AddUser({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const invite = useServerFn(inviteCmsUser);
  const { data: roles = [] } = useQuery(rolesListQuery);
  const [f, setF] = useState({ name: "", email: "", phone: "", access_role_id: "" });
  const [sendInvite, setSendInvite] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  async function save() {
    const parsed = schema.safeParse(f);
    if (!parsed.success) return void toast.error(parsed.error.issues[0]?.message ?? "Check the form.");
    setBusy(true);
    const { data, error } = await supabase.from("cms_users").insert({ ...parsed.data, email: parsed.data.email.toLowerCase() }).select("id").single();
    if (error || !data) { setBusy(false); return void toast.error(error?.code === "23505" ? "A user with this email already exists." : "Couldn't save this user."); }
    void logActivity("User Created", "Users", parsed.data.name);
    if (sendInvite) {
      try { await invite({ data: { id: data.id, origin: window.location.origin } }); void logActivity("Invitation Sent", "Users", parsed.data.email); toast.success(`Invitation sent to ${parsed.data.email}`); }
      catch (e) { toast.error(e instanceof Error ? e.message : "The invitation could not be sent."); }
    } else toast.success("User saved");
    setBusy(false);
    await qc.invalidateQueries({ queryKey: ["cms-users"] });
    await qc.invalidateQueries({ queryKey: ["cms-access-roles"] });
    onClose();
  }

  return <Modal title="Add User" onClose={onClose} footer={<>
    <button type="button" onClick={onClose} className={btn.secondary}>Cancel</button>
    <button type="button" disabled={busy} onClick={() => void save()} className={btn.primary}>{busy ? "Saving…" : "Save User"}</button>
  </>}>
    <div className="space-y-4">
      <Field label="Name" htmlFor="un"><TextInput id="un" value={f.name} onChange={set("name")} placeholder="Full name" /></Field>
      <Field label="Email" htmlFor="ue"><TextInput id="ue" type="email" value={f.email} onChange={set("email")} placeholder="name@organisation.org" /></Field>
      <Field label="Phone Number" htmlFor="up"><TextInput id="up" type="tel" value={f.phone} onChange={set("phone")} placeholder="0812…" /></Field>
      <Field label="Access Role" htmlFor="ur"><Select id="ur" value={f.access_role_id} onChange={set("access_role_id")} placeholder="Choose access" options={roles.map((r) => ({ value: r.id, label: r.name }))} /></Field>
      <div className="border-t border-border pt-4">
        <p className="mb-2 text-xs font-medium text-ink">Account Access</p>
        <Toggle label="Send CMS Invitation" checked={sendInvite} onChange={(v) => { if (v) { if (!schema.shape.email.safeParse(f.email).success) return void toast.error("Enter a valid email first."); setConfirming(true); } else setSendInvite(false); }} />
        <p className="mt-1 text-xs text-muted-foreground">{sendInvite ? "An invitation email will be sent when you save." : "Off: the user is saved without sending any email."}</p>
      </div>
    </div>
    {confirming ? <Confirm title="Send invitation?" text={<>Send CMS access invitation to <strong>{f.email.trim()}</strong>?</>} confirmLabel="Send Invitation" onConfirm={() => { setSendInvite(true); setConfirming(false); }} onClose={() => setConfirming(false)} /> : null}
  </Modal>;
}
