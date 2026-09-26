import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: { rpc: (fn: "cms_can", args: { _uid: string; _menu: string }) => PromiseLike<{ data: boolean | null }> }; userId: string };

async function assertCanManageUsers(context: Ctx) {
  const { data } = await context.supabase.rpc("cms_can", { _uid: context.userId, _menu: "users" });
  if (!data) throw new Error("You don't have access to manage users.");
}

/** Sends a real invitation (or a new one) so the user can set a password and sign in. */
export const inviteCmsUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertCanManageUsers(context as unknown as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: user, error } = await supabaseAdmin.from("cms_users").select("id,name,email,auth_user_id,first_login_at,deleted_at").eq("id", data.id).single();
    if (error || !user || user.deleted_at) throw new Error("User not found.");
    if (user.first_login_at) throw new Error("This user has already connected.");
    // Keep invitation links on the trusted published origin, never a caller-supplied domain.
    const redirectTo = "https://indonesia-vibes-hub.lovable.app/studio/reset-password";
    const res = await supabaseAdmin.auth.admin.inviteUserByEmail(user.email, { redirectTo, data: { display_name: user.name } });
    if (res.error) {
      // Account already exists but was never confirmed/used: send a password setup link instead.
      const retry = await supabaseAdmin.auth.resetPasswordForEmail(user.email, { redirectTo });
      if (retry.error) { console.error(res.error, retry.error); throw new Error("The invitation could not be sent. Please try again."); }
    }
    const authId = res.data?.user?.id ?? user.auth_user_id;
    await supabaseAdmin.from("cms_users").update({ invited_at: new Date().toISOString(), ...(authId ? { auth_user_id: authId } : {}) }).eq("id", user.id);
    return { ok: true };
  });

/** Turns CMS sign-in on/off. Off also ends existing sessions. */
export const setCmsUserActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), active: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertCanManageUsers(context as unknown as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: user } = await supabaseAdmin.from("cms_users").select("auth_user_id").eq("id", data.id).single();
    if (user?.auth_user_id === context.userId && !data.active) throw new Error("You can't deactivate your own account.");
    await supabaseAdmin.from("cms_users").update({ active: data.active }).eq("id", data.id);
    if (user?.auth_user_id) {
      await supabaseAdmin.auth.admin.updateUserById(user.auth_user_id, { ban_duration: data.active ? "none" : "876000h" });
    }
    return { ok: true };
  });

/** Removes CMS access but keeps the record so history and attribution stay traceable. */
export const deleteCmsUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertCanManageUsers(context as unknown as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: user } = await supabaseAdmin.from("cms_users").select("auth_user_id").eq("id", data.id).single();
    if (user?.auth_user_id === context.userId) throw new Error("You can't delete your own account.");
    await supabaseAdmin.from("cms_users").update({ deleted_at: new Date().toISOString(), active: false }).eq("id", data.id);
    if (user?.auth_user_id) await supabaseAdmin.auth.admin.updateUserById(user.auth_user_id, { ban_duration: "876000h" });
    return { ok: true };
  });
