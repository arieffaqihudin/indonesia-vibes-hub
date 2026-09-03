import { createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { ADMIN_ROLES, ROLE_CAPABILITIES, can, type AdminRole } from "@/lib/admin/types";
import { Card, PageHeading, PrototypeNote, Table, Td, field } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/users")({
  head: adminHead("Users and roles", "Who is on the team and what each role can do."),
  component: Users,
});

function Users() {
  const admin = useAdmin();
  const editable = can(admin.role, "configure");

  return (
    <>
      <PageHeading
        eyebrow="System"
        title="Users and roles"
        description="Roles describe responsibility, not seniority. Everyone can see the work; only some can approve or publish it."
      />

      <Card title="Team">
        <Table head={["Name", "Focus", "Role", "Status"]}>
          {admin.users.map((u) => (
            <tr key={u.id} className="border-b border-border last:border-0">
              <Td>
                <span className="text-ink">{u.name}</span>
                <span className="block text-xs text-muted-foreground">{u.email}</span>
              </Td>
              <Td>{u.focus}</Td>
              <Td>
                <label className="sr-only" htmlFor={`role-${u.id}`}>
                  Role for {u.name}
                </label>
                <select
                  id={`role-${u.id}`}
                  className={`${field} min-h-8 py-1 text-xs`}
                  value={u.role}
                  disabled={!editable}
                  onChange={(e) => admin.updateUser(u.id, { role: e.target.value as AdminRole })}
                >
                  {ADMIN_ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Td>
              <Td>
                <button
                  type="button"
                  className="text-xs text-primary underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline"
                  disabled={!editable}
                  onClick={() => admin.updateUser(u.id, { active: !u.active })}
                >
                  {u.active ? "Active — deactivate" : "Inactive — reactivate"}
                </button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="mt-4">
        <Card title="What each role can do">
          <ul className="space-y-2 text-sm">
            {ADMIN_ROLES.map((r) => (
              <li key={r}>
                <span className="text-ink">{r}</span>
                <span className="ml-2 text-xs text-muted-foreground">{ROLE_CAPABILITIES[r].join(", ") || "Read-only"}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <PrototypeNote>Role changes affect this prototype session only.</PrototypeNote>
      </div>
    </>
  );
}
