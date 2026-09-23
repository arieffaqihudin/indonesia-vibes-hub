import type { ThemeId } from "@/types/content";

export interface TopicDefinition {
  id: ThemeId;
  slug: string;
  intro: string;
}

export const TOPICS: TopicDefinition[] = [
  { id: "History & Civilization", slug: "history-and-civilization", intro: "Civilizations, kingdoms, trade routes and the long histories that shaped the archipelago." },
  { id: "Heritage & Traditions", slug: "heritage-and-traditions", intro: "Living practices carried through communities, ritual, memory and skilled work." },
  { id: "Music", slug: "music", intro: "Sound worlds, instruments, ensembles and the social life around music." },
  { id: "Performing Arts", slug: "performing-arts", intro: "Dance, theatre, puppetry and performance traditions in motion." },
  { id: "Film", slug: "film", intro: "Indonesian cinema, moving-image practice and the people shaping it." },
  { id: "Literature", slug: "literature", intro: "Writing, oral histories, translation and the many languages of the archipelago." },
  { id: "Visual Arts", slug: "visual-arts", intro: "Artists, practices and institutions shaping Indonesian visual culture." },
  { id: "Craft & Design", slug: "craft-and-design", intro: "Material intelligence, making, attribution and contemporary design." },
  { id: "Textiles", slug: "textiles", intro: "Batik, ikat, songket and the communities, meanings and futures held in cloth." },
  { id: "Culinary Culture", slug: "culinary-culture", intro: "Food knowledge, ingredients, trade and the social worlds of Indonesian kitchens." },
  { id: "Architecture", slug: "architecture", intro: "Built heritage, vernacular knowledge and contemporary spatial practice." },
  { id: "Maritime Culture", slug: "maritime-culture", intro: "Seafaring, shipbuilding, exchange and the ocean as Indonesia’s connective space." },
  { id: "Indigenous & Local Knowledge", slug: "indigenous-and-local-knowledge", intro: "Place-based knowledge, stewardship and community authority." },
  { id: "Contemporary Culture", slug: "contemporary-culture", intro: "New work, changing practice and cultural life in Indonesia today." },
  { id: "Religion & Cultural Expression", slug: "religion-and-cultural-expression", intro: "Belief, ritual and cultural expression across Indonesia’s communities." },
  { id: "Language", slug: "language", intro: "Language, translation and the words through which culture travels." },
  { id: "Cultural Exchange", slug: "cultural-exchange", intro: "How Indonesian culture travels, changes and creates lasting global relationships." },
];

export const topicBySlug = (slug: string) => TOPICS.find((topic) => topic.slug === slug);
export const topicById = (id: string) => TOPICS.find((topic) => topic.id === id);
