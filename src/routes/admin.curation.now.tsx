import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { can, type NowOverride } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, PrototypeNote, Tag, abtn, dateFmt, field } from "@/components/admin/primitives";

const MODES: NowOverride["mode"][] = ["Featured happening", "Editorial priority", "Pinned", "Hidden"];

export const Route = createFileRoute("/admin/curation/now")({
  head: adminHead("NOW curation", "Decide what the NOW section highlights this week."),
  component: NowCuration,
});

function NowCuration() {
  const admin = useAdmin();
  const editable = can(admin.role, "editorial");
  const published = admin.content.filter((c) => c.status === "published");
  const [contentId, setContentId] = useState("");
  const [mode, setMode] = useState<NowOverride["mode"]>("Featured happening");
  const [until, setUntil] = useState("");

  const set = (next: NowOverride[]) => admin.setNowOverrides(next);

  return (
    <>
      <PageHeading
        eyebrow="Curation"
        title="NOW"
        description="NOW is the platform's promise that something is happening today. By default it fills itself from live events; overrides are for editorial judgement."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card title="Current overrides">
          {admin.nowOverrides.length ? (
            <ul className="space-y-2 text-sm">
              {admin.nowOverrides.map((o) => {
                const item = admin.getContent(o.contentId);
                return (
                  <li key={o.contentId} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      {item ? (
                        <Link to="/admin/content/$id" params={{ id: item.id }} className="text-ink hover:text-primary">
                          {o.label || item.title}
                        </Link>
                      ) : (
                        <span className="text-primary">Missing record</span>
                      )}
                      <p className="text-xs text-muted-foreground">{o.until ? `Until ${dateFmt(o.until)}` : "No end date set"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag tone={o.mode === "Hidden" ? "alert" : "quiet"}>{o.mode}</Tag>
                      {editable ? (
                        <button
                          type="button"
                          className={abtn.quiet}
                          onClick={() => set(admin.nowOverrides.filter((x) => x.contentId !== o.contentId))}
                        >
                          Remove<span className="sr-only">: {o.label}</span>
                        </button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title="No overrides." hint="NOW is currently assembled automatically from live and upcoming records." />
          )}
        </Card>

        <aside className="space-y-4">
          {editable ? (
            <Card title="Add an override">
              <label className="block text-xs text-muted-foreground">
                <span className="mb-1 block">Published record</span>
                <select className={field} value={contentId} onChange={(e) => setContentId(e.target.value)}>
                  <option value="">Choose a record</option>
                  {published.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block text-xs text-muted-foreground">
                <span className="mb-1 block">Treatment</span>
                <select className={field} value={mode} onChange={(e) => setMode(e.target.value as NowOverride["mode"])}>
                  {MODES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block text-xs text-muted-foreground">
                <span className="mb-1 block">Until (optional)</span>
                <input type="date" className={field} value={until} onChange={(e) => setUntil(e.target.value)} />
              </label>
              <button
                type="button"
                className={`${abtn.primary} mt-3`}
                disabled={!contentId}
                onClick={() => {
                  const item = admin.getContent(contentId);
                  if (!item) return;
                  set([
                    ...admin.nowOverrides.filter((o) => o.contentId !== contentId),
                    { contentId, label: item.title, mode, ...(until ? { until: new Date(until).toISOString() } : {}) },
                  ]);
                  setContentId("");
                  setUntil("");
                }}
              >
                Add override
              </button>
            </Card>
          ) : (
            <Card title="Read-only">
              <p className="text-sm text-muted-foreground">Your role can view NOW curation but not change it.</p>
            </Card>
          )}
          <PrototypeNote>Overrides are stored in this prototype only.</PrototypeNote>
        </aside>
      </div>
    </>
  );
}
