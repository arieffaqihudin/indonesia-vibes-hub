import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { clearAccountCache } from "@/lib/cms/role";
import { inputClass } from "./ui";

/** Signed-in password change through the real auth backend. */
export function ChangePasswordDialog({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) return setError("Use at least 8 characters.");
    if (next !== confirm) return setError("Passwords do not match.");
    setBusy(true); setError("");
    const { error: err } = await supabase.auth.updateUser({ password: next, current_password: current, data: { must_change_password: false } } as Parameters<typeof supabase.auth.updateUser>[0]);
    setBusy(false);
    if (err) return setError(err.message.toLowerCase().includes("current") ? "Your current password is incorrect." : err.message);
    clearAccountCache();
    toast.success("Password updated");
    onClose();
    window.location.reload();
  }

  return <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Change password">
    <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/40" onClick={onClose} />
    <form onSubmit={(e) => void submit(e)} className="relative w-full max-w-sm rounded-md border border-border bg-background p-5 shadow-xl">
      <h2 className="text-base font-semibold text-ink">Set a new password</h2>
      <label className="mt-4 block text-xs font-medium text-ink">Current password<input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={`${inputClass} mt-1`} required /></label>
      <label className="mt-3 block text-xs font-medium text-ink">New password<input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={`${inputClass} mt-1`} required /></label>
      <label className="mt-3 block text-xs font-medium text-ink">Confirm new password<input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`${inputClass} mt-1`} required /></label>
      {error ? <p role="alert" className="mt-3 text-xs text-destructive">{error}</p> : null}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="h-9 rounded-md border border-border px-3 text-sm">Cancel</button>
        <button type="submit" disabled={busy} className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Update password"}</button>
      </div>
    </form>
  </div>;
}
