import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BookOpen, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, FileText,
  Handshake, Home, Layers, LayoutDashboard, Library, MapPin, Menu, Settings,
  Star, Tags, Users, X, CalendarDays, MessageSquare,
  type LucideIcon,
} from "lucide-react";

import { useAdmin } from "@/lib/admin/store";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type NavItem = { to: string; label: string; icon: LucideIcon };
type NavGroup = { label?: string; items: NavItem[] };

const NAVIGATION: NavGroup[] = [
  { items: [{ to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Homepage", items: [
    { to: "/admin/homepage/hero", label: "Hero", icon: Star },
    { to: "/admin/homepage/sections", label: "Homepage Sections", icon: Layers },
  ] },
  { label: "Understand Indonesia", items: [
    { to: "/admin/articles", label: "Articles", icon: FileText },
    { to: "/admin/topics", label: "Topics", icon: Tags },
    { to: "/admin/collections", label: "Collections", icon: Library },
    { to: "/admin/people-organisations", label: "People & Organisations", icon: Users },
  ] },
  { label: "Experience", items: [
    { to: "/admin/events-places", label: "Events & Places", icon: CalendarDays },
    { to: "/admin/around-the-world", label: "Indonesia Around the World", icon: MapPin },
  ] },
  { label: "Connect", items: [{ to: "/admin/collaborations", label: "Collaborations", icon: Handshake }] },
  { label: "About", items: [
    { to: "/admin/about", label: "About Indonesia Vibes", icon: Home },
    { to: "/admin/editorial-standards", label: "Editorial Standards", icon: BookOpen },
    { to: "/admin/faq", label: "FAQ", icon: CircleHelp },
    { to: "/admin/contact", label: "Contact", icon: MessageSquare },
  ] },
  { label: "Settings", items: [{ to: "/admin/settings", label: "Settings", icon: Settings }] },
];

export function useNavGroups() { return NAVIGATION; }

function Navigation({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <nav aria-label="CMS sections" className="space-y-5 pb-8">
    {NAVIGATION.map((group, index) => <section key={group.label ?? index}>
      {group.label && !collapsed ? <p className="mb-1.5 px-3 text-[0.625rem] font-semibold uppercase text-muted-foreground">{group.label}</p> : null}
      {group.label && collapsed ? <div className="mx-3 mb-2 border-t border-sidebar-border" /> : null}
      <ul className="space-y-0.5">{group.items.map((item) => {
        const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(`${item.to}/`));
        const Icon = item.icon;
        return <li key={item.to}><Link
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          to={item.to as any}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          title={collapsed ? item.label : undefined}
          className={cn(
            "relative flex min-h-9 items-center gap-2.5 rounded-md px-3 text-[0.8125rem] text-muted-foreground transition-colors hover:bg-muted hover:text-ink",
            collapsed && "justify-center px-0",
            active && "bg-blush font-medium text-ink before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:bg-primary",
          )}
        ><Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} aria-hidden />{!collapsed ? <span className="truncate">{item.label}</span> : null}</Link></li>;
      })}</ul>
    </section>)}
  </nav>;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { user } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountRole, setAccountRole] = useState("CMS user");

  useEffect(() => {
    const stored = window.sessionStorage.getItem("iv-admin-sidebar");
    setCollapsed(stored ? stored === "collapsed" : window.innerWidth < 1200);
  }, []);
  useEffect(() => window.sessionStorage.setItem("iv-admin-sidebar", collapsed ? "collapsed" : "expanded"), [collapsed]);
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    const listener = (event: Event) => setFocusMode((event as CustomEvent<boolean>).detail);
    window.addEventListener("iv-article-focus", listener);
    return () => window.removeEventListener("iv-article-focus", listener);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", close);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", close); };
  }, [mobileOpen]);
  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setAccountEmail(data.user.email ?? "");
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", data.user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", data.user.id),
      ]);
      setAccountName(profile?.display_name ?? data.user.email?.split("@")[0] ?? user.name);
      if (roles?.length) setAccountRole(roles.map((entry) => entry.role).join(", "));
    });
  }, [user.name]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    window.sessionStorage.removeItem("iv-cms-session-active");
    await supabase.auth.signOut();
    await navigate({ to: "/admin/login", search: {}, replace: true });
  }

  const current = useMemo(() => NAVIGATION.flatMap((group) => group.items)
    .filter((item) => pathname === item.to || (item.to !== "/admin" && pathname.startsWith(`${item.to}/`)))
    .sort((a, b) => b.to.length - a.to.length)[0]?.label ?? "Dashboard", [pathname]);

  return <div className="admin-shell min-h-screen bg-background [--cms-header:3.75rem]">
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:block",
      focusMode && "lg:hidden", collapsed ? "w-[72px]" : "w-[248px]",
    )}>
      <div className={cn("flex h-[var(--cms-header)] items-center border-b border-sidebar-border", collapsed ? "justify-center" : "px-5")}>
        <Link to="/admin/dashboard" className="text-sm font-bold text-primary">{collapsed ? "IV" : "Indonesia Vibes"}</Link>
      </div>
      <div className="h-[calc(100vh-var(--cms-header))] overflow-y-auto px-3 py-5"><Navigation collapsed={collapsed} /></div>
      <button type="button" onClick={() => setCollapsed((value) => !value)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="absolute top-5 right-[-13px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-primary">
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>

    <div className={cn("transition-[padding] duration-200", focusMode ? "lg:pl-0" : collapsed ? "lg:pl-[72px]" : "lg:pl-[248px]")}>
      {!focusMode ? <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex h-[var(--cms-header)] items-center gap-3 px-4 sm:px-6 lg:px-7">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-muted lg:hidden"><Menu className="h-5 w-5" /></button>
          <p className="truncate text-sm font-medium text-ink">{current}</p>
          <details className="relative ml-auto">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-xs font-semibold text-primary">{(accountName || user.name).split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
              <span className="hidden max-w-40 text-left sm:block"><span className="block truncate text-xs font-medium text-ink">{accountName || user.name}</span><span className="block truncate text-[0.68rem] text-muted-foreground">{accountEmail}</span></span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </summary>
            <div className="absolute top-11 right-0 z-40 w-72 rounded-md border border-border bg-popover p-3 shadow-md">
               <div><p className="truncate text-sm font-medium text-ink">{accountName || user.name}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{accountEmail}</p><p className="mt-2 text-xs capitalize text-muted-foreground">{accountRole}</p></div>
               <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3"><Link to="/admin/settings" className="text-xs text-primary">Profile and settings</Link><button type="button" onClick={handleSignOut} className="text-xs text-muted-foreground hover:text-primary">Sign out</button></div>
            </div>
          </details>
        </div>
      </header> : null}
      <main className={cn("w-full px-4 py-6 sm:px-6 lg:px-7", focusMode && "p-0 sm:p-0 lg:p-0")}>{children}</main>
    </div>

    {mobileOpen ? <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" className="absolute inset-0 bg-ink/35" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
      <aside className="relative flex h-full w-[min(17rem,88vw)] flex-col border-r border-border bg-sidebar">
        <div className="flex h-14 items-center justify-between border-b border-border px-4"><span className="text-sm font-bold text-primary">Indonesia Vibes</span><button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"><X className="h-5 w-5" /></button></div>
        <div className="flex-1 overflow-y-auto p-3 pb-safe"><Navigation onNavigate={() => setMobileOpen(false)} /></div>
      </aside>
    </div> : null}
  </div>;
}