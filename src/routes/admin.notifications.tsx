import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import type { AdminNotification } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/notifications")({
  head: adminHead("Notifications", "Things waiting on you, in the order they arrived."),
  component: Notifications,
});

function Notifications() {
  const admin = useAdmin();
  const mine = admin.notifications.filter((n) => !n.roles || n.roles.includes(admin.role));

  useEffect(() => {
    const timer = window.setTimeout(() => admin.markNotificationsRead(), 1500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeading
        eyebrow="System"
        title="Notifications"
        description="Only work that needs a decision from someone in your role. Nothing here is promotional."
        actions={
          <button type="button" className={abtn.secondary} onClick={() => admin.markNotificationsRead()}>
            Mark all as read
          </button>
        }
      />

      {mine.length ? (
        <Card>
          <ul className="space-y-3">
            {mine.map((n) => (
              <li key={n.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-ink">
                    {n.title}
                    {!n.read ? <span className="ml-2 text-xs font-normal text-primary">Unread</span> : null}
                  </p>
                  <span className="text-xs text-muted-foreground">{relative(n.date)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                <NotificationLink notification={n} />
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState title="Nothing needs your attention right now." />
      )}
    </>
  );
}

function NotificationLink({ notification }: { notification: AdminNotification }) {
  const href = notification.href;
  if (!href) return null;
  const className = "mt-1 inline-block text-xs text-primary underline-offset-4 hover:underline";
  if (href.type === "content")
    return (
      <Link to="/admin/content/$id" params={{ id: href.id }} className={className}>
        Open record
      </Link>
    );
  if (href.type === "inquiry")
    return (
      <Link to="/admin/inquiries/$id" params={{ id: href.id }} className={className}>
        Open inquiry
      </Link>
    );
  if (href.type === "collaboration")
    return (
      <Link to="/admin/collaborations/$id" params={{ id: href.id }} className={className}>
        Open collaboration
      </Link>
    );
  return (
    <Link to="/admin/partners/$id" params={{ id: href.id }} className={className}>
      Open partner
    </Link>
  );
}
