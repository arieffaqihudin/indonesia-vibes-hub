import { useEffect, useState } from "react";

export const HOMEPAGE_STORAGE_KEY = "iv-homepage-v2";
export const HERO_LIMIT_MESSAGE = "Homepage Hero can contain up to 5 articles. Remove an existing article before adding another.";

export interface HeroItem {
  articleId: string;
  headline?: string;
  summary?: string;
  image?: string;
  cta?: string;
  focalPoint?: "Center" | "Top" | "Bottom" | "Left" | "Right";
}

export type HomepageSectionId = "understand" | "latest" | "experience" | "around-world" | "collaborate";

export interface HomepageSection {
  id: HomepageSectionId;
  label: string;
  visible: boolean;
  order: number;
}

export interface HomepageSettings {
  hero: HeroItem[];
  sections: HomepageSection[];
  featuredTopicIds: string[];
  featuredCollectionId?: string;
  featuredProfileIds: string[];
  latestArticleLimit: number;
  excludeHeroFromLatest: boolean;
  featuredPlaceIds: string[];
  featuredWorldIds: string[];
  featuredCollaborationIds: string[];
  collaborateHeadline?: string;
  collaborateIntroduction?: string;
  collaborateCtaLabel?: string;
}

const finalSections: HomepageSection[] = [
  { id: "understand", label: "Understand Indonesia", visible: true, order: 0 },
  { id: "latest", label: "Latest Articles", visible: true, order: 1 },
  { id: "experience", label: "Experience Indonesia", visible: true, order: 2 },
  { id: "around-world", label: "Indonesia Around the World", visible: true, order: 3 },
  { id: "collaborate", label: "Collaborate with Indonesia", visible: true, order: 4 },
];

export const defaultHomepageSettings = (articleIds: string[]): HomepageSettings => ({
  hero: articleIds.slice(0, 3).map((articleId) => ({ articleId })),
  sections: finalSections,
  featuredTopicIds: ["Music", "Textiles", "Film", "History & Civilization", "Maritime Culture", "Culinary Culture", "Heritage & Traditions", "Contemporary Culture"],
  featuredCollectionId: "co-1",
  featuredProfileIds: ["pe-1", "pe-c1", "in-textile-museum", "in-arts-institute"],
  latestArticleLimit: 6,
  excludeHeroFromLatest: true,
  featuredPlaceIds: ["pl-borobudur", "pl-kaliuda", "pl-taman-budaya", "pl-banda"],
  featuredWorldIds: ["wn-1", "wn-2", "wn-3", "wn-4"],
  featuredCollaborationIds: ["cl-jp-film", "cl-sea-textile"],
  collaborateHeadline: "Collaborate with Indonesia",
  collaborateIntroduction: "Build cultural programmes, research, exhibitions and exchanges with Indonesian people and organisations.",
  collaborateCtaLabel: "Start a Collaboration",
});

function migrateSettings(parsed: Partial<HomepageSettings>, fallback: HomepageSettings): HomepageSettings {
  const previousSections = Array.isArray(parsed.sections) ? parsed.sections : [];
  const sections = finalSections.map((section) => {
    const saved = previousSections.find((item) => item.id === section.id);
    return saved ? { ...section, visible: saved.visible !== false, order: saved.order } : section;
  });
  return {
    ...fallback,
    ...parsed,
    hero: (parsed.hero ?? fallback.hero).slice(0, 5),
    sections,
    featuredTopicIds: parsed.featuredTopicIds ?? fallback.featuredTopicIds,
    featuredProfileIds: parsed.featuredProfileIds ?? fallback.featuredProfileIds,
    featuredPlaceIds: parsed.featuredPlaceIds ?? fallback.featuredPlaceIds,
    featuredWorldIds: parsed.featuredWorldIds ?? fallback.featuredWorldIds,
    featuredCollaborationIds: parsed.featuredCollaborationIds ?? fallback.featuredCollaborationIds,
    latestArticleLimit: Math.min(8, Math.max(4, parsed.latestArticleLimit ?? fallback.latestArticleLimit)),
    excludeHeroFromLatest: parsed.excludeHeroFromLatest ?? fallback.excludeHeroFromLatest,
  };
}

export function readHomepageSettings(articleIds: string[]) {
  const fallback = defaultHomepageSettings(articleIds);
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(HOMEPAGE_STORAGE_KEY);
    return raw ? migrateSettings(JSON.parse(raw) as Partial<HomepageSettings>, fallback) : fallback;
  } catch { return fallback; }
}

export function useHomepageSettings(articleIds: string[]) {
  const [settings, setSettingsState] = useState(() => defaultHomepageSettings(articleIds));
  useEffect(() => {
    const sync = () => setSettingsState(readHomepageSettings(articleIds));
    sync();
    window.addEventListener("iv-homepage-change", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("iv-homepage-change", sync); window.removeEventListener("storage", sync); };
  }, []);
  const setSettings = (next: HomepageSettings) => {
    setSettingsState(next);
    window.localStorage.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("iv-homepage-change"));
  };
  return [settings, setSettings] as const;
}