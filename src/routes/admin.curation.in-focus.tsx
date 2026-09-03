import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { can, type FocusOverride } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, PrototypeNote, Tag, abtn, dateFmt, field } from "@/components/admin/primitives";

const MODES: FocusOverride["mode"][] = ["Featured happening", "Editorial priority", "Pinned", "Hidden"];

export const Route = createFileRoute("/admin/curation/in-focus")({
  head: adminHead("In Focus curation", "Decide what the In Focus composition highlights."),
  component: FocusCuration,
});

function FocusCuration() {
  const admin = useAdmin();
  const editable = can(admin.role, "editorial");
  const published = admin.content.filter((c) => c.status === "published");
  const [contentId, setContentId] = useState("");
  const [mode, setMode] = useState<FocusOverride["mode"]>("Featured happening");
  const [until, setUntil] = useState("");

  const set = (next: FocusOverride[]) => admin.setFocusOverrides(next);

  return (
    <>
      <PageHeading
        eyebrow="Curation"
        title="In Focus"
        description="In Focus is assembled automatically from current events, open calls, active collaborations and recent publishing. Overrides are for editorial judgement, not for filling gaps."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card title="Current overrides">
          {admin.focusOverrides.length ? (
            <ul className="space-y-2 text-sm">
              {admin.focusOverrides.map((o) => {
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
                          onClick={() => set(admin.focusOverrides.filter((x) => x.contentId !== o.contentId))}
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
            <EmptyState title="No overrides." hint="In Focus is currently assembled automatically from current and recent records." />
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
                <select className={field} value={mode} onChange={(e) => setMode(e.target.value as FocusOverride["mode"])}>
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
                    ...admin.focusOverrides.filter((o) => o.contentId !== contentId),
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
              <p className="text-sm text-muted-foreground">Your role can view In Focus curation but not change it.</p>
            </Card>
          )}
          <PrototypeNote>Overrides are stored in this prototype only.</PrototypeNote>
        </aside>
      </div>
    </>
  );
}
