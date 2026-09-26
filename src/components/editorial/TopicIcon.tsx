import {
  AudioLines, BookOpen, Building2, Clapperboard, Drama, Globe2, Hammer,
  Landmark, Languages, Layers3, Leaf, Palette, ScrollText, Shapes,
  Sparkles, Tags, UtensilsCrossed, Waves, type LucideIcon,
} from "lucide-react";
import type { TopicDefinition } from "@/lib/topics";

/** One restrained, controlled icon vocabulary for the Topic record and every public rendering. */
export const TOPIC_ICONS = {
  Tags, Landmark, ScrollText, AudioLines, Layers3, Clapperboard, Drama,
  BookOpen, Hammer, UtensilsCrossed, Building2, Waves, Shapes, Palette,
  Leaf, Sparkles, Languages, Globe2,
} satisfies Record<string, LucideIcon>;

export type TopicIconName = keyof typeof TOPIC_ICONS;

export function TopicIcon({ topic, size = 24, className }: { topic: Pick<TopicDefinition, "icon">; size?: number; className?: string }) {
  const Icon = topic.icon && topic.icon in TOPIC_ICONS ? TOPIC_ICONS[topic.icon as TopicIconName] : TOPIC_ICONS.Tags;
  return <Icon aria-hidden="true" focusable="false" size={size} strokeWidth={1.6} className={className} />;
}