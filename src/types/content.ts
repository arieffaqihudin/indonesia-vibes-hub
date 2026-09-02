/**
 * The content graph. Entities reference each other by id so any page can
 * traverse: a story links to cultural forms, people, places and events;
 * a collection curates stories; an event happens at a place; an institution
 * holds people, collections and collaborations, and so on.
 */

export type Id = string;

export type PillarId = "heritage" | "contemporary" | "research";

/** Cross-cutting cultural themes used by every directory filter. */
export type ThemeId =
  | "Heritage"
  | "Performing Arts"
  | "Music"
  | "Film"
  | "Literature"
  | "Craft & Design"
  | "Culinary Culture"
  | "Architecture"
  | "Indigenous Knowledge"
  | "Contemporary Culture";

export const THEMES: ThemeId[] = [
  "Heritage",
  "Performing Arts",
  "Music",
  "Film",
  "Literature",
  "Craft & Design",
  "Culinary Culture",
  "Architecture",
  "Indigenous Knowledge",
  "Contemporary Culture",
];

export interface Pillar {
  id: PillarId;
  title: string;
  blurb: string;
  route: string;
}

export type PlaceType =
  | "Museum"
  | "Cultural Site"
  | "Archaeological Site"
  | "Gallery"
  | "Cultural Village"
  | "Performance Venue"
  | "Archive or Library"
  | "Cultural Landscape"
  | "City"
  | "Cultural Region";

export interface PlaceVisiting {
  opening: string;
  accessibility: string;
  guidance: string;
  website?: string;
  websiteLabel?: string;
  lastReviewed: string;
}

export interface Place {
  id: Id;
  slug: string;
  name: string;
  region: string;
  province?: string;
  city?: string;
  country: string;
  lat: number;
  lng: number;
  summary: string;
  kind: "origin" | "venue" | "institution";
  /** Editorial place typology used by the Places explorer filters. */
  type?: PlaceType;
  image?: string;
  themes?: ThemeId[];
  whyMatters?: string;
  significance?: string[];
  visiting?: PlaceVisiting;
  featured?: boolean;
}

export type PersonRole =
  | "Artist"
  | "Cultural Master"
  | "Researcher"
  | "Curator"
  | "Writer"
  | "Filmmaker"
  | "Cultural Practitioner"
  | "Tradition Bearer"
  | "Community";

export const PERSON_ROLES: PersonRole[] = [
  "Artist",
  "Cultural Master",
  "Researcher",
  "Curator",
  "Writer",
  "Filmmaker",
  "Cultural Practitioner",
  "Tradition Bearer",
  "Community",
];

export type Availability =
  | "Open to collaboration"
  | "Available for research"
  | "Available for events"
  | "By introduction only";

export const AVAILABILITY: Availability[] = [
  "Open to collaboration",
  "Available for research",
  "Available for events",
  "By introduction only",
];

export interface Work {
  title: string;
  year: string;
  note: string;
}

export interface Person {
  id: Id;
  slug: string;
  /** People and communities share one profile model with adapted wording. */
  entity: "person" | "community";
  name: string;
  localName?: string;
  role: string;
  roles: PersonRole[];
  based: string;
  bio: string;
  image: string;
  formIds: Id[];
  /** Extended profile */
  themes: ThemeId[];
  placeId?: Id;
  province?: string;
  city?: string;
  region?: string;
  intro?: string;
  story?: string[];
  whyMatters?: string;
  expertise?: string[];
  languages?: string[];
  institutionIds?: Id[];
  works?: Work[];
  availability?: Availability;
  emerging?: boolean;
  featured?: boolean;
  /** Community-specific */
  custodianship?: string;
  generations?: string;
  members?: string;
}

export interface CulturalForm {
  id: Id;
  slug: string;
  name: string;
  pillar: PillarId;
  discipline: string;
  summary: string;
  image: string;
  originPlaceId: Id;
  unesco?: string;
  themes?: ThemeId[];
  /** Alternate and local names, used by search. */
  aliases?: string[];
}

export interface Story {
  id: Id;
  slug: string;
  title: string;
  dek: string;
  kind: "Feature" | "Dispatch" | "Interview" | "Field note";
  readingMinutes: number;
  publishedAt: string;
  image: string;
  imageAlt: string;
  body: string[];
  formIds: Id[];
  peopleIds: Id[];
  placeIds: Id[];
  featured?: boolean;
}

export interface Collection {
  id: Id;
  slug: string;
  title: string;
  dek: string;
  image: string;
  storyIds: Id[];
  formIds: Id[];
}

export interface CulturalEvent {
  id: Id;
  slug: string;
  title: string;
  type: "Exhibition" | "Performance" | "Screening" | "Workshop" | "Residency";
  startDate: string;
  endDate: string;
  placeId: Id;
  image: string;
  summary: string;
  formIds: Id[];
  live?: boolean;
  institutionIds?: Id[];
  peopleIds?: Id[];
}

export interface Opportunity {
  id: Id;
  slug: string;
  title: string;
  type: "Grant" | "Residency" | "Open call" | "Fellowship";
  deadline: string;
  forWhom: string;
  summary: string;
  amount?: string;
  institutionIds?: Id[];
  themes?: ThemeId[];
}

export interface ResearchPaper {
  id: Id;
  title: string;
  authors: string;
  year: number;
  discipline: string;
  abstract: string;
  peopleIds?: Id[];
  institutionIds?: Id[];
}

export type InstitutionType =
  | "Museum"
  | "University"
  | "Research Centre"
  | "Cultural Centre"
  | "Archive"
  | "Gallery"
  | "Cultural Community"
  | "Festival Organisation"
  | "Government Cultural Institution"
  | "Diplomatic Institution"
  | "International Organisation";

export const INSTITUTION_TYPES: InstitutionType[] = [
  "Museum",
  "University",
  "Research Centre",
  "Cultural Centre",
  "Archive",
  "Gallery",
  "Cultural Community",
  "Festival Organisation",
  "Government Cultural Institution",
  "Diplomatic Institution",
  "International Organisation",
];

export interface Institution {
  id: Id;
  slug: string;
  name: string;
  type: InstitutionType;
  city: string;
  province: string;
  region: string;
  country: string;
  placeId?: Id;
  image: string;
  profile: string;
  whyMatters: string;
  expertise: string[];
  collections: string[];
  programmes: string[];
  facilities?: string[];
  peopleIds: Id[];
  themes: ThemeId[];
  formIds: Id[];
  paperIds?: Id[];
  eventIds?: Id[];
  opportunityIds?: Id[];
  partnerCountries: string[];
  collaborationInterests: string[];
  internationalExperience: boolean;
  website: string;
  lastReviewed: string;
  featured?: boolean;
}

export type CollaborationType =
  | "Research Partnership"
  | "Joint Exhibition"
  | "Artist Exchange"
  | "Residency Programme"
  | "Performance Collaboration"
  | "Cultural Mission"
  | "Museum Partnership"
  | "Academic Exchange"
  | "Film Collaboration"
  | "Bilateral Programme"
  | "Multilateral Programme";

export const COLLABORATION_TYPES: CollaborationType[] = [
  "Research Partnership",
  "Joint Exhibition",
  "Artist Exchange",
  "Residency Programme",
  "Performance Collaboration",
  "Cultural Mission",
  "Museum Partnership",
  "Academic Exchange",
  "Film Collaboration",
  "Bilateral Programme",
  "Multilateral Programme",
];

export type CollaborationStatus = "Planned" | "Active" | "Ongoing" | "Completed";

export type GlobalRegion = "Europe" | "Asia" | "Americas" | "Africa" | "Oceania";

export interface ExternalPartner {
  name: string;
  country: string;
  city?: string;
  type: InstitutionType;
}

export interface TimelineEntry {
  period: string;
  label: string;
  note: string;
}

export interface Collaboration {
  id: Id;
  slug: string;
  title: string;
  type: CollaborationType;
  status: CollaborationStatus;
  countries: string[];
  regions: GlobalRegion[];
  years: string;
  image: string;
  intro: string;
  objectives: string[];
  themes: ThemeId[];
  indonesianPartnerIds: Id[];
  internationalPartners: ExternalPartner[];
  timeline: TimelineEntry[];
  activities: string[];
  peopleIds: Id[];
  outputs: string[];
  outcomes: string[];
  eventIds: Id[];
  storyIds: Id[];
  formIds: Id[];
  placeIds: Id[];
  opportunityIds?: Id[];
  documentation: string;
  future: string[];
  featured?: boolean;
}

export interface WorldNode {
  id: Id;
  city: string;
  country: string;
  continent: GlobalRegion;
  lat: number;
  lng: number;
  programme: string;
  eventIds: Id[];
  status: "Active" | "Upcoming" | "Archive";
  collaborationIds?: Id[];
}

export interface NowItem {
  id: Id;
  label: string;
  headline: string;
  meta: string;
  href: string;
  kind: "live" | "opening" | "call" | "release";
}

/** Normalised, type-tagged record used by global search. */
export interface SearchRecord {
  id: Id;
  type:
    | "Story"
    | "Culture"
    | "People & Communities"
    | "Institutions"
    | "Places"
    | "Events"
    | "Opportunities"
    | "Collaborations";
  title: string;
  context: string;
  location?: string;
  meta?: string;
  image?: string;
  to: string;
  params?: Record<string, string>;
  themes: ThemeId[];
  countries: string[];
  date?: string;
  status?: string;
  keywords: string[];
}
