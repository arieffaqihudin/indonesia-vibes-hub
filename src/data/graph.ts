/**
 * Derived views over the content graph: relationship lookups shared by the
 * directory and detail pages, plus the global search index. Related content
 * is always computed from structured relations, never hand-listed per page.
 */
import {
  eventCountry,
  eventLocationLabel,
  events,
  forms,
  getForm,
  papers,
  people,
  places,
  stories,
} from "@/data/content";
import { collaborations } from "@/data/collaborations";
import { institutions } from "@/data/institutions";
import type {
  Collaboration,
  CulturalEvent,
  Institution,
  Person,
  Place,
  SearchRecord,
  Story,
  ThemeId,
} from "@/types/content";
import { publicFormat } from "@/lib/editorial";

/* ---------- lookups ---------- */

const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((x) => [x.id, x]));

const institutionMap = byId(institutions);
const collaborationMap = byId(collaborations);
const personMapById = byId(people);
const placeMapById = byId(places);

export const getInstitutionById = (id: string) => institutionMap.get(id);
export const getCollaborationById = (id: string) => collaborationMap.get(id);
export const getPersonById = (id: string) => personMapById.get(id);
export const getPlaceById = (id: string) => placeMapById.get(id);

export const getPersonBySlug = (slug: string) => people.find((p) => p.slug === slug);
export const getInstitutionBySlug = (slug: string) => institutions.find((i) => i.slug === slug);
export const getPlaceBySlug = (slug: string) => places.find((p) => p.slug === slug);
export const getCollaborationBySlug = (slug: string) =>
  collaborations.find((c) => c.slug === slug);

export const resolve = <T>(ids: string[] | undefined, get: (id: string) => T | undefined): T[] =>
  (ids ?? []).map(get).filter((x): x is T => Boolean(x));

/* ---------- person / community relations ---------- */

export const storiesForPerson = (personId: string) =>
  stories.filter((s) => s.peopleIds.includes(personId));

export const institutionsForPerson = (person: Person) => [
  ...new Set([
    ...resolve(person.institutionIds, getInstitutionById),
    ...institutions.filter((i) => i.peopleIds.includes(person.id)),
  ]),
];

export const eventsForPerson = (person: Person) =>
  events.filter(
    (e) =>
      e.peopleIds?.includes(person.id) ||
      e.formIds.some((f) => person.formIds.includes(f)),
  );

export const papersForPerson = (person: Person) =>
  papers.filter((p) => p.peopleIds?.includes(person.id) || p.authors.includes(person.name.split(" ").slice(-1)[0]!));

export const collaborationsForPerson = (person: Person) =>
  collaborations.filter((c) => c.peopleIds.includes(person.id));

export const placesForPerson = (person: Person) => {
  const ids = new Set<string>([
    ...(person.placeId ? [person.placeId] : []),
    ...storiesForPerson(person.id).flatMap((s) => s.placeIds),
  ]);
  return [...ids].map(getPlaceById).filter((p): p is Place => Boolean(p));
};

export const peopleForForm = (formId: string) => people.filter((p) => p.formIds.includes(formId));

/* ---------- institution relations ---------- */

export const peopleForInstitution = (institution: Institution) => [
  ...new Set([
    ...resolve(institution.peopleIds, getPersonById),
    ...people.filter((p) => p.institutionIds?.includes(institution.id)),
  ]),
];

export const collaborationsForInstitution = (institution: Institution) =>
  collaborations.filter((c) => c.indonesianPartnerIds.includes(institution.id));

export const relatedInstitutions = (institution: Institution, limit = 3) =>
  institutions
    .filter((i) => i.id !== institution.id)
    .map((i) => ({
      i,
      score:
        i.themes.filter((t) => institution.themes.includes(t)).length * 2 +
        i.formIds.filter((f) => institution.formIds.includes(f)).length * 2 +
        i.partnerCountries.filter((c) => institution.partnerCountries.includes(c)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.i);

/* ---------- place relations ---------- */

export const eventsForPlace = (placeId: string) => events.filter((e) => e.placeId === placeId);
export const storiesForPlace = (placeId: string) =>
  stories.filter((s) => s.placeIds.includes(placeId));
export const peopleForPlace = (placeId: string) =>
  people.filter((p) => p.placeId === placeId);
export const institutionsForPlace = (placeId: string) =>
  institutions.filter((i) => i.placeId === placeId);
export const formsForPlace = (placeId: string) =>
  forms.filter((f) => f.originPlaceId === placeId);
export const collaborationsForPlace = (placeId: string) =>
  collaborations.filter((c) => c.placeIds.includes(placeId));

const distanceKm = (a: Place, b: Place) => {
  const dx = (a.lng - b.lng) * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180));
  const dy = a.lat - b.lat;
  return Math.sqrt(dx * dx + dy * dy) * 111;
};

export const nearbyPlaces = (place: Place, limit = 3) =>
  places
    .filter((p) => p.id !== place.id && p.country === place.country)
    .map((p) => ({ p, d: distanceKm(p, place) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => ({ place: x.p, km: Math.round(x.d) }));

export const indonesianPlaces = places.filter((p) => p.country === "Indonesia");

/* ---------- collaboration relations ---------- */

export const collaborationsForForm = (formId: string) =>
  collaborations.filter((c) => c.formIds.includes(formId));

export const collaborationsForCountry = (country: string) =>
  collaborations.filter((c) => c.countries.includes(country));

export const collaborationCountries = [
  ...new Set(collaborations.flatMap((c) => c.countries.filter((x) => x !== "Indonesia"))),
].sort();

export const relatedCollaborations = (collaboration: Collaboration, limit = 3) =>
  collaborations
    .filter((c) => c.id !== collaboration.id)
    .map((c) => ({
      c,
      score:
        c.themes.filter((t) => collaboration.themes.includes(t)).length * 2 +
        c.countries.filter((x) => collaboration.countries.includes(x)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.c);

/* ---------- filter vocabularies derived from the data ---------- */

export const personRegions = [...new Set(people.map((p) => p.region).filter(Boolean))] as string[];
export const personProvinces = [...new Set(people.map((p) => p.province).filter(Boolean))] as string[];
export const personCities = [...new Set(people.map((p) => p.city).filter(Boolean))] as string[];

export const institutionRegions = [...new Set(institutions.map((i) => i.region))];
export const institutionExpertise = [...new Set(institutions.flatMap((i) => i.expertise))].sort();

export const placeRegions = [...new Set(indonesianPlaces.map((p) => p.region))];
export const placeProvinces = [
  ...new Set(indonesianPlaces.map((p) => p.province).filter(Boolean)),
] as string[];
export const placeTypes = [
  ...new Set(indonesianPlaces.map((p) => p.type).filter(Boolean)),
] as string[];

/* ---------- global search ---------- */

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const eventStatus = (e: CulturalEvent) => {
  const now = new Date("2026-09-02T00:00:00Z").getTime();
  if (new Date(e.endDate + "T00:00:00Z").getTime() < now) return "Past";
  if (new Date(e.startDate + "T00:00:00Z").getTime() <= now) return "On now";
  return "Upcoming";
};

const storyRecord = (s: Story): SearchRecord => ({
  id: s.id,
  type: publicFormat(s),
  title: s.title,
  context: s.dek,
  location: resolve(s.placeIds, getPlaceById)[0]?.name,
  meta: `${s.topics?.[0] ?? "Editorial Content"} · ${s.readingMinutes} min read`,
  image: s.image,
  slug: s.slug,
  themes: s.topics ?? [...new Set(resolve(s.formIds, getForm).flatMap((f) => f.themes ?? []))],
  countries: ["Indonesia"],
  date: s.publishedAt,
  keywords: [
    s.title,
    s.dek,
    publicFormat(s),
    ...(s.topics ?? []),
    ...resolve(s.formIds, getForm).flatMap((f) => [f.name, ...(f.aliases ?? [])]),
    ...resolve(s.peopleIds, getPersonById).map((p) => p.name),
    ...resolve(s.placeIds, getPlaceById).map((p) => p.name),
  ],
});

export const searchRecords: SearchRecord[] = [
  ...stories.map(storyRecord),

  ...forms.map((f) => ({
    id: f.id,
    type: "Topics" as const,
    title: f.name,
    context: f.summary,
    location: getPlaceById(f.originPlaceId)?.name,
    meta: `${f.discipline} · ${f.pillar[0]!.toUpperCase()}${f.pillar.slice(1)}`,
    image: f.image,
    slug: f.slug,
    themes: f.themes ?? [],
    countries: ["Indonesia"],
    keywords: [f.name, f.discipline, f.summary, ...(f.aliases ?? [])],
  })),

  ...people.map((p) => ({
    id: p.id,
    type: "People & Organisations" as const,
    title: p.name,
    context: p.intro ?? p.bio,
    location: p.based,
    meta: p.entity === "community" ? "Community" : p.role,
    image: p.image,
    slug: p.slug,
    themes: p.themes,
    countries: ["Indonesia"],
    status: p.availability,
    keywords: [
      p.name,
      p.localName ?? "",
      p.role,
      ...p.roles,
      ...(p.expertise ?? []),
      p.based,
      ...resolve(p.formIds, getForm).flatMap((f) => [f.name, ...(f.aliases ?? [])]),
      ...resolve(p.institutionIds, getInstitutionById).map((i) => i.name),
    ],
  })),

  ...institutions.map((i) => ({
    id: i.id,
    type: "People & Organisations" as const,
    title: i.name,
    context: i.profile,
    location: `${i.city}, ${i.country}`,
    meta: i.type,
    image: i.image,
    slug: i.slug,
    themes: i.themes,
    countries: [i.country, ...i.partnerCountries],
    status: i.internationalExperience ? "International experience" : undefined,
    keywords: [i.name, i.type, i.city, i.province, ...i.expertise, ...i.collections, ...i.programmes],
  })),

  ...places.map((p) => ({
    id: p.id,
    type: "Places" as const,
    title: p.name,
    context: p.summary,
    location: `${p.region}, ${p.country}`,
    meta: p.type,
    image: p.image,
    slug: p.slug,
    themes: p.themes ?? [],
    countries: [p.country],
    keywords: [p.name, p.region, p.province ?? "", p.city ?? "", p.country, p.type ?? "", p.summary],
  })),

  ...events.map((e) => ({
    id: e.id,
    type: "Events" as const,
    title: e.title,
    context: e.summary ?? e.sourceNote ?? "",
    location: eventLocationLabel(e),
    meta: e.type ?? "Event",
    ...(e.image ? { image: e.image } : {}),
    slug: e.slug,
    themes: [...new Set(resolve(e.formIds, getForm).flatMap((f) => f.themes ?? []))],
    countries: [eventCountry(e) || "Indonesia"],
    date: e.startDate,
    status: eventStatus(e),
    keywords: [
      e.title,
      e.type ?? "",
      e.summary ?? "",
      eventLocationLabel(e),
      ...resolve(e.formIds, getForm).flatMap((f) => [f.name, ...(f.aliases ?? [])]),
    ],
  })),

  ...collaborations.map((c) => ({
    id: c.id,
    type: "Collaborations" as const,
    title: c.title,
    context: c.intro,
    location: c.countries.join(" · "),
    meta: c.type,
    image: c.image,
    slug: c.slug,
    themes: c.themes,
    countries: c.countries,
    date: c.years,
    status: c.status,
    keywords: [
      c.title,
      c.type,
      c.status,
      c.intro,
      ...c.countries,
      ...c.internationalPartners.map((p) => p.name),
      ...resolve(c.indonesianPartnerIds, getInstitutionById).map((i) => i.name),
    ],
  })),
];

const indexed = searchRecords.map((r) => ({
  record: r,
  haystack: norm([r.title, r.context, r.location ?? "", r.meta ?? "", ...r.keywords].join(" ")),
  title: norm(r.title),
}));

/** Loose synonym expansion so search behaves like discovery, not lookup. */
const SYNONYMS: Record<string, string[]> = {
  "shadow puppetry": ["wayang"],
  "shadow puppet": ["wayang"],
  puppet: ["wayang"],
  textile: ["ikat", "batik", "songket", "weaving", "cloth", "tenun"],
  textiles: ["ikat", "batik", "weaving", "cloth"],
  weaving: ["ikat", "textile", "hinggi"],
  cloth: ["ikat", "textile"],
  boat: ["phinisi", "shipbuilding", "maritime"],
  ship: ["phinisi", "boatbuilding", "maritime"],
  music: ["gamelan", "sound", "bronze"],
  orchestra: ["gamelan"],
  dance: ["performance", "choreography"],
  film: ["cinema", "documentary"],
  movie: ["cinema", "film"],
  temple: ["candi", "borobudur", "relief"],
  food: ["rempah", "spice", "culinary", "bumbu"],
  spices: ["rempah", "nutmeg", "spice"],
  forest: ["adat", "stewardship", "kalimantan"],
  indigenous: ["adat", "customary", "community"],
  museum: ["institution", "collection"],
  craft: ["kriya", "weaving", "rattan", "carving", "design"],
  maritime: ["phinisi", "boatbuilding", "sea", "shipyard"],
  pottery: ["ceramic", "clay", "craft"],
  batik: ["textile", "ikat", "cloth", "wax resist"],
  gong: ["gamelan", "bronze"],
  theatre: ["wayang", "performance", "dance"],
  cooking: ["rempah", "bumbu", "spice", "culinary"],
  translation: ["subtitle", "language", "translator"],
  study: ["research", "fellowship", "paper"],
  partnership: ["collaboration", "exchange", "programme"],
  exhibition: ["show", "gallery", "museum", "event"],
};

export interface SearchHit {
  record: SearchRecord;
  score: number;
}

export const searchAll = (query: string): SearchHit[] => {
  const q = norm(query);
  if (!q) return [];
  const expanded = new Set<string>([q, ...q.split(" ").filter((t) => t.length > 2)]);
  for (const [key, values] of Object.entries(SYNONYMS)) {
    if (q.includes(key)) values.forEach((v) => expanded.add(v));
  }
  const terms = [...expanded];

  return indexed
    .map(({ record, haystack, title }) => {
      let score = 0;
      for (const t of terms) {
        if (!t) continue;
        if (title === t) score += 12;
        else if (title.includes(t)) score += 7;
        if (haystack.includes(t)) score += t === q ? 4 : 2;
      }
      return { record, score };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title));
};

/** Fallback paths shown when a query returns nothing. */
export const searchSuggestions = () => {
  const themes: ThemeId[] = ["Craft & Design", "Music", "Film", "Indigenous Knowledge", "Heritage"];
  return {
    themes,
    topics: ["Wayang", "Sumba ikat", "Gamelan", "Phinisi shipbuilding", "Rempah kitchens"],
    records: searchRecords.filter((r) => ["st-1", "cf-gamelan", "pe-c1", "cl-jp-film"].includes(r.id)),
  };
};

export const popularSearches = [
  "shadow puppetry",
  "traditional Indonesian textile",
  "gamelan",
  "boatbuilding",
  "residency",
  "Japan",
];
