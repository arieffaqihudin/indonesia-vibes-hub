import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { graphEntry } from "@/lib/admin/selectors";
import { Card, EmptyState, PageHeading, StatusPill, abtn, dateFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/collections")({
  head: adminHead("Collections", "Curated groupings of published content, with an editorial reason for each."),
  component: Collections,
});

function Collections() {
  const admin = useAdmin();
  const collections = admin.content.filter((c) => c.kind === "collection");

  return (
    <>
      <PageHeading
        eyebrow="Cultural network"
        title="Collections"
        description="A collection is an editorial argument, so each one records why these records belong together."
        actions={
          <Link to="/admin/content/new" search={{ kind: "collection" }} className={abtn.primary}>
            New collection
          </Link>
        }
      />

      {collections.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {collections.map((c) => (
            <Card key={c.id} title={c.title} action={<StatusPill status={c.status} />}>
              <p className="text-sm text-muted-foreground">{c.fields["statement"] || c.fields["standfirst"] || "No editorial statement recorded yet."}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                Curated by {c.fields["editor"] || c.assignedTo || "unassigned"} · updated {dateFmt(c.updatedAt)}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-ink">
                {c.relationships.culture.map((id) => (
                  <li key={id}>{graphEntry(id)?.label ?? id}</li>
                ))}
                {!c.relationships.culture.length ? (
                  <li className="text-muted-foreground">Nothing added to this collection yet.</li>
                ) : null}
              </ul>
              <Link to="/admin/content/$id" params={{ id: c.id }} className={`${abtn.small} mt-3`}>
                Open collection
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No collections yet." hint="Collections group published records around a single editorial idea." />
      )}
    </>
  );
}
