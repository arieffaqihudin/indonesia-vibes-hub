/**
 * Every "Request an introduction", "Connect with the institution" and
 * "Propose a collaboration" CTA routes through the same managed inquiry
 * flow on /contact. Personal contact details are never published — the
 * platform facilitates the introduction.
 */

export type InquiryTopic =
  | "General question"
  | "Editorial question"
  | "Partnership"
  | "Media"
  | "Contribution"
  | "Technical issue"
  | "Correction"
  | "Introduction request"
  | "Institutional connection"
  | "Collaboration proposal";

export const INQUIRY_TOPICS: InquiryTopic[] = [
  "General question",
  "Editorial question",
  "Partnership",
  "Media",
  "Contribution",
  "Technical issue",
  "Correction",
  "Introduction request",
  "Institutional connection",
  "Collaboration proposal",
];

/** Topics that belong in the structured partnership conversation. */
export const STRUCTURED_TOPICS: InquiryTopic[] = [
  "Partnership",
  "Introduction request",
  "Institutional connection",
  "Collaboration proposal",
];

export interface InquirySearch {
  topic?: InquiryTopic;
  subject?: string;
  ref?: string;
}

export const inquiryLink = (search: InquirySearch) => ({
  to: "/contact" as const,
  search,
  hash: "inquiry",
});

export const isInquiryTopic = (value: unknown): value is InquiryTopic =>
  typeof value === "string" && (INQUIRY_TOPICS as string[]).includes(value);
