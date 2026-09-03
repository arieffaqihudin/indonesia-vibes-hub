import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { adminHead } from "@/lib/admin/head";
import { useAdmin } from "@/lib/admin/store";
import { contentSourceIssues } from "@/lib/admin/selectors";
import { Card, EmptyState, ExternalLink, Metric, PageHeading, SearchInput, Table, Td, Tag, abtn, dateFmt } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/sources")({
  head: adminHead("Sources & verification", "Everything with an unverified source or an unsupported claim, in one place."),
  component: Sources,
});

function Sources() {
  const admin = useAdmin();
  const [query, setQuery] = useState("");
  const issues = contentSourceIssues(admin.content, admin.sources, admin.claims).filter((i) =>
    query ? i.item.title.toLowerCase().includes(query.toLowerCase()) : true,
  );
  const verified = admin.sources.filter((s) => s.status === "Verified").length;

  return (
    <>
      <PageHeading
        eyebrow="Editorial"
        title="Sources & verification"
        description="Research work lives with the content it supports. This is the shortlist of what still needs checking."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Metric value={admin.sources.length} label="Sources recorded" />
        <Metric value={verified} label="Verified" />
        <Metric value={issues.length} label="Records with open questions" />
      </div>

      <div className="mb-4 max-w-md">
        <SearchInput value={query} onChange={setQuery} label="Search records" placeholder="Record title" />
      </div>

      {issues.length ? (
        <div className="space-y-3">
          {issues.map(({ item, unverified, unsupported }) => (
            <Card key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-lg text-ink">
                    <Link to="/admin/content/$id" params={{ id: item.id }} className="hover:text-primary">
                      {item.title}
                    </Link>
                  </h2>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {unverified.length ? <Tag tone="alert">{unverified.length} unverified source{unverified.length === 1 ? "" : "s"}</Tag> : null}
                    {unsupported.length ? <Tag tone="alert">{unsupported.length} claim{unsupported.length === 1 ? "" : "s"} without evidence</Tag> : null}
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-ink">
                    {unverified.map((s) => (
                      <li key={s.id}>
                        {s.title} <span className="text-xs text-muted-foreground">· {s.status}</span>{" "}
                        {s.url ? <ExternalLink href={s.url}>Open</ExternalLink> : null}
                      </li>
                    ))}
                    {unsupported.map((c) => (
                      <li key={c.id} className="text-muted-foreground">
                        “{c.text}” <span className="text-xs">· {c.section}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/admin/content/$id" params={{ id: item.id }} className={abtn.secondary}>
                  Open sources
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No open verification questions." hint="Sources flagged as unverified or claims without evidence appear here." />
      )}

      <div className="mt-8">
        <Card title="All sources">
          <Table head={["Source", "Type", "Status", "Verified by", "Record"]}>
            {admin.sources.map((s) => {
              const item = admin.content.find((c) => c.id === s.contentId);
              return (
                <tr key={s.id} className="border-t border-border">
                  <Td>{s.title}</Td>
                  <Td>{s.type}</Td>
                  <Td>{s.status}</Td>
                  <Td>{s.verifiedBy ? `${s.verifiedBy} · ${dateFmt(s.verifiedAt)}` : "—"}</Td>
                  <Td>
                    {item ? (
                      <Link to="/admin/content/$id" params={{ id: item.id }} className="text-primary underline-offset-4 hover:underline">
                        {item.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </Td>
                </tr>
              );
            })}
          </Table>
        </Card>
      </div>
    </>
  );
}
