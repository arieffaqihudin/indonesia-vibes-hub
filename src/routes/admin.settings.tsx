import { createFileRoute } from "@tanstack/react-router";
import { PlugZap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { adminHead } from "@/lib/admin/head";
import { useCms } from "@/lib/cms/store";
import { ROLE_INFO, useCmsAccount } from "@/lib/cms/role";
import { Field, PageHeader, Select, TextArea, TextInput, Tabs, btn } from "@/components/cms/ui";

type Tab = "general" | "users" | "analytics" | "seo" | "integrations";
const TABS: Tab[] = ["general", "users", "analytics", "seo", "integrations"];

export const Route = createFileRoute("/admin/settings")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab } => (TABS.includes(s["tab"] as Tab) ? { tab: s["tab"] as Tab } : {}),
  head: adminHead("Settings", "General, users and roles, analytics, SEO and integrations."),
  component: Settings,
});

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1 border-b border-border py-3 last:border-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-sm text-ink">{children}</dd></div>;
}

function Settings() {
  const search = Route.useSearch();
  const [tab, setTab] = useState<Tab>(search.tab ?? "general");
  const { settings, updateSettings } = useCms();
  const account = useCmsAccount();
  const [provider, setProvider] = useState(settings.analyticsProvider ?? "");

  return <div className="mx-auto max-w-3xl">
    <PageHeader title="Settings" />
    <Tabs<Tab> value={tab} onChange={setTab} tabs={[{ id: "general", label: "General" }, { id: "users", label: "Users & Roles" }, { id: "analytics", label: "Analytics" }, { id: "seo", label: "SEO" }, { id: "integrations", label: "Integrations" }]} />
    <div className="rounded-lg border border-border bg-background p-5">
      {tab === "general" ? <div className="space-y-4">
        <Field label="Site name" htmlFor="sn"><TextInput id="sn" value={settings.siteName} onChange={(v) => updateSettings({ siteName: v })} /></Field>
        <Field label="Tagline" htmlFor="tg"><TextInput id="tg" value={settings.tagline} onChange={(v) => updateSettings({ tagline: v })} /></Field>
        <Field label="Public contact email" htmlFor="ce"><TextInput id="ce" value={settings.contactEmail} onChange={(v) => updateSettings({ contactEmail: v })} /></Field>
        <p className="text-xs text-muted-foreground">Saved automatically.</p>
      </div> : null}

      {tab === "users" ? <div>
        <h2 className="text-sm font-semibold text-ink">Your account</h2>
        <dl className="mt-2"><Row label="Name">{account?.name ?? "…"}</Row><Row label="Email">{account?.email ?? "…"}</Row><Row label="Role">{account?.role ?? "…"}{account && !account.assigned ? <span className="ml-2 text-xs text-muted-foreground">(no role assigned yet — acting as Editor)</span> : null}</Row></dl>
        <h2 className="mt-6 text-sm font-semibold text-ink">Roles</h2>
        <ul className="mt-2 divide-y divide-border rounded-md border border-border">{ROLE_INFO.map((r) => <li key={r.role} className="px-4 py-3"><p className="text-sm font-medium text-ink">{r.role}</p><p className="text-xs text-muted-foreground">{r.text}</p></li>)}</ul>
        <p className="mt-4 text-xs text-muted-foreground">New CMS accounts are created by an administrator. Public registration is turned off.</p>
      </div> : null}

      {tab === "analytics" ? <div>
        <div className="flex items-start gap-3 rounded-md bg-sand p-4"><PlugZap className="mt-0.5 h-5 w-5 text-muted-foreground" /><div><p className="text-sm font-medium text-ink">Analytics not connected</p><p className="text-xs text-muted-foreground">The dashboard shows no traffic numbers until a real analytics source is connected. Nothing is estimated.</p></div></div>
        <dl className="mt-4"><Row label="Status">Not connected</Row><Row label="Provider">{settings.analyticsProvider || "—"}</Row><Row label="Property / project">{settings.analyticsProperty || "—"}</Row><Row label="Last sync">Never</Row></dl>
        <div className="mt-4 space-y-4 border-t border-border pt-4">
          <Field label="Provider" htmlFor="ap"><Select id="ap" value={provider} onChange={setProvider} options={["Google Analytics", "Plausible", "Matomo", "PostHog"]} placeholder="Choose provider" /></Field>
          <Field label="Property or site ID" htmlFor="apr" hint="e.g. G-XXXXXXX for Google Analytics, or your domain for Plausible."><TextInput id="apr" value={settings.analyticsProperty ?? ""} onChange={(v) => updateSettings({ analyticsProperty: v })} /></Field>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn.primary} disabled={!provider} onClick={() => { updateSettings({ analyticsProvider: provider }); toast.info("Provider saved. Numbers will appear once the connection is set up and verified."); }}>Connect Analytics</button>
            <button type="button" className={btn.secondary} onClick={() => toast.error("No analytics source is connected yet.")}>Test Connection</button>
          </div>
        </div>
      </div> : null}

      {tab === "seo" ? <div className="space-y-4">
        <Field label="Default search title" htmlFor="st"><TextInput id="st" value={settings.seoTitle} onChange={(v) => updateSettings({ seoTitle: v })} /></Field>
        <Field label="Default search description" htmlFor="sd" hint={`${settings.seoDescription.length} / 160 characters`}><TextArea id="sd" value={settings.seoDescription} onChange={(v) => updateSettings({ seoDescription: v })} /></Field>
      </div> : null}

      {tab === "integrations" ? <ul className="divide-y divide-border">
        {[["Sign-in", "Email and password sign-in for the CMS", "Connected"], ["Analytics", "Website traffic for the dashboard", "Not connected"], ["Email", "Sending replies and notifications", "Not connected"]].map(([n, d, s]) => <li key={n} className="flex items-center justify-between gap-4 py-3"><div><p className="text-sm font-medium text-ink">{n}</p><p className="text-xs text-muted-foreground">{d}</p></div><span className={s === "Connected" ? "text-xs font-medium text-primary" : "text-xs text-muted-foreground"}>{s}</span></li>)}
      </ul> : null}
    </div>
  </div>;
}
