import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  Activity,
  BellRing,
  BookOpen,
  Building2,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Drum,
  FileText,
  Handshake,
  History,
  Home,
  Image,
  Inbox,
  Landmark,
  Layers,
  LayoutDashboard,
  Library,
  MapPin,
  MenuIcon,
  MessageSquare,
  Search as SearchIcon,
  Settings,
  Sparkles,
  Star,
  Tags,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAdmin } from "@/lib/admin/store";
import { adminSearch, inquiriesNeedingRouting, isInReview, overdueFollowUps } from "@/lib/admin/selectors";
import { ADMIN_ROLES, can, type AdminRole } from "@/lib/admin/types";
import { abtn, field, Modal } from "./primitives";

interface NavItem {
  to: string;
  label: string;
  badge?: number;
  icon: LucideIcon;
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
    { label: "", items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
    {
      label: "Content",
      visibleTo: editorialRole,
      items: [
        { to: "/admin/content", label: "All Content", icon: Layers },
        { to: "/admin/create", label: "Create New", icon: FileText },
      ],
    },
    {
      label: "Editorial",
      visibleTo: editorialRole,
      items: [
        { to: "/admin/submissions", label: "Submissions", icon: Inbox, badge: submissions },
        { to: "/admin/review", label: "Review", icon: ClipboardCheck, badge: reviewCount },
        { to: "/admin/calendar", label: "Calendar", icon: CalendarRange },
      ],
    },
    {
      label: "Partnerships",
      visibleTo: (r: AdminRole) => can(r, "partnership") || r === "Viewer / Leadership",
      items: [
        { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare, badge: routing },
        { to: "/admin/partners", label: "Partners", icon: Building2 },
        { to: "/admin/follow-ups", label: "Follow-ups", icon: BellRing, badge: overdue },
      ],
    },
    {
      label: "",
      visibleTo: (r: AdminRole) => can(r, "configure") || r === "Managing Editor",
      items: [
        { to: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ].filter((g) => !g.visibleTo || g.visibleTo(role));
}

const CREATE_OPTIONS: { kind: string; label: string }[] = [
  { kind: "story", label: "Editorial Content" },
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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.sessionStorage.getItem("iv-admin-sidebar");
    // Narrow desktops start collapsed so the working area stays wide enough.
    if (!stored) return window.innerWidth < 1280;
    return stored === "collapsed";
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    window.sessionStorage.setItem("iv-admin-sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  // The navigation drawer owns the screen while it is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);


  const sectionLabel = useMemo(() => {
    const flat = groups.flatMap((g) => g.items);
    const match = flat
      .filter((i) => pathname === i.to || (i.to !== "/admin" && pathname.startsWith(`${i.to}/`)))
      .sort((a, b) => b.to.length - a.to.length)[0];
    return match?.label ?? "Dashboard";
  }, [groups, pathname]);

  const unread = notifications.filter((n) => !n.read && (!n.roles || n.roles.includes(user.role))).length;
  const results = useMemo(
    () => adminSearch(query, { content, inquiries, partners, pipeline }),
    [query, content, inquiries, partners, pipeline],
  );

  const nav = (collapsed: boolean) => (
    <nav aria-label="Dashboard sections" className="space-y-5 pb-8">
      {groups.map((group, gi) => (
        <div key={group.label || `g${gi}`}>
          {group.label && !collapsed ? (
            <p className="px-3 pb-1.5 text-[0.62rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {group.label}
            </p>
          ) : null}
          {group.label && collapsed ? <div className="mx-3 mb-2 border-t border-border" /> : null}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(`${item.to}/`));
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={item.to as any}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-blush font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-ink",
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} aria-hidden />
                    {!collapsed ? (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge ? (
                          <span className="ml-auto rounded bg-ink px-1.5 text-[0.65rem] tabular-nums text-background">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    ) : item.badge ? (
                      <span className="absolute ml-6 -mt-4 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {!collapsed ? (
        <div className="space-y-1 border-t border-border px-3 pt-4 text-xs">
          <a href="/" target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-primary">
            View public platform ↗
          </a>
          <a href="/contributor" target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-primary">
            Contributor workspace ↗
          </a>
        </div>
      ) : null}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed sidebar */}
      <aside
        id="admin-nav"
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-card lg:block",
          "transition-[width] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          collapsed ? "w-[76px]" : "w-[268px]",
        )}
      >
        <div className={cn("flex h-14 items-center border-b border-border", collapsed ? "justify-center" : "px-4")}>
          <Link to="/admin" className="flex items-baseline gap-2 overflow-hidden">
            <span className="text-sm font-semibold tracking-tight text-primary">{collapsed ? "IV" : "Indonesia Vibes"}</span>
          </Link>
        </div>
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto px-3 py-4">{nav(collapsed)}</div>

        {/* Edge collapse trigger, vertically centred on the sidebar boundary */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          aria-controls="admin-nav"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-1/2 -right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" aria-hidden /> : <ChevronLeft className="h-3.5 w-3.5" aria-hidden />}
        </button>
      </aside>

      <div
        className={cn(
          "transition-[padding] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[268px]",
        )}
      >
        <header className="sticky top-0 z-30 border-b border-border bg-card">
          <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-6">
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ink transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="admin-nav-mobile"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <MenuIcon className="h-5 w-5" aria-hidden />}
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-ink">{sectionLabel}</p>
              <p className="hidden text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase lg:block">
                Editorial &amp; Partnership Workspace
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className={cn(abtn.small, "hidden sm:inline-flex")}
                onClick={() => setSearchOpen(true)}
              >
                Search
              </button>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-muted sm:hidden"
                onClick={() => setSearchOpen(true)}
                aria-label="Search the workspace"
              >
                <SearchIcon className="h-[1.05rem] w-[1.05rem]" aria-hidden />
              </button>
              <button type="button" className={cn(abtn.primary, "hidden sm:inline-flex")} onClick={() => setCreateOpen(true)}>
                + Create
              </button>
               <Link to="/admin/notifications" className="relative hidden h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary sm:inline-flex" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
                 <BellRing className="h-4 w-4" aria-hidden />
                {unread ? (
                   <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] tabular-nums text-primary-foreground">{unread}</span>
                ) : null}
              </Link>
              <Link
                to="/admin/notifications"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-muted sm:hidden"
                aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              >
                <BellRing className="h-[1.05rem] w-[1.05rem]" aria-hidden />
                {unread ? (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden />
                ) : null}
              </Link>
               <details className="relative hidden border-l border-border pl-3 xl:block">
                 <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-1 py-1 hover:bg-muted">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blush text-[0.7rem] font-semibold text-primary">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
                 <span className="max-w-36 text-left"><span className="block truncate text-xs font-medium text-ink">{user.name}</span><span className="block truncate text-[0.65rem] text-muted-foreground">{user.role}</span></span>
                 <ChevronRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" aria-hidden />
                 </summary>
                 <div className="absolute top-11 right-0 z-40 w-72 border border-border bg-card p-3 shadow-md">
                 <label className="block text-xs text-muted-foreground"><span className="mb-1 block">View workspace as</span>
                <select
                   className={cn(field, "min-h-8 py-1 text-xs")}
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
                 <Link to="/admin/settings" className="mt-2 block border-t border-border pt-2 text-xs text-primary hover:underline">Profile and settings</Link>
                 </div>
               </details>
            </div>
          </div>
        </header>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} aria-hidden />
            <div
              id="admin-nav-mobile"
              className="relative z-10 flex h-full w-[min(19rem,86vw)] flex-col border-r border-border bg-card"
            >
              <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
                <span className="text-sm font-semibold tracking-tight text-primary">Indonesia Vibes</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-muted"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pb-safe">
                {nav(false)}
                <div className="mt-2 border-t border-border pt-3 xl:hidden">
                  <label className="block text-xs text-muted-foreground">
                    <span className="mb-1 block">Signed in as</span>
                    <select
                      className={cn(field, "text-xs")}
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
                  <button
                    type="button"
                    className={cn(abtn.primary, "mt-3 w-full")}
                    onClick={() => {
                      setMobileOpen(false);
                      setCreateOpen(true);
                    }}
                  >
                    + Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}


        <main className="mx-auto w-full max-w-[92rem] px-4 py-5 lg:px-8 lg:py-7">{children}</main>
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
