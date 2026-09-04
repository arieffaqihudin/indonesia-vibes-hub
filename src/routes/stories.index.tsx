import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FilterBar } from "@/components/editorial/FilterBar";
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
      </PageHeader>

      <FilterBar
        primary={[
          {
            id: "kind",
            label: "Kind",
            options: kinds.filter((k) => k !== "All"),
            value: kind === "All" ? null : kind,
            onChange: (v) => setKind((v ?? "All") as (typeof kinds)[number]),
            allLabel: "All",
          },
        ]}
        resultCount={list.length}
        resultNoun={list.length === 1 ? "story" : "stories"}
      />

      <div className="container-editorial py-16">
        <h2 className="sr-only">Stories</h2>
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