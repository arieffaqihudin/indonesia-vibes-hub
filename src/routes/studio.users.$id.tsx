import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { adminHead } from "@/lib/studio/head";
import { logActivity } from "@/lib/cms/activity";
import { useCmsAccount } from "@/lib/cms/role";
import { deleteCmsUser, inviteCmsUser, setCmsUserActive } from "@/lib/cms/users.functions";
import { rolesListQuery, usersQuery } from "@/lib/cms/users";
import { Confirm, fmtDateTime } from "@/components/cms/Modal";
import { ConnectionLabel } from "@/components/cms/UserBadges";
import { Field, Select, TextInput, Toggle, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/studio/users/$id")({
  head: adminHead("Edit User", "Update a CMS user's details and access."),
  component: EditUser,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-t border-border py-5 first:border-0 first:pt-0"><h2 className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{title}</h2>{children}</section>;
}

function EditUser() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const me = useCmsAccount();
  const { data: users, isLoading } = useQuery(usersQuery);
  const { data: roles = [] } = useQuery(rolesListQuery);
  const user = users?.find((u) => u.id === id);
  const invite = useServerFn(inviteCmsUser);
  const setActive = useServerFn(setCmsUserActive);
  const del = useServerFn(deleteCmsUser);
  const [f, setF] = useState({ name: "", phone: "", access_role_id: "" });
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | "invite" | "delete" | "deactivate">(null);
  useEffect(() => { if (user) setF({ name: user.name, phone: user.phone, access_role_id: user.access_role_id ?? "" }); }, [user]);

  if (isLoading) return <p className="py-8 text-sm text-muted-foreground">Loading…</p>;
  if (!user) return <div className="py-12 text-center"><p className="text-sm text-muted-foreground">This user doesn't exist or was deleted.</p><Link to="/studio/users" className="mt-3 inline-block text-sm font-medium text-primary">Back to Users</Link></div>;
  const isMe = user.id === me?.cmsUserId;
  const connected = Boolean(user.first_login_at);
  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ["cms-users"] }), qc.invalidateQueries({ queryKey: ["cms-access-roles"] })]);

  async function save() {
    const p = z.object({ name: z.string().trim().min(1).max(120), phone: z.string().trim().max(40).regex(/^[0-9+()\-\s]*$/), access_role_id: z.string().uuid() }).safeParse(f);
    if (!p.success) return void toast.error("Check the name, phone number and access role.");
    setBusy("save");
    const { error } = await supabase.from("cms_users").update(p.data).eq("id", id);
    setBusy(null);
    if (error) return void toast.error("Couldn't save changes.");
    void logActivity("User Updated", "Users", p.data.name);
    toast.success("User updated"); void refresh();
  }
  async function run(kind: "invite" | "delete" | "active", fn: () => Promise<unknown>, done: string, log: [string, string]) {
    setBusy(kind);
    try { await fn(); void logActivity(log[0], "Users", log[1]); toast.success(done); await refresh(); return true; }
    catch (e) { toast.error(e instanceof Error ? e.message : "Something went wrong."); return false; }
    finally { setBusy(null); setConfirm(null); }
  }

  return <div className="mx-auto max-w-2xl">
    <Link to="/studio/users" className={`${btn.ghost} -ml-2.5 mb-3`}><ArrowLeft className="h-4 w-4" />Users</Link>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-xl font-semibold text-ink">{user.name}</h1><p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p></div>
      <button type="button" disabled={busy === "save"} onClick={() => void save()} className={btn.primary}>{busy === "save" ? "Saving…" : "Save Changes"}</button>
    </div>

    <Section title="Basic Information"><div className="space-y-4">
      <Field label="Name" htmlFor="n"><TextInput id="n" value={f.name} onChange={(v) => setF({ ...f, name: v })} /></Field>
      <Field label="Email" hint="The sign-in email can't be changed here."><p className="flex h-9 items-center text-sm text-ink">{user.email}</p></Field>
      <Field label="Phone Number" htmlFor="p"><TextInput id="p" type="tel" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} /></Field>
    </div></Section>

    <Section title="Access">
      <Field label="Access Role" htmlFor="r" hint={isMe ? "You can't change your own access role." : undefined}>
        {isMe ? <p className="flex h-9 items-center text-sm text-ink">{user.role_name}</p> : <Select id="r" value={f.access_role_id} onChange={(v) => setF({ ...f, access_role_id: v })} options={roles.map((r) => ({ value: r.id, label: r.name }))} />}
      </Field>
    </Section>

    <Section title="Account">
      <div className="space-y-3">
        {isMe ? <p className="text-sm text-ink">Account active <span className="text-xs text-muted-foreground">(you can't deactivate yourself)</span></p> :
          <Toggle label="Account Active" checked={user.active} onChange={(v) => v ? void run("active", () => setActive({ data: { id, active: true } }), "Account activated", ["User Enabled", user.name]) : setConfirm("deactivate")} />}
        <dl className="grid gap-2 text-sm sm:grid-cols-[9rem_1fr]">
          <dt className="text-muted-foreground">Login Status</dt><dd><ConnectionLabel connected={connected} /></dd>
          <dt className="text-muted-foreground">Invitation</dt><dd className="text-ink">{user.invited_at ? `Sent ${fmtDateTime(user.invited_at)}` : "Not sent"}</dd>
          <dt className="text-muted-foreground">First Login</dt><dd className="text-ink">{fmtDateTime(user.first_login_at)}</dd>
          <dt className="text-muted-foreground">Last Login</dt><dd className="text-ink">{fmtDateTime(user.last_login_at)}</dd>
        </dl>
      </div>
    </Section>

    <Section title="Actions">
      <div className="flex flex-wrap gap-2">
        {!connected ? <button type="button" className={btn.secondary} disabled={busy === "invite" || !user.active} onClick={() => setConfirm("invite")}>{user.invited_at ? "Resend Invitation" : "Send CMS Invitation"}</button> : null}
        {!isMe && user.active ? <button type="button" className={btn.secondary} onClick={() => setConfirm("deactivate")}>Deactivate User</button> : null}
        {!isMe ? <button type="button" className={btn.danger} onClick={() => setConfirm("delete")}>Delete User</button> : null}
      </div>
      {connected ? <p className="mt-2 text-xs text-muted-foreground">To reset a password, the user can choose “Forgot password?” on the sign-in page.</p> : null}
    </Section>

    {confirm === "invite" ? <Confirm title="Send invitation?" text={<>Send CMS access invitation to <strong>{user.email}</strong>?</>} confirmLabel="Send Invitation" busy={busy === "invite"} onConfirm={() => void run("invite", () => invite({ data: { id, origin: window.location.origin } }), `Invitation sent to ${user.email}`, ["Invitation Sent", user.email])} onClose={() => setConfirm(null)} /> : null}
    {confirm === "deactivate" ? <Confirm danger title={`Deactivate ${user.name}?`} text="They won't be able to sign in and any open sessions will end. Their details and activity history are kept." confirmLabel="Deactivate" busy={busy === "active"} onConfirm={() => void run("active", () => setActive({ data: { id, active: false } }), "Account deactivated", ["User Disabled", user.name])} onClose={() => setConfirm(null)} /> : null}
    {confirm === "delete" ? <Confirm danger title={`Delete ${user.name}?`} text="They lose CMS access and disappear from this list. Content they worked on and their activity history stay traceable under their name." confirmLabel="Delete User" busy={busy === "delete"} onConfirm={() => void run("delete", () => del({ data: { id } }), "User deleted", ["User Deleted", user.name]).then((ok) => { if (ok) void navigate({ to: "/studio/users" }); })} onClose={() => setConfirm(null)} /> : null}
  </div>;
}
