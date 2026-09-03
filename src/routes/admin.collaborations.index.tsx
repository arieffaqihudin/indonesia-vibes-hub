import { Link, createFileRoute } from "@tanstack/react-router";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { PIPELINE_STAGES } from "@/lib/admin/types";
import { Card, EmptyState, PageHeading, Tag, abtn, relative } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/collaborations/")({
  head: adminHead("Collaborations", "International collaborations from first idea to recorded outcome."),
  component: Collaborations,
});

function Collaborations() {
  const admin = useAdmin();

  return (
    <>
      <PageHeading
        eyebrow="Partnerships"
        title="Collaborations"
        description="Grouped by stage. A collaboration only becomes public content once it is confirmed and written up."
      />

      {admin.pipeline.length ? (
        <div className="space-y-6">
          {PIPELINE_STAGES.map((stage) => {
            const items = admin.pipeline.filter((c) => c.stage === stage);
            if (!items.length) return null;
            return (
              <section key={stage}>
                <h2 className="mb-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {stage} · {items.length}
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {items.map((c) => (
                    <Card key={c.id}>
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag tone="quiet">{c.origin}</Tag>
                        {c.countries.map((country) => (
                          <Tag key={country}>{country}</Tag>
                        ))}
                      </div>
                      <h3 className="mt-2 font-display text-lg text-ink">
                        <Link to="/admin/collaborations/$id" params={{ id: c.id }} className="hover:text-primary">
                          {c.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{c.objective}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Led by {c.leadOfficer} · updated {relative(c.updatedAt)}
                      </p>
                      {c.nextActions.length ? (
                        <p className="mt-1 text-xs text-ink">Next: {c.nextActions[0]}</p>
                      ) : null}
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No collaborations recorded."
          action={
            <Link to="/admin/inquiries" className={abtn.secondary}>
              Look at open inquiries
            </Link>
          }
        />
      )}
    </>
  );
}
