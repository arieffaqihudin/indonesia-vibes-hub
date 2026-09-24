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

export interface HomepageSection {
  id: "in-focus" | "understand" | "topics" | "collection" | "people" | "coming-up" | "around-world" | "collaborations" | "latest";
  label: string;
  visible: boolean;
  order: number;
  featuredId?: string;
}

export interface HomepageSettings { hero: HeroItem[]; sections: HomepageSection[] }

export const defaultHomepageSettings = (articleIds: string[]): HomepageSettings => ({
  hero: articleIds.slice(0, 3).map((articleId) => ({ articleId })),
  sections: [
    ["in-focus", "In Focus"], ["understand", "Understand Indonesia"], ["topics", "Topics"],
    ["collection", "Featured Collection"], ["people", "People & Organisations"], ["coming-up", "Coming Up"],
    ["around-world", "Around the World"], ["collaborations", "Collaborate with Indonesia"], ["latest", "Latest Content"],
  ].map(([id, label], order) => ({ id: id as HomepageSection["id"], label: label!, visible: true, order })),
});

export function readHomepageSettings(articleIds: string[]) {
  const fallback = defaultHomepageSettings(articleIds);
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(HOMEPAGE_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<HomepageSettings>;
    return { hero: (parsed.hero ?? fallback.hero).slice(0, 5), sections: parsed.sections ?? fallback.sections };
  } catch { return fallback; }
}

export function useHomepageSettings(articleIds: string[]) {
  const [settings, setSettingsState] = useState(() => defaultHomepageSettings(articleIds));
  useEffect(() => setSettingsState(readHomepageSettings(articleIds)), []);
  const setSettings = (next: HomepageSettings) => {
    setSettingsState(next);
    window.localStorage.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("iv-homepage-change"));
  };
  return [settings, setSettings] as const;
}