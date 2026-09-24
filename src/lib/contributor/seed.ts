/**
 * Prototype contributor data. Clearly labelled as prototype in the UI —
 * these records exist to demonstrate every state of the editorial workflow.
 */

import type { Submission } from "./schema";
import type { Member, Notification, Organisation } from "./store";

const day = 86_400_000;
const at = (offset: number) => new Date(Date.now() + offset * day).toISOString();
const id = (n: string) => `proto-${n}`;

export const seedOrganisation: Organisation = {
  name: "Embassy of the Republic of Indonesia, Lisbon",
  type: "Embassy / Mission",
  country: "Portugal",
  city: "Lisbon",
  website: "https://kemlu.go.id/lisbon",
  description:
    "The cultural section of the Indonesian mission in Portugal, working with museums, universities and festivals across the Iberian peninsula on maritime heritage, performing arts and contemporary practice.",
  interests: ["Maritime heritage", "Performing arts", "Museum partnerships", "Academic exchange"],
  themes: ["Heritage", "Performing Arts", "Music", "Contemporary Culture"],
  collaborationInterests:
    "Joint exhibitions with maritime and ethnographic museums, artist residencies, and shared archival research on the spice routes.",
  contact: "culture.lisbon@kemlu.go.id",
};

export const seedMembers: Member[] = [
  {
    id: "m1",
    name: "Maya Kusuma",
    email: "maya.kusuma@kemlu.go.id",
    role: "Organisation Admin",
    status: "Active",
    joined: at(-420),
  },
  {
    id: "m2",
    name: "Rui Tavares",
    email: "rui.tavares@kemlu.go.id",
    role: "Contributor",
    status: "Active",
    joined: at(-160),
  },
  {
    id: "m3",
    name: "Dewi Anggraini",
    email: "dewi.anggraini@kemlu.go.id",
    role: "Contributor",
    status: "Invited",
    joined: at(-6),
  },
];

export const seedNotifications = (): Notification[] => [
  {
    id: "n1",
    title: "Revision requested",
    body: "Our editorial team needs a few updates to “Indonesian Film Programme in Tokyo”.",
    date: at(-2),
    read: false,
    submissionId: id("event"),
  },
  {
    id: "n2",
    title: "Editorial review started",
    body: "“Gamelan Across Oceans” is now with an editor.",
    date: at(-5),
    read: false,
    submissionId: id("story"),
  },
  {
    id: "n3",
    title: "Published",
    body: "“Indonesia–Portugal Maritime Heritage” is live on Indonesia Vibes.",
    date: at(-21),
    read: true,
    submissionId: id("collab"),
  },
];

export const seedSubmissions = (): Submission[] => [
  {
    id: id("story"),
    type: "story",
    title: "Gamelan Across Oceans",
    status: "editorial_review",
    createdAt: at(-24),
    updatedAt: at(-5),
    submittedBy: "Maya Kusuma",
    submittedAt: at(-12),
    currentEditor: "Indonesia Vibes Editorial",
    prototype: true,
    data: {
      title: "Gamelan Across Oceans",
      storyType: "Feature",
      theme: "Music",
      summary:
        "Three European conservatoires now keep a full gamelan set. This is the story of how the instruments travelled, who tunes them, and what happens when a communal music meets a solo-performance tradition.",
      whyTold:
        "Gamelan abroad is usually written about as an exotic curiosity. The more interesting story is institutional: who maintains the instruments, who is invited to teach, and on whose terms.",
      geography: "Yogyakarta; Lisbon; Amsterdam",
      proposal:
        "The story follows a single set of bronze instruments cast in Yogyakarta and now housed at a Lisbon conservatoire. We trace the commission, the shipping, the annual retuning visit by the smith's family, and the first Portuguese students to perform a complete piece.",
      angle: "Who holds the authority to teach a communal tradition when it is transplanted?",
      context:
        "Court gamelan traditions in Central Java carry lineage-based teaching relationships that do not map easily onto European conservatoire timetables.",
      whyMatters:
        "It shows cultural diplomacy as maintenance rather than spectacle — the unglamorous, decades-long work of keeping a living tradition alive far from home.",
      audience: "European arts institutions, ethnomusicologists, general cultural readers",
      interviewees: ["Pak Suhirdjan (instrument smith)", "Conservatoire ensemble director"],
      sensitivity: [],
      linkSubjects: ["Gamelan"],
      linkPlaces: ["Yogyakarta"],
    },
    media: [
      {
        id: "s1m1",
        kind: "image",
        title: "Bronze keys before tuning",
        caption: "Bronze keys laid out before the annual retuning in Lisbon.",
        creator: "Rui Tavares",
        credit: "Embassy of Indonesia, Lisbon",
        rightsHolder: "Embassy of Indonesia, Lisbon",
        permission: "We own the rights",
        altText: "Rows of bronze gamelan keys on a workbench",
      },
    ],
    sources: [
      {
        id: "s1s1",
        title: "Gamelan: Cultural Interaction and Musical Development in Central Java",
        author: "Sumarsam",
        year: "1995",
        publisher: "University of Chicago Press",
        type: "Academic",
      },
    ],
    feedback: [],
    activity: [
      { id: "a1", date: at(-24), label: "Draft created", by: "Maya Kusuma" },
      { id: "a2", date: at(-12), label: "Submitted for editorial review", by: "Maya Kusuma" },
      { id: "a3", date: at(-10), label: "Initial review completed", by: "Indonesia Vibes Editorial" },
      { id: "a4", date: at(-5), label: "Editorial review started", by: "Indonesia Vibes Editorial" },
    ],
  },
  {
    id: id("event"),
    type: "event",
    title: "Indonesian Film Programme in Tokyo",
    status: "revision_requested",
    createdAt: at(-18),
    updatedAt: at(-2),
    submittedBy: "Rui Tavares",
    submittedAt: at(-9),
    currentEditor: "Indonesia Vibes Editorial",
    dueDate: at(7),
    prototype: true,
    data: {
      title: "Indonesian Film Programme in Tokyo",
      eventType: "Screening",
      theme: "Film",
      summary:
        "A six-film programme of Indonesian cinema from the last decade, with two director conversations and a panel on archival restoration.",
      startDate: at(34).slice(0, 10),
      endDate: at(41).slice(0, 10),
      startTime: "18:30",
      endTime: "21:30",
      timeZone: "JST (UTC+9)",
      format: "Onsite",
      country: "Japan",
      city: "Tokyo",
      venue: "Cinema hall, central Tokyo",
      organiser: "Indonesian cultural mission, Tokyo",
      hostInstitution: "Tokyo film centre",
      artists: ["Two visiting directors", "Restoration archivist"],
      programmeText:
        "Six features screened across eight evenings, each introduced with fifteen minutes of context for audiences new to Indonesian cinema. Two evenings close with a director conversation in Indonesian with Japanese and English interpretation.",
      audience: "General public, film students, Indonesian diaspora",
      languages: ["Indonesian", "Japanese", "English"],
      admission: "Ticketed",
      accessibility: "Step-free access to the main hall. Japanese and English subtitles on all screenings.",
      sensitivity: [],
    },
    media: [
      {
        id: "e1m1",
        kind: "image",
        title: "Programme hero image",
        caption: "Still from the opening film.",
        creator: "Production company",
        credit: "Courtesy of the production company",
        rightsHolder: "Production company",
        permission: "",
        altText: "Film still showing two figures on a night street",
      },
    ],
    sources: [],
    feedback: [
      {
        id: "f1",
        section: "Programme detail",
        stepId: "programme",
        note: "Please name the films and the directors. A programme without titles cannot be listed on the public calendar.",
      },
      {
        id: "f2",
        section: "Media rights",
        stepId: "media",
        note: "Please confirm permission for the hero image — the rights status is currently blank.",
      },
      {
        id: "f3",
        section: "Participation",
        stepId: "participation",
        note: "Add the ticket price range and an official registration link if one exists.",
      },
    ],
    activity: [
      { id: "b1", date: at(-18), label: "Draft created", by: "Rui Tavares" },
      { id: "b2", date: at(-9), label: "Submitted for editorial review", by: "Rui Tavares" },
      { id: "b3", date: at(-7), label: "Initial review started", by: "Indonesia Vibes Editorial" },
      { id: "b4", date: at(-2), label: "Revision requested", by: "Indonesia Vibes Editorial" },
    ],
  },

  {
    id: id("profile"),
    type: "profile",
    title: "Living Textile Traditions",
    status: "verification",
    createdAt: at(-40),
    updatedAt: at(-4),
    submittedBy: "Dewi Anggraini",
    submittedAt: at(-30),
    currentEditor: "Indonesia Vibes Editorial",
    prototype: true,
    data: {
      profileKind: "Cultural subject",
      title: "Living Textile Traditions",
      localName: "Tenun ikat",
      aliases: ["Ikat", "Hinggi"],
      category: "Craft & Design",
      summary:
        "Resist-dyed handwoven cloth made across the eastern islands, where pattern, dye source and permitted wearer are all part of a single knowledge system.",
      whyMatters:
        "These cloths are not decorative objects. They record lineage, mark passage and carry restrictions on who may wear which motif — which is exactly what tends to be lost when they enter the global design market.",
      history:
        "Documented in colonial collections from the nineteenth century, though the dye and binding techniques are considerably older.",
      today:
        "Roughly forty households in East Sumba still work with entirely natural dyes. Younger weavers are returning to the practice, often combining it with formal design training.",
      custodians: "Weaving households in East Sumba, and cooperatives that manage indigo and morinda cultivation.",
      origin: "East Sumba, East Nusa Tenggara",
      experienceIt: "Village workshops, regional museums, and the annual weaving season",
      recognition: "Listed in national intangible cultural heritage inventories",
      sensitivity: ["Community-owned knowledge", "Restricted knowledge"],
      sensitivityContext:
        "Certain motifs may only be worn by specific lineages. The weaving cooperative has approved publication of the general description and images, but asked that two motifs not be photographed in detail.",
    },
    media: [
      {
        id: "p1m1",
        kind: "image",
        title: "Indigo dye bath",
        caption: "Skeins lifted from an indigo bath during the dry season.",
        creator: "Dewi Anggraini",
        credit: "Dewi Anggraini",
        rightsHolder: "Dewi Anggraini",
        permission: "Permission granted",
        altText: "Hands lifting deep blue yarn from a dye vat",
      },
    ],
    sources: [
      {
        id: "p1s1",
        title: "Textiles of Eastern Indonesia",
        author: "Regional museum collection notes",
        year: "2019",
        type: "Archive",
      },
      {
        id: "p1s2",
        title: "Interview with weaving cooperative coordinator",
        author: "Dewi Anggraini",
        year: "2026",
        type: "Interview",
      },
    ],
    feedback: [],
    activity: [
      { id: "d1", date: at(-40), label: "Draft created", by: "Dewi Anggraini" },
      { id: "d2", date: at(-30), label: "Submitted for editorial review", by: "Dewi Anggraini" },
      { id: "d3", date: at(-22), label: "Editorial review completed", by: "Indonesia Vibes Editorial" },
      { id: "d4", date: at(-4), label: "Verification started — sources and community permissions", by: "Indonesia Vibes Editorial" },
    ],
  },
  {
    id: id("collab"),
    type: "collaboration",
    title: "Indonesia–Portugal Maritime Heritage",
    status: "published",
    createdAt: at(-140),
    updatedAt: at(-21),
    submittedBy: "Maya Kusuma",
    submittedAt: at(-120),
    publishedAt: at(-21),
    publicUrl: "/collaborations",
    prototype: true,
    data: {
      title: "Indonesia–Portugal Maritime Heritage",
      countries: ["Indonesia", "Portugal"],
      status: "Ongoing",
      themes: ["Heritage", "Architecture"],
      summary:
        "A shared research and exhibition programme on shipbuilding, navigation and the archival record of the spice routes, run between Indonesian and Portuguese maritime institutions.",
      intlInstitutions: ["Maritime museum, Lisbon", "University archive, Coimbra"],
      objectives: [
        "Digitise navigation records held on both sides",
        "Train early-career conservators in wooden hull conservation",
        "Produce one travelling exhibition",
      ],
      why:
        "Both countries hold half of the same archive. Neither can tell the story alone, and until now the two record sets had never been read against each other.",
      timeline:
        "Year one — archival survey\nYear two — conservation training and joint cataloguing\nYear three — travelling exhibition",
      activities: ["Archival survey", "Conservation workshops", "Public lecture series"],
      outputs: ["Joint digital catalogue", "Travelling exhibition", "Two conservation manuals"],
      outcomes: [
        "A standing exchange between the two archives",
        "Six conservators trained and now working in regional museums",
      ],
      future: "A third partner in the Indian Ocean region, extending the archival comparison eastward.",
      nextSteps: ["Scope a third partner", "Secure exhibition tour funding"],
      sensitivity: [],
    },
    media: [
      {
        id: "k1m1",
        kind: "image",
        title: "Phinisi hull under repair",
        caption: "A phinisi hull under repair on the South Sulawesi coast.",
        creator: "Maya Kusuma",
        credit: "Embassy of Indonesia, Lisbon",
        rightsHolder: "Embassy of Indonesia, Lisbon",
        permission: "We own the rights",
        altText: "Wooden ship hull propped on a beach with workers alongside",
      },
    ],
    sources: [
      {
        id: "k1s1",
        title: "Joint programme memorandum",
        author: "Partner institutions",
        year: "2024",
        type: "Official source",
      },
    ],
    feedback: [],
    activity: [
      { id: "e1", date: at(-140), label: "Draft created", by: "Maya Kusuma" },
      { id: "e2", date: at(-120), label: "Submitted for editorial review", by: "Maya Kusuma" },
      { id: "e3", date: at(-96), label: "Revision requested", by: "Indonesia Vibes Editorial" },
      { id: "e4", date: at(-88), label: "Revision submitted", by: "Maya Kusuma" },
      { id: "e5", date: at(-60), label: "Approved for publication", by: "Indonesia Vibes Editorial" },
      { id: "e6", date: at(-21), label: "Published on Indonesia Vibes", by: "Indonesia Vibes Editorial" },
    ],
    updates: [],
  },
  {
    id: id("draft"),
    type: "story",
    title: "Diaspora kitchens in Porto",
    status: "draft",
    createdAt: at(-2),
    updatedAt: at(-1),
    submittedBy: "Rui Tavares",
    prototype: true,
    data: {
      title: "Diaspora kitchens in Porto",
      storyType: "Field notes",
      theme: "Culinary Culture",
      summary: "Three home kitchens, one supper club, and the substitutions that happen when the ingredient is 11,000 km away.",
    },
    media: [],
    sources: [],
    feedback: [],
    activity: [{ id: "g1", date: at(-2), label: "Draft created", by: "Rui Tavares" }],
  },
];
