import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";

import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import { PageHeading } from "@/components/contributor/primitives";
import { SUBMISSION_TYPES } from "@/lib/contributor/schema";

export const Route = createFileRoute("/contributor/new")({
  head: () => ({
    meta: [
      { title: "Create a submission — Indonesia Vibes Contributor Workspace" },
      {
        name: "description",
        content:
          "Choose what to contribute: an article, an event, a cultural profile, or a collaboration.",
      },
      { property: "og:title", content: "Create a submission — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "Choose what to contribute and we will guide you through it." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewPage,
});

function NewPage() {
  const navigate = useNavigate();

  return (
    <WorkspaceShell>
      <PageHeading
        eyebrow="Create new"
        title="What would you like to contribute?"
        intro="Each form is guided, saves as you go, and can be finished later. Nothing is sent until you choose to submit."
      />
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {SUBMISSION_TYPES.map((t) => (
          <li key={t.type}>
            <button
              type="button"
              onClick={() => navigate({ to: "/contributor/submissions/new/$type", params: { type: t.type } })}
              className="group flex h-full w-full flex-col rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary"
            >
              <span className="flex items-center justify-between">
                <span className="text-base font-semibold tracking-tight text-ink">{t.cta}</span>
                <ArrowRight
                  className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </span>
              <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.description}</span>
              <span className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-ink">Typically needed: </span>
                {t.needs}
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {t.effort}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </WorkspaceShell>
  );
}
