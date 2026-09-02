import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState, FilterGroup, FilterPanel, SearchField } from "@/components/editorial/Filters";
import { CollaborationCard } from "@/components/editorial/EntityCards";
import { PageHeader } from "@/components/editorial/Section";
import { InquiryButton } from "@/components/editorial/ui";
import { collaborations } from "@/data/collaborations";
import { collaborationCountries } from "@/data/graph";
import { COLLABORATION_TYPES, THEMES } from "@/types/content";
import type {
  CollaborationStatus,
  CollaborationType,
  GlobalRegion,
  ThemeId,
} from "@/types/content";

const REGIONS: GlobalRegion[] = ["Europe", "Asia", "Americas", "Africa", "Oceania"];
const STATUSES: CollaborationStatus[] = ["Planned", "Active", "Ongoing", "Completed"];

export const Route = createFileRoute("/collaborations/")({
  head: () => ({
    meta: [
      { title: "International Collaborations — Indonesia Vibes" },
      {
        name: "description",
        content:
          "Joint exhibitions, research partnerships, artist exchanges and bilateral programmes connecting Indonesian culture with partners worldwide.",
      },
      { property: "og:title", content: "International Collaborations — Indonesia Vibes" },
      {
        property: "og:description",
        content: "How Indonesia works with the world: exchanges, exhibitions and research partnerships.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/collaborations" }],
  }),
  component: CollaborationsPage,
});

function CollaborationsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<CollaborationType | null>(null);
  const [status, setStatus] = useState<CollaborationStatus | null>(null);
  const [region, setRegion] = useState<GlobalRegion | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeId | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return collaborations.filter((c) => {
      if (type && c.type !== type) return false;
      if (status && c.status !== status) return false;
      if (region && !c.regions.includes(region)) return false;
      if (country && !c.countries.includes(country)) return false;
      if (theme && !c.themes.includes(theme)) return false;
      if (!q) return true;
      return [c.title, c.intro, ...c.countries, ...c.internationalPartners.map((p) => p.name)]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, type, status, region, country, theme]);

  const active = Boolean(query || type || status || region || country || theme);
  const featured = collaborations.find((c) => c.featured);
  const reset = () => {
    setQuery("");
    setType(null);
    setStatus(null);
    setRegion(null);
    setCountry(null);
    setTheme(null);
  };

  const counts = {
    total: collaborations.length,
    countries: collaborationCountries.length,
    active: collaborations.filter((c) => c.status === "Active" || c.status === "Ongoing").length,
  };

  return (
    <>
      <PageHeader
        eyebrow="Collaborate"
        title="International Collaborations"
        intro="Cultural diplomacy is a two-way exchange. These are the partnerships already running between Indonesian institutions, artists and communities and their counterparts abroad — with objectives, timelines and outcomes made public."
      >
        <dl className="flex flex-wrap gap-x-12 gap-y-4">
          {[
            { label: "Programmes", value: counts.total },
            { label: "Partner countries", value: counts.countries },
            { label: "Active now", value: counts.active },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="eyebrow text-muted-foreground">{stat.label}</dt>
              <dd className="display-3 mt-1 text-primary tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {!active && featured ? (
        <section className="border-b border-border">
          <div className="container-editorial py-16">
            <h2 className="eyebrow text-primary">Featured collaboration</h2>
            <div className="mt-8">
              <CollaborationCard collaboration={featured} size="lg" />
            </div>
          </div>
        </section>
      ) : null}

      <FilterPanel
        resultCount={results.length}
        resultNoun={results.length === 1 ? "collaboration" : "collaborations"}
        onReset={reset}
        active={active}
      >
        <SearchField
          id="collab-search"
          label="Search"
          placeholder="Programme, partner or country"
          value={query}
          onChange={setQuery}
        />
        <FilterGroup label="Type" options={COLLABORATION_TYPES} value={type} onChange={setType} />
        <FilterGroup label="Status" options={STATUSES} value={status} onChange={setStatus} />
        <FilterGroup label="Region" options={REGIONS} value={region} onChange={setRegion} />
        <FilterGroup
          label="Country"
          options={collaborationCountries}
          value={country}
          onChange={setCountry}
        />
        <FilterGroup label="Theme" options={THEMES} value={theme} onChange={setTheme} />
      </FilterPanel>

      <div className="container-editorial py-16">
        <h2 className="sr-only">Collaborations</h2>
        {results.length ? (
          <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {results.map((c) => (
              <li key={c.id}>
                <CollaborationCard collaboration={c} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No collaborations match those filters">
            <p>Nothing here yet for that combination — which may be an opening rather than a gap.</p>
          </EmptyState>
        )}
      </div>

      <section className="border-t border-border bg-ink-deep text-sand">
        <div className="container-editorial py-16">
          <h2 className="display-2 max-w-2xl">Propose a collaboration</h2>
          <p className="standfirst mt-5 max-w-2xl text-sand/80">
            Museums, festivals, universities and funders can start a structured conversation with the
            programme team. Tell us the form, the audience and the timeframe.
          </p>
          <div className="mt-8">
            <InquiryButton
              search={{ topic: "Collaboration proposal", subject: "New collaboration proposal" }}
            >
              Start a proposal
            </InquiryButton>
          </div>
        </div>
      </section>
    </>
  );
}
