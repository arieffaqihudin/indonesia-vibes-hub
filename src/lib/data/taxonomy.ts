/**
 * Shared taxonomy and synonyms (§39–§40).
 *
 * One vocabulary is used by editorial classification, directory filters and
 * search ranking. Terms are never re-declared per surface.
 */
import { THEMES, type ThemeId } from "@/types/content";
import { entities, entitiesOfType } from "./entities";

export interface TaxonomyTerm {
  id: ThemeId;
  label: ThemeId;
  /** Words a reader might use that mean the same thing. */
  synonyms: string[];
  /** How many canonical records carry this term. */
  usageCount: number;
}

const SYNONYMS: Record<ThemeId, string[]> = {
  Heritage: ["tradition", "warisan", "cultural heritage", "intangible heritage"],
  "Performing Arts": ["dance", "theatre", "wayang", "performance", "puppetry"],
  Music: ["gamelan", "ensemble", "musik", "instrument"],
  Film: ["cinema", "screening", "documentary", "sinema"],
  Literature: ["writing", "poetry", "sastra", "storytelling"],
  "Craft & Design": ["batik", "ikat", "songket", "textile", "weaving", "kriya"],
  "Culinary Culture": ["food", "cuisine", "kuliner", "spice"],
  Architecture: ["building", "vernacular", "arsitektur", "structure"],
  "Indigenous Knowledge": ["adat", "customary", "traditional knowledge", "navigation"],
  "Contemporary Culture": ["modern", "contemporary art", "new media", "kontemporer"],
};

export const taxonomy: TaxonomyTerm[] = THEMES.map((t) => ({
  id: t,
  label: t,
  synonyms: SYNONYMS[t],
  usageCount: entities.filter((e) => e.themes.includes(t)).length,
}));

export const getTerm = (id: ThemeId) => taxonomy.find((t) => t.id === id);

/** Resolve a free-text query to taxonomy terms via label or synonym. */
export const matchTerms = (query: string): TaxonomyTerm[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return taxonomy.filter(
    (t) => t.label.toLowerCase().includes(q) || t.synonyms.some((s) => s.includes(q) || q.includes(s)),
  );
};

/** Terms that no canonical record uses — candidates for retirement. */
export const unusedTerms = () => taxonomy.filter((t) => t.usageCount === 0);

/** Published cultural subjects grouped by term, for coverage reporting. */
export const subjectsByTerm = (term: ThemeId) =>
  entitiesOfType("cultural_subject").filter((e) => e.themes.includes(term));
