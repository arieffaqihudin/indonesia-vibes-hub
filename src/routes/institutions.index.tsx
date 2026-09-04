import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/editorial/Filters";
import { FilterBar } from "@/components/editorial/FilterBar";
import type { FilterDef } from "@/components/editorial/FilterBar";
import { InstitutionCard } from "@/components/editorial/EntityCards";
import { PageHeader } from "@/components/editorial/Section";
import { InquiryButton } from "@/components/editorial/ui";
import { institutions } from "@/data/institutions";
import { institutionExpertise, institutionRegions } from "@/data/graph";
import { INSTITUTION_TYPES, THEMES } from "@/types/content";
import type { InstitutionType, ThemeId } from "@/types/content";

export const Route = createFileRoute("/institutions/")({
  head: () => ({
    meta: [
      { title: "Institutions — Indonesia Vibes" },
      {
        name: "description",
        content:
          "Museums, universities, research centres, archives and cultural organisations across Indonesia, with their collections, programmes and partnership interests.",
      },
      { property: "og:title", content: "Institutions — Indonesia Vibes" },
      {
        property: "og:description",
        content: "The Indonesian institutions international partners should know, and how to reach them.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/institutions" }],
  }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<InstitutionType | null>(null);
  const [theme, setTheme] = useState<ThemeId | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [expertise, setExpertise] = useState<string | null>(null);
  const [international, setInternational] = useState<"International experience" | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return institutions.filter((i) => {
      if (type && i.type !== type) return false;
      if (theme && !i.themes.includes(theme)) return false;
      if (region && i.region !== region) return false;
      if (expertise && !i.expertise.includes(expertise)) return false;
      if (international && !i.internationalExperience) return false;
      if (!q) return true;
      return [i.name, i.city, i.province, i.profile, ...i.expertise, ...i.collections]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, type, theme, region, expertise, international]);

  const primaryFilters: FilterDef[] = [
    {
      id: "type",
      label: "Type",
      options: INSTITUTION_TYPES,
      value: type,
      onChange: (v) => setType(v as InstitutionType | null),
      allLabel: "All types",
    },
    {
      id: "region",
      label: "Region",
      options: institutionRegions,
      value: region,
      onChange: setRegion,
      allLabel: "All regions",
    },
  ];

  const secondaryFilters: FilterDef[] = [
    { id: "theme", label: "Theme", options: THEMES, value: theme, onChange: (v) => setTheme(v as ThemeId | null) },
    { id: "expertise", label: "Expertise", options: institutionExpertise, value: expertise, onChange: setExpertise },
    {
      id: "partnership",
      label: "Partnership",
      options: ["International experience"],
      value: international,
      onChange: (v) => setInternational(v as "International experience" | null),
      allLabel: "Any",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Institutions"
        intro="The museums, universities, archives, research centres and cultural organisations that steward Indonesian culture — presented as potential partners, not as a directory of addresses."
      >
        <InquiryButton
          search={{ topic: "Institutional connection", subject: "Institutional partnership enquiry" }}
        >
          Propose an institutional partnership
        </InquiryButton>
      </PageHeader>

      <FilterBar
        search={{ value: query, onChange: setQuery, placeholder: "Name, city or collection" }}
        primary={primaryFilters}
        secondary={secondaryFilters}
        resultCount={results.length}
        resultNoun={results.length === 1 ? "institution" : "institutions"}
      />

      <div className="container-editorial py-16">
        <h2 className="sr-only">Institutions</h2>
        {results.length ? (
          <ul className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {results.map((institution) => (
              <li key={institution.id}>
                <InstitutionCard institution={institution} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No institutions match those filters">
            <p>
              Widen the filters, or{" "}
              <Link
                to="/contact"
                search={{ topic: "General question" as const, subject: "Suggest an institution" }}
                className="text-primary underline underline-offset-4"
              >
                suggest an institution
              </Link>{" "}
              we should profile.
            </p>
          </EmptyState>
        )}
      </div>
    </>
  );
}
