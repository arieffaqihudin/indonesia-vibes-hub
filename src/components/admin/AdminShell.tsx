import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useAdmin } from "@/lib/admin/store";
import { adminSearch, inquiriesNeedingRouting, isInReview, overdueFollowUps } from "@/lib/admin/selectors";
import { ADMIN_ROLES, can, type AdminRole } from "@/lib/admin/types";
import { abtn, field, Modal } from "./primitives";

interface NavItem {
  to: string;
  label: string;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  /** Groups hidden from roles that never work in them. */
  visibleTo?: (role: AdminRole) => boolean;
}

const editorialRole = (role: AdminRole) =>
  can(role, "editorial") || can(role, "verify") || can(role, "subject") || can(role, "language") || can(role, "media") || can(role, "approve");

export function useNavGroups(): NavGroup[] {
  const { content, inquiries, followUps, role } = useAdmin();
  const reviewCount = content.filter(isInReview).length;
  const submissions = content.filter((c) => c.status === "submitted").length;
  const routing = inquiriesNeedingRouting(inquiries).length;
  const overdue = overdueFollowUps(followUps).length;

  return [
    { label: "", items: [{ to: "/admin", label: "Overview" }] },
    {
      label: "Editorial",
      visibleTo: editorialRole,
      items: [
        { to: "/admin/content", label: "Content" },
        { to: "/admin/submissions", label: "Submissions", badge: submissions },
        { to: "/admin/calendar", label: "Editorial calendar" },
        { to: "/admin/review", label: "Review queue", badge: reviewCount },
        { to: "/admin/sources", label: "Sources & verification" },
        { to: "/admin/media", label: "Media & rights" },
      ],
    },
    {
      label: "Cultural network",
      visibleTo: editorialRole,
      items: [
        { to: "/admin/network", label: "Cultural subjects" },
        { to: "/admin/collections", label: "Collections" },
        { to: "/admin/taxonomy", label: "Taxonomy" },
      ],
    },
    {
      label: "Partnerships",
      visibleTo: (r: AdminRole) => can(r, "partnership") || r === "Viewer / Leadership",
      items: [
        { to: "/admin/inquiries", label: "Inquiries", badge: routing },
        { to: "/admin/partners", label: "Partners" },
        { to: "/admin/collaborations", label: "Collaborations" },
        { to: "/admin/opportunities", label: "Opportunities" },
        { to: "/admin/follow-ups", label: "Follow-ups", badge: overdue },
      ],
    },
    {
      label: "Events",
      items: [
        { to: "/admin/events", label: "Events" },
        { to: "/admin/global-agenda", label: "Global agenda" },
      ],
    },
    {
      label: "Insights",
      items: [
        { to: "/admin/insights", label: "Platform overview" },
        { to: "/admin/insights/editorial", label: "Editorial health" },
        { to: "/admin/insights/partnerships", label: "Partnership outcomes" },
      ],
    },
    {
      label: "Curation",
      visibleTo: (r: AdminRole) => can(r, "publish"),
      items: [
        { to: "/admin/curation/homepage", label: "Homepage" },
        { to: "/admin/curation/now", label: "NOW" },
      ],
    },
    {
      label: "System",
      visibleTo: (r: AdminRole) => can(r, "configure") || r === "Managing Editor",
      items: [
        { to: "/admin/users", label: "Users & roles" },
        { to: "/admin/data-health", label: "Data health" },
        { to: "/admin/settings", label: "Settings" },
        { to: "/admin/activity", label: "Activity log" },
      ],
    },
  ].filter((g) => !g.visibleTo || g.visibleTo(role));
}

const CREATE_OPTIONS: { kind: string; label: string }[] = [
  { kind: "story", label: "Story" },
  { kind: "culture", label: "Cultural subject" },
  { kind: "person", label: "Person / community" },
  { kind: "institution", label: "Institution" },
  { kind: "place", label: "Place" },
  { kind: "event", label: "Event" },
  { kind: "opportunity", label: "Opportunity" },
  { kind: "collaboration", label: "Collaboration" },
  { kind: "collection", label: "Collection" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, users, setCurrentUser, notifications, content, inquiries, partners, pipeline } = useAdmin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = useNavGroups();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => setMobileOpen(false), [pathname]);

  const unread = notifications.filter((n) => !n.read && (!n.roles || n.roles.includes(user.role))).length;
  const results = useMemo(
    () => adminSearch(query, { content, inquiries, partners, pipeline }),
    [query, content, inquiries, partners, pipeline],
  );

  const nav = (
    <nav aria-label="Dashboard sections" className="space-y-5 pb-8">
      {groups.map((group, gi) => (
        <div key={group.label || `g${gi}`}>
          {group.label ? (
            <p className="px-3 pb-1.5 text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {group.label}
            </p>
          ) : null}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(`${item.to}/`));
              return (
                <li key={item.to}>
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={item.to as any}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded px-3 py-1.5 text-sm transition-colors",
                      active ? "bg-blush font-medium text-ink" : "text-muted-foreground hover:bg-muted hover:text-ink",
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="rounded bg-ink px-1.5 text-[0.65rem] tabular-nums text-background">{item.badge}</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="space-y-1 border-t border-border px-3 pt-4 text-xs">
        <a href="/" target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-primary">
          View public platform ↗
        </a>
        <a href="/contributor" target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-primary">
          Contributor workspace ↗
        </a>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <button
            type="button"
            className={cn(abtn.small, "lg:hidden")}
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="admin-nav"
          >
            Menu
          </button>
          <Link to="/admin" className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight text-ink">Indonesia Vibes</span>
            <span className="hidden text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase sm:inline">
              Editorial &amp; Partnership
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <button type="button" className={abtn.small} onClick={() => setSearchOpen(true)}>
              Search
            </button>
            <button type="button" className={cn(abtn.primary, "hidden sm:inline-flex")} onClick={() => setCreateOpen(true)}>
              + Create
            </button>
            <Link to="/admin/notifications" className={cn(abtn.small, "relative")}>
              Notifications
              {unread ? (
                <span className="rounded bg-primary px-1.5 text-[0.65rem] tabular-nums text-primary-foreground">{unread}</span>
              ) : null}
            </Link>
            <label className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
              <span className="sr-only">Signed in as</span>
              <select
                className={cn(field, "min-h-8 w-auto py-1 text-xs")}
                value={user.id}
                onChange={(e) => setCurrentUser(e.target.value)}
                aria-label="Prototype role switcher"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.role}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[100rem] gap-6 px-4 py-6">
        <aside id="admin-nav" className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20">{nav}</div>
        </aside>
        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} aria-hidden />
            <div className="relative z-10 h-full w-72 overflow-y-auto border-r border-border bg-card p-4">{nav}</div>
          </div>
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Search the workspace">
        <input
          className={field}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Title, alias, country, organisation or reference number"
          aria-label="Search content, inquiries, partners and collaborations"
        />
        <ul className="max-h-80 space-y-1 overflow-auto">
          {results.map((r) => (
            <li key={`${r.type}-${r.id}`}>
              <button
                type="button"
                className="w-full rounded px-2 py-1.5 text-left hover:bg-muted"
                onClick={() => {
                  setSearchOpen(false);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  navigate({ to: r.to as any, params: r.params as any });
                }}
              >
                <span className="text-sm text-ink">{r.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {r.type} · {r.detail}
                </span>
              </button>
            </li>
          ))}
          {query.length >= 2 && !results.length ? (
            <li className="px-2 py-3 text-sm text-muted-foreground">No records match that search.</li>
          ) : null}
        </ul>
      </Modal>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a record">
        <p className="text-xs text-muted-foreground">
          New records start as drafts and follow the same editorial workflow as contributor submissions.
        </p>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {CREATE_OPTIONS.map((opt) => (
            <li key={opt.kind}>
              <Link
                to="/admin/content/new"
                search={{ kind: opt.kind }}
                className="block rounded border border-border px-3 py-2 text-sm text-ink hover:border-primary hover:text-primary"
                onClick={() => setCreateOpen(false)}
              >
                {opt.label}
              </Link>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

export { ADMIN_ROLES };
