import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Pill } from "@/components/editorial/ui";
import { cn } from "@/lib/utils";
import type { Collaboration, Institution, Person, Place, SearchRecord } from "@/types/content";

export function PersonCard({ person, size = "md" }: { person: Person; size?: "sm" | "md" }) {
  return (
    <article className="group min-w-0">
      <Link to="/people/$slug" params={{ slug: person.slug }} className="block">
        <div className="media-zoom relative bg-muted">
          <img
            src={person.image}
            alt={
              person.entity === "community"
                ? `${person.name}, photographed at work`
                : `Portrait of ${person.name}`
            }
            width={800}
            height={800}
            loading="lazy"
            className={cn("w-full object-cover", size === "sm" ? "aspect-square" : "aspect-[4/5]")}
          />
          <span className="absolute top-3 left-3 bg-background/92 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-ink uppercase">
            {person.entity === "community" ? "Community" : person.roles[0]}
          </span>
        </div>
        <div className="pt-4">
          <h3 className="text-lg leading-snug font-medium text-ink">
            <span className="link-underline">{person.name}</span>
          </h3>
          {person.localName ? (
            <p className="mt-1 text-sm text-muted-foreground italic">{person.localName}</p>
          ) : null}
          <p className="mt-1.5 text-sm text-primary">{person.role}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {person.intro ?? person.bio}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{person.based}</p>
        </div>
      </Link>
    </article>
  );
}

export function InstitutionCard({ institution }: { institution: Institution }) {
  return (
    <article className="group flex min-w-0 flex-col border border-border bg-background">
      <Link to="/institutions/$slug" params={{ slug: institution.slug }} className="flex h-full flex-col">
        <div className="media-zoom bg-muted">
          <img
            src={institution.image}
            alt={`${institution.name}, ${institution.type.toLowerCase()} in ${institution.city}`}
            width={1600}
            height={1104}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="eyebrow text-primary">{institution.type}</p>
          <h3 className="mt-2.5 text-lg leading-snug font-medium text-ink">
            <span className="link-underline">{institution.name}</span>
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {institution.profile}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            {institution.city}, {institution.province}
          </p>
          {institution.internationalExperience ? (
            <p className="mt-3">
              <Pill>Works internationally</Pill>
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export function PlaceCard({ place }: { place: Place }) {
  return (
    <article className="group min-w-0">
      <Link to="/places/$slug" params={{ slug: place.slug }} className="block">
        {place.image ? (
          <div className="media-zoom bg-muted">
            <img
              src={place.image}
              alt={`${place.name}, ${place.region}`}
              width={1600}
              height={1104}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
        ) : null}
        <div className="pt-4">
          <p className="eyebrow text-primary">{place.type ?? "Place"}</p>
          <h3 className="mt-2.5 text-lg leading-snug font-medium text-ink">
            <span className="link-underline">{place.name}</span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{place.summary}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {place.province ? `${place.province} · ` : ""}
            {place.region}
          </p>
        </div>
      </Link>
    </article>
  );
}

const STATUS_TONE = {
  Active: "brand",
  Ongoing: "brand",
  Planned: "outline",
  Completed: "quiet",
} as const;

export function CollaborationCard({
  collaboration,
  size = "md",
}: {
  collaboration: Collaboration;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <article className="group min-w-0">
      <Link
        to="/collaborations/$slug"
        params={{ slug: collaboration.slug }}
        className="block"
      >
        <div className="media-zoom bg-muted">
          <img
            src={collaboration.image}
            alt={`${collaboration.title}: ${collaboration.countries.join(" and ")}`}
            width={1600}
            height={1104}
            loading="lazy"
            className={cn(
              "w-full object-cover",
              size === "lg" ? "aspect-[16/9]" : size === "sm" ? "aspect-[4/3]" : "aspect-[3/2]",
            )}
          />
        </div>
        <div className="pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={STATUS_TONE[collaboration.status]}>{collaboration.status}</Pill>
            <span className="text-xs text-muted-foreground">{collaboration.type}</span>
          </div>
          <h3
            className={cn(
              "mt-3 font-medium text-ink",
              size === "lg" ? "display-3" : "text-xl leading-snug",
            )}
          >
            <span className="link-underline">{collaboration.title}</span>
          </h3>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted-foreground">
            {collaboration.intro}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {collaboration.countries.join(" · ")} · {collaboration.years}
          </p>
        </div>
      </Link>
    </article>
  );
}

/** Search results adapt their shape to the type of thing they point at. */
export function SearchResultCard({ record }: { record: SearchRecord }) {
  const inner = (
    <div className="flex min-w-0 gap-4">
      {record.image ? (
        <img
          src={record.image}
          alt=""
          width={400}
          height={400}
          loading="lazy"
          className={cn(
            "shrink-0 bg-muted object-cover",
            record.type === "People & Communities"
              ? "h-20 w-20 rounded-full"
              : "h-20 w-28",
          )}
        />
      ) : (
        <span
          aria-hidden
          className="flex h-20 w-28 shrink-0 items-center justify-center bg-blush text-[0.65rem] font-semibold tracking-[0.14em] text-primary uppercase"
        >
          {record.type.split(" ")[0]}
        </span>
      )}
      <div className="min-w-0">
        <p className="eyebrow text-primary">{record.type}</p>
        <h3 className="mt-1.5 text-lg leading-snug font-medium text-ink">
          <span className="link-underline">{record.title}</span>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {record.context}
        </p>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {record.location ? <span>{record.location}</span> : null}
          {record.meta ? <span>{record.meta}</span> : null}
          {record.status ? <span className="text-clay">{record.status}</span> : null}
        </p>
      </div>
    </div>
  );

  const slug = record.slug ?? "";
  switch (record.type) {
    case "Story":
      return <RecordShell to="/stories/$slug" params={{ slug }}>{inner}</RecordShell>;
    case "Culture":
      return <RecordShell to="/culture/$slug" params={{ slug }}>{inner}</RecordShell>;
    case "People & Communities":
      return <RecordShell to="/people/$slug" params={{ slug }}>{inner}</RecordShell>;
    case "Institutions":
      return <RecordShell to="/institutions/$slug" params={{ slug }}>{inner}</RecordShell>;
    case "Places":
      return <RecordShell to="/places/$slug" params={{ slug }}>{inner}</RecordShell>;
    case "Events":
      return <RecordShell to="/events/$slug" params={{ slug }}>{inner}</RecordShell>;
    case "Collaborations":
      return <RecordShell to="/collaborations/$slug" params={{ slug }}>{inner}</RecordShell>;
    default:
      return <RecordShell to="/opportunities">{inner}</RecordShell>;
  }
}

function RecordShell(props: {
  children: ReactNode;
  to: string;
  params?: { slug: string };
}) {
  const { children, to, params } = props;
  return (
    <article className="group border-b border-border py-6 last:border-b-0">
      <Link to={to as never} params={params as never} className="block">
        {children}
      </Link>
    </article>
  );
}
