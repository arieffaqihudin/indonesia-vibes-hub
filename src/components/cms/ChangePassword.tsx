import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { refreshAccount } from "@/lib/cms/role";
import { cn } from "@/lib/utils";
import { btn, inputClass } from "./ui";

const RULES: [string, (p: string) => boolean][] = [
  ["At least 8 characters", (p) => p.length >= 8],
  ["An uppercase letter", (p) => /[A-Z]/.test(p)],
  ["A lowercase letter", (p) => /[a-z]/.test(p)],
  ["A number", (p) => /\d/.test(p)],
  ["A special character", (p) => /[^A-Za-z0-9]/.test(p)],
];

function PasswordInput({ id, label, value, onChange, autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return <div><label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink">{label}</label>
    <div className="relative"><input id={id} type={show ? "text" : "password"} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "h-11 pr-11")} />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-ink">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
  </div>;
}

/** Signed-in password change through the real auth backend; the current password is verified first. */
export function ChangePasswordForm({ email }: { email: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const ok = RULES.every(([, t]) => t(next));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!current) return setError("Enter your current password.");
    if (!ok) return setError("Your new password doesn't meet all the requirements.");
    if (next !== confirm) return setError("Passwords do not match.");
    setBusy(true); setError("");
    const check = await supabase.auth.signInWithPassword({ email, password: current });
    if (check.error) { setBusy(false); return setError("Your current password is incorrect."); }
    const { error: err } = await supabase.auth.updateUser({ password: next, data: { must_change_password: false } });
    setBusy(false);
    if (err) return setError(/same|different/i.test(err.message) ? "Choose a password you haven't used before." : err.message);
    setCurrent(""); setNext(""); setConfirm("");
    void refreshAccount();
    toast.success("Password updated successfully.");
  }

  return <form onSubmit={(e) => void submit(e)} className="max-w-sm space-y-4" noValidate>
    <PasswordInput id="pw-current" label="Current Password" value={current} onChange={setCurrent} autoComplete="current-password" />
    <PasswordInput id="pw-new" label="New Password" value={next} onChange={setNext} autoComplete="new-password" />
    <ul className="grid gap-1 text-xs sm:grid-cols-2">{RULES.map(([label, test]) => <li key={label} className={test(next) ? "text-primary" : "text-muted-foreground"}>{test(next) ? "✓" : "·"} {label}</li>)}</ul>
    <PasswordInput id="pw-confirm" label="Confirm New Password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
    {error ? <p role="alert" className="text-xs text-deep-red">{error}</p> : null}
    <button type="submit" disabled={busy} className={btn.primary}>{busy ? "Saving…" : "Change Password"}</button>
  </form>;
}
