import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  FileEdit,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  PlusCircle,
  Users,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import markRed from "@/assets/mark-red.png";
import { useWorkspace } from "@/lib/contributor/store";
import { STATUSES } from "@/lib/contributor/schema";
import { cn } from "@/lib/utils";
import { btn, relativeTime } from "./primitives";

const NAV: { label: string; to: string; icon: typeof LayoutDashboard; children?: { label: string; search?: Record<string, string> }[] }[] = [
  { label: "Overview", to: "/contributor", icon: LayoutDashboard },
  {
    label: "Submissions",
    to: "/contributor/submissions",
    icon: FileEdit,
    children: [
      { label: "All submissions" },
      { label: "Drafts", search: { tab: "draft" } },
      { label: "In review", search: { tab: "in-review" } },
      { label: "Needs revision", search: { tab: "revision_requested" } },
      { label: "Approved", search: { tab: "approved" } },
      { label: "Published", search: { tab: "published" } },
    ],
  },
  { label: "Create new", to: "/contributor/new", icon: PlusCircle },
  { label: "Organisation", to: "/contributor/organisation", icon: Building2 },
  { label: "Team", to: "/contributor/team", icon: Users },
  { label: "Help & guidelines", to: "/contributor/help", icon: LifeBuoy },
  { label: "Account", to: "/contributor/account", icon: UserCircle },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search as Record<string, unknown> });

  return (
    <nav aria-label="Contributor workspace" className="space-y-1">
      {NAV.map((item) => {
        const active =
          item.to === "/contributor" ? pathname === "/contributor" : pathname.startsWith(item.to);
        return (
          <div key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-blush font-medium text-clay" : "text-muted-foreground hover:bg-sand hover:text-ink",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
            {item.children && pathname.startsWith(item.to) ? (
              <ul className="mt-1 mb-2 ml-6 space-y-0.5 border-l border-border pl-3">
                {item.children.map((child) => {
                  const childActive =
                    (search["tab"] ?? undefined) === (child.search?.["tab"] ?? undefined);
                  return (
                    <li key={child.label}>
                      <Link
                        to="/contributor/submissions"
                        search={child.search ?? {}}
                        onClick={onNavigate}
                        className={cn(
                          "block rounded px-2 py-1.5 text-[0.82rem] transition-colors",
                          childActive ? "font-medium text-primary" : "text-muted-foreground hover:text-ink",
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

function NotificationBell() {
  const { notifications, markNotificationsRead } = useWorkspace();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) markNotificationsRead();
        }}
        aria-expanded={open}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-primary hover:text-primary"
      >
        <Bell className="h-4 w-4" aria-hidden />
        {unread > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-semibold text-primary-foreground">
            {unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-border bg-card p-2 shadow-lg">
          <p className="px-2 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Notifications
          </p>
          {notifications.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">Nothing yet.</p>
          ) : (
            <ul className="max-h-80 overflow-auto">
              {notifications.slice(0, 8).map((n) => (
                <li key={n.id}>
                  <Link
                    to={n.submissionId ? "/contributor/submissions/$id" : "/contributor"}
                    {...(n.submissionId ? { params: { id: n.submissionId } } : {})}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-2.5 hover:bg-sand"
                  >
                    <p className="text-sm font-medium text-ink">{n.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[0.7rem] text-muted-foreground">{relativeTime(n.date)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The workspace chrome. Deliberately quieter than the public platform:
 * one column of navigation, no immersive imagery, task-oriented.
 */
export function WorkspaceShell({
  children,
  requireAuth = true,
}: {
  children: ReactNode;
  requireAuth?: boolean;
}) {
  const { user, hydrated, signOut, submissions } = useWorkspace();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setDrawer(false), [pathname]);

  useEffect(() => {
    if (!hydrated || !requireAuth) return;
    if (!user) navigate({ to: "/contributor/login" });
    else if (!user.onboarded) navigate({ to: "/contributor/onboarding" });
  }, [hydrated, requireAuth, user, navigate]);

  const needsAction = submissions.filter((s) => STATUSES[s.status].actionNeeded).length;

  if (requireAuth && (!hydrated || !user)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Opening your workspace…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setDrawer(true)}
            aria-label="Open workspace menu"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </button>
          <Link to="/contributor" className="flex items-center gap-2.5">
            <img src={markRed} alt="" width={32} height={32} className="h-7 w-7 object-contain" />
            <span className="text-[0.95rem] leading-tight font-semibold tracking-tight text-ink">
              Indonesia<span className="text-primary"> Vibes</span>
              <span className="ml-2 hidden border-l border-border pl-2 text-xs font-normal text-muted-foreground sm:inline">
                Contributor
              </span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <a
              href="/"
              className="hidden text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline sm:inline"
            >
              View Indonesia Vibes ↗
            </a>
            <NotificationBell />
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-ink">{user?.name}</p>
              <p className="text-[0.7rem] text-muted-foreground">{user?.workspaceRole}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24">
            <NavList />
            {needsAction > 0 ? (
              <p className="mt-6 rounded-md bg-blush px-3 py-2 text-xs text-clay">
                {needsAction} submission{needsAction === 1 ? "" : "s"} need your attention.
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                signOut();
                navigate({ to: "/contributor/login" });
              }}
              className="mt-6 px-3 text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 pb-16">{children}</div>
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 overflow-auto bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Workspace</span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <NavList onNavigate={() => setDrawer(false)} />
            <a href="/" className="mt-6 block px-3 text-xs text-muted-foreground hover:text-primary">
              View Indonesia Vibes ↗
            </a>
            <button
              type="button"
              onClick={() => {
                signOut();
                navigate({ to: "/contributor/login" });
              }}
              className={cn(btn.quiet, "mt-4 ml-3")}
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Centred shell for the authentication and onboarding screens. */
export function AuthShell({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-sand lg:grid-cols-[1fr_1.1fr]">
      <div className="hidden flex-col justify-between bg-ink-deep p-12 text-background lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={markRed} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="text-sm font-semibold">Indonesia Vibes</span>
        </Link>
        <div className="max-w-md">
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-pink uppercase">
            Contributor workspace
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight">
            You hold something worth sharing. We help you submit it properly.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-background/70">
            Embassies, museums, universities, archives, communities, festivals and artists propose
            stories, events, opportunities, profiles and collaborations here. Our editorial team
            prepares them for a global readership — and tells you exactly where yours stands.
          </p>
        </div>
        <p className="text-xs text-background/50">Prototype environment. No real submissions are sent.</p>
      </div>
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <img src={markRed} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="text-sm font-semibold text-ink">Indonesia Vibes</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          {intro ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p> : null}
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-8 text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
