import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays, ChevronLeft, ChevronRight, ExternalLink, FileText, Handshake, History, Home, Landmark, LayoutDashboard, Library, KeyRound, LogOut, Menu, UserRound, Search, ShieldCheck, Tags, UserCog, Users, X, Files, type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import markRed from "@/assets/mark-red.png";
import { supabase } from "@/integrations/supabase/client";
import { useCollections } from "@/lib/collections";
import { useCms } from "@/lib/cms/store";
import { ALL_MENUS, MENU_GROUPS, type MenuKey } from "@/lib/cms/access";
import { logActivity } from "@/lib/cms/activity";
import { clearAccountCache, useCmsAccount } from "@/lib/cms/role";
import { TYPE_LABEL, editPath } from "@/lib/cms/types";
import { useTopics } from "@/lib/topics";
import { cn } from "@/lib/utils";
import { btn, inputClass } from "./ui";

const ICONS: Record<MenuKey, LucideIcon> = {
  dashboard: LayoutDashboard, articles: FileText, heritage: Landmark, topics: Tags, collections: Library,
  people: Users, experience: CalendarDays, collaborations: Handshake, homepage: Home, pages: Files,
  access: ShieldCheck, users: UserCog, activity: History, profile: UserRound,
};

const TITLES: [string, string][] = ALL_MENUS.map((i) => [i.to, i.label === "User" ? "Users" : i.label] as [string, string]);

/** Thin bar while the next page's code loads; the current page stays visible meanwhile. */
function RouteProgress() {
  const loading = useRouterState({ select: (s) => s.status === "pending" });
  return <div aria-hidden className={cn("pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary transition-[opacity,transform] duration-300", loading ? "scale-x-75 opacity-100" : "scale-x-100 opacity-0")} />;
}

function Sidebar({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const account = useCmsAccount();
  const allowed = account?.menus ?? [];
  const groups = MENU_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => allowed.includes(i.key)) })).filter((g) => g.items.length);
   return <nav aria-label="Studio" className={cn("min-h-0 flex-1 space-y-5 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
    {groups.map((group, i) => <div key={group.label ?? i}>
      {group.label && !collapsed ? <p className="mb-1 px-2.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">{group.label}</p> : null}
      <ul className="space-y-0.5">{group.items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = ICONS[item.key];
        return <li key={item.to}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
           <Link to={item.to as any} onClick={onNavigate} aria-current={active ? "page" : undefined} aria-label={collapsed ? item.label : undefined} title={collapsed ? item.label : undefined} className={cn("group relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm text-ink/75 transition-colors duration-150 hover:bg-background/80 hover:text-ink active:bg-blush/70", collapsed && "justify-center px-0", active && "bg-blush font-medium text-primary hover:bg-blush hover:text-primary")}>
             <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />{!collapsed && item.label}
          </Link>
        </li>;
      })}</ul>
    </div>)}
  </nav>;
}

/** Stops the page (and the CMS content area) scrolling behind an open drawer or window. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const els = [document.body, document.getElementById("cms-main")].filter(Boolean) as HTMLElement[];
    const prev = els.map((el) => el.style.overflow);
    els.forEach((el) => { el.style.overflow = "hidden"; });
    return () => els.forEach((el, i) => { el.style.overflow = prev[i] ?? ""; });
  }, [locked]);
}

function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return <Link to="/studio/dashboard" aria-label="Indonesia Vibes Studio dashboard" title={collapsed ? "Indonesia Vibes Studio" : undefined} className={cn("flex h-14 shrink-0 items-center gap-2.5", collapsed ? "justify-center px-2" : "px-5")}>
    <img src={markRed} alt="" className="h-6 w-6 object-contain" />
    {!collapsed && <span className="text-sm font-semibold text-ink">Indonesia Vibes <span className="font-normal text-muted-foreground">Studio</span></span>}
  </Link>;
}

function GlobalSearch() {
  const { records } = useCms();
  const [topics] = useTopics();
  const [collections] = useCollections();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); ref.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const hits: { key: string; label: string; kind: string; go: () => void }[] = [];
    records.filter((r) => r.title.toLowerCase().includes(term)).slice(0, 10).forEach((r) => hits.push({ key: r.id, label: r.title, kind: TYPE_LABEL[r.type].one, go: () => void navigate({ to: editPath(r.type), params: { id: r.id } } as never) }));
    topics.filter((t) => t.id.toLowerCase().includes(term)).slice(0, 4).forEach((t) => hits.push({ key: t.slug, label: t.id, kind: "Topic", go: () => void navigate({ to: "/studio/topics/$id", params: { id: t.slug } }) }));
    collections.filter((c) => c.title.toLowerCase().includes(term)).slice(0, 4).forEach((c) => hits.push({ key: c.id, label: c.title, kind: "Collection", go: () => void navigate({ to: "/studio/collections/$id", params: { id: c.id } }) }));
    [["about", "About Indonesia Vibes"], ["editorial-standards", "Editorial Standards"], ["contact", "Contact"]].filter(([, l]) => l!.toLowerCase().includes(term)).forEach(([id, l]) => hits.push({ key: id!, label: l!, kind: "Page", go: () => void navigate({ to: "/studio/pages/$page", params: { page: id! } }) }));
    if ("faq".includes(term) || "frequently asked".includes(term)) hits.push({ key: "faq", label: "FAQ", kind: "Page", go: () => void navigate({ to: "/studio/pages/faq" }) });
    return hits.slice(0, 14);
  }, [q, records, topics, collections, navigate]);

  return <div className="relative w-full max-w-md">
    <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <input ref={ref} value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} placeholder="Search everything…" aria-label="Search the CMS" className={cn(inputClass, "border-transparent bg-background/80 pl-8")} />
    {open && q.trim().length >= 2 ? <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-md border border-border bg-background py-1 shadow-lg">
      {results.length ? results.map((r) => <button key={r.kind + r.key} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { r.go(); setQ(""); setOpen(false); }} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-sand">
        <span className="truncate text-ink">{r.label}</span><span className="shrink-0 text-xs text-muted-foreground">{r.kind}</span>
      </button>) : <p className="px-3 py-3 text-sm text-muted-foreground">No results for “{q}”.</p>}
    </div> : null}
  </div>;
}

function Account() {
  const account = useCmsAccount();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const initials = (account?.name ?? "?").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const signOut = async () => {
    await logActivity("Logout", "Account", account?.name ?? "");
    await queryClient.cancelQueries(); queryClient.clear(); clearAccountCache();
    Object.keys(window.sessionStorage).filter((k) => k.startsWith("iv-cms-login:")).forEach((k) => window.sessionStorage.removeItem(k));
    await supabase.auth.signOut();
    window.sessionStorage.removeItem("iv-cms-session-active");
    void navigate({ to: "/studio/login", replace: true });
  };
  return <div className="relative">
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Account" className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-ink text-xs font-semibold text-primary-foreground">{account?.avatar ? <img src={account.avatar} alt="" className="h-full w-full object-cover" /> : initials}</button>
    {open ? <>
      <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
      <div className="absolute top-full right-0 z-50 mt-2 w-60 rounded-md border border-border bg-background p-1 shadow-lg">
        <div className="border-b border-border px-3 py-2.5"><p className="truncate text-sm font-medium text-ink">{account?.name}</p><p className="text-xs text-primary">{account?.role}</p><p className="mt-1 truncate text-xs text-muted-foreground">{account?.email}</p></div>
        <Link to="/studio/profile" onClick={() => setOpen(false)} className="flex h-10 items-center gap-2 rounded-[var(--btn-radius-sm)] px-3 text-sm text-ink hover:bg-muted"><UserRound className="h-4 w-4" />Profile</Link>
        <Link to="/studio/profile" hash="password" onClick={() => setOpen(false)} className="flex h-10 items-center gap-2 rounded-[var(--btn-radius-sm)] px-3 text-sm text-ink hover:bg-muted"><KeyRound className="h-4 w-4" />Change Password</Link>
        <button type="button" onClick={() => void signOut()} className="flex h-10 w-full items-center gap-2 rounded-[var(--btn-radius-sm)] px-3 text-sm text-ink hover:bg-muted"><LogOut className="h-4 w-4" />Sign Out</button>
      </div>
    </> : null}
  </div>;
}

function PasswordNotice() {
  const account = useCmsAccount();
  const [hidden, setHidden] = useState(false);
  if (!account?.mustChangePassword || hidden) return null;
  return <div className="flex flex-wrap items-center gap-3 border-b border-border bg-blush px-4 py-2 text-sm text-ink sm:px-6 lg:px-8">
    <span className="flex-1">You're using a temporary password. Set a new one to keep your account secure.</span>
    <Link to="/studio/profile" hash="password" className={`${btn.primary} ${btn.small}`}>Set a New Password</Link>
    <button type="button" onClick={() => setHidden(true)} className="h-8 px-2 text-xs text-muted-foreground hover:text-ink">Later</button>
  </div>;
}

export function CmsShell({ children }: { children: ReactNode }) {
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("iv-cms-sidebar-collapsed");
      setCollapsed(saved === null ? window.matchMedia("(min-width: 1024px) and (max-width: 1199px)").matches : saved === "true");
    } catch { /* Storage may be unavailable; use expanded state. */ }
  }, []);
  const toggleSidebar = () => setCollapsed((previous) => {
    const next = !previous;
    try { window.localStorage.setItem("iv-cms-sidebar-collapsed", String(next)); } catch { /* Continue without persistence. */ }
    return next;
  });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const account = useCmsAccount();
  const { setEditorName } = useCms();
  useEffect(() => { if (account?.name) setEditorName(account.name); }, [account?.name, setEditorName]);
  useEffect(() => setMobile(false), [pathname]);
  useScrollLock(mobile);
  // Pages restored from the back/forward cache re-run the sign-in check.
  useEffect(() => { const h = (e: PageTransitionEvent) => { if (e.persisted) window.location.reload(); }; window.addEventListener("pageshow", h); return () => window.removeEventListener("pageshow", h); }, []);
  const title = TITLES.find(([to]) => pathname === to || pathname.startsWith(`${to}/`))?.[1] ?? "CMS";

  return <div className="min-h-dvh bg-sand/70 text-ink lg:flex lg:h-dvh lg:overflow-hidden">
     <aside className={cn("relative z-40 hidden h-dvh shrink-0 flex-col border-r border-border/50 bg-sand transition-[width] duration-200 ease-out motion-reduce:transition-none lg:flex", collapsed ? "w-[68px]" : "w-60")}><Brand collapsed={collapsed} /><Sidebar collapsed={collapsed} /></aside>
       <button type="button" onClick={toggleSidebar} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} className={cn(btn.iconSm, "fixed top-[calc(50%-16px)] z-50 hidden h-8 w-8 -translate-x-1/2 border border-border bg-background shadow-sm transition-[left,background-color] duration-200 ease-out hover:bg-sand motion-reduce:transition-none lg:inline-flex", collapsed ? "left-[68px]" : "left-60")}>
         {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
       </button>
    {mobile ? <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
      <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-ink/40" onClick={() => setMobile(false)} />
      <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-background shadow-xl"><div className="flex items-center justify-between pr-3"><Brand /><button type="button" onClick={() => setMobile(false)} aria-label="Close navigation" className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"><X className="h-4 w-4" /></button></div><Sidebar onNavigate={() => setMobile(false)} /></aside>
    </div> : null}

    <div className="lg:flex lg:min-w-0 lg:flex-1 lg:flex-col">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-sand/85 px-4 backdrop-blur sm:px-6 lg:px-8">
        <button type="button" onClick={() => setMobile(true)} aria-label="Open navigation" className={`${btn.icon} -ml-1 text-ink lg:hidden`}><Menu className="h-5 w-5" /></button>
        <p className="hidden min-w-[9rem] text-sm font-semibold text-ink md:block">{title}</p>
        <div className="flex flex-1 justify-center"><GlobalSearch /></div>
        <a href="/" target="_blank" rel="noreferrer" className={`${btn.ghost} hidden sm:inline-flex`}><ExternalLink className="h-4 w-4" />Preview website</a>
        <Account />
      </header>
      <RouteProgress />
      {/* Desktop: this is the only vertical scroll area; the sidebar and header stay put. */}
      <div id="cms-main" data-scroll-restoration-id="cms-main" className="lg:min-h-0 lg:flex-1 lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-contain">
        <PasswordNotice />
        <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8"><div key={pathname} className="cms-enter">{children}</div></main>
      </div>
    </div>
  </div>;
}
