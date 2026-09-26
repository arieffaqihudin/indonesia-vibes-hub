/**
 * Heritage — canonical cultural entities (Gamelan, Wayang, Phinisi…).
 *
 * One Heritage record per cultural entity, derived from the canonical
 * cultural-form records. Articles, people, events, places, collections and
 * collaborations all reference the same record by id; nothing is duplicated.
 * Recognition (e.g. UNESCO) is an attribute only, never a qualifier.
 */
import { collaborations } from "@/data/collaborations";
import { events, forms, people, places, stories } from "@/data/content";
import { institutions } from "@/data/institutions";
import { readCollections } from "@/lib/collections";
import { TOPICS } from "@/lib/topics";
import type { CulturalForm } from "@/types/content";

export const HERITAGE_TYPES = ["Performance tradition", "Craft tradition", "Knowledge tradition", "Culinary tradition", "Tangible heritage"] as const;
export type HeritageType = (typeof HERITAGE_TYPES)[number];

const TYPE_BY_DISCIPLINE: Record<string, HeritageType> = {
  Music: "Performance tradition",
  Performance: "Performance tradition",
  Dance: "Performance tradition",
  Textile: "Craft tradition",
  Craft: "Craft tradition",
  Architecture: "Tangible heritage",
  Culinary: "Culinary tradition",
};

export const heritageType = (form: CulturalForm): HeritageType => TYPE_BY_DISCIPLINE[form.discipline] ?? "Knowledge tradition";

export const heritageRecords = forms.filter((form) => form.pillar === "heritage");
export const isHeritage = (form: CulturalForm) => form.pillar === "heritage";
export const heritageBySlug = (slug: string) => heritageRecords.find((item) => item.slug === slug);

export const heritageRegion = (form: CulturalForm) => {
  const origin = places.find((place) => place.id === form.originPlaceId);
  return origin ? { place: origin, region: origin.region, label: origin.name } : null;
};

export const heritageRecognition = (form: CulturalForm) => (form.unesco?.startsWith("Inscribed") ? "UNESCO" : null);

export const heritageTopics = (form: CulturalForm) => TOPICS.filter((topic) => form.themes?.includes(topic.id));

export function heritageConnections(form: CulturalForm) {
  const linkedPeople = people.filter((person) => person.formIds.includes(form.id));
  const placeIds = new Set<string>([form.originPlaceId]);
  const linkedEvents = events.filter((event) => event.formIds.includes(form.id));
  linkedEvents.forEach((event) => event.placeId && placeIds.add(event.placeId));
  return {
    articles: stories.filter((story) => story.formIds.includes(form.id)),
    people: linkedPeople.filter((person) => person.entity === "person"),
    communities: linkedPeople.filter((person) => person.entity === "community"),
    organisations: institutions.filter((institution) => institution.formIds.includes(form.id)),
    places: places.filter((place) => placeIds.has(place.id)),
    events: linkedEvents,
    collections: readCollections().filter((collection) => collection.status === "Published" && collection.formIds.includes(form.id)),
    collaborations: collaborations.filter((collaboration) => collaboration.formIds.includes(form.id)),
  };
}

export const heritageForIds = (ids: string[]) => heritageRecords.filter((item) => ids.includes(item.id));
