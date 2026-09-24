/**
 * Centralised status enums for the canonical data layer.
 *
 * Rule (One Data, §104): a status string is declared once, here, and imported
 * everywhere. Components must never invent their own status literals.
 */

export const PUBLICATION_STATUSES = ["draft", "in_review", "published", "archived"] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export const VERIFICATION_STATUSES = [
  "unverified",
  "in_progress",
  "verified",
  "disputed",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const EVENT_STATUSES = ["upcoming", "live", "past"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const COLLABORATION_LIFECYCLE = ["Planned", "Active", "Ongoing", "Completed"] as const;
export type CollaborationLifecycle = (typeof COLLABORATION_LIFECYCLE)[number];

export const MEDIA_RIGHTS_STATUSES = [
  "cleared",
  "pending",
  "restricted",
  "unknown",
  "not_usable",
] as const;
export type MediaRightsStatus = (typeof MEDIA_RIGHTS_STATUSES)[number];

/** Who may see a record or a field. */
export const VISIBILITIES = ["public", "internal", "restricted"] as const;
export type Visibility = (typeof VISIBILITIES)[number];

/** Where a value came from — provenance is data (§32, §43). */
export const PROVENANCE_SOURCES = [
  "editorial",
  "contributor",
  "partner",
  "import",
  "derived",
] as const;
export type ProvenanceSource = (typeof PROVENANCE_SOURCES)[number];

/** Governance roles accountable for a canonical record (§109). */
export const STEWARD_ROLES = [
  "Data Steward",
  "Editorial Owner",
  "Subject Reviewer",
  "Media Rights Reviewer",
  "Partnership Owner",
  "System Administrator",
] as const;
export type StewardRole = (typeof STEWARD_ROLES)[number];
