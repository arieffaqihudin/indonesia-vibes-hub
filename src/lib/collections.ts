import { useEffect, useState } from "react";
import { collections } from "@/data/content";

export type CollectionStatus = "Draft" | "Published" | "Archived";

export interface EditorialCollection {
  id: string;
  slug: string;
  title: string;
  introduction: string;
  longIntroduction: string;
  image: string;
  storyIds: string[];
  formIds: string[];
  status: CollectionStatus;
  featured: boolean;
  primaryTopic?: string;
  updatedAt: string;
}

export const COLLECTIONS: EditorialCollection[] = collections.map((item, index) => ({
  ...item,
  introduction: item.dek,
  longIntroduction: index === 0
    ? "Move through material, labour and memory in a deliberate sequence—from the time held inside a cloth to the knowledge carried by boats, stone and natural dye."
    : index === 1
      ? "A listening and viewing journey through a decade of Indonesian cinema, sound and performance, following new voices as they travel."
      : "A journey through attribution, cultural authority and the people deciding how knowledge is shared, credited and carried forward.",
  status: "Published",
  featured: index === 0,
  primaryTopic: index === 0 ? "Textiles" : index === 1 ? "Contemporary Culture" : "Indigenous & Local Knowledge",
  updatedAt: `2026-09-${18 - index}`,
}));

const STORAGE_KEY = "iv-collections-v1";
const EVENT = "iv-collections-change";

export function readCollections(): EditorialCollection[] {
  if (typeof window === "undefined") return COLLECTIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EditorialCollection[]) : COLLECTIONS;
  } catch { return COLLECTIONS; }
}

export function useCollections() {
  const [items, setState] = useState<EditorialCollection[]>(COLLECTIONS);
  useEffect(() => {
    const sync = () => setState(readCollections());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const setItems = (next: EditorialCollection[]) => {
    setState(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  };
  return [items, setItems] as const;
}

export const collectionBySlug = (slug: string) => readCollections().find((item) => item.slug === slug);