/**
 * The content graph. Entities reference each other by id so any page can
 * traverse: a story links to cultural forms, people, places and events;
 * a collection curates stories; an event happens at a place, etc.
 */

export type Id = string;

export type PillarId = "heritage" | "contemporary" | "research";

export interface Pillar {
  id: PillarId;
  title: string;
  blurb: string;
  route: string;
}

export interface Place {
  id: Id;
  slug: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  summary: string;
  kind: "origin" | "venue" | "institution";
}

export interface Person {
  id: Id;
  slug: string;
  name: string;
  role: string;
  based: string;
  bio: string;
  image: string;
  formIds: Id[];
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
}

export interface ResearchPaper {
  id: Id;
  title: string;
  authors: string;
  year: number;
  discipline: string;
  abstract: string;
}

export interface WorldNode {
  id: Id;
  city: string;
  country: string;
  continent: "Europe" | "Asia" | "Americas" | "Africa" | "Oceania";
  lat: number;
  lng: number;
  programme: string;
  eventIds: Id[];
  status: "Active" | "Upcoming" | "Archive";
}

export interface NowItem {
  id: Id;
  label: string;
  headline: string;
  meta: string;
  href: string;
  kind: "live" | "opening" | "call" | "release";
}