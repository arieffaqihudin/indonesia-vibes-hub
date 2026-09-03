import { Link, createFileRoute } from "@tanstack/react-router";

import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import { btn, EmptyState, PageHeading, Panel, relativeTime } from "@/components/contributor/primitives";
import { useWorkspace } from "@/lib/contributor/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contributor/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Indonesia Vibes Contributor Workspace" },
      { name: "description", content: "Editorial updates on your submissions, in one place." },
      { property: "og:title", content: "Notifications — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Editorial updates on your submissions, in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, markNotificationsRead } = useWorkspace();

  return (
    <WorkspaceShell>
      <PageHeading
        eyebrow="Notifications"
        title="Editorial updates"
        intro="Every change of status, request for revision and publication notice."
        action={
          notifications.some((n) => !n.read) ? (
            <button type="button" className={btn.secondary} onClick={() => markNotificationsRead()}>
              Mark all as read
            </button>
          ) : null
        }
      />
      <div className="mt-8 max-w-3xl">
        <Panel>
          {notifications.length === 0 ? (
            <EmptyState title="Nothing yet." body="You'll hear from us as soon as a submission moves." />
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li key={n.id} className={cn("flex gap-3 py-4", !n.read && "bg-sand/60")}>
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      n.read ? "bg-border" : "bg-primary",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{n.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {relativeTime(n.date)}
                      {n.read ? "" : " · unread"}
                    </p>
                    {n.submissionId ? (
                      <Link
                        to="/contributor/submissions/$id"
                        params={{ id: n.submissionId }}
                        className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-4"
                      >
                        Open submission
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </WorkspaceShell>
  );
}
