import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/editorial/Section";
import { StoryCard } from "@/components/editorial/StoryCard";
import { stories } from "@/data/content";
import { cn } from "@/lib/utils";

const kinds = ["All", "Feature", "Interview", "Dispatch", "Field note"] as const;

export const Route = createFileRoute("/stories/")({
  head: () => ({
    meta: [
      { title: "Stories — Indonesia Vibes" },
      {
        name: "description",
        content:
          "Features, interviews, dispatches and field notes on Indonesian culture, reported with the communities who hold it.",
      },
      { property: "og:title", content: "Stories — Indonesia Vibes" },
      {
        property: "og:description",
        content: "Features, interviews and field notes on Indonesian culture.",
      },
      { property: "og:url", content: "/stories" },
    ],
    links: [{ rel: "canonical", href: "/stories" }],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");
  const list = useMemo(
    () => (kind === "All" ? stories : stories.filter((s) => s.kind === kind)),
    [kind],
  );

  return (
    <>
      <PageHeader
        eyebrow="Discover"
        title="Stories"
        intro="Long reads and short dispatches. Every piece links back to the forms, people and places it came from."
      >
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={cn(
                "min-h-9 rounded-full border px-4 text-sm transition-colors",
                kind === k
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-ink hover:border-primary hover:text-primary",
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="container-editorial py-16">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
        {list.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Nothing filed under {kind} yet.</p>
        ) : null}
      </div>
    </>
  );
}