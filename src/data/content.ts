import textileHero from "@/assets/textile-hero.jpg";
import gamelan from "@/assets/gamelan.jpg";
import maritime from "@/assets/maritime.jpg";
import cinema from "@/assets/cinema.jpg";
import performance from "@/assets/performance.jpg";
import design from "@/assets/design.jpg";
import forest from "@/assets/forest.jpg";
import exhibition from "@/assets/exhibition.jpg";
import heritage from "@/assets/heritage.jpg";
import culinary from "@/assets/culinary.jpg";
import abroad from "@/assets/abroad.jpg";
import person1 from "@/assets/person-1.jpg";
import person2 from "@/assets/person-2.jpg";
import person3 from "@/assets/person-3.jpg";
import person4 from "@/assets/person-4.jpg";

import type {
  Collection,
  CulturalEvent,
  CulturalForm,
  NowItem,
  Opportunity,
  Person,
  Pillar,
  Place,
  ResearchPaper,
  Story,
  WorldNode,
} from "@/types/content";

export const images = {
  textileHero,
  gamelan,
  maritime,
  cinema,
  performance,
  design,
  forest,
  exhibition,
  heritage,
  culinary,
  abroad,
};

export const pillars: Pillar[] = [
  {
    id: "heritage",
    title: "Heritage",
    blurb:
      "Living traditions carried by makers, musicians and navigators — documented with the communities who hold them.",
    route: "/heritage",
  },
  {
    id: "contemporary",
    title: "Contemporary",
    blurb:
      "Cinema, design, sound and performance made now, in Jakarta, Yogyakarta, Makassar and the diaspora.",
    route: "/contemporary",
  },
  {
    id: "research",
    title: "Research",
    blurb:
      "Open scholarship, archives and field notes that give the work context and keep attribution honest.",
    route: "/research",
  },
];

export const places: Place[] = [
  { id: "pl-sumba", slug: "sumba", name: "East Sumba", region: "East Nusa Tenggara", country: "Indonesia", lat: -9.65, lng: 120.26, kind: "origin", summary: "Ikat weaving villages where warp threads are bound and dyed over years, not weeks." },
  { id: "pl-yogya", slug: "yogyakarta", name: "Yogyakarta", region: "Java", country: "Indonesia", lat: -7.797, lng: 110.37, kind: "origin", summary: "Court city and contemporary art capital; gamelan, batik and an unbroken studio culture." },
  { id: "pl-bira", slug: "tanjung-bira", name: "Tanjung Bira", region: "South Sulawesi", country: "Indonesia", lat: -5.61, lng: 120.46, kind: "origin", summary: "Konjo shipwrights still build phinisi by eye and memory on the beach at Bira." },
  { id: "pl-jakarta", slug: "jakarta", name: "Jakarta", region: "Java", country: "Indonesia", lat: -6.2, lng: 106.85, kind: "origin", summary: "The archipelago's loudest room: film, music, publishing and a restless design scene." },
  { id: "pl-borobudur", slug: "borobudur", name: "Borobudur", region: "Central Java", country: "Indonesia", lat: -7.608, lng: 110.204, kind: "origin", summary: "Ninth-century stone mandala, 2,672 relief panels, and a working pilgrimage site." },
  { id: "pl-kalimantan", slug: "heart-of-borneo", name: "Heart of Borneo", region: "Kalimantan", country: "Indonesia", lat: 0.5, lng: 114.0, kind: "origin", summary: "Dayak forest stewardship: customary law as an environmental technology." },
  { id: "pl-london", slug: "london", name: "London", region: "England", country: "United Kingdom", lat: 51.507, lng: -0.127, kind: "venue", summary: "Partner museums and a long diaspora presence across east and south London." },
  { id: "pl-berlin", slug: "berlin", name: "Berlin", region: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, kind: "venue", summary: "Sound art, film festivals and an appetite for archipelagic music." },
  { id: "pl-nyc", slug: "new-york", name: "New York", region: "New York", country: "United States", lat: 40.713, lng: -74.006, kind: "venue", summary: "Museums, university programmes and a growing Indonesian design presence." },
  { id: "pl-tokyo", slug: "tokyo", name: "Tokyo", region: "Kantō", country: "Japan", lat: 35.68, lng: 139.69, kind: "venue", summary: "Craft dialogues between Japanese and Indonesian material traditions." },
  { id: "pl-melbourne", slug: "melbourne", name: "Melbourne", region: "Victoria", country: "Australia", lat: -37.814, lng: 144.963, kind: "venue", summary: "The closest large audience, and the deepest teaching links." },
  { id: "pl-nairobi", slug: "nairobi", name: "Nairobi", region: "Nairobi", country: "Kenya", lat: -1.286, lng: 36.817, kind: "venue", summary: "South–south exchange on textiles, sound and creative economy policy." },
  { id: "pl-saopaulo", slug: "sao-paulo", name: "São Paulo", region: "São Paulo", country: "Brazil", lat: -23.55, lng: -46.633, kind: "venue", summary: "Tropical modernism as shared ground for design and architecture exchange." },
];

export const people: Person[] = [
  { id: "pe-1", slug: "rambu-ana", name: "Rambu Ana Hàmu", role: "Master weaver", based: "East Sumba", image: person1, formIds: ["cf-ikat"], bio: "Third-generation ikat weaver who binds and dyes her own warps and now teaches a cohort of twelve younger weavers in her village." },
  { id: "pe-2", slug: "dimas-prayoga", name: "Dimas Prayoga", role: "Composer and gamelan director", based: "Yogyakarta", image: person2, formIds: ["cf-gamelan", "cf-sound"], bio: "Writes for bronze ensemble and electronics, and has toured a hybrid gamelan programme to eleven cities." },
  { id: "pe-3", slug: "nadia-suryani", name: "Nadia Suryani", role: "Curator", based: "Jakarta / London", image: person3, formIds: ["cf-design", "cf-cinema"], bio: "Curates the platform's touring exhibitions and works on restitution and attribution policy with partner museums." },
  { id: "pe-4", slug: "bayu-lestari", name: "Bayu Lestari", role: "Researcher, maritime history", based: "Makassar", image: person4, formIds: ["cf-phinisi", "cf-forest"], bio: "Documents Konjo shipbuilding knowledge and the trade routes that carried it across the Indian Ocean." },
];

export const forms: CulturalForm[] = [
  { id: "cf-ikat", slug: "sumba-ikat", name: "Sumba ikat", pillar: "heritage", discipline: "Textile", image: textileHero, originPlaceId: "pl-sumba", unesco: "Related to the UNESCO-listed Indonesian batik tradition", summary: "Warp-bound, naturally dyed cloth in which a single hinggi can take two years and encodes clan, rank and cosmology." },
  { id: "cf-gamelan", slug: "gamelan", name: "Gamelan", pillar: "heritage", discipline: "Music", image: gamelan, originPlaceId: "pl-yogya", unesco: "Inscribed on the UNESCO Representative List, 2021", summary: "Tuned bronze ensembles whose interlocking cycles have shaped composers from Debussy to today's electronic producers." },
  { id: "cf-phinisi", slug: "phinisi", name: "Phinisi shipbuilding", pillar: "heritage", discipline: "Craft", image: maritime, originPlaceId: "pl-bira", unesco: "Inscribed on the UNESCO Representative List, 2017", summary: "Wooden schooners built without plans by Konjo shipwrights, hull first, from memory and proportion." },
  { id: "cf-temple", slug: "candi-relief", name: "Candi relief carving", pillar: "heritage", discipline: "Architecture", image: heritage, originPlaceId: "pl-borobudur", unesco: "Borobudur Temple Compounds, UNESCO World Heritage, 1991", summary: "Narrative stone relief as public literature, read clockwise across kilometres of wall." },
  { id: "cf-spice", slug: "rempah", name: "Rempah kitchens", pillar: "heritage", discipline: "Culinary", image: culinary, originPlaceId: "pl-jakarta", summary: "The spice logic that reordered global trade, still practised daily in the mortar." },
  { id: "cf-cinema", slug: "new-indonesian-cinema", name: "New Indonesian cinema", pillar: "contemporary", discipline: "Film", image: cinema, originPlaceId: "pl-jakarta", summary: "A generation of directors working between festival circuits and a fierce domestic box office." },
  { id: "cf-performance", slug: "contemporary-performance", name: "Contemporary performance", pillar: "contemporary", discipline: "Dance", image: performance, originPlaceId: "pl-yogya", summary: "Choreographers who take court vocabularies apart and reassemble them for a black box." },
  { id: "cf-design", slug: "material-design", name: "Material design", pillar: "contemporary", discipline: "Design", image: design, originPlaceId: "pl-jakarta", summary: "Rattan, bamboo and volcanic stone in studios designing for export without flattening origin." },
  { id: "cf-sound", slug: "archipelagic-sound", name: "Archipelagic sound", pillar: "contemporary", discipline: "Music", image: abroad, originPlaceId: "pl-jakarta", summary: "Field recording, bronze and synthesis meeting in clubs and concert halls abroad." },
  { id: "cf-forest", slug: "forest-stewardship", name: "Forest stewardship", pillar: "research", discipline: "Ecology", image: forest, originPlaceId: "pl-kalimantan", summary: "Customary law, mapping and the case for indigenous authority over the Heart of Borneo." },
];

export const stories: Story[] = [
  {
    id: "st-1",
    slug: "two-years-in-a-single-cloth",
    title: "Two years in a single cloth",
    dek: "In East Sumba, a hinggi is measured in seasons. What happens when the world wants it in six weeks?",
    kind: "Feature",
    readingMinutes: 11,
    publishedAt: "2026-02-04",
    image: textileHero,
    imageAlt: "Hands binding indigo-dyed warp threads on a wooden ikat loom",
    featured: true,
    formIds: ["cf-ikat"],
    peopleIds: ["pe-1"],
    placeIds: ["pl-sumba"],
    body: [
      "Rambu Ana Hàmu counts a cloth the way a farmer counts a harvest. The warp is bound in the dry months, dyed when the indigo is ready, and woven when the household has hands to spare. A single hinggi kombu — the deep red that gives Sumba its signature — can pass through four pairs of hands and two full years before it leaves the village.",
      "That arithmetic is the first thing an export buyer tries to change. It is also the thing that cannot be changed without changing the cloth itself. Natural dye needs time in the vat and time in the sun; the red comes from morinda root and is coaxed, not applied.",
      "The platform's position is simple and unglamorous: publish the timeline alongside the object. Buyers who understand that a hinggi is a two-year commitment behave differently from buyers who think they are looking at a scarf.",
      "What has shifted in the last decade is who narrates. Rambu Ana now teaches twelve younger weavers, three of whom photograph and caption their own work. Attribution travels with the cloth, in the weaver's own words, and the price follows attribution.",
    ],
  },
  {
    id: "st-2",
    slug: "bronze-and-circuit",
    title: "Bronze and circuit",
    dek: "A Yogyakarta composer takes a full gamelan on tour with a modular synthesiser — and refuses to call it fusion.",
    kind: "Interview",
    readingMinutes: 8,
    publishedAt: "2026-01-22",
    image: gamelan,
    imageAlt: "Bronze gamelan instruments arranged in a rehearsal hall",
    featured: true,
    formIds: ["cf-gamelan", "cf-sound"],
    peopleIds: ["pe-2"],
    placeIds: ["pl-yogya", "pl-berlin"],
    body: [
      "\"Fusion implies two finished things being pressed together,\" Dimas Prayoga says. \"Gamelan was never finished. It absorbed the kendang, it absorbed European tuning arguments, and now it is absorbing a Eurorack.\"",
      "His touring ensemble travels with two and a half tonnes of bronze. The economics are punishing and the argument for doing it anyway is acoustic: sampled gamelan loses the beating between paired instruments, deliberately tuned a few cents apart, that makes the sound shimmer.",
      "In Berlin last autumn the programme sold out three nights. Half the audience, by the venue's own count, had come for the electronics.",
    ],
  },
  {
    id: "st-3",
    slug: "built-by-eye",
    title: "Built by eye",
    dek: "No plans, no CAD, no keel-first sequence. How Konjo shipwrights hold a phinisi in their heads.",
    kind: "Feature",
    readingMinutes: 9,
    publishedAt: "2026-01-09",
    image: maritime,
    imageAlt: "Shipwrights fitting timber planks to a wooden phinisi hull on a beach",
    formIds: ["cf-phinisi"],
    peopleIds: ["pe-4"],
    placeIds: ["pl-bira"],
    body: [
      "The hull comes first. Planks are shaped and pinned to each other before any frame exists, which inverts the sequence taught in every naval architecture school and produces a fair curve that no drawing specified.",
      "Bayu Lestari has spent four years recording the proportional rules that govern it — ratios held in language rather than notation, passed between a master and the two or three people allowed to stand close enough to watch.",
      "UNESCO inscription in 2017 raised the form's profile. It did not fund the apprenticeships, which is the gap the platform's residency programme is aimed at.",
    ],
  },
  {
    id: "st-4",
    slug: "a-country-that-shoots-in-the-rain",
    title: "A country that shoots in the rain",
    dek: "Indonesian cinema is having its loudest decade. Its directors are not interested in explaining themselves.",
    kind: "Dispatch",
    readingMinutes: 7,
    publishedAt: "2025-12-15",
    image: cinema,
    imageAlt: "Film crew working on a night shoot in a Jakarta street",
    formIds: ["cf-cinema"],
    peopleIds: ["pe-3"],
    placeIds: ["pl-jakarta"],
    body: [
      "The domestic box office now regularly outperforms imported blockbusters, which changes the negotiating position of every director who also wants a festival premiere.",
      "What travels is not the explanation of Indonesia but the specificity of it: a horror grammar built on local cosmology, comedies that assume you know the traffic.",
      "Subtitling policy matters more than it sounds. The platform funds translation that keeps register — the difference between a formal and an intimate 'you' is often the whole scene.",
    ],
  },
  {
    id: "st-5",
    slug: "the-forest-is-a-legal-argument",
    title: "The forest is a legal argument",
    dek: "In the Heart of Borneo, customary mapping is doing what satellite enforcement could not.",
    kind: "Field note",
    readingMinutes: 10,
    publishedAt: "2025-11-30",
    image: forest,
    imageAlt: "Forest canopy in Kalimantan seen through morning mist",
    formIds: ["cf-forest"],
    peopleIds: ["pe-4"],
    placeIds: ["pl-kalimantan"],
    body: [
      "Adat maps are not decorative. Filed correctly, they establish a claim, and a claim is the only thing that has reliably slowed a concession.",
      "The work is slow, communal and cartographically rigorous: walking boundaries, recording names, reconciling three generations of memory into a single polygon.",
      "The research pillar publishes the methodology openly, on the argument that a technique that only works for the community that invented it is a hobby, not a policy.",
    ],
  },
  {
    id: "st-6",
    slug: "rattan-after-the-catalogue",
    title: "Rattan, after the catalogue",
    dek: "Jakarta studios are designing for export without letting origin get sanded off the object.",
    kind: "Feature",
    readingMinutes: 6,
    publishedAt: "2025-11-11",
    image: design,
    imageAlt: "Rattan chair prototypes in a bright contemporary design studio",
    formIds: ["cf-design"],
    peopleIds: ["pe-3"],
    placeIds: ["pl-jakarta"],
    body: [
      "For thirty years Indonesian rattan mostly left the country as raw material and came back as someone else's furniture. The interesting studios now keep the design step at home.",
      "The constraint they set themselves is credit: the weaver's workshop is named on the label, not just the designer.",
      "It reads as ethics. It functions as differentiation, and buyers in Milan and Tokyo are paying for it.",
    ],
  },
  {
    id: "st-7",
    slug: "reading-a-wall-clockwise",
    title: "Reading a wall clockwise",
    dek: "Borobudur's reliefs were built to be walked. A new conservation programme is teaching visitors how.",
    kind: "Dispatch",
    readingMinutes: 5,
    publishedAt: "2025-10-28",
    image: heritage,
    imageAlt: "Stone stupas and carved reliefs at Borobudur at sunrise",
    formIds: ["cf-temple"],
    peopleIds: [],
    placeIds: ["pl-borobudur"],
    body: [
      "Two thousand six hundred and seventy-two relief panels, arranged so that a pilgrim walking clockwise reads a narrative from the earthly to the formless.",
      "Foot traffic is the conservation problem and the point of the monument at once. The current programme caps numbers and trades volume for guided literacy.",
      "Visitors who are taught the reading direction stay four times longer, which turns out to be better for the stone as well as the story.",
    ],
  },
  {
    id: "st-8",
    slug: "spice-as-infrastructure",
    title: "Spice as infrastructure",
    dek: "Nutmeg redrew world maps. In Indonesian kitchens it never stopped being a daily tool.",
    kind: "Feature",
    readingMinutes: 8,
    publishedAt: "2025-10-02",
    image: culinary,
    imageAlt: "Spice paste being ground in a stone mortar with fresh aromatics",
    formIds: ["cf-spice"],
    peopleIds: [],
    placeIds: ["pl-jakarta"],
    body: [
      "The colonial history of Indonesian spice is well told. The living technique is not.",
      "Bumbu is a system: an order of operations, a heat curve, a set of substitutions that vary by island and household.",
      "Documenting it as method — rather than as recipe — is the difference between a cuisine that can be taught abroad and one that can only be imitated.",
    ],
  },
];

export const collections: Collection[] = [
  { id: "co-1", slug: "made-slowly", title: "Made slowly", dek: "Six stories about work that resists compression: ikat, phinisi, stone, dye.", image: textileHero, storyIds: ["st-1", "st-3", "st-7"], formIds: ["cf-ikat", "cf-phinisi", "cf-temple"] },
  { id: "co-2", slug: "loud-decade", title: "A loud decade", dek: "Cinema, sound and performance made in the last ten years, and where it travelled.", image: cinema, storyIds: ["st-2", "st-4", "st-6"], formIds: ["cf-cinema", "cf-sound", "cf-design"] },
  { id: "co-3", slug: "who-holds-the-knowledge", title: "Who holds the knowledge", dek: "Attribution, restitution and the politics of credit across the archipelago.", image: forest, storyIds: ["st-5", "st-1", "st-8"], formIds: ["cf-forest", "cf-ikat", "cf-spice"] },
];

export const events: CulturalEvent[] = [
  { id: "ev-1", slug: "warp-and-weft-london", title: "Warp & Weft: Two Years in a Cloth", type: "Exhibition", startDate: "2026-02-10", endDate: "2026-05-24", placeId: "pl-london", image: exhibition, formIds: ["cf-ikat"], live: true, summary: "Thirty-one hinggi from East Sumba, shown with the names and timelines of every weaver." },
  { id: "ev-2", slug: "bronze-circuit-berlin", title: "Bronze / Circuit", type: "Performance", startDate: "2026-03-06", endDate: "2026-03-08", placeId: "pl-berlin", image: gamelan, formIds: ["cf-gamelan", "cf-sound"], summary: "Full gamelan and modular synthesis across three nights, with an open rehearsal on the Saturday." },
  { id: "ev-3", slug: "new-cinema-nyc", title: "New Indonesian Cinema", type: "Screening", startDate: "2026-04-02", endDate: "2026-04-12", placeId: "pl-nyc", image: cinema, formIds: ["cf-cinema"], summary: "Eleven features and a shorts programme, all newly subtitled with register-faithful translation." },
  { id: "ev-4", slug: "hull-first-tokyo", title: "Hull First: Konjo Boatbuilding", type: "Workshop", startDate: "2026-04-18", endDate: "2026-04-20", placeId: "pl-tokyo", image: maritime, formIds: ["cf-phinisi"], summary: "Three days with two Bira shipwrights and Japanese wooden-boat builders, working at quarter scale." },
  { id: "ev-5", slug: "body-court-melbourne", title: "Body / Court", type: "Performance", startDate: "2026-05-14", endDate: "2026-05-16", placeId: "pl-melbourne", image: performance, formIds: ["cf-performance"], summary: "Two choreographers dismantle Javanese court vocabulary for a black-box stage." },
  { id: "ev-6", slug: "material-futures-sao-paulo", title: "Material Futures", type: "Exhibition", startDate: "2026-06-01", endDate: "2026-08-30", placeId: "pl-saopaulo", image: design, formIds: ["cf-design"], summary: "Indonesian and Brazilian studios on tropical material practice, credit and export." },
  { id: "ev-7", slug: "south-south-textiles-nairobi", title: "South–South Textiles", type: "Residency", startDate: "2026-07-05", endDate: "2026-09-05", placeId: "pl-nairobi", image: textileHero, formIds: ["cf-ikat"], summary: "Eight weeks pairing Sumba weavers with Kenyan dyers around natural pigment research." },
];

export const opportunities: Opportunity[] = [
  { id: "op-1", slug: "weaving-apprenticeship-fund", title: "Weaving Apprenticeship Fund", type: "Grant", deadline: "2026-03-31", forWhom: "Master weavers and their apprentices in eastern Indonesia", amount: "Up to IDR 180,000,000", summary: "Two-year support covering materials, dye gardens and a stipend for apprentices under 30." },
  { id: "op-2", slug: "touring-ensemble-residency", title: "Touring Ensemble Residency", type: "Residency", deadline: "2026-04-15", forWhom: "Ensembles working between traditional and contemporary practice", summary: "Ten weeks at a partner venue in Europe, with freight for instruments and a public performance." },
  { id: "op-3", slug: "translation-open-call", title: "Subtitle & Translation Open Call", type: "Open call", deadline: "2026-02-28", forWhom: "Literary and screen translators working from Indonesian regional languages", amount: "Per-project fee", summary: "We fund translation that preserves register, not just meaning. Sample submission required." },
  { id: "op-4", slug: "archipelago-research-fellowship", title: "Archipelago Research Fellowship", type: "Fellowship", deadline: "2026-05-20", forWhom: "Early-career researchers, any nationality, working with Indonesian communities", amount: "12-month stipend", summary: "Open-access publication is a condition. Community co-authorship is strongly encouraged." },
];

export const papers: ResearchPaper[] = [
  { id: "rp-1", title: "Proportional rule systems in Konjo hull construction", authors: "B. Lestari, A. Ridwan", year: 2025, discipline: "Maritime history", abstract: "A first formal notation for the oral ratios governing phinisi hull fairing, recorded across nine builds at Tanjung Bira." },
  { id: "rp-2", title: "Morinda dye chemistry and the two-year hinggi", authors: "R. A. Hàmu, S. Prameswari", year: 2025, discipline: "Material science", abstract: "Why compression of the mordanting cycle degrades colourfastness, with fade data across 24 months of exposure." },
  { id: "rp-3", title: "Adat mapping as enforcement: evidence from Kalimantan", authors: "B. Lestari, M. Iban", year: 2024, discipline: "Environmental law", abstract: "Concession outcomes in 47 mapped versus 51 unmapped customary territories between 2016 and 2023." },
  { id: "rp-4", title: "Beating frequencies and the perception of gamelan tuning", authors: "D. Prayoga, K. Meurer", year: 2024, discipline: "Acoustics", abstract: "Measuring what is lost when paired instruments are sampled rather than played, and why audiences notice." },
  { id: "rp-5", title: "Register loss in Indonesian screen translation", authors: "N. Suryani", year: 2023, discipline: "Translation studies", abstract: "A corpus study of 62 subtitled features, and a proposed style guide for pronoun and honorific handling." },
];

export const worldNodes: WorldNode[] = [
  { id: "wn-1", city: "London", country: "United Kingdom", continent: "Europe", lat: 51.507, lng: -0.127, programme: "Warp & Weft exhibition and schools programme", eventIds: ["ev-1"], status: "Active" },
  { id: "wn-2", city: "Berlin", country: "Germany", continent: "Europe", lat: 52.52, lng: 13.405, programme: "Bronze / Circuit residency and concerts", eventIds: ["ev-2"], status: "Upcoming" },
  { id: "wn-3", city: "New York", country: "United States", continent: "Americas", lat: 40.713, lng: -74.006, programme: "New Indonesian Cinema season", eventIds: ["ev-3"], status: "Upcoming" },
  { id: "wn-4", city: "Tokyo", country: "Japan", continent: "Asia", lat: 35.68, lng: 139.69, programme: "Hull First boatbuilding exchange", eventIds: ["ev-4"], status: "Upcoming" },
  { id: "wn-5", city: "Melbourne", country: "Australia", continent: "Oceania", lat: -37.814, lng: 144.963, programme: "Body / Court performance season", eventIds: ["ev-5"], status: "Upcoming" },
  { id: "wn-6", city: "São Paulo", country: "Brazil", continent: "Americas", lat: -23.55, lng: -46.633, programme: "Material Futures design exhibition", eventIds: ["ev-6"], status: "Upcoming" },
  { id: "wn-7", city: "Nairobi", country: "Kenya", continent: "Africa", lat: -1.286, lng: 36.817, programme: "South–South Textiles residency", eventIds: ["ev-7"], status: "Upcoming" },
  { id: "wn-8", city: "Jakarta", country: "Indonesia", continent: "Asia", lat: -6.2, lng: 106.85, programme: "Home studio, commissioning and archive", eventIds: [], status: "Active" },
  { id: "wn-9", city: "Amsterdam", country: "Netherlands", continent: "Europe", lat: 52.37, lng: 4.895, programme: "Restitution and provenance working group", eventIds: [], status: "Active" },
  { id: "wn-10", city: "Seoul", country: "South Korea", continent: "Asia", lat: 37.567, lng: 126.978, programme: "Screen industry co-production talks", eventIds: [], status: "Archive" },
  { id: "wn-11", city: "Cape Town", country: "South Africa", continent: "Africa", lat: -33.925, lng: 18.424, programme: "Creative economy policy exchange", eventIds: [], status: "Archive" },
  { id: "wn-12", city: "Mexico City", country: "Mexico", continent: "Americas", lat: 19.432, lng: -99.133, programme: "Textile and dye research visit", eventIds: [], status: "Archive" },
];

export const nowItems: NowItem[] = [
  { id: "nw-1", kind: "live", label: "On now", headline: "Warp & Weft opens in London", meta: "Until 24 May · 31 hinggi, 31 named weavers", href: "/events/warp-and-weft-london" },
  { id: "nw-2", kind: "call", label: "Open call", headline: "Subtitle & Translation open call closes 28 Feb", meta: "Regional languages · per-project fee", href: "/opportunities" },
  { id: "nw-3", kind: "opening", label: "Next", headline: "Bronze / Circuit, three nights in Berlin", meta: "6–8 March · open rehearsal Saturday", href: "/events/bronze-circuit-berlin" },
  { id: "nw-4", kind: "release", label: "New", headline: "Field note: the forest is a legal argument", meta: "Research · 10 min read", href: "/stories/the-forest-is-a-legal-argument" },
];

/* ---------- graph helpers ---------- */

const byId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));

const placeMap = byId(places);
const formMap = byId(forms);
const personMap = byId(people);
const storyMap = byId(stories);
const eventMap = byId(events);

export const getPlace = (id: string) => placeMap.get(id);
export const getForm = (id: string) => formMap.get(id);
export const getPerson = (id: string) => personMap.get(id);
export const getStoryById = (id: string) => storyMap.get(id);
export const getEventById = (id: string) => eventMap.get(id);

export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
export const getEvent = (slug: string) => events.find((e) => e.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

export const formsByPillar = (pillar: string) => forms.filter((f) => f.pillar === pillar);

export const storiesForForm = (formId: string) => stories.filter((s) => s.formIds.includes(formId));

export const relatedStories = (story: Story, limit = 3) =>
  stories
    .filter((s) => s.id !== story.id)
    .map((s) => ({
      s,
      score:
        s.formIds.filter((f) => story.formIds.includes(f)).length * 2 +
        s.placeIds.filter((p) => story.placeIds.includes(p)).length +
        s.peopleIds.filter((p) => story.peopleIds.includes(p)).length * 2,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.s);

export const eventsForForm = (formId: string) => events.filter((e) => e.formIds.includes(formId));

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export const formatRange = (start: string, end: string) => {
  const s = new Date(start + "T00:00:00Z");
  const e = new Date(end + "T00:00:00Z");
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const f = (d: Date, withYear: boolean) =>
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: withYear ? "numeric" : undefined,
      timeZone: "UTC",
    });
  return `${f(s, !sameYear)} – ${f(e, true)}`;
};