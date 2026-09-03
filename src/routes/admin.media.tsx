import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { rightsIssues } from "@/lib/admin/selectors";
import { RIGHTS_STATUSES, can, type RightsStatus } from "@/lib/admin/types";
import { Card, EmptyState, Metric, PageHeading, SelectFilter, Table, Td, Tag, abtn, dateFmt, field } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/media")({
  head: adminHead("Media & rights", "Track permission, credit and alt text for every asset before publication."),
  component: Media,
});

function Media() {
  const admin = useAdmin();
  const [filter, setFilter] = useState("All");
  const editable = can(admin.role, "media");
  const assets = admin.media.filter((m) => m.contentId !== "removed").filter((m) => (filter === "All" ? true : m.permission === filter));
  const blocked = rightsIssues(admin.media);
  const missingAlt = admin.media.filter((m) => !m.altText.trim());

  return (
    <>
      <PageHeading
        eyebrow="Editorial"
        title="Media & rights"
        description="An asset without confirmed permission blocks publication of the record it belongs to."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Metric value={admin.media.length} label="Assets" />
        <Metric value={blocked.length} label="Blocking publication" hint="Required assets without confirmed rights." />
        <Metric value={missingAlt.length} label="Missing alt text" />
      </div>

      <div className="mb-4 max-w-xs">
        <SelectFilter label="Permission" value={filter} onChange={setFilter} options={["All", ...RIGHTS_STATUSES]} />
      </div>

      {assets.length ? (
        <Card>
          <Table head={["Asset", "Record", "Rights holder", "Permission", "Alt text", "Updated"]}>
            {assets.map((asset) => {
              const item = admin.content.find((c) => c.id === asset.contentId);
              return (
                <tr key={asset.id} className="border-t border-border align-top">
                  <Td>
                    <span className="block text-ink">{asset.fileName}</span>
                    <span className="block text-xs text-muted-foreground">
                      {asset.kind}
                      {asset.required ? " · required" : ""}
                    </span>
                  </Td>
                  <Td>
                    {item ? (
                      <Link to="/admin/content/$id" params={{ id: item.id }} className="text-primary underline-offset-4 hover:underline">
                        {item.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>
                    <span className="block">{asset.rightsHolder}</span>
                    <span className="block text-xs text-muted-foreground">{asset.credit}</span>
                  </Td>
                  <Td>
                    <select
                      className={`${field} min-h-8 w-44 py-1 text-xs`}
                      aria-label={`Permission for ${asset.fileName}`}
                      value={asset.permission}
                      disabled={!editable}
                      onChange={(e) => admin.updateMedia(asset.id, { permission: e.target.value as RightsStatus })}
                    >
                      {RIGHTS_STATUSES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    {asset.restrictions ? (
                      <span className="mt-1 block text-xs text-primary">{asset.restrictions}</span>
                    ) : null}
                  </Td>
                  <Td>{asset.altText ? asset.altText : <Tag tone="alert">Missing</Tag>}</Td>
                  <Td>{dateFmt(asset.updatedAt)}</Td>
                </tr>
              );
            })}
          </Table>
        </Card>
      ) : (
        <EmptyState
          title="No assets match this filter."
          action={
            <button type="button" className={abtn.secondary} onClick={() => setFilter("All")}>
              Show all assets
            </button>
          }
        />
      )}
    </>
  );
}
