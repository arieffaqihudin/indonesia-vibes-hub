import { useEffect, useState } from "react";
import type { ThemeId } from "@/types/content";
import type { TopicIconName } from "@/components/editorial/TopicIcon";

export const TOPIC_CATEGORIES = [
  "Arts & Expression",
  "Heritage & Traditions",
  "History & Society",
  "Food & Living Culture",
  "Maritime & Environment",
  "Contemporary Culture",
] as const;
export type TopicCategory = (typeof TOPIC_CATEGORIES)[number];
export type TopicStatus = "Draft" | "Published" | "Archived";

export interface TopicDefinition {
  id: ThemeId;
  slug: string;
  intro: string;
  category: TopicCategory;
  aliases: string[];
  status: TopicStatus;
  featured?: boolean;
  image?: string;
  icon?: TopicIconName;
  updatedAt: string;
}

const DEFAULT_ICONS: Partial<Record<ThemeId, TopicIconName>> = {
  "History & Civilization": "Landmark", "Heritage & Traditions": "ScrollText",
  Heritage: "ScrollText", Music: "AudioLines", "Performing Arts": "Drama",
  Film: "Clapperboard", Literature: "BookOpen", "Visual Arts": "Palette",
  "Craft & Design": "Hammer", Textiles: "Layers3", "Culinary Culture": "UtensilsCrossed",
  Architecture: "Building2", "Maritime Culture": "Waves",
  "Indigenous & Local Knowledge": "Leaf", "Indigenous Knowledge": "Leaf",
  "Contemporary Culture": "Shapes", "Religion & Cultural Expression": "Sparkles",
  Language: "Languages", "Cultural Exchange": "Globe2",
};

const withDefaultIcon = (topic: TopicDefinition): TopicDefinition => ({
  ...topic, icon: topic.icon ?? DEFAULT_ICONS[topic.id] ?? "Tags",
});

const SEED_TOPICS: TopicDefinition[] = [
  { id: "History & Civilization", slug: "history-and-civilization", intro: "Kingdoms, archaeology, trade networks and the long histories that shaped the archipelago.", category: "History & Society", aliases: ["history", "kingdoms", "archaeology", "civilisation"], status: "Published", updatedAt: "2026-09-18" },
  { id: "Heritage & Traditions", slug: "heritage-and-traditions", intro: "Living practices carried through communities, ritual, memory and skilled work.", category: "Heritage & Traditions", aliases: ["heritage", "tradition", "ritual"], status: "Published", featured: true, updatedAt: "2026-09-16" },
  { id: "Music", slug: "music", intro: "Traditional and contemporary music, instruments, performance and sound cultures.", category: "Arts & Expression", aliases: ["gamelan", "sound", "instruments"], status: "Published", updatedAt: "2026-09-20" },
  { id: "Performing Arts", slug: "performing-arts", intro: "Dance, theatre, puppetry and performance traditions in motion.", category: "Arts & Expression", aliases: ["dance", "theatre", "wayang"], status: "Published", updatedAt: "2026-09-15" },
  { id: "Film", slug: "film", intro: "Indonesian cinema, moving-image practice and the people shaping it.", category: "Arts & Expression", aliases: ["cinema", "movies", "screen"], status: "Published", updatedAt: "2026-09-19" },
  { id: "Literature", slug: "literature", intro: "Writing, oral histories, translation and the many languages of the archipelago.", category: "Arts & Expression", aliases: ["writing", "poetry", "books", "oral history"], status: "Published", updatedAt: "2026-09-11" },
  { id: "Visual Arts", slug: "visual-arts", intro: "Artists, practices and institutions shaping Indonesian visual culture.", category: "Arts & Expression", aliases: ["art", "painting", "sculpture"], status: "Published", updatedAt: "2026-09-10" },
  { id: "Craft & Design", slug: "craft-and-design", intro: "Material intelligence, making, attribution and contemporary design.", category: "Arts & Expression", aliases: ["craft", "making", "design"], status: "Published", updatedAt: "2026-09-17" },
  { id: "Textiles", slug: "textiles", intro: "Batik, ikat, songket, weaving traditions and the knowledge carried in cloth.", category: "Heritage & Traditions", aliases: ["batik", "ikat", "songket", "weaving", "cloth"], status: "Published", featured: true, updatedAt: "2026-09-22" },
  { id: "Culinary Culture", slug: "culinary-culture", intro: "Food knowledge, ingredients, trade and the social worlds of Indonesian kitchens.", category: "Food & Living Culture", aliases: ["food", "cooking", "spice", "kitchen"], status: "Published", updatedAt: "2026-09-14" },
  { id: "Architecture", slug: "architecture", intro: "Built heritage, vernacular knowledge and contemporary spatial practice.", category: "Heritage & Traditions", aliases: ["buildings", "built heritage", "vernacular"], status: "Published", updatedAt: "2026-09-12" },
  { id: "Maritime Culture", slug: "maritime-culture", intro: "Seafaring, shipbuilding, exchange and the ocean as Indonesia’s connective space.", category: "Maritime & Environment", aliases: ["sea", "ocean", "boats", "phinisi"], status: "Published", featured: true, updatedAt: "2026-09-21" },
  { id: "Indigenous & Local Knowledge", slug: "indigenous-and-local-knowledge", intro: "Place-based knowledge, stewardship and community authority.", category: "Maritime & Environment", aliases: ["indigenous knowledge", "local knowledge", "stewardship"], status: "Published", updatedAt: "2026-09-08" },
  { id: "Contemporary Culture", slug: "contemporary-culture", intro: "New work, changing practice and cultural life in Indonesia today.", category: "Contemporary Culture", aliases: ["today", "modern", "new work"], status: "Published", updatedAt: "2026-09-23" },
  { id: "Religion & Cultural Expression", slug: "religion-and-cultural-expression", intro: "Belief, ritual and cultural expression across Indonesia’s communities.", category: "History & Society", aliases: ["religion", "belief", "ritual"], status: "Published", updatedAt: "2026-09-09" },
  { id: "Language", slug: "language", intro: "Language, translation and the words through which culture travels.", category: "History & Society", aliases: ["translation", "words", "linguistics"], status: "Published", updatedAt: "2026-09-07" },
  { id: "Cultural Exchange", slug: "cultural-exchange", intro: "How Indonesian culture travels, changes and creates lasting global relationships.", category: "Contemporary Culture", aliases: ["diplomacy", "exchange", "international"], status: "Published", updatedAt: "2026-09-13" },
];

export const TOPICS: TopicDefinition[] = SEED_TOPICS.map(withDefaultIcon);

const TOPIC_STORAGE_KEY = "iv-topics-v1";
const TOPIC_EVENT = "iv-topics-change";

export function readTopics(): TopicDefinition[] {
  if (typeof window === "undefined") return TOPICS;
  try {
    const raw = window.localStorage.getItem(TOPIC_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TopicDefinition[]).map(withDefaultIcon) : TOPICS;
  } catch { return TOPICS; }
}

export function useTopics() {
  const [topics, setState] = useState<TopicDefinition[]>(TOPICS);
  useEffect(() => {
    const sync = () => setState(readTopics());
    sync();
    window.addEventListener(TOPIC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(TOPIC_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const setTopics = (next: TopicDefinition[]) => {
    setState(next);
    window.localStorage.setItem(TOPIC_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(TOPIC_EVENT));
  };
  return [topics, setTopics] as const;
}

export const topicBySlug = (slug: string) => readTopics().find((topic) => topic.slug === slug);
export const topicById = (id: string) => readTopics().find((topic) => topic.id === id);
