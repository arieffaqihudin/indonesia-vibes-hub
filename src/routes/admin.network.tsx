import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { allGraphEntries, graphEntry, relationshipGroups } from "@/lib/admin/selectors";
import { kindLabel, networkReadiness } from "@/lib/admin/types";
import { Card, EmptyState, Metric, PageHeading, SearchInput, Tag, abtn } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/network")({
  head: adminHead("Cultural subjects", "The knowledge network: subjects, the records around them, and where connections are missing."),
  component: Network,
});

function Network() {
  const admin = useAdmin();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const subjects = useMemo(
    () => admin.content.filter((c) => c.kind === "culture").filter((c) => (query ? c.title.toLowerCase().includes(query.toLowerCase()) : true)),
    [admin.content, query],
  );

  const current = subjects.find((s) => s.id === selected) ?? subjects[0];
  const orphans = admin.content.filter((c) => relationshipGroups.every((g) => !c.relationships[g.key].length));

  return (
    <>
      <PageHeading
        eyebrow="Cultural network"
        title="Cultural subjects"
        description="Subjects are the spine of the platform. Everything else connects through them."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Metric value={subjects.length} label="Cultural subjects" />
        <Metric value={allGraphEntries.length} label="Records in the network" />
        <Metric value={orphans.length} label="Records with no connections" hint="These become dead ends for readers." />
      </div>

      <div className="mb-4 max-w-md">
        <SearchInput value={query} onChange={setQuery} label="Search cultural subjects" placeholder="Gamelan, ikat, phinisi…" />
      </div>

      {current ? (
        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <nav aria-label="Cultural subjects">
            <ul className="space-y-1">
              {subjects.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(s.id)}
                    aria-current={s.id === current.id}
                    className={`w-full rounded border px-3 py-2 text-left text-sm ${
                      s.id === current.id ? "border-primary bg-primary/5 text-ink" : "border-border text-muted-foreground hover:text-ink"
                    }`}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <Card
              title={current.title}
              description="Connected records, grouped the way a reader will encounter them."
              action={
                <Link to="/admin/content/$id" params={{ id: current.id }} className={abtn.small}>
                  Open record
                </Link>
              }
            >
              <div className="space-y-3">
                {relationshipGroups.map((g) => {
                  const ids = current.relationships[g.key];
                  return (
                    <div key={g.key}>
                      <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">{g.label}</p>
                      {ids.length ? (
                        <ul className="mt-1 flex flex-wrap gap-1.5">
                          {ids.map((id) => (
                            <li key={id}>
                              <Tag tone="quiet">{graphEntry(id)?.label ?? id}</Tag>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground">No connections in this group yet.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Network readiness">
              <ul className="grid gap-1 text-xs sm:grid-cols-2">
                {networkReadiness(current).checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2">
                    <span aria-hidden>{c.ok ? "✓" : "○"}</span>
                    <span className={c.ok ? "text-ink" : "text-muted-foreground"}>{c.label}</span>
                    <span className="sr-only">{c.ok ? "connected" : "not connected"}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState title="No cultural subjects match that search." />
      )}

      {orphans.length ? (
        <div className="mt-8">
          <Card title="Records with no connections" description="Fixing these removes dead ends on the public platform.">
            <ul className="space-y-1.5 text-sm">
              {orphans.slice(0, 12).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2">
                  <Link to="/admin/content/$id" params={{ id: o.id }} className="text-ink hover:text-primary">
                    {o.title}
                  </Link>
                  <span className="text-xs text-muted-foreground">{kindLabel(o.kind)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}
    </>
  );
}
