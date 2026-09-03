/**
 * Canonical geography (§13–§14, §69–§71).
 *
 * Countries and places exist once. Everything else references them by id, so a
 * map, a country page and an institution profile agree by construction.
 */
import { places } from "@/data/content";
import { institutions } from "@/data/institutions";
import { collaborations } from "@/data/collaborations";
import { countryNames, entitiesOfType, getEntityBySource } from "./entities";
import type { GlobalRegion } from "@/types/content";

export interface CanonicalCountry {
  id: string;
  name: string;
  /** Broad world region used by the global agenda and world map. */
  region: GlobalRegion | "Indonesia";
  placeIds: string[];
  institutionIds: string[];
  collaborationIds: string[];
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z]+/g, "-");

const regionOf = (name: string): GlobalRegion | "Indonesia" => {
  if (name === "Indonesia") return "Indonesia";
  const fromCollab = collaborations.find((c) => c.countries.includes(name));
  return fromCollab?.regions[0] ?? "Asia";
};

export const countries: CanonicalCountry[] = countryNames.map((name) => ({
  id: slug(name),
  name,
  region: regionOf(name),
  placeIds: places.filter((p) => p.country === name).map((p) => p.id),
  institutionIds: institutions.filter((i) => i.country === name).map((i) => i.id),
  collaborationIds: collaborations.filter((c) => c.countries.includes(name)).map((c) => c.id),
}));

export const getCountry = (nameOrId: string) =>
  countries.find((c) => c.id === nameOrId || c.name === nameOrId);

/** Everything Indonesia Vibes holds for one country — the country network query (§70). */
export const countryNetwork = (nameOrId: string) => {
  const country = getCountry(nameOrId);
  if (!country) return undefined;
  return {
    country,
    places: country.placeIds.map((id) => getEntityBySource("place", id)).filter(Boolean),
    institutions: country.institutionIds.map((id) => getEntityBySource("institution", id)).filter(Boolean),
    collaborations: country.collaborationIds
      .map((id) => getEntityBySource("collaboration", id))
      .filter(Boolean),
  };
};

/** Places that carry no usable coordinates — a data health check. */
export const placesMissingGeography = () =>
  places.filter((p) => typeof p.lat !== "number" || typeof p.lng !== "number" || !p.country);

/** Countries the platform names but holds no records for. */
export const emptyCountries = () =>
  countries.filter(
    (c) => c.placeIds.length + c.institutionIds.length + c.collaborationIds.length === 0,
  );

export const countryCoverage = () =>
  countries
    .map((c) => ({
      ...c,
      records:
        c.placeIds.length +
        c.institutionIds.length +
        c.collaborationIds.length +
        entitiesOfType("collaboration").filter((e) => e.countries.includes(c.name)).length,
    }))
    .sort((a, b) => b.records - a.records);
