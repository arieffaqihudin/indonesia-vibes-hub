/**
 * Contributor Workspace — submission model, status vocabulary and the
 * schema that drives every guided submission form.
 *
 * Forms are schema-driven so the five submission types share one renderer,
 * one auto-save engine and one completeness calculation, while each keeps
 * its own steps, wording and helper text.
 */

export type SubmissionType = "story" | "event" | "profile" | "collaboration";

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "initial_review"
  | "editorial_review"
  | "revision_requested"
  | "verification"
  | "english_editing"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export interface StatusMeta {
  id: SubmissionStatus;
  label: string;
  /** Plain-language explanation shown to contributors. */
  meaning: string;
  tone: "neutral" | "progress" | "action" | "good" | "quiet";
  /** Does the contributor need to do something? */
  actionNeeded?: boolean;
}

export const STATUSES: Record<SubmissionStatus, StatusMeta> = {
  draft: {
    id: "draft",
    label: "Draft",
    meaning: "Not yet submitted. Only your organisation can see this.",
    tone: "quiet",
  },
  submitted: {
    id: "submitted",
    label: "Submitted",
    meaning: "Received by Indonesia Vibes. Nothing is needed from you right now.",
    tone: "neutral",
  },
  initial_review: {
    id: "initial_review",
    label: "Initial review",
    meaning: "We are checking that the submission is complete and a good fit.",
    tone: "progress",
  },
  editorial_review: {
    id: "editorial_review",
    label: "Editorial review",
    meaning: "An editor is reading for quality, context and international clarity.",
    tone: "progress",
  },
  revision_requested: {
    id: "revision_requested",
    label: "Revision requested",
    meaning: "Our editorial team needs a few updates before this can continue.",
    tone: "action",
    actionNeeded: true,
  },
  verification: {
    id: "verification",
    label: "Verification",
    meaning: "Facts, sources, permissions and rights are being checked.",
    tone: "progress",
  },
  english_editing: {
    id: "english_editing",
    label: "English editing",
    meaning: "The text is being prepared for an international readership.",
    tone: "progress",
  },
  approved: {
    id: "approved",
    label: "Approved",
    meaning: "Approved for publication. A publication date will follow.",
    tone: "good",
  },
  scheduled: {
    id: "scheduled",
    label: "Scheduled",
    meaning: "Queued for publication on Indonesia Vibes.",
    tone: "good",
  },
  published: {
    id: "published",
    label: "Published",
    meaning: "Live on Indonesia Vibes.",
    tone: "good",
  },
  archived: {
    id: "archived",
    label: "Archived",
    meaning: "No longer active in the current editorial workflow.",
    tone: "quiet",
  },
};

/** The stages shown on the submission timeline, in order. */
export const TIMELINE_STAGES: { id: string; label: string; statuses: SubmissionStatus[] }[] = [
  { id: "submitted", label: "Submitted", statuses: ["submitted"] },
  { id: "initial", label: "Initial review", statuses: ["initial_review"] },
  { id: "editorial", label: "Editorial review", statuses: ["editorial_review", "revision_requested"] },
  { id: "verification", label: "Verification", statuses: ["verification", "english_editing"] },
  { id: "approval", label: "Approval", statuses: ["approved"] },
  { id: "publication", label: "Publication", statuses: ["scheduled", "published"] },
];

const STATUS_ORDER: SubmissionStatus[] = [
  "draft",
  "submitted",
  "initial_review",
  "editorial_review",
  "revision_requested",
  "verification",
  "english_editing",
  "approved",
  "scheduled",
  "published",
  "archived",
];

export const statusRank = (s: SubmissionStatus) => STATUS_ORDER.indexOf(s);

/* ------------------------------------------------------------------ */
/* Media & sources                                                      */
/* ------------------------------------------------------------------ */

export type MediaKind = "image" | "video" | "audio" | "document";

export type PermissionStatus =
  | "We own the rights"
  | "Permission granted"
  | "Permission pending"
  | "Public domain or open licence"
  | "Unclear — please advise";

export const PERMISSION_STATUSES: PermissionStatus[] = [
  "We own the rights",
  "Permission granted",
  "Permission pending",
  "Public domain or open licence",
  "Unclear — please advise",
];

export interface MediaItem {
  id: string;
  kind: MediaKind;
  title: string;
  /** Object URL or remote link. Prototype only — nothing is uploaded. */
  url?: string;
  fileName?: string;
  caption?: string;
  creator?: string;
  credit?: string;
  rightsHolder?: string;
  permission?: PermissionStatus | "";
  restrictions?: string;
  altText?: string;
}

export type SourceType =
  | "Official source"
  | "Academic"
  | "Book"
  | "Archive"
  | "Community source"
  | "Interview"
  | "Other";

export const SOURCE_TYPES: SourceType[] = [
  "Official source",
  "Academic",
  "Book",
  "Archive",
  "Community source",
  "Interview",
  "Other",
];

export interface SourceItem {
  id: string;
  title: string;
  author?: string;
  year?: string;
  publisher?: string;
  url?: string;
  type?: SourceType | "";
  notes?: string;
}

/* ------------------------------------------------------------------ */
/* Submissions                                                          */
/* ------------------------------------------------------------------ */

export interface FeedbackItem {
  id: string;
  section: string;
  /** Step id the feedback points at, so we can deep-link into the form. */
  stepId?: string;
  note: string;
  resolved?: boolean;
}

export interface ActivityEntry {
  id: string;
  date: string;
  label: string;
  by: string;
}

export interface UpdateRequest {
  id: string;
  createdAt: string;
  kind: string;
  detail: string;
  status: "Submitted" | "In review" | "Applied";
}

export interface Submission {
  id: string;
  type: SubmissionType;
  title: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  submittedBy: string;
  submittedAt?: string;
  publishedAt?: string;
  scheduledFor?: string;
  publicUrl?: string;
  currentEditor?: string;
  dueDate?: string;
  data: Record<string, unknown>;
  media: MediaItem[];
  sources: SourceItem[];
  feedback: FeedbackItem[];
  activity: ActivityEntry[];
  updates?: UpdateRequest[];
  /** Seeded prototype records are labelled in the UI. */
  prototype?: boolean;
}

/* ------------------------------------------------------------------ */
/* Form schema                                                          */
/* ------------------------------------------------------------------ */

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "checkboxes"
  | "tags"
  | "date"
  | "time"
  | "url"
  | "consent"
  | "boolean"
  | "coordinates"
  | "connections"
  | "media"
  | "sources"
  | "sensitivity";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  options?: readonly string[];
  required?: boolean;
  /** Renders at half width on desktop. */
  half?: boolean;
  rows?: number;
  /** Connection picker category. */
  entity?: string;
  /** Only show when another field has one of these values. */
  showWhen?: { field: string; equals: string[] };
}

export interface StepDef {
  id: string;
  index: string;
  title: string;
  blurb?: string;
  fields: FieldDef[];
}

export interface TypeConfig {
  type: SubmissionType;
  label: string;
  cta: string;
  description: string;
  needs: string;
  effort: string;
  steps: (data: Record<string, unknown>) => StepDef[];
}

const THEMES = [
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
] as const;

const mediaStep = (id: string, index: string, blurb: string): StepDef => ({
  id,
  index,
  title: "Media & sources",
  blurb,
  fields: [
    {
      name: "media",
      label: "Media",
      type: "media",
      help: "Please tell us who owns each file and whether Indonesia Vibes may use it.",
    },
    {
      name: "sources",
      label: "Sources & references",
      type: "sources",
      help: "Anything a reader or an editor could follow to verify a claim.",
    },
  ],
});

const sensitivityFields: FieldDef[] = [
  {
    name: "sensitivity",
    label: "Cultural sensitivity check",
    type: "sensitivity",
    help: "Flagging something here does not slow your submission down. It tells our editors to handle it with the right care.",
  },
  {
    name: "sensitivityContext",
    label: "Context for the editorial team",
    type: "textarea",
    rows: 3,
    help: "Who granted permission, what may be shown, and anything that should not be published.",
    showWhen: { field: "__sensitivityAny", equals: ["yes"] },
  },
];

const reviewStep = (id: string, index: string, consents: FieldDef[]): StepDef => ({
  id,
  index,
  title: "Review & submit",
  blurb: "A last look before this reaches our editors. You can still come back and change anything.",
  fields: consents,
});

const accuracyConsent: FieldDef = {
  name: "consentAccurate",
  label: "I confirm that the information provided is accurate to the best of my knowledge.",
  type: "consent",
  required: true,
};

const mediaConsent: FieldDef = {
  name: "consentMedia",
  label:
    "I confirm that I have permission to share the submitted media, or have clearly stated its rights status.",
  type: "consent",
  required: true,
};

/* ----------------------------- Story ------------------------------ */

const storySteps = (): StepDef[] => [
  {
    id: "basics",
    index: "01",
    title: "Basics",
    blurb: "The shape of the story in a few lines.",
    fields: [
      { name: "title", label: "Working title", type: "text", required: true, placeholder: "A title we can recognise it by" },
      {
        name: "storyType",
        label: "Story type",
        type: "select",
        required: true,
        options: ["Feature", "Interview", "Essay", "Photo story", "Video story", "Field notes"],
        half: true,
      },
      { name: "theme", label: "Primary cultural theme", type: "select", options: THEMES, required: true, half: true },
      {
        name: "summary",
        label: "Short summary",
        type: "textarea",
        rows: 3,
        required: true,
        help: "Two or three sentences. Assume the reader has never been to Indonesia.",
      },
      {
        name: "whyTold",
        label: "Why should this story be told?",
        type: "textarea",
        rows: 3,
        required: true,
        help: "What makes this worth a reader's attention now?",
      },
      { name: "geography", label: "Location / geography", type: "text", placeholder: "Province, island, city, or abroad", required: true },
    ],
  },
  {
    id: "details",
    index: "02",
    title: "Story details",
    blurb: "As much or as little as you have. A strong proposal is enough to start.",
    fields: [
      { name: "proposal", label: "Story proposal or draft", type: "textarea", rows: 8, required: true },
      { name: "angle", label: "Key questions or angle", type: "textarea", rows: 3 },
      { name: "context", label: "Relevant historical or cultural context", type: "textarea", rows: 4 },
      {
        name: "whyMatters",
        label: "Why it matters today",
        type: "textarea",
        rows: 3,
        required: true,
        help: "Explain why this subject is relevant to someone who may know little about Indonesia.",
      },
      { name: "audience", label: "Intended international audience", type: "text" },
      { name: "interviewees", label: "Potential contributors or interviewees", type: "tags", help: "Press Enter after each name." },
      ...sensitivityFields,
    ],
  },
  {
    id: "connections",
    index: "03",
    title: "People & connections",
    blurb: "Link this story to what already exists on Indonesia Vibes, or suggest something new.",
    fields: [
      { name: "linkSubjects", label: "Cultural subjects", type: "connections", entity: "Culture" },
      { name: "linkPeople", label: "People", type: "connections", entity: "People & Communities" },
      { name: "linkInstitutions", label: "Institutions", type: "connections", entity: "Institutions" },
      { name: "linkPlaces", label: "Places", type: "connections", entity: "Places" },
      { name: "linkEvents", label: "Events", type: "connections", entity: "Events" },
    ],
  },
  mediaStep("media", "04", "Images, documents and links — with their rights clearly stated."),
  reviewStep("review", "05", [accuracyConsent, mediaConsent]),
];

/* ----------------------------- Event ------------------------------ */

const eventSteps = (): StepDef[] => [
  {
    id: "basics",
    index: "01",
    title: "Basics",
    fields: [
      { name: "title", label: "Event title", type: "text", required: true },
      {
        name: "eventType",
        label: "Event type",
        type: "select",
        required: true,
        options: [
          "Festival",
          "Exhibition",
          "Performance",
          "Conference",
          "Workshop",
          "Screening",
          "Cultural mission",
          "Exchange programme",
          "Other",
        ],
        half: true,
      },
      { name: "theme", label: "Primary cultural theme", type: "select", options: THEMES, half: true },
      { name: "summary", label: "Short description", type: "textarea", rows: 3, required: true },
    ],
  },
  {
    id: "when",
    index: "02",
    title: "Date & location",
    fields: [
      { name: "startDate", label: "Start date", type: "date", required: true, half: true },
      { name: "endDate", label: "End date", type: "date", required: true, half: true },
      { name: "startTime", label: "Start time", type: "time", half: true },
      { name: "endTime", label: "End time", type: "time", half: true },
      { name: "timeZone", label: "Time zone", type: "text", placeholder: "e.g. WIB (UTC+7)", half: true },
      { name: "format", label: "Format", type: "radio", options: ["Onsite", "Online", "Hybrid"], required: true, half: true },
      { name: "country", label: "Country", type: "text", required: true, half: true },
      { name: "city", label: "City", type: "text", half: true },
      { name: "venue", label: "Venue", type: "text", showWhen: { field: "format", equals: ["Onsite", "Hybrid"] } },
      { name: "onlineLink", label: "Online link", type: "url", showWhen: { field: "format", equals: ["Online", "Hybrid"] } },
    ],
  },
  {
    id: "programme",
    index: "03",
    title: "Organisers & programme",
    fields: [
      { name: "organiser", label: "Organiser", type: "text", required: true, half: true },
      { name: "hostInstitution", label: "Host institution", type: "text", half: true },
      { name: "partnersId", label: "Indonesian partners", type: "tags" },
      { name: "partnersIntl", label: "International partners", type: "tags" },
      { name: "artists", label: "Artists / speakers", type: "tags" },
      { name: "programmeText", label: "Programme description", type: "textarea", rows: 5, required: true },
      { name: "audience", label: "Audience", type: "text", half: true },
      { name: "languages", label: "Languages", type: "tags", half: true },
    ],
  },
  {
    id: "participation",
    index: "04",
    title: "Participation",
    fields: [
      { name: "admission", label: "Admission", type: "radio", options: ["Free", "Ticketed", "Invitation only"], required: true },
      { name: "registrationLink", label: "Registration link", type: "url", half: true },
      { name: "website", label: "Official website", type: "url", half: true },
      {
        name: "accessibility",
        label: "Accessibility information",
        type: "textarea",
        rows: 3,
        help: "Step-free access, captions, sign interpretation, quiet hours — anything a visitor should know.",
      },
    ],
  },
  {
    id: "connections",
    index: "05",
    title: "Cultural connections",
    fields: [
      { name: "linkSubjects", label: "Cultural subjects", type: "connections", entity: "Culture" },
      { name: "linkPeople", label: "People", type: "connections", entity: "People & Communities" },
      { name: "linkPlaces", label: "Places", type: "connections", entity: "Places" },
      { name: "linkInstitutions", label: "Institutions", type: "connections", entity: "Institutions" },
      { name: "linkStories", label: "Stories", type: "connections", entity: "Story" },
      ...sensitivityFields,
    ],
  },
  mediaStep("media", "06", "A hero image and a poster help enormously. Please credit each one."),
  reviewStep("review", "07", [accuracyConsent, mediaConsent]),
];

/* ------------------------ Cultural profile ------------------------ */

const subjectFields: FieldDef[] = [
  { name: "title", label: "English name", type: "text", required: true },
  { name: "localName", label: "Local / original name", type: "text", half: true },
  { name: "aliases", label: "Alternate names", type: "tags", half: true },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: THEMES,
    required: true,
    half: true,
  },
  { name: "summary", label: "Short introduction", type: "textarea", rows: 3, required: true },
  {
    name: "whyMatters",
    label: "Why it matters",
    type: "textarea",
    rows: 3,
    required: true,
    help: "Explain why this subject is relevant to someone who may know little about Indonesia.",
  },
  { name: "history", label: "Historical context", type: "textarea", rows: 4 },
  { name: "today", label: "How it is practised today", type: "textarea", rows: 4, required: true },
  { name: "custodians", label: "Communities / custodians", type: "textarea", rows: 2 },
  { name: "origin", label: "Geographic origin", type: "text", half: true },
  { name: "experienceIt", label: "Where it can be experienced", type: "text", half: true },
  { name: "recognition", label: "Recognition", type: "text", help: "UNESCO listing, national heritage designation, and similar." },
];

const personFields: FieldDef[] = [
  { name: "title", label: "Name", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true, half: true },
  { name: "location", label: "Location", type: "text", required: true, half: true },
  { name: "summary", label: "Short biography", type: "textarea", rows: 4, required: true },
  { name: "expertise", label: "Areas of expertise", type: "tags" },
  { name: "works", label: "Cultural practices / works", type: "textarea", rows: 3 },
  { name: "languages", label: "Languages", type: "tags", half: true },
  { name: "affiliation", label: "Affiliation", type: "text", half: true },
  { name: "projects", label: "Selected projects", type: "textarea", rows: 3 },
  {
    name: "availability",
    label: "Collaboration availability",
    type: "select",
    options: ["Open to collaboration", "Available for research", "Available for events", "By introduction only"],
  },
  {
    name: "consentPerson",
    label: "I confirm that this person has agreed to be proposed for publication on Indonesia Vibes.",
    type: "consent",
    required: true,
  },
];

const communityFields: FieldDef[] = [
  { name: "title", label: "Community name", type: "text", required: true },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "summary", label: "Short profile", type: "textarea", rows: 3, required: true },
  { name: "history", label: "Community history", type: "textarea", rows: 4 },
  { name: "culturalRole", label: "Cultural role", type: "textarea", rows: 3, required: true },
  { name: "practices", label: "Practices", type: "tags" },
  { name: "knowledgeAreas", label: "Knowledge areas", type: "tags" },
  { name: "activities", label: "Selected activities", type: "textarea", rows: 3 },
  { name: "collaborationInterests", label: "Collaboration interests", type: "textarea", rows: 2 },
  {
    name: "communityContact",
    label: "Community contact person",
    type: "text",
    help: "For editorial coordination only. This is never published.",
  },
  {
    name: "consentCommunity",
    label: "I confirm the community is aware of, and agrees to, this proposal.",
    type: "consent",
    required: true,
  },
];

const institutionFields: FieldDef[] = [
  { name: "title", label: "Institution name", type: "text", required: true },
  {
    name: "institutionType",
    label: "Institution type",
    type: "select",
    required: true,
    half: true,
    options: [
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
    ],
  },
  { name: "website", label: "Official website", type: "url", half: true },
  { name: "country", label: "Country", type: "text", required: true, half: true },
  { name: "city", label: "City", type: "text", half: true },
  { name: "summary", label: "Short profile", type: "textarea", rows: 4, required: true },
  { name: "expertise", label: "Areas of expertise", type: "tags" },
  { name: "collections", label: "Collections", type: "textarea", rows: 3 },
  { name: "programmes", label: "Programmes", type: "textarea", rows: 3 },
  { name: "facilities", label: "Facilities / capabilities", type: "tags" },
  { name: "keyPeople", label: "Key people", type: "tags" },
  { name: "themes", label: "Cultural themes", type: "checkboxes", options: THEMES },
  { name: "intlExperience", label: "International collaboration experience", type: "textarea", rows: 3 },
  { name: "collaborationInterests", label: "Collaboration interests", type: "textarea", rows: 2 },
  { name: "officialContact", label: "Official contact", type: "text", help: "An institutional address, not a personal one." },
];

const placeFields: FieldDef[] = [
  { name: "title", label: "Place name", type: "text", required: true },
  {
    name: "placeType",
    label: "Place type",
    type: "select",
    required: true,
    half: true,
    options: [
      "Museum",
      "Cultural Site",
      "Archaeological Site",
      "Gallery",
      "Cultural Village",
      "Performance Venue",
      "Archive or Library",
      "Cultural Landscape",
      "City",
      "Cultural Region",
    ],
  },
  { name: "country", label: "Country", type: "text", required: true, half: true },
  { name: "province", label: "Province / region", type: "text", half: true },
  { name: "city", label: "City", type: "text", half: true },
  { name: "address", label: "Address", type: "text" },
  { name: "coordinates", label: "Coordinates", type: "coordinates", help: "Latitude, longitude — e.g. -8.5069, 115.2625" },
  { name: "summary", label: "Short introduction", type: "textarea", rows: 3, required: true },
  { name: "significance", label: "Cultural significance", type: "textarea", rows: 4, required: true },
  { name: "history", label: "Historical context", type: "textarea", rows: 3 },
  { name: "practices", label: "Related cultural practices", type: "tags" },
  { name: "communities", label: "Related communities", type: "tags" },
  { name: "experienceIt", label: "What can be experienced", type: "textarea", rows: 3 },
  { name: "opening", label: "Opening information", type: "text" },
  { name: "accessibility", label: "Accessibility", type: "textarea", rows: 2 },
  {
    name: "visitGuidance",
    label: "Responsible visitation guidance",
    type: "textarea",
    rows: 3,
    help: "Dress, photography, ceremonies, permissions — what a respectful visitor should know.",
  },
  { name: "website", label: "Official website", type: "url", half: true },
  { name: "infoSource", label: "Source of practical information", type: "text", half: true },
  { name: "lastVerified", label: "Last verified date", type: "date", half: true },
];

export const PROFILE_KINDS = ["Cultural subject", "Person", "Community", "Institution", "Place"] as const;
export type ProfileKind = (typeof PROFILE_KINDS)[number];

const profileFieldsFor = (kind: string): FieldDef[] => {
  switch (kind) {
    case "Person":
      return personFields;
    case "Community":
      return communityFields;
    case "Institution":
      return institutionFields;
    case "Place":
      return placeFields;
    default:
      return subjectFields;
  }
};

const profileSteps = (data: Record<string, unknown>): StepDef[] => {
  const kind = (data["profileKind"] as string) || "Cultural subject";
  return [
    {
      id: "kind",
      index: "01",
      title: "What would you like to suggest?",
      blurb: "The form adapts to what you choose.",
      fields: [
        { name: "profileKind", label: "Profile type", type: "radio", options: PROFILE_KINDS, required: true },
      ],
    },
    {
      id: "details",
      index: "02",
      title: kind === "Cultural subject" ? "The subject" : `About this ${kind.toLowerCase()}`,
      blurb:
        kind === "Cultural subject"
          ? "Please do not submit restricted, sacred, or community-held knowledge unless you have appropriate permission to share it."
          : "Write it as you would want it read by someone abroad.",
      fields: profileFieldsFor(kind),
    },
    {
      id: "connections",
      index: "03",
      title: "Connections",
      fields: [
        { name: "linkSubjects", label: "Related cultural subjects", type: "connections", entity: "Culture" },
        { name: "linkPeople", label: "Related people & communities", type: "connections", entity: "People & Communities" },
        { name: "linkPlaces", label: "Related places", type: "connections", entity: "Places" },
        { name: "linkInstitutions", label: "Related institutions", type: "connections", entity: "Institutions" },
        { name: "linkEvents", label: "Related events", type: "connections", entity: "Events" },
        ...sensitivityFields,
      ],
    },
    mediaStep("media", "04", "A profile image and any supporting documents, with their rights."),
    reviewStep("review", "05", [accuracyConsent, mediaConsent]),
  ];
};

/* ------------------------- Collaboration -------------------------- */

const collaborationSteps = (): StepDef[] => [
  {
    id: "overview",
    index: "01",
    title: "Overview",
    fields: [
      { name: "title", label: "Collaboration title", type: "text", required: true },
      { name: "countries", label: "Countries involved", type: "tags", required: true },
      {
        name: "status",
        label: "Status",
        type: "radio",
        options: ["Planned", "Active", "Ongoing", "Completed"],
        required: true,
      },
      { name: "themes", label: "Cultural themes", type: "checkboxes", options: THEMES },
      { name: "summary", label: "Short introduction", type: "textarea", rows: 4, required: true },
    ],
  },
  {
    id: "partners",
    index: "02",
    title: "Partners",
    fields: [
      { name: "linkInstitutions", label: "Indonesian institutions", type: "connections", entity: "Institutions" },
      { name: "intlInstitutions", label: "International institutions", type: "tags", required: true },
      { name: "linkPeople", label: "People", type: "connections", entity: "People & Communities" },
      { name: "communities", label: "Communities", type: "tags" },
      { name: "supporters", label: "Supporting organisations", type: "tags" },
    ],
  },
  {
    id: "purpose",
    index: "03",
    title: "Purpose",
    fields: [
      { name: "objectives", label: "Objectives", type: "tags", required: true, help: "One per line. Press Enter after each." },
      { name: "why", label: "Why was this collaboration created?", type: "textarea", rows: 4, required: true },
    ],
  },
  {
    id: "activities",
    index: "04",
    title: "Activities",
    fields: [
      { name: "timeline", label: "Timeline", type: "textarea", rows: 4, help: "Period, milestone, note — one per line." },
      { name: "activities", label: "Activities", type: "tags" },
      { name: "linkEvents", label: "Events", type: "connections", entity: "Events" },
      { name: "research", label: "Research", type: "textarea", rows: 3 },
      { name: "residencies", label: "Residencies", type: "textarea", rows: 2 },
      { name: "exhibitions", label: "Exhibitions", type: "textarea", rows: 2 },
      { name: "programmes", label: "Programmes", type: "textarea", rows: 2 },
    ],
  },
  {
    id: "results",
    index: "05",
    title: "Results",
    blurb: "We keep these apart on purpose: what was made, and what changed.",
    fields: [
      { name: "outputs", label: "Outputs — what was produced?", type: "tags" },
      { name: "outcomes", label: "Outcomes — what changed or continued?", type: "tags" },
    ],
  },
  {
    id: "continuation",
    index: "06",
    title: "Continuation",
    fields: [
      { name: "future", label: "Future possibilities", type: "textarea", rows: 3 },
      { name: "nextSteps", label: "Potential next steps", type: "tags" },
      { name: "collaborationInterests", label: "Collaboration interests", type: "textarea", rows: 2 },
      ...sensitivityFields,
    ],
  },
  mediaStep("media", "07", "Images, documents and links, with credits and rights."),
  reviewStep("review", "08", [accuracyConsent, mediaConsent]),
];

export const TYPE_CONFIG: Record<SubmissionType, TypeConfig> = {
  story: {
    type: "story",
    label: "Story",
    cta: "Submit a story",
    description: "Propose a story, interview, photo story, field note, or editorial feature.",
    needs: "A working title, a summary, why it matters, and any sources or images you already hold.",
    effort: "20–30 minutes",
    steps: storySteps,
  },
  event: {
    type: "event",
    label: "Event",
    cta: "Propose an event",
    description: "Share a cultural event taking place in Indonesia, abroad, online, or in hybrid format.",
    needs: "Dates, venue or link, organiser, programme, and one image you have the rights to.",
    effort: "15–25 minutes",
    steps: eventSteps,
  },
  profile: {
    type: "profile",
    label: "Cultural profile",
    cta: "Suggest a cultural profile",
    description: "Suggest a cultural subject, person, community, institution or place for the knowledge base.",
    needs: "An introduction, why it matters, custodians or affiliations, and consent where a person is involved.",
    effort: "20–40 minutes",
    steps: profileSteps,
  },
  collaboration: {
    type: "collaboration",
    label: "Collaboration",
    cta: "Submit a collaboration",
    description: "Document an international partnership, exchange, joint exhibition or research programme.",
    needs: "Partners on both sides, objectives, activities, and the difference between outputs and outcomes.",
    effort: "25–40 minutes",
    steps: collaborationSteps,
  },
};

export const SUBMISSION_TYPES = Object.values(TYPE_CONFIG);

export const stepsFor = (type: SubmissionType, data: Record<string, unknown>) =>
  TYPE_CONFIG[type].steps(data);

/** Fields visible for the current data (respecting showWhen). */
export const visibleFields = (step: StepDef, data: Record<string, unknown>) =>
  step.fields.filter((f) => {
    if (!f.showWhen) return true;
    if (f.showWhen.field === "__sensitivityAny") {
      const flags = (data["sensitivity"] as string[]) || [];
      return flags.length > 0;
    }
    return f.showWhen.equals.includes(String(data[f.showWhen.field] ?? ""));
  });

export const SENSITIVITY_FLAGS = [
  "Sacred information",
  "Restricted knowledge",
  "Community-owned knowledge",
  "Ceremonial practices",
  "Personal information",
  "Vulnerable community information",
] as const;

/* --------------------------- Completeness -------------------------- */

const isEmpty = (v: unknown) =>
  v === undefined ||
  v === null ||
  v === "" ||
  v === false ||
  (Array.isArray(v) && v.length === 0);

export interface Completeness {
  percent: number;
  missing: { label: string; stepId: string }[];
}

export function completeness(sub: Submission): Completeness {
  const steps = stepsFor(sub.type, sub.data);
  const missing: { label: string; stepId: string }[] = [];
  let total = 0;
  let done = 0;
  for (const step of steps) {
    for (const field of visibleFields(step, sub.data)) {
      if (field.type === "media" || field.type === "sources" || field.type === "sensitivity") continue;
      const value =
        field.name === "media" ? sub.media : field.name === "sources" ? sub.sources : sub.data[field.name];
      const weight = field.required ? 2 : 1;
      total += weight;
      if (!isEmpty(value)) done += weight;
      else if (field.required) missing.push({ label: field.label, stepId: step.id });
    }
  }
  if (sub.media.length === 0) missing.push({ label: "At least one image or document", stepId: "media" });
  const unrighted = sub.media.filter((m) => !m.permission).length;
  if (unrighted > 0) missing.push({ label: `Rights status for ${unrighted} media item(s)`, stepId: "media" });
  if (sub.sources.length === 0) missing.push({ label: "At least one source", stepId: "media" });
  total += 3;
  done += (sub.media.length > 0 ? 1 : 0) + (unrighted === 0 && sub.media.length > 0 ? 1 : 0) + (sub.sources.length > 0 ? 1 : 0);
  return { percent: total === 0 ? 0 : Math.round((done / total) * 100), missing };
}

/* --------------------------- Validation ---------------------------- */

const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;

export function validateStep(
  step: StepDef,
  sub: Submission,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const data = sub.data;
  for (const field of visibleFields(step, data)) {
    const value = field.name === "media" ? sub.media : field.name === "sources" ? sub.sources : data[field.name];
    if (field.required && isEmpty(value)) {
      errors[field.name] =
        field.type === "consent" ? "This confirmation is required." : `${field.label} is required.`;
      continue;
    }
    if (field.type === "url" && typeof value === "string" && value && !URL_RE.test(value)) {
      errors[field.name] = "Enter a full web address, starting with https://";
    }
    if (field.type === "coordinates" && typeof value === "string" && value) {
      const parts = value.split(",").map((n) => Number(n.trim()));
      const lat = parts[0] ?? NaN;
      const lng = parts[1] ?? NaN;
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        errors[field.name] = "Use latitude, longitude — for example -8.5069, 115.2625";
      }
    }
  }
  const s = data["startDate"] as string | undefined;
  const e = data["endDate"] as string | undefined;
  if (s && e && e < s) errors["endDate"] = "The end date cannot come before the start date.";
  const open = data["openingDate"] as string | undefined;
  const dl = data["deadline"] as string | undefined;
  if (open && dl && dl < open) errors["deadline"] = "The deadline cannot come before the opening date.";
  return errors;
}

export const titleOf = (sub: Submission) =>
  (sub.data["title"] as string) || sub.title || "Untitled submission";
