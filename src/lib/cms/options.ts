import { useMemo } from "react";

import { authors } from "@/data/team";
import { useCollections } from "@/lib/collections";
import { useTopics } from "@/lib/topics";
import { useCms } from "./store";
import type { CmsType, RelationKey } from "./types";

export type Option = { id: string; label: string; meta?: string };

const TYPE_FOR: Partial<Record<RelationKey, CmsType>> = {
  heritage: "heritage", people: "person", communities: "community", organisations: "organisation",
  places: "place", events: "event", collaborations: "collaboration", articles: "article",
};

/** Human-labelled choices for every connection field. */
export function useOptions() {
  const { records } = useCms();
  const [topics] = useTopics();
  const [collections] = useCollections();
  return useMemo(() => {
    const map = {} as Record<RelationKey, Option[]>;
    (Object.keys(TYPE_FOR) as RelationKey[]).forEach((key) => {
      map[key] = records.filter((r) => r.type === TYPE_FOR[key] && r.status !== "Archived").map((r) => ({ id: r.id, label: r.title || "Untitled", meta: r.fields["location"] || r.fields["country"] || undefined }));
    });
    map.topics = topics.map((t) => ({ id: t.id, label: t.id }));
    map.collections = collections.map((c) => ({ id: c.id, label: c.title }));
    return map;
  }, [records, topics, collections]);
}

export const AUTHOR_OPTIONS = authors.map((a) => ({ value: a.name, label: a.role ? `${a.name} — ${a.role}` : a.name }));

export const RELATION_LABEL: Record<RelationKey, string> = {
  topics: "Topics", heritage: "Related Heritage", people: "Related People", communities: "Related Communities",
  organisations: "Related Organisations", places: "Related Places", events: "Related Events", collections: "Related Collections",
  collaborations: "Related Collaborations", articles: "Related Articles",
};
