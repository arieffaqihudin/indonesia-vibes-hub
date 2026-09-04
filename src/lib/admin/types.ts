/**
 * Internal Editorial & Partnership Dashboard model.
 *
 * The dashboard reads the same cultural knowledge network as the public
 * platform and the contributor workspace: content items carry relationship
 * ids into `src/data/*`, inquiries point at content, partners point at
 * institutions, and collaborations record where they came from.
 */

/* ---------------- roles ---------------- */

export type AdminRole =
  | "Super Admin"
  | "Managing Editor"
  | "Content Editor"
  | "Researcher / Fact Checker"
  | "Subject Reviewer"
  | "English Editor"
  | "Multimedia Editor"
  | "Partnership Officer"
  | "Viewer / Leadership";

export const ADMIN_ROLES: AdminRole[] = [
  "Super Admin",
  "Managing Editor",
  "Content Editor",
  "Researcher / Fact Checker",
  "Subject Reviewer",
  "English Editor",
  "Multimedia Editor",
  "Partnership Officer",
  "Viewer / Leadership",
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  focus: string;
  active: boolean;
}

/** Broad capability groups — deliberately coarse for the prototype. */
export type Capability =
  | "editorial"
  | "assign"
  | "approve"
  | "publish"
  | "verify"
  | "subject"
  | "language"
  | "media"
  | "partnership"
  | "configure";

export const ROLE_CAPABILITIES: Record<AdminRole, Capability[]> = {
  "Super Admin": [
    "editorial",
    "assign",
    "approve",
    "publish",
    "verify",
    "subject",
    "language",
    "media",
    "partnership",
    "configure",
  ],
  "Managing Editor": ["editorial", "assign", "approve", "publish", "media", "partnership"],
  "Content Editor": ["editorial", "assign", "media"],
  "Researcher / Fact Checker": ["verify"],
  "Subject Reviewer": ["subject"],
  "English Editor": ["language"],
  "Multimedia Editor": ["media"],
  "Partnership Officer": ["partnership"],
  "Viewer / Leadership": [],
};

export const can = (role: AdminRole, capability: Capability) =>
  ROLE_CAPABILITIES[role].includes(capability);

/** Only these roles may see requester contact details and private notes. */
export const canSeePersonalData = (role: AdminRole) =>
  role === "Super Admin" || role === "Partnership Officer" || role === "Managing Editor";

/* ---------------- editorial workflow ---------------- */

export type ContentStatus =
  | "draft"
  | "submitted"
  | "initial_review"
  | "editorial_review"
  | "revision_requested"
  | "verification"
  | "subject_review"
  | "english_editing"
  | "media_rights"
  | "ready_for_approval"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export interface StatusMeta {
  label: string;
  /** Short internal description of what this stage means operationally. */
  meaning: string;
  group: "incoming" | "working" | "waiting" | "cleared" | "live" | "closed";
}

export const CONTENT_STATUS: Record<ContentStatus, StatusMeta> = {
  draft: { label: "Draft", meaning: "Started internally, not yet in a queue.", group: "incoming" },
  submitted: {
    label: "Submitted",
    meaning: "Arrived from the Contributor Workspace, awaiting screening.",
    group: "incoming",
  },
  initial_review: {
    label: "Initial review",
    meaning: "Being screened for scope, duplication and completeness.",
    group: "working",
  },
  editorial_review: {
    label: "Editorial review",
    meaning: "An editor is working through structure, accuracy and framing.",
    group: "working",
  },
  revision_requested: {
    label: "Revision requested",
    meaning: "Waiting on the contributor to respond to feedback.",
    group: "waiting",
  },
  verification: {
    label: "Verification",
    meaning: "With a researcher — claims and sources are being checked.",
    group: "waiting",
  },
  subject_review: {
    label: "Subject review",
    meaning: "With a cultural reviewer for substance and sensitivity.",
    group: "waiting",
  },
  english_editing: {
    label: "English editing",
    meaning: "With the English editor for international readability.",
    group: "waiting",
  },
  media_rights: {
    label: "Media & rights review",
    meaning: "With the multimedia editor for permissions and alt text.",
    group: "waiting",
  },
  ready_for_approval: {
    label: "Ready for approval",
    meaning: "All required stages cleared. Awaiting a managing editor.",
    group: "cleared",
  },
  approved: { label: "Approved", meaning: "Cleared for publication or scheduling.", group: "cleared" },
  scheduled: { label: "Scheduled", meaning: "Queued to publish at a set date and time.", group: "cleared" },
  published: { label: "Published", meaning: "Live on the public platform.", group: "live" },
  archived: { label: "Archived", meaning: "Withdrawn from the public platform, kept on record.", group: "closed" },
};

export type ContentKind =
  | "story"
  | "culture"
  | "person"
  | "community"
  | "institution"
  | "place"
  | "event"
  | "opportunity"
  | "collaboration"
  | "collection";

export const CONTENT_KINDS: { kind: ContentKind; label: string; plural: string }[] = [
  { kind: "story", label: "Story", plural: "Stories" },
  { kind: "culture", label: "Cultural subject", plural: "Cultural subjects" },
  { kind: "person", label: "Person", plural: "People" },
  { kind: "community", label: "Community", plural: "Communities" },
  { kind: "institution", label: "Institution", plural: "Institutions" },
  { kind: "place", label: "Place", plural: "Places" },
  { kind: "event", label: "Event", plural: "Events" },
  { kind: "opportunity", label: "Opportunity", plural: "Opportunities" },
  { kind: "collaboration", label: "Collaboration", plural: "Collaborations" },
  { kind: "collection", label: "Collection", plural: "Collections" },
];

export const kindLabel = (kind: ContentKind) =>
  CONTENT_KINDS.find((k) => k.kind === kind)?.label ?? kind;

/**
 * Conditional workflow. A simple event skips subject review and English
 * editing; a long-form cultural subject passes through everything.
 */
export const REQUIRED_STAGES: Record<ContentKind, ContentStatus[]> = {
  story: ["editorial_review", "verification", "english_editing", "media_rights", "ready_for_approval"],
  culture: [
    "editorial_review",
    "verification",
    "subject_review",
    "english_editing",
    "media_rights",
    "ready_for_approval",
  ],
  person: ["editorial_review", "verification", "subject_review", "media_rights", "ready_for_approval"],
  community: [
    "editorial_review",
    "verification",
    "subject_review",
    "media_rights",
    "ready_for_approval",
  ],
  institution: ["initial_review", "verification", "ready_for_approval"],
  place: ["editorial_review", "verification", "media_rights", "ready_for_approval"],
  event: ["initial_review", "verification", "ready_for_approval"],
  opportunity: ["initial_review", "verification", "ready_for_approval"],
  collaboration: ["editorial_review", "verification", "media_rights", "ready_for_approval"],
  collection: ["editorial_review", "media_rights", "ready_for_approval"],
};

export interface WorkflowAction {
  id: string;
  label: string;
  to: ContentStatus;
  capability: Capability;
  /** Destructive or externally visible actions ask for confirmation. */
  confirm?: string;
  tone?: "primary" | "quiet" | "danger";
}

const ACTION_LIBRARY: Record<string, WorkflowAction> = {
  initial_review: { id: "initial_review", label: "Accept for review", to: "initial_review", capability: "editorial" },
  editorial_review: {
    id: "editorial_review",
    label: "Start editorial review",
    to: "editorial_review",
    capability: "editorial",
  },
  revision: {
    id: "revision",
    label: "Request revision",
    to: "revision_requested",
    capability: "editorial",
    confirm: "The contributor will see the feedback marked as visible to them. Send this back for revision?",
  },
  verification: { id: "verification", label: "Send to verification", to: "verification", capability: "editorial" },
  subject_review: {
    id: "subject_review",
    label: "Send to subject review",
    to: "subject_review",
    capability: "editorial",
  },
  english_editing: {
    id: "english_editing",
    label: "Send to English editing",
    to: "english_editing",
    capability: "editorial",
  },
  media_rights: { id: "media_rights", label: "Send to rights review", to: "media_rights", capability: "editorial" },
  ready: {
    id: "ready",
    label: "Mark ready for approval",
    to: "ready_for_approval",
    capability: "editorial",
  },
  approve: { id: "approve", label: "Approve", to: "approved", capability: "approve", tone: "primary" },
  schedule: { id: "schedule", label: "Schedule publication", to: "scheduled", capability: "publish" },
  publish: {
    id: "publish",
    label: "Publish now",
    to: "published",
    capability: "publish",
    tone: "primary",
    confirm: "This makes the record public on Indonesia Vibes immediately. Publish now?",
  },
  archive: {
    id: "archive",
    label: "Archive",
    to: "archived",
    capability: "publish",
    tone: "danger",
    confirm: "Archiving removes this from the public platform. The record is kept internally. Continue?",
  },
  reopen: { id: "reopen", label: "Reopen for editing", to: "editorial_review", capability: "editorial" },
};

/** Only actions that make sense from the current state. */
export function actionsFor(status: ContentStatus, kind: ContentKind): WorkflowAction[] {
  const required = REQUIRED_STAGES[kind];
  const stage = (id: string) => ACTION_LIBRARY[id]!;
  const pick = (...ids: string[]) => ids.map(stage).filter((a) => a.to === "ready_for_approval" ? true : true);
  const optional = (id: string, status: ContentStatus) =>
    required.includes(status) ? [stage(id)] : [];

  switch (status) {
    case "draft":
      return pick("editorial_review", "archive");
    case "submitted":
      return [stage("initial_review"), stage("revision"), stage("archive")];
    case "initial_review":
      return [
        stage("editorial_review"),
        stage("verification"),
        stage("revision"),
        stage("archive"),
      ];
    case "editorial_review":
      return [
        stage("verification"),
        ...optional("subject_review", "subject_review"),
        ...optional("english_editing", "english_editing"),
        ...optional("media_rights", "media_rights"),
        stage("revision"),
        stage("ready"),
      ];
    case "revision_requested":
      return [stage("editorial_review"), stage("archive")];
    case "verification":
      return [
        ...optional("subject_review", "subject_review"),
        ...optional("english_editing", "english_editing"),
        ...optional("media_rights", "media_rights"),
        stage("editorial_review"),
        stage("ready"),
      ];
    case "subject_review":
      return [
        ...optional("english_editing", "english_editing"),
        ...optional("media_rights", "media_rights"),
        stage("editorial_review"),
        stage("ready"),
      ];
    case "english_editing":
      return [...optional("media_rights", "media_rights"), stage("editorial_review"), stage("ready")];
    case "media_rights":
      return [stage("ready"), stage("editorial_review")];
    case "ready_for_approval":
      return [stage("approve"), stage("revision"), stage("editorial_review")];
    case "approved":
      return [stage("publish"), stage("schedule"), stage("editorial_review")];
    case "scheduled":
      return [stage("publish"), stage("approve"), stage("editorial_review")];
    case "published":
      return [stage("reopen"), stage("archive")];
    case "archived":
      return [stage("editorial_review")];
    default:
      return [];
  }
}

/* ---------------- sources and verification ---------------- */

export type SourceType =
  | "Official source"
  | "Academic publication"
  | "Book"
  | "Archive"
  | "Community source"
  | "Interview"
  | "Institutional source"
  | "Other";

export const SOURCE_TYPES: SourceType[] = [
  "Official source",
  "Academic publication",
  "Book",
  "Archive",
  "Community source",
  "Interview",
  "Institutional source",
  "Other",
];

export type SourceStatus =
  | "Unverified"
  | "Verification in progress"
  | "Verified"
  | "Needs clarification"
  | "Not suitable";

export const SOURCE_STATUSES: SourceStatus[] = [
  "Unverified",
  "Verification in progress",
  "Verified",
  "Needs clarification",
  "Not suitable",
];

export interface SourceRecord {
  id: string;
  contentId: string;
  title: string;
  author?: string;
  publisher?: string;
  year?: string;
  url?: string;
  type: SourceType;
  owner?: string;
  notes?: string;
  status: SourceStatus;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Claim {
  id: string;
  contentId: string;
  section: string;
  text: string;
  sourceIds: string[];
  status: "Requires source" | "Source attached" | "Verified" | "Disputed";
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

/* ---------------- cultural review ---------------- */

export type SensitivityFlag =
  | "Sacred knowledge"
  | "Restricted knowledge"
  | "Community-owned knowledge"
  | "Ceremonial practice"
  | "Personal information"
  | "Vulnerable community"
  | "Cultural ownership concern";

export const SENSITIVITY_FLAGS: SensitivityFlag[] = [
  "Sacred knowledge",
  "Restricted knowledge",
  "Community-owned knowledge",
  "Ceremonial practice",
  "Personal information",
  "Vulnerable community",
  "Cultural ownership concern",
];

export type CulturalDecision =
  | "No concern"
  | "Context required"
  | "Permission required"
  | "Limit public detail"
  | "Do not publish"
  | "Needs further review";

export const CULTURAL_DECISIONS: CulturalDecision[] = [
  "No concern",
  "Context required",
  "Permission required",
  "Limit public detail",
  "Do not publish",
  "Needs further review",
];

export interface CulturalReview {
  flags: SensitivityFlag[];
  decision?: CulturalDecision;
  reviewer?: string;
  context?: string;
  date?: string;
}

export interface SubjectReview {
  reviewer?: string;
  outcome?: "Substance approved" | "Clarification requested" | "Revision suggested" | "Sensitivity flagged";
  comment?: string;
  date?: string;
  questions?: string[];
}

export interface LanguageReview {
  complete: boolean;
  reviewer?: string;
  date?: string;
  notes?: string;
}

/* ---------------- media and rights ---------------- */

export type MediaKind = "Image" | "Video" | "Audio" | "Document";

export type RightsStatus =
  | "Unknown"
  | "Needs confirmation"
  | "Permission received"
  | "Licensed"
  | "Restricted"
  | "Do not publish";

export const RIGHTS_STATUSES: RightsStatus[] = [
  "Unknown",
  "Needs confirmation",
  "Permission received",
  "Licensed",
  "Restricted",
  "Do not publish",
];

/** Rights states that stop a record from going live. */
export const BLOCKING_RIGHTS: RightsStatus[] = ["Unknown", "Needs confirmation", "Do not publish"];

export interface MediaAsset {
  id: string;
  contentId: string;
  kind: MediaKind;
  fileName: string;
  preview?: string;
  caption: string;
  creator: string;
  credit: string;
  rightsHolder: string;
  permission: RightsStatus;
  restrictions?: string;
  altText: string;
  required: boolean;
  updatedAt: string;
}

/* ---------------- content ---------------- */

export interface Relationships {
  culture: string[];
  people: string[];
  communities: string[];
  institutions: string[];
  places: string[];
  events: string[];
  opportunities: string[];
  collaborations: string[];
  collections: string[];
  research: string[];
}

export const emptyRelationships = (): Relationships => ({
  culture: [],
  people: [],
  communities: [],
  institutions: [],
  places: [],
  events: [],
  opportunities: [],
  collaborations: [],
  collections: [],
  research: [],
});

export type FeedbackKind = "Required" | "Suggestion" | "Question";

export interface EditorialFeedback {
  id: string;
  section: string;
  note: string;
  kind: FeedbackKind;
  /** Contributor-visible feedback vs internal-only reasoning. */
  visibleToContributor: boolean;
  author: string;
  date: string;
  resolved?: boolean;
}

export type NoteKind = "Comment" | "Private note" | "Contributor feedback";

export interface InternalNote {
  id: string;
  kind: NoteKind;
  body: string;
  author: string;
  date: string;
  mentions?: string[];
}

export interface Version {
  id: string;
  label: string;
  editor: string;
  date: string;
  summary: string;
}

export interface ActivityEntry {
  id: string;
  date: string;
  actor: string;
  action: string;
  recordType: string;
  recordId: string;
  recordTitle: string;
  /** Internal-only entries never surface in the shared feed. */
  sensitive?: boolean;
}

export type Priority = "Low" | "Normal" | "High";
export const PRIORITIES: Priority[] = ["Low", "Normal", "High"];

export interface ContentItem {
  id: string;
  kind: ContentKind;
  title: string;
  slug?: string;
  publicPath?: string;
  status: ContentStatus;
  priority: Priority;
  assignedTo?: string;
  contributor?: string;
  organisation?: string;
  submissionId?: string;
  themes: string[];
  countries: string[];
  location?: string;
  createdAt: string;
  updatedAt: string;
  stageSince: string;
  publishedAt?: string;
  scheduledFor?: string;
  scheduleTimeZone?: string;
  lastReviewed?: string;
  nextReview?: string;
  reviewFrequencyDays?: number;
  /** Structured, type-specific editorial fields — never one giant blob. */
  fields: Record<string, string>;
  relationships: Relationships;
  culturalReview: CulturalReview;
  subjectReview?: SubjectReview;
  languageReview: LanguageReview;
  feedback: EditorialFeedback[];
  notes: InternalNote[];
  versions: Version[];
  featured?: ("Homepage" | "In Focus" | "Featured story" | "Collection")[];
  prototype?: boolean;
}

/** Structured field definitions per content type. */
export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "longform";
  help?: string;
}

export const CONTENT_FIELDS: Record<ContentKind, FieldDef[]> = {
  story: [
    { name: "title", label: "Title", type: "text" },
    { name: "standfirst", label: "Standfirst", type: "textarea" },
    { name: "storyType", label: "Story type", type: "text", help: "Feature, Dispatch, Interview or Field note." },
    { name: "heroMedia", label: "Hero media", type: "text" },
    { name: "author", label: "Author", type: "text" },
    { name: "narrative", label: "Narrative", type: "longform" },
    { name: "cta", label: "Primary CTA", type: "text", help: "Where should a reader go next?" },
  ],
  culture: [
    { name: "englishName", label: "English name", type: "text" },
    { name: "originalName", label: "Original name", type: "text" },
    { name: "pronunciation", label: "Pronunciation", type: "text" },
    { name: "introduction", label: "Introduction", type: "textarea" },
    { name: "whyItMatters", label: "Why it matters", type: "textarea" },
    { name: "historicalContext", label: "Historical context", type: "longform" },
    { name: "contemporaryPractice", label: "Contemporary practice", type: "longform" },
    { name: "communities", label: "Communities", type: "textarea" },
    { name: "geography", label: "Geography", type: "text" },
    { name: "sensitivity", label: "Cultural sensitivity", type: "textarea" },
    { name: "recognition", label: "Recognition", type: "text" },
  ],
  person: [
    { name: "name", label: "Name", type: "text" },
    { name: "localName", label: "Local name", type: "text" },
    { name: "role", label: "Role", type: "text" },
    { name: "based", label: "Based in", type: "text" },
    { name: "biography", label: "Biography", type: "longform" },
    { name: "expertise", label: "Expertise", type: "textarea" },
    { name: "consent", label: "Consent and representation", type: "textarea" },
  ],
  community: [
    { name: "name", label: "Community name", type: "text" },
    { name: "custodianship", label: "Custodianship", type: "textarea" },
    { name: "generations", label: "Generations", type: "text" },
    { name: "introduction", label: "Introduction", type: "textarea" },
    { name: "practice", label: "Practice today", type: "longform" },
    { name: "consent", label: "Community consent", type: "textarea" },
  ],
  institution: [
    { name: "name", label: "Institution name", type: "text" },
    { name: "type", label: "Type", type: "text" },
    { name: "profile", label: "Profile", type: "longform" },
    { name: "expertise", label: "Expertise", type: "textarea" },
    { name: "programmes", label: "Programmes", type: "textarea" },
    { name: "website", label: "Official website", type: "text" },
  ],
  place: [
    { name: "name", label: "Place name", type: "text" },
    { name: "type", label: "Place type", type: "text" },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "significance", label: "Significance", type: "longform" },
    { name: "visiting", label: "Visitor information", type: "textarea", help: "Reviewed more frequently than essays." },
    { name: "coordinates", label: "Coordinates", type: "text" },
  ],
  event: [
    { name: "title", label: "Event title", type: "text" },
    { name: "type", label: "Event type", type: "text" },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "dates", label: "Dates", type: "text" },
    { name: "venue", label: "Venue", type: "text" },
    { name: "timeZone", label: "Time zone", type: "text" },
    { name: "format", label: "Format", type: "text" },
    { name: "officialLink", label: "Official source", type: "text" },
    { name: "admission", label: "Admission", type: "text" },
  ],
  opportunity: [
    { name: "title", label: "Opportunity title", type: "text" },
    { name: "type", label: "Type", type: "text" },
    { name: "deadline", label: "Deadline", type: "text" },
    { name: "forWhom", label: "Who it is for", type: "textarea" },
    { name: "support", label: "What is offered", type: "textarea" },
    { name: "eligibility", label: "Eligibility", type: "textarea" },
    { name: "officialLink", label: "Official source", type: "text" },
  ],
  collaboration: [
    { name: "title", label: "Title", type: "text" },
    { name: "countries", label: "Countries", type: "text" },
    { name: "intro", label: "Introduction", type: "textarea" },
    { name: "objectives", label: "Objectives", type: "textarea" },
    { name: "activities", label: "Activities", type: "longform" },
    { name: "documentation", label: "Documentation", type: "textarea" },
  ],
  collection: [
    { name: "title", label: "Title", type: "text" },
    { name: "standfirst", label: "Standfirst", type: "textarea" },
    { name: "theme", label: "Theme", type: "text" },
    { name: "statement", label: "Collection statement", type: "longform" },
    { name: "editor", label: "Editor", type: "text" },
  ],
};

/** Relationship groups that make a record feel connected on the public site. */
export const NETWORK_CHECKS: { key: keyof Relationships | "cta"; label: string }[] = [
  { key: "culture", label: "Cultural subject" },
  { key: "people", label: "People" },
  { key: "places", label: "Place" },
  { key: "institutions", label: "Institution" },
  { key: "events", label: "Event" },
  { key: "collaborations", label: "Collaboration" },
  { key: "research", label: "Research resource" },
  { key: "cta", label: "Meaningful CTA" },
];

export function networkReadiness(item: ContentItem) {
  const checks = NETWORK_CHECKS.map((c) => ({
    label: c.label,
    ok:
      c.key === "cta"
        ? Boolean(item.fields["cta"] ?? item.fields["officialLink"] ?? item.fields["website"])
        : (item.relationships[c.key as keyof Relationships] ?? []).length > 0,
  }));
  return { checks, met: checks.filter((c) => c.ok).length, total: checks.length };
}

/* ---------------- inquiries ---------------- */

export type InquiryStatus =
  | "New"
  | "Under review"
  | "Need more information"
  | "Ready to route"
  | "Forwarded"
  | "In discussion"
  | "Completed"
  | "Closed";

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "New",
  "Under review",
  "Need more information",
  "Ready to route",
  "Forwarded",
  "In discussion",
  "Completed",
  "Closed",
];

export const INQUIRY_CATEGORIES = [
  "Cultural Collaboration",
  "Research & Academic Partnership",
  "Artist / Speaker Invitation",
  "Exhibition / Performance",
  "Institutional Partnership",
  "Cultural Visit / Programme",
  "Media & Publication",
  "General Inquiry",
] as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number];

export interface Clarification {
  id: string;
  message: string;
  sentAt: string;
  sentBy: string;
  response?: string;
  respondedAt?: string;
  status: "Awaiting response" | "Answered" | "No response";
}

export interface Introduction {
  id: string;
  partnerId: string;
  contactPerson: string;
  reason: string;
  contextShared: string;
  consentConfirmed: boolean;
  introducedAt: string;
  followUpDate?: string;
  outcome?: string;
}

export interface InquiryQualification {
  request?: string;
  clear?: "Yes" | "Partly" | "No";
  credible?: "Yes" | "Needs checking" | "No";
  culturalArea?: string;
  geography?: string;
  potentialPartner?: string;
  followUp?: string;
  possibleOutcome?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  label: string;
  actor: string;
  /** External = communicated to the requester. Internal = team-only. */
  channel: "External" | "Internal";
}

export interface Inquiry {
  id: string;
  reference: string;
  requesterName: string;
  requesterRole: string;
  organisation: string;
  country: string;
  email: string;
  category: InquiryCategory;
  subject: string;
  summary: string;
  desiredOutcome: string;
  timeframe: string;
  attachments: string[];
  relatedContentIds: string[];
  receivedAt: string;
  assignedTo?: string;
  priority: Priority;
  status: InquiryStatus;
  nextAction?: string;
  qualification: InquiryQualification;
  clarifications: Clarification[];
  introductions: Introduction[];
  timeline: TimelineEvent[];
  notes: InternalNote[];
  collaborationId?: string;
}

/* ---------------- partners ---------------- */

export type PartnerType =
  | "Institution"
  | "Community"
  | "Individual"
  | "International Organisation"
  | "Embassy / Mission"
  | "University"
  | "Museum"
  | "Cultural Centre"
  | "Festival"
  | "Research Centre";

export const PARTNER_TYPES: PartnerType[] = [
  "Institution",
  "Community",
  "Individual",
  "International Organisation",
  "Embassy / Mission",
  "University",
  "Museum",
  "Cultural Centre",
  "Festival",
  "Research Centre",
];

export type RelationshipStatus = "New" | "Known" | "Active" | "Strategic" | "Inactive";

export const RELATIONSHIP_STATUSES: RelationshipStatus[] = [
  "New",
  "Known",
  "Active",
  "Strategic",
  "Inactive",
];

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  country: string;
  city: string;
  themes: string[];
  expertise: string[];
  collaborationInterests: string[];
  contactPathway: string;
  contactPerson?: string;
  relatedPeopleIds: string[];
  relatedContentIds: string[];
  collaborationIds: string[];
  institutionSlug?: string;
  relationshipStatus: RelationshipStatus;
  lastInteraction?: string;
  nextFollowUp?: string;
  notes: InternalNote[];
}

export type InteractionKind =
  | "Meeting"
  | "Call"
  | "Email"
  | "Introduction"
  | "Event encounter"
  | "Follow-up";

export const INTERACTION_KINDS: InteractionKind[] = [
  "Meeting",
  "Call",
  "Email",
  "Introduction",
  "Event encounter",
  "Follow-up",
];

export interface Interaction {
  id: string;
  kind: InteractionKind;
  date: string;
  participants: string;
  partnerId?: string;
  inquiryId?: string;
  collaborationId?: string;
  summary: string;
  nextAction?: string;
  privateNote?: string;
  recordedBy: string;
}

/* ---------------- collaboration pipeline ---------------- */

/**
 * Deliberately short. Teams should not have to learn a ten-step pipeline to
 * say where a collaboration stands; finer operational detail lives in the
 * collaboration record's notes and activities.
 */
export type PipelineStage =
  | "Draft"
  | "Discussion"
  | "Confirmed"
  | "Ongoing"
  | "Completed"
  | "On hold"
  | "Archived";

export const PIPELINE_STAGES: PipelineStage[] = [
  "Draft",
  "Discussion",
  "Confirmed",
  "Ongoing",
  "Completed",
  "On hold",
  "Archived",
];

/** Maps any legacy stage stored in the prototype's local state onto the short list. */
export function normaliseStage(stage: string): PipelineStage {
  const map: Record<string, PipelineStage> = {
    Idea: "Draft",
    Exploring: "Draft",
    "Partners identified": "Discussion",
    "Proposal development": "Discussion",
    Active: "Ongoing",
    Closed: "Archived",
  };
  return (map[stage] ?? (PIPELINE_STAGES.includes(stage as PipelineStage) ? (stage as PipelineStage) : "Draft"));
}

export type CollaborationOrigin =
  | "Public inquiry"
  | "Existing partner"
  | "Embassy"
  | "Editorial connection"
  | "Event"
  | "Research programme"
  | "Team initiative";

export const COLLABORATION_ORIGINS: CollaborationOrigin[] = [
  "Public inquiry",
  "Existing partner",
  "Embassy",
  "Editorial connection",
  "Event",
  "Research programme",
  "Team initiative",
];

export const OUTPUT_TYPES = [
  "Exhibition",
  "Workshop",
  "Research paper",
  "Performance",
  "Residency",
  "Publication",
  "Digital archive",
  "Programme",
  "Film",
] as const;

export const OUTCOME_TYPES = [
  "New institutional relationship",
  "Follow-up programme",
  "Repeat exchange",
  "Research partnership",
  "Audience expansion",
  "Long-term network",
  "Policy or programme continuation",
] as const;

export interface OriginStep {
  label: string;
  recordType: string;
  recordId?: string;
  date: string;
}

export interface PipelineCollaboration {
  id: string;
  title: string;
  countries: string[];
  themes: string[];
  leadOfficer: string;
  stage: PipelineStage;
  origin: CollaborationOrigin;
  /** Story → inquiry → introduction → meeting → collaboration. */
  originTrail: OriginStep[];
  potentialPartnerIds: string[];
  confirmedPartnerIds: string[];
  objective: string;
  context: string;
  activities: string[];
  timeline: { period: string; label: string }[];
  outputs: { type: string; label: string }[];
  outcomes: { type: string; label: string }[];
  documents: string[];
  inquiryIds: string[];
  nextActions: string[];
  publicSlug?: string;
  contentId?: string;
  updatedAt: string;
}

/* ---------------- follow-ups, taxonomy, curation ---------------- */

export interface FollowUp {
  id: string;
  title: string;
  dueDate?: string;
  owner: string;
  status: "Open" | "Completed";
  relatedType: "Inquiry" | "Partner" | "Collaboration" | "Content";
  relatedId: string;
  relatedLabel: string;
  note?: string;
  completedAt?: string;
}

export type TaxonomyCategory =
  | "Theme"
  | "Geography"
  | "Cultural Category"
  | "Global Region"
  | "Country"
  | "User Intent"
  | "Recognition"
  | "Event Type"
  | "Opportunity Type"
  | "Collaboration Type";

export const TAXONOMY_CATEGORIES: TaxonomyCategory[] = [
  "Theme",
  "Geography",
  "Cultural Category",
  "Global Region",
  "Country",
  "User Intent",
  "Recognition",
  "Event Type",
  "Opportunity Type",
  "Collaboration Type",
];

export interface TaxonomyTerm {
  id: string;
  category: TaxonomyCategory;
  label: string;
  usage: number;
  archived?: boolean;
}

export interface CurationSlot {
  id: string;
  section: "Hero" | "In Focus" | "Featured Collection" | "People to Know" | "Upcoming Experiences" | "Current Collaborations" | "Opportunities";
  contentId: string;
  label: string;
  order: number;
  scheduledUntil?: string;
}

export interface FocusOverride {
  contentId: string;
  label: string;
  mode: "Featured happening" | "Editorial priority" | "Pinned" | "Hidden";
  until?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  roles?: AdminRole[];
  href?: { type: "content" | "inquiry" | "collaboration" | "partner"; id: string };
}

/* ---------------- helpers ---------------- */

export const DAY = 86_400_000;

export const daysBetween = (iso: string, now = Date.now()) =>
  Math.round((now - new Date(iso).getTime()) / DAY);

export const daysUntil = (iso: string, now = Date.now()) =>
  Math.round((new Date(iso).getTime() - now) / DAY);

export function ageLabel(iso: string) {
  const d = daysBetween(iso);
  if (d <= 0) return "today";
  if (d === 1) return "1 day";
  return `${d} days`;
}

/** Records that cannot go live because required media rights are unresolved. */
export function rightsBlocked(assets: MediaAsset[]) {
  return assets.filter((a) => a.required && BLOCKING_RIGHTS.includes(a.permission));
}
