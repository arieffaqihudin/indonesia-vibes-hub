import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { SubmissionForm } from "@/components/contributor/SubmissionForm";
import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import { PageHeading } from "@/components/contributor/primitives";
import { TYPE_CONFIG, type SubmissionType } from "@/lib/contributor/schema";
import { useWorkspace } from "@/lib/contributor/store";

const TYPES: SubmissionType[] = ["story", "event", "opportunity", "profile", "collaboration"];

export const Route = createFileRoute("/contributor/submissions/new/$type")({
  head: ({ params }) => {
    const config = TYPE_CONFIG[(params.type as SubmissionType) in TYPE_CONFIG ? (params.type as SubmissionType) : "story"];
    return {
      meta: [
        { title: `${config.cta} — Indonesia Vibes Contributor Workspace` },
        { name: "description", content: config.description },
        { property: "og:title", content: `${config.cta} — Indonesia Vibes` },
        { property: "og:description", content: config.description },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: NewSubmissionPage,
});

function NewSubmissionPage() {
  const { type } = Route.useParams();
  const { createSubmission, getSubmission, hydrated, user } = useWorkspace();
  const navigate = useNavigate();
  const [id, setId] = useState<string | null>(null);
  const created = useRef(false);

  const valid = TYPES.includes(type as SubmissionType);

  useEffect(() => {
    if (!hydrated || !user || !valid || created.current) return;
    created.current = true;
    setId(createSubmission(type as SubmissionType).id);
  }, [hydrated, user, valid, type, createSubmission]);

  useEffect(() => {
    if (hydrated && !valid) navigate({ to: "/contributor/new" });
  }, [hydrated, valid, navigate]);

  const submission = id ? getSubmission(id) : undefined;
  const config = valid ? TYPE_CONFIG[type as SubmissionType] : null;

  return (
    <WorkspaceShell>
      {config ? (
        <PageHeading eyebrow="New submission" title={config.cta} intro={config.description} />
      ) : null}
      <div className="mt-8">
        {submission ? (
          <SubmissionForm submission={submission} />
        ) : (
          <p className="text-sm text-muted-foreground">Preparing your form…</p>
        )}
      </div>
    </WorkspaceShell>
  );
}
