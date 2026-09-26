/**
 * The CMS content model. One flat record shape for every managed item so the
 * editor, lists, search and dashboard share one pattern. Relationships are
 * plain id lists; the UI never exposes them as a "graph".
 */

export type CmsType =
  | "article"
  | "heritage"
  | "person"
  | "community"
  | "organisation"
  | "event"
  | "place"
  | "collaboration";

export const CMS_STATUSES = ["Draft", "In Review", "Scheduled", "Published", "Archived"] as const;
export type CmsStatus = (typeof CMS_STATUSES)[number];

export type RelationKey =
  | "topics"
  | "heritage"
  | "people"
  | "communities"
  | "organisations"
  | "places"
  | "events"
  | "collections"
  | "collaborations"
  | "articles";

export interface CmsRecord {
  id: string;
  type: CmsType;
  title: string;
  slug: string;
  status: CmsStatus;
  /** Standfirst / short description. */
  summary: string;
  /** Rich HTML body. */
  body: string;
  image: string;
  imageAlt?: string;
  /** Type-specific simple values (format, region, dates, website…). */
  fields: Record<string, string>;
  relations: Partial<Record<RelationKey, string[]>>;
  /** Article author (who wrote it). Never inferred from related people. */
  author?: string | undefined;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  publishedAt?: string;
  scheduledFor?: string;
  /** Existing public page for this record, when there is one. */
  publicPath?: string;
}

export const REQUEST_STATUSES = ["New", "Reviewing", "Need Information", "In Discussion", "Closed"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface CmsRequest {
  id: string;
  name: string;
  organisation: string;
  country: string;
  email: string;
  intent: string;
  subject: string;
  message: string;
  status: RequestStatus;
  receivedAt: string;
  note: string;
}

export type PageId = "about" | "editorial-standards" | "contact";

export interface CmsPage {
  id: PageId;
  title: string;
  body: string;
  status: CmsStatus;
  fields: Record<string, string>;
  updatedAt: string;
  updatedBy: string;
}

export interface CmsTeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  order: number;
  /** Optional link to an existing People & Organisations profile. */
  personId?: string | undefined;
}

export interface CmsSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  seoTitle: string;
  seoDescription: string;
  /** No analytics provider is connected until a real integration exists. */
  analyticsProvider?: string;
  analyticsProperty?: string;
}

export const TYPE_LABEL: Record<CmsType, { one: string; many: string }> = {
  article: { one: "Article", many: "Articles" },
  heritage: { one: "Heritage", many: "Heritage" },
  person: { one: "Person", many: "People" },
  community: { one: "Community", many: "Communities" },
  organisation: { one: "Organisation", many: "Institutions & Organisations" },
  event: { one: "Event", many: "Events" },
  place: { one: "Place", many: "Places" },
  collaboration: { one: "Collaboration", many: "Collaborations" },
};

/** Where each record type is edited. */
export function editPath(type: CmsType): string {
  switch (type) {
    case "article": return "/admin/articles/$id";
    case "heritage": return "/admin/heritage/$id";
    case "person":
    case "community":
    case "organisation": return "/admin/people-organisations/$id";
    case "event":
    case "place": return "/admin/experience/$id";
    case "collaboration": return "/admin/collaborations/$id";
  }
}

export const FORMAT_OPTIONS = [
  { value: "Knowledge", label: "Knowledge", hint: "Public label: Essentials" },
  { value: "Semantic", label: "Semantic", hint: "Public label: Deep Dive" },
  { value: "Pragmatic", label: "Pragmatic", hint: "Public label: Perspectives" },
];
