/**
 * Maps the existing published content into the CMS record model so the new
 * CMS starts from the real records, not invented ones.
 */
import { collaborations } from "@/data/collaborations";
import { events, forms, people, places, stories } from "@/data/content";
import { institutions } from "@/data/institutions";
import { team } from "@/data/team";
import { seedInquiries } from "@/lib/studio/seed";
import { heritageRecognition, heritageRegion, heritageType, isHeritage } from "@/lib/heritage";
import type { CmsPage, CmsRecord, CmsRequest, CmsSettings, CmsStatus, CmsTeamMember, RequestStatus } from "./types";

const html = (parts: (string | undefined)[]) => parts.filter(Boolean).map((p) => `<p>${p}</p>`).join("");
const heritageIds = new Set(forms.filter(isHeritage).map((f) => f.id));
const personIds = new Set(people.filter((p) => p.entity === "person").map((p) => p.id));
const communityIds = new Set(people.filter((p) => p.entity === "community").map((p) => p.id));
const EDITOR = "Editorial team";

function base(partial: Omit<CmsRecord, "createdAt" | "updatedAt" | "updatedBy" | "status"> & { status?: CmsStatus; updatedAt?: string }): CmsRecord {
  const updated = partial.updatedAt ?? "2026-09-01T09:00:00.000Z";
  return { status: "Published", createdAt: updated, updatedBy: EDITOR, ...partial, updatedAt: updated };
}

const articles = stories.map((s) => base({
  id: s.id, type: "article", title: s.title, slug: s.slug, summary: s.dek, body: html(s.body), image: s.image, imageAlt: s.imageAlt,
  ...(s.author ? { author: s.author } : {}),
  fields: {
    format: s.deliveryType ?? "Knowledge", source: s.contentSource ?? "Internal", sourceAttribution: s.sourceAttribution ?? "",
    sources: (s.sources ?? []).map((r) => [r.title, r.author, r.year].filter(Boolean).join(", ")).join("\n"),
  },
  relations: {
    topics: s.topics ?? [], heritage: s.formIds.filter((id) => heritageIds.has(id)),
    people: s.peopleIds.filter((id) => personIds.has(id)), communities: s.peopleIds.filter((id) => communityIds.has(id)), places: s.placeIds,
  },
  publishedAt: s.publishedAt, updatedAt: s.updatedAt ?? s.publishedAt, publicPath: `/stories/${s.slug}`,
}));

const heritage = forms.filter(isHeritage).map((f) => base({
  id: f.id, type: "heritage", title: f.name, slug: f.slug, summary: f.summary, body: html([f.whatItIs, f.whyMatters, f.today]), image: f.image,
  fields: { heritageType: heritageType(f), region: heritageRegion(f)?.region ?? "", recognition: heritageRecognition(f) ? (f.unesco ?? "UNESCO") : "" },
  relations: {
    topics: f.themes ?? [], people: people.filter((p) => p.entity === "person" && p.formIds.includes(f.id)).map((p) => p.id),
    communities: people.filter((p) => p.entity === "community" && p.formIds.includes(f.id)).map((p) => p.id),
    organisations: institutions.filter((i) => i.formIds.includes(f.id)).map((i) => i.id),
    places: [f.originPlaceId], events: events.filter((e) => e.formIds.includes(f.id)).map((e) => e.id),
    collaborations: collaborations.filter((c) => c.formIds.includes(f.id)).map((c) => c.id),
  },
  updatedAt: f.lastReviewed ? `${f.lastReviewed}T09:00:00.000Z` : undefined, publicPath: `/understand-indonesia/heritage/${f.slug}`,
} as never));

const directory = people.map((p) => base({
  id: p.id, type: p.entity === "community" ? "community" : "person", title: p.name, slug: p.slug, summary: p.role, body: html([p.bio, p.intro]), image: p.image,
  fields: { role: p.role, location: p.based },
  relations: { heritage: p.formIds.filter((id) => heritageIds.has(id)), topics: p.themes, organisations: p.institutionIds ?? [], places: p.placeId ? [p.placeId] : [] },
  publicPath: `/people/${p.slug}`,
}));

const organisations = institutions.map((i) => base({
  id: i.id, type: "organisation", title: i.name, slug: i.slug, summary: i.expertise.slice(0, 3).join(", "), body: html([i.profile, i.whyMatters]), image: i.image,
  fields: { orgType: i.type, location: `${i.city}, ${i.country}`, country: i.country, website: i.website },
  relations: { heritage: i.formIds.filter((id) => heritageIds.has(id)), topics: i.themes, people: i.peopleIds, events: i.eventIds ?? [], collaborations: collaborations.filter((c) => c.indonesianPartnerIds.includes(i.id)).map((c) => c.id) },
  updatedAt: `${i.lastReviewed}T09:00:00.000Z`, publicPath: `/institutions/${i.slug}`,
}));

const placeRecords = places.map((p) => base({
  id: p.id, type: "place", title: p.name, slug: p.slug, summary: p.summary, body: html([p.whyMatters]), image: p.image ?? "",
  fields: { placeType: p.type ?? "", location: [p.city, p.region].filter(Boolean).join(", "), country: p.country, lat: String(p.lat), lng: String(p.lng) },
  relations: { heritage: forms.filter((f) => f.originPlaceId === p.id && heritageIds.has(f.id)).map((f) => f.id), topics: p.themes ?? [] },
  publicPath: `/places/${p.slug}`,
}));

const eventRecords = events.map((e) => {
  const place = places.find((p) => p.id === e.placeId);
  return base({
    id: e.id, type: "event", title: e.title, slug: e.slug, summary: e.summary ?? e.sourceNote ?? "", body: html([e.context]), image: e.image ?? "",
    fields: {
      eventType: e.type ?? "", startDate: e.startDate.slice(0, 10), endDate: (e.endDate ?? "").slice(0, 10), venue: e.venue ?? place?.name ?? "",
      location: e.location?.city ?? place?.city ?? place?.region ?? "", country: e.location?.country ?? place?.country ?? "", organiser: e.organiser ?? "",
      lat: String(e.location?.lat ?? place?.lat ?? ""), lng: String(e.location?.lng ?? place?.lng ?? ""), missing: (e.needsVerification ?? []).join(", "),
    },
    relations: { heritage: e.formIds.filter((id) => heritageIds.has(id)), people: e.peopleIds ?? [], organisations: e.institutionIds ?? [], places: e.placeId ? [e.placeId] : [] },
    publicPath: `/events/${e.slug}`,
  });
});

const collaborationRecords = collaborations.map((c) => base({
  id: c.id, type: "collaboration", title: c.title, slug: c.slug, summary: c.intro, body: html(c.objectives), image: c.image,
  fields: {
    countries: c.countries.join(", "), partners: c.internationalPartners.map((p) => p.name).join(", "), period: c.years, progress: c.status,
    publicStory: c.publicStory ? "on" : "", background: c.documentation, activities: c.activities.join("\n"), outcomes: c.outcomes.join("\n"), visibility: "Public",
  },
  relations: { topics: c.themes, heritage: c.formIds.filter((id) => heritageIds.has(id)), organisations: c.indonesianPartnerIds, people: c.peopleIds, events: c.eventIds, articles: c.storyIds, places: c.placeIds },
  ...(c.publicStory ? { publicPath: `/collaborate/${c.slug}` } : {}),
}));

export const seedRecords = (): CmsRecord[] => [...articles, ...heritage, ...directory, ...organisations, ...placeRecords, ...eventRecords, ...collaborationRecords];

const REQUEST_STATUS: Record<string, RequestStatus> = {
  New: "New", "Under review": "Reviewing", "Need more information": "Need Information", "Ready to route": "Reviewing",
  Forwarded: "In Discussion", "In discussion": "In Discussion", Completed: "Closed", Closed: "Closed",
};

export const seedRequests = (): CmsRequest[] => seedInquiries.map((q) => ({
  id: q.id, name: q.requesterName, organisation: q.organisation, country: q.country, email: q.email, intent: q.category,
  subject: q.subject, message: q.summary, status: REQUEST_STATUS[q.status] ?? "New", receivedAt: q.receivedAt, note: "",
}));

export const seedPages = (): CmsPage[] => [
  { id: "about", title: "About Indonesia Vibes", status: "Published", updatedAt: "2026-09-01T09:00:00.000Z", updatedBy: EDITOR, fields: {},
    body: "<h2>Who we are</h2><p>Indonesia Vibes is a cultural diplomacy platform that helps people around the world understand Indonesian culture, experience it, and build collaborations with Indonesia.</p><h2>Mission</h2><p>To make Indonesian culture legible, trustworthy and connected for international audiences.</p><h2>Approach</h2><p>We work with Indonesian cultural institutions, communities and specialists, and credit every author by name.</p>" },
  { id: "editorial-standards", title: "Editorial Standards", status: "Published", updatedAt: "2026-09-01T09:00:00.000Z", updatedBy: EDITOR, fields: {},
    body: "<h2>Accuracy</h2><p>Factual claims are checked against named references. Where information cannot be confirmed, we leave it out.</p><h2>Attribution</h2><p>Every article names its author. External authors are credited clearly.</p><h2>Corrections</h2><p>Corrections are dated on the article.</p>" },
  { id: "contact", title: "Contact", status: "Published", updatedAt: "2026-09-01T09:00:00.000Z", updatedBy: EDITOR,
    fields: { email: "hello@indonesiavibes.org", address: "Jakarta, Indonesia", responseTime: "We usually reply within five working days." },
    body: "<p>For general questions, corrections or press, write to the editorial team. To propose a collaboration, use the Collaborate page.</p>" },
];

export const seedTeam = (): CmsTeamMember[] => team.map((m) => ({
  id: m.id, name: m.name, role: m.role, bio: m.bio, photo: m.photo ?? "", order: m.order, ...(m.personId ? { personId: m.personId } : {}),
}));

export const seedSettings = (): CmsSettings => ({
  siteName: "Indonesia Vibes", tagline: "Culture for the Future", contactEmail: "hello@indonesiavibes.org",
  seoTitle: "Indonesia Vibes — Understand, experience and collaborate with Indonesia",
  seoDescription: "A cultural diplomacy platform for understanding Indonesian culture and building collaborations with Indonesia.",
});
