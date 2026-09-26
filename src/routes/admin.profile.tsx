import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { adminHead } from "@/lib/admin/head";
import { refreshAccount, useCmsAccount } from "@/lib/cms/role";
import { ChangePasswordForm } from "@/components/cms/ChangePassword";
import { fmtDateTime } from "@/components/cms/Modal";
import { ActiveLabel } from "@/components/cms/UserBadges";
import { Field, PageHeader, TextInput, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/profile")({
  head: adminHead("Profile", "Your CMS profile and password."),
  component: Profile,
});

/** Shrinks a chosen photo to a small square so it can be stored with the profile. */
function toAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const size = 160, c = document.createElement("canvas"); c.width = size; c.height = size;
      const s = Math.min(img.width, img.height);
      c.getContext("2d")!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(img.src); resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function Profile() {
  const account = useCmsAccount();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => { if (account) { setName(account.name); setPhone(account.phone); setAvatar(account.avatar); } }, [account]);
  useEffect(() => { if (window.location.hash === "#password") document.getElementById("password")?.scrollIntoView({ behavior: "smooth" }); }, []);

  async function save() {
    if (!name.trim()) return toast.error("Enter your name.");
    if (!/^[0-9+()\-\s]*$/.test(phone)) return toast.error("Use numbers only for the phone number.");
    setBusy(true);
    const { error } = await supabase.rpc("cms_update_profile", { _name: name.trim(), _phone: phone.trim(), _avatar: avatar ?? "" });
    setBusy(false);
    if (error) return toast.error("Couldn't save your profile.");
    await refreshAccount();
    toast.success("Profile saved");
  }

  const initials = (name || "?").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const managed = Boolean(account?.cmsUserId);
  return <div className="mx-auto max-w-2xl">
    <PageHeader title="Profile" description="Your own details. Only an administrator can change your access." />
    <section className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-ink text-lg font-semibold text-primary-foreground">{avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : initials}</div>
        <div className="flex gap-2">
          <button type="button" className={btn.secondary} disabled={!managed} onClick={() => file.current?.click()}>Change Photo</button>
          {avatar ? <button type="button" className={btn.ghost} onClick={() => setAvatar(null)}>Remove</button> : null}
          <input ref={file} type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { setAvatar(await toAvatar(f)); } catch { toast.error("That image couldn't be read."); } } e.target.value = ""; }} />
        </div>
      </div>
      <Field label="Name" htmlFor="pn"><TextInput id="pn" value={name} onChange={setName} /></Field>
      <Field label="Phone Number" htmlFor="pp"><TextInput id="pp" type="tel" value={phone} onChange={setPhone} /></Field>
      <dl className="grid gap-2 border-t border-border pt-4 text-sm sm:grid-cols-[9rem_1fr]">
        <dt className="text-muted-foreground">Email</dt><dd className="text-ink">{account?.email ?? "…"}</dd>
        <dt className="text-muted-foreground">Access Role</dt><dd className="text-ink">{account?.role ?? "…"}</dd>
        <dt className="text-muted-foreground">Account Status</dt><dd>{account ? <ActiveLabel active={account.active} /> : "…"}</dd>
        <dt className="text-muted-foreground">Last Login</dt><dd className="text-ink">{fmtDateTime(account?.lastLogin)}</dd>
      </dl>
      <button type="button" className={btn.primary} disabled={busy || !managed} onClick={() => void save()}>{busy ? "Saving…" : "Save Profile"}</button>
    </section>
    <section id="password" className="mt-10 scroll-mt-20 border-t border-border pt-6">
      <h2 className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Change Password</h2>
      {account ? <ChangePasswordForm email={account.email} /> : null}
    </section>
  </div>;
}
