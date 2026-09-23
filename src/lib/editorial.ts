import type { Story } from "@/types/content";

export const DELIVERY_TYPES = ["Knowledge", "Semantic", "Pragmatic"] as const;
export type DeliveryType = (typeof DELIVERY_TYPES)[number];

export const PUBLIC_FORMATS = ["Essentials", "Deep Dive", "Perspectives"] as const;
export type PublicFormat = (typeof PUBLIC_FORMATS)[number];

export const CONTENT_SOURCES = ["Internal", "By Curation"] as const;
export type ContentSource = (typeof CONTENT_SOURCES)[number];

export const DELIVERY_PUBLIC_LABEL: Record<DeliveryType, PublicFormat> = {
  Knowledge: "Essentials",
  Semantic: "Deep Dive",
  Pragmatic: "Perspectives",
};

export const DELIVERY_HELP: Record<DeliveryType, string> = {
  Knowledge: "Use this when the goal is to introduce a topic or provide basic information.",
  Semantic: "Use this when the reader needs deeper context, meaning, or explanation.",
  Pragmatic: "Use this when the content develops an argument, interpretation, or strategic cultural perspective.",
};

export const SOURCE_HELP: Record<ContentSource, string> = {
  Internal: "Produced or commissioned directly by Indonesia Vibes.",
  "By Curation": "Selected and editorially adapted from external material.",
};

export const publicFormat = (story: Pick<Story, "deliveryType">): PublicFormat =>
  DELIVERY_PUBLIC_LABEL[story.deliveryType ?? "Semantic"];

export const publicFormatFromInternal = (value?: string): PublicFormat =>
  DELIVERY_PUBLIC_LABEL[(DELIVERY_TYPES.includes(value as DeliveryType) ? value : "Semantic") as DeliveryType];

export const isEditorialKind = (kind: string) => kind === "story" || kind === "culture";
