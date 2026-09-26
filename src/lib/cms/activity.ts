import { supabase } from "@/integrations/supabase/client";
import { loadAccount } from "./role";

/** Records an important CMS action in the read-only activity log. Best effort; never blocks editing. */
export async function logActivity(action: string, module: string, item = "", detail: Record<string, string> = {}) {
  try {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;
    const account = await loadAccount();
    await supabase.from("cms_activity").insert({
      actor_id: uid, actor_name: account?.name ?? data.session?.user.email ?? "", action, module, item: item.slice(0, 300), detail,
      device: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 200) : "",
    });
  } catch { /* logging must never interrupt work */ }
}

export function deviceLabel(ua: string) {
  if (!ua) return "—";
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "";
  return os ? `${browser} · ${os}` : browser;
}
