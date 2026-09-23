import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { graphEntry, relationshipGroups } from "@/lib/admin/selectors";
import { CONTENT_FIELDS, kindLabel } from "@/lib/admin/types";
import { publicFormatFromInternal } from "@/lib/editorial";
import { Card, EmptyState, PageHeading, PrototypeNote, abtn } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/content/$id/preview")({
  head: adminHead("Preview", "See how a record will read on the public platform before it is published."),
  component: PreviewRoute,
});

function PreviewRoute() {
  const { id } = Route.useParams();
  const admin = useAdmin();
  const item = admin.getContent(id);
  const media = admin.media.filter((m) => m.contentId === id);

  if (!item) {
    return (
      <EmptyState
        title="That record no longer exists."
        action={
          <Link to="/admin/content" className={abtn.secondary}>
            Back to the content library
          </Link>
        }
      />
    );
  }

  const fields = CONTENT_FIELDS[item.kind];

  return (
    <>
      <PageHeading
        eyebrow="Preview"
        title={item.title}
        description={`How this ${kindLabel(item.kind).toLowerCase()} will read on the public platform.`}
        actions={
          <Link to="/admin/content/$id" params={{ id }} className={abtn.secondary}>
            Back to the workspace
          </Link>
        }
      />

      <PrototypeNote>
        Prototype preview: layout is approximate. Relationship blocks show what a reader will be offered next.
      </PrototypeNote>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="rounded-lg border border-border bg-card p-6">
          <p className="text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase">{item.kind === "story" ? publicFormatFromInternal(item.deliveryType) : kindLabel(item.kind)}</p>
          <h2 className="mt-2 font-display text-2xl text-ink">{item.title}</h2>
          <div className="mt-4 space-y-4">
            {fields.map((f) => {
              const value = item.fields[f.name];
              if (!value) return null;
              return (
                <section key={f.name}>
                  <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">{f.label}</h3>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink">{value}</p>
                </section>
              );
            })}
            {fields.every((f) => !item.fields[f.name]) ? (
              <p className="text-sm text-muted-foreground">
                Nothing to preview yet — add content in the workspace and it will appear here.
              </p>
            ) : null}
          </div>

          {media.length ? (
            <div className="mt-6 border-t border-border pt-4">
              <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">Media</h3>
              <ul className="mt-2 space-y-2 text-sm text-ink">
                {media.map((m) => (
                  <li key={m.id}>
                    {m.caption} <span className="text-xs text-muted-foreground">— {m.credit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>

        <aside className="space-y-4">
          <Card title="Readers will be offered next">
            {relationshipGroups.map((g) => {
              const ids = item.relationships[g.key];
              if (!ids.length) return null;
              return (
                <div key={g.key} className="mb-3 last:mb-0">
                  <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">{g.label}</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-ink">
                    {ids.map((rid) => (
                      <li key={rid}>{graphEntry(rid)?.label ?? rid}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {relationshipGroups.every((g) => !item.relationships[g.key].length) ? (
              <p className="text-sm text-muted-foreground">
                No connections yet, so this page would be a dead end for readers.
              </p>
            ) : null}
          </Card>
        </aside>
      </div>
    </>
  );
}
