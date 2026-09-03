import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { Card, EmptyState, ExternalLink, Metric, PageHeading, TabBar, Tag, abtn } from "@/components/admin/primitives";
import {
  compareEntities,
  countryCoverage,
  dataHealth,
  duplicateCandidates,
  entityImpact,
  graphStats,
  taxonomy,
  type CanonicalEntity,
} from "@/lib/data";

export const Route = createFileRoute("/admin/data-health")({
  head: adminHead("Data health", "Integrity of the cultural knowledge graph, with every figure leading to records."),
  component: DataHealth,
});

function DataHealth() {
  const sections = useMemo(() => dataHealth(), []);
  const duplicates = useMemo(() => duplicateCandidates(), []);
  const stats = useMemo(() => graphStats(), []);
  const coverage = useMemo(() => countryCoverage().slice(0, 8), []);
  const [tab, setTab] = useState(sections[0]?.id ?? "schema");
  const [inspect, setInspect] = useState<CanonicalEntity | null>(null);
  const [merge, setMerge] = useState<{ a: CanonicalEntity; b: CanonicalEntity } | null>(null);

  const active = sections.find((s) => s.id === tab) ?? sections[0];
  const impact = inspect ? entityImpact(inspect.uid) : undefined;
  const comparison = merge ? compareEntities(merge.a.uid, merge.b.uid) : undefined;

  return (
    <>
      <PageHeading
        eyebrow="System"
        title="Data health"
        description="One entity, one record, many relationships. These checks show where that promise is not yet kept."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <Metric value={stats.entities} label="Canonical records" />
        <Metric value={stats.relationships} label="Typed relationships" />
        <Metric value={`${stats.connectedShare}%`} label="Records connected" hint="Share with at least one relationship." />
        <Metric value={duplicates.length} label="Possible duplicates" hint="Reviewed by a person, never merged automatically." />
      </div>

      <TabBar
        label="Integrity checks"
        tabs={sections.map((s) => ({ id: s.id, label: s.title, count: s.findings.length }))}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-4 space-y-4">
        <Card title={active?.title ?? "Checks"} description={active?.hint ?? ""}>
          {active && active.findings.length ? (
            <ul className="space-y-2 text-sm">
              {active.findings.slice(0, 40).map((f) => (
                <li key={f.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-2 last:border-0">
                  <span className="min-w-0">
                    <span className="text-ink">{f.title}</span>{" "}
                    <span className="text-muted-foreground">— {f.detail}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {f.path ? <ExternalLink href={f.path}>View public page</ExternalLink> : null}
                    {f.entity ? (
                      <button type="button" className={abtn.small} onClick={() => setInspect(f.entity ?? null)}>
                        Where is it used?
                      </button>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Nothing failing this check." hint="This part of the graph is holding together." />
          )}
        </Card>

        <Card
          title="Possible duplicates"
          description="Two records answering to the same name. Merging is a deliberate, previewed decision."
        >
          {duplicates.length ? (
            <ul className="space-y-2 text-sm">
              {duplicates.slice(0, 20).map((d) => (
                <li key={`${d.a.uid}-${d.b.uid}`} className="flex flex-wrap items-baseline justify-between gap-2">
                  <span>
                    <span className="text-ink">{d.a.name}</span> <span className="text-muted-foreground">and</span>{" "}
                    <span className="text-ink">{d.b.name}</span>{" "}
                    <span className="text-xs text-muted-foreground">· {d.reason}</span>
                  </span>
                  <button type="button" className={abtn.small} onClick={() => setMerge({ a: d.a, b: d.b })}>
                    Preview merge
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No duplicate candidates." hint="Canonical names and aliases are currently distinct." />
          )}
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Country coverage" description="Where the graph is thick, and where it is thin.">
            <ul className="space-y-1 text-sm">
              {coverage.map((c) => (
                <li key={c.id} className="flex items-baseline justify-between gap-2">
                  <span className="text-ink">{c.name}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{c.records} records</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Shared taxonomy" description="One vocabulary across editorial, filters and search.">
            <ul className="space-y-1 text-sm">
              {taxonomy.map((t) => (
                <li key={t.id} className="flex items-baseline justify-between gap-2">
                  <span className="text-ink">{t.label}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {t.usageCount} records · {t.synonyms.length} synonyms
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {impact ? (
          <Card
            title={`Where “${impact.entity.name}” is used`}
            description="Changing this record affects everything listed here."
            action={
              <button type="button" className={abtn.small} onClick={() => setInspect(null)}>
                Close
              </button>
            }
          >
            <p className="mb-2 text-sm text-muted-foreground">{impact.total} direct relationships.</p>
            <ul className="space-y-1 text-sm">
              {impact.byType.map((g) => (
                <li key={g.type}>
                  <span className="text-ink">
                    {g.count} {g.label.toLowerCase()}
                    {g.count === 1 ? "" : "s"}
                  </span>{" "}
                  <span className="text-xs text-muted-foreground">
                    · {g.examples.map((e) => e.name).join(", ")}
                  </span>
                </li>
              ))}
            </ul>
            {impact.publicPages.length ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Public pages affected: {impact.publicPages.join(", ")}
              </p>
            ) : null}
          </Card>
        ) : null}

        {comparison ? (
          <Card
            title="Merge preview"
            description="Nothing is merged until a person confirms the result."
            action={
              <button type="button" className={abtn.small} onClick={() => setMerge(null)}>
                Close
              </button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-ink">{comparison.left.name}</p>
                <p className="text-xs text-muted-foreground">
                  {comparison.leftRelationships} relationships · {comparison.left.publicPath ?? "no public page"}
                </p>
              </div>
              <div>
                <p className="text-ink">{comparison.right.name}</p>
                <p className="text-xs text-muted-foreground">
                  {comparison.rightRelationships} relationships · {comparison.right.publicPath ?? "no public page"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink">Aliases after merge: {comparison.combinedAliases.join(", ")}</p>
            {comparison.publishedUrls.length ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Published URLs to redirect: {comparison.publishedUrls.join(", ")}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {comparison.conflicts.length ? (
                comparison.conflicts.map((c) => (
                  <Tag key={c} tone="alert">
                    {c}
                  </Tag>
                ))
              ) : (
                <Tag tone="quiet">No conflicts detected</Tag>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Prototype: merging is previewed here but not executed. Records are archived and redirected, never deleted.
            </p>
          </Card>
        ) : null}
      </div>
    </>
  );
}
