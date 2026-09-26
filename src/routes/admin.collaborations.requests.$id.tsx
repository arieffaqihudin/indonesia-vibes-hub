import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { useEffect } from "react";

import { adminHead } from "@/lib/admin/head";
import { formatWhen, useCms } from "@/lib/cms/store";
import { REQUEST_STATUSES, type RequestStatus } from "@/lib/cms/types";
import { Field, Select, StatusBadge, TextArea, btn } from "@/components/cms/ui";

export const Route = createFileRoute("/admin/collaborations/requests/$id")({
  head: adminHead("Collaboration request", "Read and respond to a collaboration request."),
  component: RequestDetail,
});

function RequestDetail() {
  const { id } = Route.useParams();
  const cms = useCms();
  const request = cms.requests.find((r) => r.id === id);
  // Opening a new request moves it to Reviewing.
  useEffect(() => { if (request?.status === "New") cms.updateRequest(id, { status: "Reviewing" }); }, [request?.status, id, cms]);
  if (!request) return <p className="py-20 text-center text-sm text-muted-foreground">Request not found.</p>;

  return <div className="mx-auto max-w-4xl">
    <Link to="/admin/collaborations" search={{ tab: "requests" }} className={`${btn.ghost} -ml-2 mb-3`}><ArrowLeft className="h-4 w-4" />Requests</Link>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <article className="rounded-lg border border-border bg-background p-5">
        <p className="text-xs text-muted-foreground">{request.intent} · Received {formatWhen(request.receivedAt)}</p>
        <h1 className="mt-1 text-xl font-semibold text-ink">{request.subject}</h1>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink">{request.message}</p>
        <dl className="mt-6 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
          <div><dt className="text-xs text-muted-foreground">Name</dt><dd className="text-ink">{request.name}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Organisation</dt><dd className="text-ink">{request.organisation}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Country</dt><dd className="text-ink">{request.country}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Email</dt><dd className="truncate text-ink">{request.email}</dd></div>
        </dl>
      </article>
      <aside className="space-y-4">
        <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Status</span><StatusBadge status={request.status} /></div>
        <Field label="Change status" htmlFor="rs"><Select id="rs" value={request.status} onChange={(v) => cms.updateRequest(id, { status: v as RequestStatus })} options={[...REQUEST_STATUSES]} /></Field>
        <Field label="Internal note" htmlFor="note" hint="Only visible to the team."><TextArea id="note" rows={5} value={request.note} onChange={(v) => cms.updateRequest(id, { note: v })} /></Field>
        <a href={`mailto:${request.email}?subject=${encodeURIComponent(`Re: ${request.subject}`)}`} className={`${btn.primary} w-full`}><Mail className="h-4 w-4" />Reply by email</a>
      </aside>
    </div>
  </div>;
}
