/**
 * Our Team and Authors — deliberately separate from People & Organisations.
 *
 * CULTURAL RELEVANCE ≠ AUTHORSHIP ≠ TEAM MEMBERSHIP ≠ ARTICLE RELATIONSHIP.
 * - Team member: works on Indonesia Vibes itself (MEMBER_OF_TEAM).
 * - Author: may be credited as Written By on an article (WRITTEN_BY).
 * - A cultural profile (People & Organisations) is linked only via an explicit
 *   `personId`; it is never inferred from a name match or from relevance.
 */
import person1 from "@/assets/person-1.jpg";
import person3 from "@/assets/person-3.jpg";
import person5 from "@/assets/person-5.jpg";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  order: number;
  /** Optional explicit link to a People & Organisations profile. */
  personId?: string;
  links?: { label: string; href: string }[];
}

export const team: TeamMember[] = [
  { id: "tm-sari", name: "Sari Prameswari", role: "Managing Editor", bio: "Responsible for editorial development and publication.", photo: person1, order: 1 },
  { id: "tm-nadia", name: "Nadia Suryani", role: "Contributing Curator", bio: "Shapes curated collections and screen-culture coverage.", photo: person3, order: 2, personId: "pe-3" },
  { id: "tm-arif", name: "Arif Santoso", role: "Partnerships Lead", bio: "Supports cultural collaborations with institutions abroad.", photo: person5, order: 3 },
];

export interface Author {
  id: string;
  /** Exact byline name used on articles. */
  name: string;
  role?: string;
  teamMemberId?: string;
  /** Explicit link to a cultural profile, only if one genuinely exists. */
  personId?: string;
}

/** Authorised author identities — the only names the CMS offers as Author. */
export const authors: Author[] = [
  { id: "au-sari", name: "Sari Prameswari", role: "Managing Editor", teamMemberId: "tm-sari" },
  { id: "au-nadia", name: "Nadia Suryani", role: "Curator", teamMemberId: "tm-nadia", personId: "pe-3" },
  { id: "au-daniel", name: "Daniel Prayoga", role: "Contributing writer" },
  { id: "au-andi", name: "Andi Ridwan", role: "Contributing writer" },
  { id: "au-bella", name: "Bella Lestari", role: "Contributing writer" },
  { id: "au-hendra", name: "Hendra Wibowo", role: "Contributing writer" },
  { id: "au-editorial", name: "Editorial team", role: "Indonesia Vibes" },
];

export const sortedTeam = () => [...team].sort((a, b) => a.order - b.order);
export const getAuthorByName = (name?: string) => (name ? authors.find((a) => a.name === name) : undefined);
