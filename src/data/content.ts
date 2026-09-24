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
import person5 from "@/assets/person-5.jpg";
import person6 from "@/assets/person-6.jpg";
import person7 from "@/assets/person-7.jpg";
import institutionMuseum from "@/assets/institution-museum.jpg";

import type {
  Collection,
  CulturalEvent,
  CulturalForm,
  Person,
  Pillar,
  Place,
  ResearchPaper,
  Story,
  WorldNode,
} from "@/types/content";

export const images = {
  textileHero,
  institutionMuseum,
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
  { id: "pl-sumba", slug: "sumba", name: "East Sumba", region: "Lesser Sunda Islands", province: "East Nusa Tenggara", city: "Waingapu", country: "Indonesia", lat: -9.65, lng: 120.26, kind: "origin", type: "Cultural Region", image: textileHero, featured: true, themes: ["Craft & Design", "Heritage", "Indigenous Knowledge"], summary: "Ikat weaving villages where warp threads are bound and dyed over years, not weeks.", whyMatters: "Sumba is one of the few places where an entire textile economy still runs on natural dye time — a two-year cloth remains a two-year cloth.", significance: ["The hinggi, a man's shoulder cloth, carries clan motifs that function as a readable record of rank, marriage and cosmology.", "Dye gardens are held collectively; morinda root and indigo are grown, harvested and shared across households rather than bought in.", "Weaving is taught by apprenticeship, and the apprenticeship is a household commitment measured in seasons."], visiting: { opening: "Village weaving houses generally receive visitors on weekday mornings; arrange through a local host rather than arriving unannounced.", accessibility: "Unpaved village paths and low doorways; limited step-free access.", guidance: "Ask before photographing looms or unfinished cloth. Buy directly from the weaving house where possible, and expect prices that reflect years of work.", website: "https://indonesia.travel", websiteLabel: "Regional visitor information", lastReviewed: "2026-01-18" } },
  { id: "pl-kaliuda", slug: "kaliuda", name: "Kaliuda village", region: "Lesser Sunda Islands", province: "East Nusa Tenggara", city: "Pahunga Lodu", country: "Indonesia", lat: -10.13, lng: 120.72, kind: "origin", type: "Cultural Village", image: textileHero, themes: ["Craft & Design", "Heritage"], summary: "A weaving village on Sumba's south-east coast where dye gardens sit behind the looms.", whyMatters: "Kaliuda shows the full chain in one place: garden, vat, loom, and the households that decide what leaves the village.", significance: ["Roughly forty households weave; a dozen maintain their own morinda and indigo plots.", "The village weaving house doubles as the teaching room for apprentices under thirty."], visiting: { opening: "Daylight hours, by arrangement with the weaving house.", accessibility: "Sand and gravel access road; not step-free.", guidance: "Visits are hosted, not ticketed. Contributions go to the weaving house rather than individuals.", lastReviewed: "2026-01-18" } },
  { id: "pl-yogya", slug: "yogyakarta", name: "Yogyakarta", region: "Java", province: "Special Region of Yogyakarta", city: "Yogyakarta", country: "Indonesia", lat: -7.797, lng: 110.37, kind: "origin", type: "City", image: gamelan, featured: true, themes: ["Performing Arts", "Music", "Contemporary Culture", "Heritage"], summary: "Court city and contemporary art capital; gamelan, batik and an unbroken studio culture.", whyMatters: "Nowhere else in the archipelago keeps court tradition and experimental practice in the same week, often in the same building.", significance: ["Court gamelan repertoire is still performed on a fixed calendar, while independent studios rework it nightly.", "The city's art schools supply curators, choreographers and composers to the rest of Indonesia."], visiting: { opening: "Cultural venues typically open 09:00–17:00; performance schedules vary by season.", accessibility: "Major venues have ramp access; older court buildings do not.", guidance: "Court performances have dress expectations. Follow venue guidance on photography during ritual sequences.", website: "https://indonesia.travel", websiteLabel: "City visitor information", lastReviewed: "2026-02-02" } },
  { id: "pl-taman-budaya", slug: "taman-budaya-yogyakarta", name: "Taman Budaya performance hall", region: "Java", province: "Special Region of Yogyakarta", city: "Yogyakarta", country: "Indonesia", lat: -7.801, lng: 110.366, kind: "venue", type: "Performance Venue", image: performance, themes: ["Performing Arts", "Music"], summary: "The city's working black box: rehearsal, premiere and open studio in one building.", whyMatters: "Most contemporary Indonesian choreography passes through a room like this before it travels abroad.", significance: ["Open rehearsals are free and announced a week ahead.", "The hall hosts both court-trained and independent companies without separating the programmes."], visiting: { opening: "Box office 10:00–19:00 on performance days.", accessibility: "Step-free entry, accessible seating on request.", guidance: "Photography is usually allowed at open rehearsals and not during performances.", lastReviewed: "2026-02-02" } },
  { id: "pl-bira", slug: "tanjung-bira", name: "Tanjung Bira", region: "Sulawesi", province: "South Sulawesi", city: "Bonto Bahari", country: "Indonesia", lat: -5.61, lng: 120.46, kind: "origin", type: "Cultural Landscape", image: maritime, featured: true, themes: ["Heritage", "Craft & Design", "Indigenous Knowledge"], summary: "Konjo shipwrights still build phinisi by eye and memory on the beach at Bira.", whyMatters: "The hulls are built without plans. The knowledge lives in proportion, sequence and the hands of the master builder.", significance: ["Construction begins with the keel and hull; frames are fitted afterwards, the reverse of European practice.", "Launches are communal events, and the timing is set by the master builder rather than a calendar."], visiting: { opening: "Beach yards are open daylight hours; work pauses around midday heat.", accessibility: "Soft sand and active worksites; not step-free and not suitable for unaccompanied children.", guidance: "These are working yards, not exhibits. Ask the master builder before entering a hull or photographing a launch preparation.", lastReviewed: "2026-01-30" } },
  { id: "pl-jakarta", slug: "jakarta", name: "Jakarta", region: "Java", province: "Jakarta", city: "Jakarta", country: "Indonesia", lat: -6.2, lng: 106.85, kind: "origin", type: "City", image: cinema, themes: ["Film", "Contemporary Culture", "Culinary Culture", "Craft & Design"], summary: "The archipelago's loudest room: film, music, publishing and a restless design scene.", whyMatters: "Every national conversation about culture is argued out here first, usually in a cinema lobby or a studio courtyard.", significance: ["The domestic box office is one of the fastest growing in Asia, and it is genuinely local in taste.", "Design studios here now keep the design step at home rather than exporting raw material."], visiting: { opening: "Museums typically 09:00–16:00, closed Mondays; screening venues run late.", accessibility: "Newer venues are step-free; older buildings vary.", guidance: "Traffic makes cross-city plans unrealistic — pick one district per day.", website: "https://indonesia.travel", websiteLabel: "City visitor information", lastReviewed: "2026-02-10" } },
  { id: "pl-borobudur", slug: "borobudur", name: "Borobudur", region: "Java", province: "Central Java", city: "Magelang", country: "Indonesia", lat: -7.608, lng: 110.204, kind: "origin", type: "Archaeological Site", image: heritage, featured: true, themes: ["Architecture", "Heritage"], summary: "Ninth-century stone mandala, 2,672 relief panels, and a working pilgrimage site.", whyMatters: "It was built to be walked. Reading the reliefs clockwise turns a monument into a piece of public literature.", significance: ["The narrative panels run for kilometres and were designed for a reader moving at walking pace.", "It remains an active pilgrimage site, not only a heritage attraction."], visiting: { opening: "Timed entry from sunrise; upper terraces are capped and require a guided slot.", accessibility: "Ground-level galleries are step-free; the terraces are steep stone stairs.", guidance: "Wear the provided footwear on the terraces, keep to the clockwise direction, and treat pilgrimage groups as having right of way.", website: "https://whc.unesco.org", websiteLabel: "World Heritage listing", lastReviewed: "2026-01-22" } },
  { id: "pl-trowulan", slug: "trowulan", name: "Trowulan", region: "Java", province: "East Java", city: "Mojokerto", country: "Indonesia", lat: -7.55, lng: 112.38, kind: "origin", type: "Archaeological Site", image: heritage, themes: ["Architecture", "Heritage"], summary: "Brick foundations of a Majapahit-era capital spread under present-day farmland and villages.", whyMatters: "An urban site rather than a monument: it shows how a medieval archipelagic capital actually organised water, trade and housing.", significance: ["Excavated water channels and brick platforms sit inside a living agricultural landscape.", "Local brickmakers still work with the same clay beds recorded in the site surveys."], visiting: { opening: "Site museum 08:00–15:30, closed Mondays.", accessibility: "Flat but unpaved between excavation areas.", guidance: "Much of the site lies under private land — stay on marked routes and ask before crossing fields.", lastReviewed: "2026-01-12" } },
  { id: "pl-banda", slug: "banda-islands", name: "Banda Islands", region: "Maluku", province: "Maluku", city: "Banda Neira", country: "Indonesia", lat: -4.53, lng: 129.9, kind: "origin", type: "Cultural Landscape", image: culinary, themes: ["Culinary Culture", "Heritage", "Indigenous Knowledge"], summary: "Nutmeg groves, colonial-era warehouses and a maritime memory that redrew world trade.", whyMatters: "The spice that reorganised European navigation is still farmed here by households, on the same terraces.", significance: ["Nutmeg is harvested in small family plots under kenari shade trees.", "The islands hold layered maritime archives: Bandanese, Dutch, British and Indonesian."], visiting: { opening: "Groves and heritage houses are open by arrangement; ferry schedules govern all visits.", accessibility: "Steep paths, boat transfers; limited accessible options.", guidance: "Sea crossings are weather dependent. Buy nutmeg from grower cooperatives rather than resellers.", lastReviewed: "2026-01-05" } },
  { id: "pl-kalimantan", slug: "heart-of-borneo", name: "Heart of Borneo", region: "Kalimantan", province: "West Kalimantan", city: "Putussibau", country: "Indonesia", lat: 0.5, lng: 114.0, kind: "origin", type: "Cultural Landscape", image: forest, themes: ["Indigenous Knowledge", "Heritage"], summary: "Dayak forest stewardship: customary law as an environmental technology.", whyMatters: "Customary boundaries, when mapped and recognised, hold up in negotiations that abstract conservation arguments lose.", significance: ["Community mapping reconciles three generations of memory into a single agreed polygon.", "Longhouse governance decides forest use collectively, season by season."], visiting: { opening: "Visits are hosted by longhouse communities and arranged in advance.", accessibility: "River transport and forest trails; not accessible.", guidance: "Customary protocol applies on arrival. Some sites and knowledge are restricted and are not photographed or published.", lastReviewed: "2025-12-14" } },
  { id: "pl-london", slug: "london", name: "London", region: "England", province: "Greater London", city: "London", country: "United Kingdom", lat: 51.507, lng: -0.127, kind: "venue", type: "City", image: exhibition, themes: ["Heritage", "Craft & Design"], summary: "Partner museums and a long diaspora presence across east and south London." },
  { id: "pl-berlin", slug: "berlin", name: "Berlin", region: "Berlin", province: "Berlin", city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, kind: "venue", type: "City", image: gamelan, themes: ["Music", "Contemporary Culture"], summary: "Sound art, film festivals and an appetite for archipelagic music." },
  { id: "pl-nyc", slug: "new-york", name: "New York", region: "North America", province: "New York", city: "New York", country: "United States", lat: 40.713, lng: -74.006, kind: "venue", type: "City", image: cinema, themes: ["Film", "Contemporary Culture"], summary: "Museums, university programmes and a growing Indonesian design presence." },
  { id: "pl-tokyo", slug: "tokyo", name: "Tokyo", region: "Kantō", province: "Tokyo", city: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69, kind: "venue", type: "City", image: maritime, themes: ["Craft & Design", "Film"], summary: "Craft dialogues between Japanese and Indonesian material traditions." },
  { id: "pl-melbourne", slug: "melbourne", name: "Melbourne", region: "Victoria", province: "Victoria", city: "Melbourne", country: "Australia", lat: -37.814, lng: 144.963, kind: "venue", type: "City", image: performance, themes: ["Performing Arts"], summary: "The closest large audience, and the deepest teaching links." },
  { id: "pl-nairobi", slug: "nairobi", name: "Nairobi", region: "East Africa", province: "Nairobi", city: "Nairobi", country: "Kenya", lat: -1.286, lng: 36.817, kind: "venue", type: "City", image: textileHero, themes: ["Craft & Design"], summary: "South–south exchange on textiles, sound and creative economy policy." },
  { id: "pl-saopaulo", slug: "sao-paulo", name: "São Paulo", region: "South America", province: "São Paulo", city: "São Paulo", country: "Brazil", lat: -23.55, lng: -46.633, kind: "venue", type: "City", image: design, themes: ["Craft & Design", "Architecture"], summary: "Tropical modernism as shared ground for design and architecture exchange." },
  { id: "pl-lisbon", slug: "lisbon", name: "Lisbon", region: "Europe", province: "Lisbon", city: "Lisbon", country: "Portugal", lat: 38.72, lng: -9.14, kind: "venue", type: "City", image: maritime, themes: ["Heritage"], summary: "Maritime archives and a shared, complicated Indian Ocean record." },
];

export const people: Person[] = [
  {
    id: "pe-1", slug: "rambu-ana", entity: "person", name: "Rambu Ana Hàmu", localName: "Rambu Ana", role: "Master weaver", roles: ["Cultural Master", "Tradition Bearer"],
    based: "East Sumba", image: person1, formIds: ["cf-ikat"], themes: ["Craft & Design", "Heritage", "Indigenous Knowledge"],
    placeId: "pl-kaliuda", province: "East Nusa Tenggara", city: "Pahunga Lodu", region: "Lesser Sunda Islands",
    institutionIds: ["in-kaliuda"], availability: "Available for events", featured: true,
    languages: ["Kambera", "Indonesian"],
    expertise: ["Warp ikat binding", "Morinda and indigo dyeing", "Motif custodianship", "Apprentice teaching"],
    bio: "Third-generation ikat weaver who binds and dyes her own warps and now teaches a cohort of twelve younger weavers in her village.",
    intro: "A hinggi from her loom takes two years, and she can name every hand that touched it.",
    whyMatters: "She is one of a small number of weavers who still control the whole chain — garden, vat, loom — and she has chosen to teach it rather than protect it.",
    story: [
      "Rambu Ana Hàmu counts a cloth the way a farmer counts a harvest: bound in the dry months, dyed when the indigo is ready, woven when the household has hands to spare.",
      "Since 2019 she has run an apprenticeship out of the Kaliuda weaving house, on the condition that apprentices learn the dye garden before they touch a loom.",
      "She works with researchers on colourfastness data, and insists that motif rights stay with the clans that hold them.",
    ],
    works: [
      { title: "Hinggi kombu series", year: "2023–2025", note: "Nine cloths, each documented from dye garden to finished panel." },
      { title: "Kaliuda apprentice cohort", year: "2019–", note: "Twelve weavers under thirty, taught garden-first." },
    ],
  },
  {
    id: "pe-2", slug: "dimas-prayoga", entity: "person", name: "Dimas Prayoga", role: "Composer and gamelan director", roles: ["Artist", "Cultural Practitioner"],
    based: "Yogyakarta", image: person2, formIds: ["cf-gamelan", "cf-sound"], themes: ["Music", "Contemporary Culture", "Performing Arts"],
    placeId: "pl-yogya", province: "Special Region of Yogyakarta", city: "Yogyakarta", region: "Java",
    institutionIds: ["in-arts-institute", "in-sound-archive"], availability: "Open to collaboration", featured: true,
    languages: ["Javanese", "Indonesian", "English"],
    expertise: ["Composition for bronze ensemble", "Live electronics", "Tuning and beating frequencies", "Touring production"],
    bio: "Writes for bronze ensemble and electronics, and has toured a hybrid gamelan programme to eleven cities.",
    intro: "He treats a gamelan as a tuning system rather than a museum object, then puts a modular synth beside it.",
    whyMatters: "His work is the clearest argument that traditional tuning systems are compositional tools, not heritage decoration.",
    story: [
      "Trained in court repertoire before studying acoustics, Dimas builds pieces around the beating frequencies that paired instruments produce and samplers cannot.",
      "His touring programme keeps a full ensemble on stage, which is expensive and, he argues, the entire point.",
    ],
    works: [
      { title: "Bronze / Circuit", year: "2026", note: "Three-night programme for full gamelan and modular synthesis." },
      { title: "Paired frequencies", year: "2024", note: "Study recordings made with acousticians for open publication." },
    ],
  },
  {
    id: "pe-3", slug: "nadia-suryani", entity: "person", name: "Nadia Suryani", role: "Curator", roles: ["Curator", "Writer"],
    based: "Jakarta / London", image: person3, formIds: ["cf-design", "cf-cinema"], themes: ["Craft & Design", "Film", "Contemporary Culture"],
    placeId: "pl-jakarta", province: "Jakarta", city: "Jakarta", region: "Java",
    institutionIds: ["in-textile-museum"], availability: "Open to collaboration",
    languages: ["Indonesian", "English"],
    expertise: ["Touring exhibition curation", "Provenance and attribution", "Translation policy", "Loan agreements"],
    bio: "Curates the platform's touring exhibitions and works on restitution and attribution policy with partner museums.",
    intro: "She writes the loan agreements that put the maker's name on the wall label before the lender's.",
    whyMatters: "Attribution is a negotiating position, not a courtesy. She has made it a condition of touring.",
    story: [
      "Nadia moves between Jakarta and London, assembling exhibitions where provenance is published alongside the object.",
      "Her corpus study of subtitled Indonesian features led to a style guide now used by three festival partners.",
    ],
    works: [
      { title: "Warp & Weft", year: "2026", note: "Thirty-one hinggi shown with weaver names and full timelines." },
      { title: "Register loss in screen translation", year: "2023", note: "Corpus study and proposed subtitling style guide." },
    ],
  },
  {
    id: "pe-4", slug: "bayu-lestari", entity: "person", name: "Bayu Lestari", role: "Researcher, maritime history", roles: ["Researcher"],
    based: "Makassar", image: person4, formIds: ["cf-phinisi", "cf-forest"], themes: ["Heritage", "Indigenous Knowledge"],
    placeId: "pl-bira", province: "South Sulawesi", city: "Makassar", region: "Sulawesi",
    institutionIds: ["in-maritime-centre"], availability: "Available for research",
    languages: ["Konjo", "Makassarese", "Indonesian", "English"],
    expertise: ["Oral proportional systems", "Boatbuilding documentation", "Indian Ocean trade routes", "Community co-authorship"],
    bio: "Documents Konjo shipbuilding knowledge and the trade routes that carried it across the Indian Ocean.",
    intro: "He is writing down a set of hull ratios that have never been written down before — with the builders as co-authors.",
    whyMatters: "Without notation, the knowledge travels only as far as the next apprentice. With it, the builders keep the credit.",
    story: [
      "Bayu has recorded nine builds at Tanjung Bira, converting spoken proportions into a notation the builders themselves reviewed.",
      "He also works on customary mapping in Kalimantan, where the same question applies: who holds the record, and who benefits from it.",
    ],
    works: [
      { title: "Proportional rule systems in Konjo hull construction", year: "2025", note: "Open-access paper, co-authored with builders." },
      { title: "Hull First", year: "2026", note: "Quarter-scale boatbuilding exchange in Tokyo." },
    ],
  },
  {
    id: "pe-5", slug: "laras-anjani", entity: "person", name: "Laras Anjani", role: "Filmmaker", roles: ["Filmmaker", "Artist"],
    based: "Jakarta", image: person5, formIds: ["cf-cinema"], themes: ["Film", "Contemporary Culture"],
    placeId: "pl-jakarta", province: "Jakarta", city: "Jakarta", region: "Java",
    institutionIds: ["in-screen-festival"], availability: "Available for events", emerging: true,
    languages: ["Indonesian", "English", "Japanese"],
    expertise: ["Documentary direction", "Archive film", "Co-production", "Subtitling and register"],
    bio: "Documentary director working between Jakarta and festival circuits, with a practice built on long access rather than fast shoots.",
    intro: "Her films sit with a subject for two seasons before the camera decides anything.",
    whyMatters: "She is part of the first generation of Indonesian directors negotiating co-productions on their own terms.",
    story: [
      "Laras came out of the Jakarta screen scene making shorts on borrowed kit, and now works in co-production with partners in Japan.",
      "She insists on Indonesian-led subtitling, arguing that register carries as much meaning as plot.",
    ],
    works: [
      { title: "Salt season", year: "2025", note: "Feature documentary shot across two harvests." },
      { title: "Two Islands, One Cut", year: "2026", note: "Indonesia–Japan co-production and editing residency." },
    ],
  },
  {
    id: "pe-6", slug: "hendra-mulyadi", entity: "person", name: "Hendra Mulyadi", role: "Writer and oral historian", roles: ["Writer", "Researcher"],
    based: "Banda Neira", image: person6, formIds: ["cf-spice"], themes: ["Literature", "Culinary Culture", "Heritage"],
    placeId: "pl-banda", province: "Maluku", city: "Banda Neira", region: "Maluku",
    institutionIds: ["in-sound-archive"], availability: "Available for research",
    languages: ["Indonesian", "Bandanese", "Dutch", "English"],
    expertise: ["Oral history", "Spice trade archives", "Essay and long form", "Translation"],
    bio: "Collects household spice knowledge in the Banda Islands and writes essays on how a trade route becomes a kitchen.",
    intro: "He records bumbu as method — order of operations, heat curve, substitution — rather than as recipe.",
    whyMatters: "Documenting technique instead of recipes is what makes a cuisine teachable abroad without flattening it.",
    story: [
      "Hendra has interviewed cooks and nutmeg growers across the Banda Islands since 2016.",
      "His essays are published in English and Indonesian simultaneously, with the interviewee credited on each piece.",
    ],
    works: [
      { title: "Spice as infrastructure", year: "2025", note: "Essay series on bumbu as an order of operations." },
    ],
  },
  {
    id: "pe-7", slug: "ratih-kusuma", entity: "person", name: "Ratih Kusuma", role: "Material designer", roles: ["Artist", "Cultural Practitioner"],
    based: "Jakarta", image: person7, formIds: ["cf-design"], themes: ["Craft & Design", "Contemporary Culture"],
    placeId: "pl-jakarta", province: "Jakarta", city: "Jakarta", region: "Java",
    institutionIds: ["in-ruang-baru"], availability: "Open to collaboration", emerging: true,
    languages: ["Indonesian", "English"],
    expertise: ["Rattan and bamboo", "Volcanic stone", "Export design", "Workshop credit systems"],
    bio: "Designs rattan and stone objects for export while keeping the weaving workshop named on the label.",
    intro: "Credit is her design constraint, not her marketing line.",
    whyMatters: "Her studio model shows that keeping the design step — and the attribution — at home is commercially viable.",
    story: [
      "Ratih works with three weaving workshops in Cirebon and publishes the split of who made what.",
      "Buyers in Milan and Tokyo now ask for the workshop credit as part of the product story.",
    ],
    works: [
      { title: "Lontar seating", year: "2025", note: "Rattan series produced with named workshops." },
    ],
  },
  {
    id: "pe-c1", slug: "kaliuda-weaving-community", entity: "community", name: "Kaliuda Weaving Community", localName: "Komunitas Tenun Kaliuda", role: "Weaving community", roles: ["Community", "Tradition Bearer"],
    based: "Kaliuda, East Sumba", image: textileHero, formIds: ["cf-ikat"], themes: ["Craft & Design", "Heritage", "Indigenous Knowledge"],
    placeId: "pl-kaliuda", province: "East Nusa Tenggara", city: "Pahunga Lodu", region: "Lesser Sunda Islands",
    institutionIds: ["in-kaliuda"], availability: "By introduction only", featured: true,
    languages: ["Kambera", "Indonesian"],
    members: "Around forty weaving households",
    generations: "Three generations working, with a formal apprentice cohort since 2019",
    custodianship: "Clan motifs remain the property of the clans that hold them; the community decides collectively which motifs may be photographed, exhibited or reproduced.",
    expertise: ["Warp ikat", "Natural dye gardens", "Collective motif governance"],
    bio: "Forty households on Sumba's south-east coast who weave, dye and decide together what leaves the village.",
    intro: "A weaving community that treats its motifs as governed property, not open pattern.",
    whyMatters: "Their collective decision-making is the reason Sumba ikat has entered international exhibitions with attribution intact.",
    story: [
      "The community organises around the weaving house: apprenticeship, dye gardens and the shared indigo vats are all managed there.",
      "Exhibition loans are agreed in a village meeting, and the terms include naming every weaver involved.",
      "Income from direct sales funds the dye gardens, which are the slowest and least visible part of the work.",
    ],
    works: [
      { title: "Warp & Weft loan", year: "2026", note: "Thirty-one cloths loaned to a London exhibition with full weaver credits." },
    ],
  },
  {
    id: "pe-c2", slug: "sekar-bronze-ensemble", entity: "community", name: "Sekar Bronze Ensemble", localName: "Karawitan Sekar", role: "Gamelan ensemble", roles: ["Community", "Cultural Practitioner"],
    based: "Yogyakarta", image: gamelan, formIds: ["cf-gamelan"], themes: ["Music", "Performing Arts"],
    placeId: "pl-yogya", province: "Special Region of Yogyakarta", city: "Yogyakarta", region: "Java",
    institutionIds: ["in-arts-institute"], availability: "Available for events",
    languages: ["Javanese", "Indonesian", "English"],
    members: "Twenty-six players, ages 17 to 74",
    generations: "Founded by three families; now open membership by audition",
    custodianship: "Court repertoire is performed under the guidance of senior players, and certain ritual pieces are not performed outside their occasion.",
    expertise: ["Court repertoire", "Contemporary commissions", "Instrument maintenance and tuning"],
    bio: "A twenty-six-player ensemble that keeps court repertoire and new commissions on the same rehearsal schedule.",
    intro: "The ensemble rehearses court pieces on Tuesday and new commissions on Thursday, with the same players.",
    whyMatters: "It is a living argument that repertoire and experiment do not need separate institutions.",
    story: [
      "Sekar tours with its own instruments, which is the expensive choice, because the tuning cannot be substituted.",
      "Open rehearsals are free and used as the ensemble's main teaching route for younger players.",
    ],
    works: [
      { title: "Bronze / Circuit", year: "2026", note: "Berlin performance season with live electronics." },
    ],
  },
  {
    id: "pe-c3", slug: "bira-boatwrights", entity: "community", name: "Bira Boatwrights", localName: "Panrita Lopi", role: "Shipbuilding community", roles: ["Community", "Cultural Master"],
    based: "Tanjung Bira, South Sulawesi", image: maritime, formIds: ["cf-phinisi"], themes: ["Heritage", "Craft & Design", "Indigenous Knowledge"],
    placeId: "pl-bira", province: "South Sulawesi", city: "Bonto Bahari", region: "Sulawesi",
    institutionIds: ["in-maritime-centre"], availability: "Available for research",
    languages: ["Konjo", "Indonesian"],
    members: "Roughly sixty builders across eight beach yards",
    generations: "Master builders train sons, nephews and, since 2021, apprentices from outside the family",
    custodianship: "Ritual sequences around keel-laying and launch are held by master builders and are not performed for visitors.",
    expertise: ["Hull-first construction", "Timber selection", "Oral proportional systems"],
    bio: "Konjo master builders and their yards, building wooden schooners hull-first without drawings.",
    intro: "Sixty builders, eight yards, and a body of proportion knowledge that has never needed paper.",
    whyMatters: "This is one of the last large-scale wooden shipbuilding traditions still operating commercially rather than as demonstration.",
    story: [
      "The yards work through the dry season, pausing at midday heat, with families supplying labour across generations.",
      "Since 2024 the community has co-authored documentation of its proportional rules rather than being documented by others.",
    ],
    works: [
      { title: "Hull First exchange", year: "2026", note: "Quarter-scale build with Japanese wooden-boat builders in Tokyo." },
    ],
  },
  {
    id: "pe-c4", slug: "forest-custodians", entity: "community", name: "Upper Kapuas Forest Custodians", localName: "Penjaga Rimba Kapuas Hulu", role: "Customary forest community", roles: ["Community", "Tradition Bearer"],
    based: "Kapuas Hulu, West Kalimantan", image: forest, formIds: ["cf-forest"], themes: ["Indigenous Knowledge", "Heritage"],
    placeId: "pl-kalimantan", province: "West Kalimantan", city: "Putussibau", region: "Kalimantan",
    institutionIds: ["in-maritime-centre"], availability: "By introduction only",
    languages: ["Iban", "Indonesian"],
    members: "Eleven longhouse communities in a shared mapping process",
    generations: "Boundary memory reconciled across three living generations",
    custodianship: "Sacred groves and certain place names are excluded from published maps by community decision.",
    expertise: ["Participatory mapping", "Customary law", "Forest governance"],
    bio: "Eleven longhouse communities mapping customary boundaries and using the maps in negotiation.",
    intro: "Their maps are legal instruments as much as cultural records.",
    whyMatters: "Mapped customary territory changes concession outcomes. The method is published; the sacred sites are not.",
    story: [
      "Mapping walks take weeks and reconcile three generations of remembered boundaries into a single agreed polygon.",
      "The communities publish the methodology openly, on the argument that a technique nobody else can use is a hobby, not a policy.",
    ],
    works: [
      { title: "Adat mapping as enforcement", year: "2024", note: "Co-authored study of mapped versus unmapped territories." },
    ],
  },
];


export const forms: CulturalForm[] = [
  {
    id: "cf-ikat", slug: "sumba-ikat", name: "Sumba ikat", pillar: "heritage", discipline: "Textile", image: textileHero, originPlaceId: "pl-sumba",
    unesco: "Related to the UNESCO-listed Indonesian batik tradition", themes: ["Craft & Design", "Heritage", "Indigenous Knowledge"],
    aliases: ["ikat", "hinggi", "traditional Indonesian textile", "handwoven cloth", "tenun", "weaving", "batik", "songket", "natural dye"],
    summary: "Warp-bound, naturally dyed cloth in which a single hinggi can take two years and encodes clan, rank and cosmology.",
    whatItIs: "Warp ikat is a resist technique: the pattern is tied into the warp threads and dyed before a single weft passes through the loom. The weaver has to see the finished cloth in the bundle of bound threads, years before it exists.",
    practisedIn: "East Sumba, principally the villages of the Kaliuda and Pahunga Lodu coast, with related traditions across Flores, Timor and Savu.",
    whoCarries: "Weaving households, usually organised by clan. Binding, dyeing and weaving are separate specialisms, and a single hinggi commonly passes through four pairs of hands.",
    whyMatters: "A hinggi is a legal and social document as much as a textile: motifs record clan affiliation and rank, and cloths are exchanged at marriage and funeral. Reading one correctly means knowing who is entitled to wear it.",
    today: "Demand from overseas buyers has raised prices and shortened deadlines at the same time. The communities that have held their ground did so by publishing timelines and weaver names alongside the cloth, so that a two-year piece is not priced against a six-week imitation.",
    experienceIt: "Kaliuda's weaving house receives visitors by introduction through the community, not by drop-in. Internationally, thirty-one hinggi travel as the Warp & Weft exhibition in London.",
    sensitivity: "Certain clan motifs may not be photographed, reproduced or worn outside their lineage. Ask before photographing work in progress, and credit the individual weaver rather than the village.",
    sources: [
      { title: "Morinda dye chemistry and the two-year hinggi", author: "R. A. Hàmu, S. Prameswari", year: "2025", note: "Fade data across 24 months of exposure." },
      { title: "Textile exchange and rank on Sumba", author: "Museum Tekstil Jakarta", year: "2023", publisher: "Collection notes" },
    ],
    reviewedBy: "Kaliuda Weaving Community",
    lastReviewed: "2026-01-19",
  },
  {
    id: "cf-gamelan", slug: "gamelan", name: "Gamelan", pillar: "heritage", discipline: "Music", image: gamelan, originPlaceId: "pl-yogya",
    unesco: "Inscribed on the UNESCO Representative List, 2021", themes: ["Music", "Performing Arts", "Heritage"],
    aliases: ["gamelan", "karawitan", "bronze orchestra", "traditional Indonesian music", "gong ensemble"],
    summary: "Tuned bronze ensembles whose interlocking cycles have shaped composers from Debussy to today's electronic producers.",
    whatItIs: "An ensemble of tuned bronze, wood and drums playing cyclic structures marked by the gong. Parts interlock rather than harmonise, and every set is tuned to itself, so instruments from two ensembles cannot be mixed.",
    practisedIn: "Central and East Java, Yogyakarta, Surakarta and Bali, with distinct repertoires and tunings in each; Sundanese and Balinese forms are separate traditions rather than variants.",
    whoCarries: "Court ensembles, village groups, campus karawitan programmes and independent ensembles. Tuning and instrument maintenance is a specialist trade in its own right.",
    whyMatters: "Gamelan is the reason a great deal of twentieth-century Western music sounds the way it does, and it remains a working civic practice in Java rather than a preserved one.",
    today: "Ensembles now move between court repertoire and new commissions with the same players. Touring costs are the constraint: the tuning cannot be substituted, so the instruments travel or the concert does not happen.",
    experienceIt: "Open rehearsals in Yogyakarta are free and public. Bronze / Circuit plays three nights in Berlin.",
    sensitivity: "Some ritual pieces are tied to their occasion and are not performed for audiences. Instruments are stepped over, never on.",
    sources: [
      { title: "Beating frequencies and the perception of gamelan tuning", author: "D. Prayoga, K. Meurer", year: "2024", note: "On what is lost when paired instruments are sampled." },
      { title: "UNESCO Representative List inscription file: Gamelan", year: "2021", publisher: "UNESCO" },
    ],
    reviewedBy: "Sekar Bronze Ensemble",
    lastReviewed: "2026-01-08",
  },
  {
    id: "cf-phinisi", slug: "phinisi", name: "Phinisi shipbuilding", pillar: "heritage", discipline: "Craft", image: maritime, originPlaceId: "pl-bira",
    unesco: "Inscribed on the UNESCO Representative List, 2017", themes: ["Heritage", "Craft & Design", "Indigenous Knowledge"],
    aliases: ["pinisi", "phinisi", "lopi", "wooden ship", "boatbuilding", "maritime heritage", "schooner"],
    summary: "Wooden schooners built without plans by Konjo shipwrights, hull first, from memory and proportion.",
    whatItIs: "Large wooden vessels built hull-first on open beaches. There are no drawings: proportion is held as a set of remembered ratios that the master builder adjusts by eye as the planking rises.",
    practisedIn: "Tanjung Bira, Ara and Lemo-Lemo in Bulukumba, South Sulawesi, where the beach yards run through the dry season.",
    whoCarries: "Konjo master builders — panrita lopi — and their crews. Training passed through family lines until 2021, when the yards opened apprenticeships to outsiders.",
    whyMatters: "This is one of very few large wooden shipbuilding traditions still working commercially rather than as demonstration, and its knowledge has never been written down.",
    today: "Timber supply and the charter market shape what gets built. Since 2024 the builders have been co-authoring documentation of their own proportional rules instead of being documented by visiting researchers.",
    experienceIt: "The Bira yards can be visited during the dry season by arrangement. A quarter-scale build runs with Japanese boatwrights in Tokyo.",
    sensitivity: "Keel-laying and launch rituals are held by the master builder and are not performed for visitors or filmed on request.",
    sources: [
      { title: "Proportional rule systems in Konjo hull construction", author: "B. Lestari, A. Ridwan", year: "2025", note: "Recorded across nine builds at Tanjung Bira." },
    ],
    reviewedBy: "Bira Boatwrights",
    lastReviewed: "2025-12-11",
  },
  {
    id: "cf-temple", slug: "candi-relief", name: "Candi relief carving", pillar: "heritage", discipline: "Architecture", image: heritage, originPlaceId: "pl-borobudur",
    unesco: "Borobudur Temple Compounds, UNESCO World Heritage, 1991", themes: ["Architecture", "Heritage"],
    aliases: ["candi", "temple carving", "stone relief", "borobudur", "prambanan style", "archaeology"],
    summary: "Narrative stone relief as public literature, read clockwise across kilometres of wall.",
    whatItIs: "Narrative carving cut into andesite and arranged so that a visitor walking clockwise reads a continuous story. Borobudur alone holds 2,672 relief panels across several kilometres of wall.",
    practisedIn: "Central Java, principally the Kedu Plain — Borobudur, Mendut and Prambanan — with later traditions in East Java and Bali.",
    whoCarries: "Conservation teams, stone carvers who maintain and replicate panels, and the guides trained to teach the reading direction.",
    whyMatters: "The reliefs were designed to be walked, not viewed. Treating them as architecture rather than illustration changes both how they are read and how they are conserved.",
    today: "Foot traffic is the conservation problem and the purpose of the monument at once. Current management caps visitor numbers and trades volume for guided literacy; visitors taught the reading direction stay roughly four times longer.",
    experienceIt: "Timed entry with a guide at Borobudur; sandals are issued to protect the stone. Sunrise slots are limited and booked well ahead.",
    sensitivity: "Borobudur is an active pilgrimage site, especially at Waisak. Ceremonies are not staged for photography.",
    sources: [
      { title: "Visitor load and stone wear at Borobudur", author: "Borobudur Conservation Office", year: "2024", publisher: "Programme report" },
    ],
    lastReviewed: "2025-11-30",
  },
  {
    id: "cf-spice", slug: "rempah", name: "Rempah kitchens", pillar: "heritage", discipline: "Culinary", image: culinary, originPlaceId: "pl-jakarta",
    themes: ["Culinary Culture", "Heritage"], aliases: ["bumbu", "spice", "rempah", "nutmeg", "indonesian food", "cuisine", "cooking"],
    summary: "The spice logic that reordered global trade, still practised daily in the mortar.",
    whatItIs: "Bumbu is a method rather than a recipe: an order of operations, a heat curve and a set of permitted substitutions that shift by island and by household.",
    practisedIn: "Everywhere, with strong regional grammars — Minang, Manado, Javanese, Balinese and Maluku kitchens each build their base differently.",
    whoCarries: "Home cooks first, then market traders, nutmeg and clove growers, and the writers documenting technique in both languages.",
    whyMatters: "The colonial history of Indonesian spice is well told; the living technique is not. Documenting method is what makes a cuisine teachable abroad without flattening it.",
    today: "Growers in Banda are being recorded alongside cooks, so the supply chain and the kitchen appear in the same account. Publishing in Indonesian and English simultaneously has become standard practice among the better food writers.",
    experienceIt: "Market walks and kitchen sessions run year-round in Jakarta and Ternate; the Banda nutmeg harvest is the season to see growing rather than cooking.",
    sources: [
      { title: "Spice as infrastructure", author: "Hendra Wibowo", year: "2025", note: "Essay series on bumbu as an order of operations." },
    ],
    lastReviewed: "2025-10-02",
  },
  {
    id: "cf-cinema", slug: "new-indonesian-cinema", name: "New Indonesian cinema", pillar: "contemporary", discipline: "Film", image: cinema, originPlaceId: "pl-jakarta",
    themes: ["Film", "Contemporary Culture"], aliases: ["film", "cinema", "movies", "documentary", "screen", "sinema"],
    summary: "A generation of directors working between festival circuits and a fierce domestic box office.",
    whatItIs: "Feature and documentary work made since roughly 2015 by directors who treat the domestic audience as the primary one and the festival circuit as a second market.",
    practisedIn: "Jakarta and Yogyakarta production bases, with regional-language filmmaking growing fastest outside Java.",
    whoCarries: "Independent producers, regional collectives, subtitlers and the film schools feeding both.",
    whyMatters: "Indonesian cinema now sells tickets at home in numbers that make foreign approval optional, which changes what gets made.",
    today: "Translation is the current bottleneck: pronouns and honorifics carry class and intimacy that flatten in subtitles, so the platform funds register-faithful translation rather than literal accuracy.",
    experienceIt: "Eleven features and a shorts programme screen in New York, all newly subtitled.",
    sources: [
      { title: "Register loss in Indonesian screen translation", author: "N. Suryani", year: "2023", note: "Corpus study of 62 subtitled features." },
    ],
    lastReviewed: "2026-01-15",
  },
  {
    id: "cf-performance", slug: "contemporary-performance", name: "Contemporary performance", pillar: "contemporary", discipline: "Dance", image: performance, originPlaceId: "pl-yogya",
    themes: ["Performing Arts", "Contemporary Culture"], aliases: ["dance", "tari", "choreography", "theatre", "performance"],
    summary: "Choreographers who take court vocabularies apart and reassemble them for a black box.",
    whatItIs: "Choreography that works from trained classical vocabulary — Javanese court dance, Balinese forms, martial traditions — and rebuilds it for contemporary stages.",
    practisedIn: "Yogyakarta, Solo, Jakarta and Bali, with an active touring circuit through Australia and Europe.",
    whoCarries: "Choreographers who trained inside court or village traditions before leaving them, and the dancers who hold both techniques at once.",
    whyMatters: "The work argues that tradition is a technique to think with, not a costume to wear, and it is one of the most legible routes into Indonesian practice for foreign audiences.",
    today: "Commissioning is increasingly international while rehearsal stays at home, which raises questions about who is credited on a co-production and where the work premieres.",
    experienceIt: "Body / Court runs in Melbourne; Yogyakarta studios hold open showings through the year.",
    sensitivity: "Some source material remains tied to ritual context and is credited to its teachers by name in the programme.",
    lastReviewed: "2026-01-15",
  },
  {
    id: "cf-design", slug: "material-design", name: "Material design", pillar: "contemporary", discipline: "Design", image: design, originPlaceId: "pl-jakarta",
    themes: ["Craft & Design", "Contemporary Culture"], aliases: ["design", "rattan", "bamboo", "furniture", "craft", "kriya"],
    summary: "Rattan, bamboo and volcanic stone in studios designing for export without flattening origin.",
    whatItIs: "Product and furniture design built on Indonesian material supply — rattan, bamboo, volcanic stone — with the making retained in the workshops that hold the technique.",
    practisedIn: "Jakarta and Bandung studios working with weaving workshops in Cirebon and Central Java.",
    whoCarries: "Designers, and the weaving and stone workshops named alongside them on the label.",
    whyMatters: "For thirty years rattan mostly left the country raw and returned as someone else's furniture. Keeping the design step at home is the difference between a supply chain and an industry.",
    today: "Credit has become the commercial argument: buyers in Milan and Tokyo now ask for the workshop attribution as part of the product story.",
    experienceIt: "Material Futures pairs Indonesian and Brazilian studios in São Paulo.",
    lastReviewed: "2025-11-14",
  },
  {
    id: "cf-sound", slug: "archipelagic-sound", name: "Archipelagic sound", pillar: "contemporary", discipline: "Music", image: abroad, originPlaceId: "pl-jakarta",
    themes: ["Music", "Contemporary Culture"], aliases: ["sound art", "electronic music", "field recording", "musik"],
    summary: "Field recording, bronze and synthesis meeting in clubs and concert halls abroad.",
    whatItIs: "Composition and sound art built from field recording, bronze instruments and electronics, usually made for club, gallery and concert contexts in the same year.",
    practisedIn: "Jakarta, Yogyakarta and Bandung, with a steady presence at European festivals.",
    whoCarries: "Composers, producers and the ensembles that lend them instruments and players.",
    whyMatters: "It is the clearest counter-argument to the idea that Indonesian music is a heritage category.",
    today: "Artists resist the fusion label: the interest is in tuning systems and cycles, not in decoration.",
    experienceIt: "Bronze / Circuit in Berlin, including a free open rehearsal.",
    lastReviewed: "2026-01-22",
  },
  {
    id: "cf-wayang", slug: "wayang", name: "Wayang", pillar: "heritage", discipline: "Performance", image: performance, originPlaceId: "pl-yogya",
    unesco: "Inscribed on the UNESCO Representative List, 2008", themes: ["Performing Arts", "Heritage", "Literature"],
    aliases: ["shadow puppetry", "shadow puppets", "wayang kulit", "puppet theatre", "dalang", "puppetry"],
    summary: "Shadow puppet theatre in which one dalang voices every character across a night-long performance, accompanied by gamelan.",
    whatItIs: "Shadow theatre performed against a lit screen with leather puppets. A single dalang manipulates every figure, voices every character, cues the gamelan and improvises commentary, usually from dusk until dawn.",
    practisedIn: "Central and East Java and Bali, with distinct puppet styles, repertoires and languages in each.",
    whoCarries: "Dalang and their households, the gamelan players who accompany them, and the puppet makers who cut and paint the leather.",
    whyMatters: "Wayang is where epic literature, political satire and religious teaching have met in public for centuries; the dalang's improvised commentary is still where audiences expect to hear the present discussed.",
    today: "All-night performances compete with shorter formats and screen audiences. Younger dalang are performing edited sets and streaming them, which extends reach and shortens the form at the same time.",
    experienceIt: "Village and palace performances in Yogyakarta and Solo, most often tied to a commissioning occasion rather than a ticketed season.",
    sensitivity: "Performances are frequently commissioned for a specific occasion — a marriage, a vow fulfilled — and attending is being a guest, not buying a ticket.",
    sources: [
      { title: "UNESCO Representative List inscription file: Wayang puppet theatre", year: "2008", publisher: "UNESCO" },
    ],
    lastReviewed: "2025-12-04",
  },
  {
    id: "cf-forest", slug: "forest-stewardship", name: "Forest stewardship", pillar: "research", discipline: "Ecology", image: forest, originPlaceId: "pl-kalimantan",
    themes: ["Indigenous Knowledge", "Heritage"], aliases: ["adat", "customary law", "forest", "ecology", "dayak", "indigenous knowledge", "mapping"],
    summary: "Customary law, mapping and the case for indigenous authority over the Heart of Borneo.",
    whatItIs: "Customary governance of forest territory: boundaries held in memory and song, reconciled through participatory mapping into polygons that hold up in negotiation.",
    practisedIn: "Kapuas Hulu, West Kalimantan, across eleven longhouse communities in the Heart of Borneo.",
    whoCarries: "Longhouse communities and their customary councils, working with lawyers and cartographers on their own terms.",
    whyMatters: "Mapped customary territory measurably changes concession outcomes. This is cultural knowledge functioning as legal instrument.",
    today: "The communities publish their methodology openly, on the argument that a technique nobody else can use is a hobby rather than a policy. Sacred groves and certain place names are deliberately excluded from published maps.",
    experienceIt: "Field visits are arranged through the customary councils and are research visits, not tourism.",
    sensitivity: "Sacred sites are withheld from maps by community decision. Do not request their locations.",
    sources: [
      { title: "Adat mapping as enforcement: evidence from Kalimantan", author: "B. Lestari, M. Iban", year: "2024", note: "Outcomes across 47 mapped and 51 unmapped territories." },
    ],
    reviewedBy: "Upper Kapuas Forest Custodians",
    lastReviewed: "2025-09-26",
  },
];

const storiesSource: Story[] = [
  {
    id: "st-1",
    slug: "two-years-in-a-single-cloth",
    author: "Sari Prameswari",
    authorRole: "Contributing editor, textiles",
    reviewedBy: "Kaliuda Weaving Community",
    updatedAt: "2026-02-11",
    sources: [
      { title: "Morinda dye chemistry and the two-year hinggi", author: "R. A. Hàmu, S. Prameswari", year: "2025" },
    ],
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
    author: "Daniel Prayoga",
    authorRole: "Music editor",
    reviewedBy: "Sekar Bronze Ensemble",
    updatedAt: "2026-01-27",
    sources: [
      { title: "Beating frequencies and the perception of gamelan tuning", author: "D. Prayoga, K. Meurer", year: "2024" },
    ],
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
    author: "Andi Ridwan",
    authorRole: "Maritime correspondent",
    reviewedBy: "Bira Boatwrights",
    updatedAt: "2026-01-06",
    sources: [
      { title: "Proportional rule systems in Konjo hull construction", author: "B. Lestari, A. Ridwan", year: "2025" },
    ],
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
    author: "Nadia Suryani",
    authorRole: "Screen editor",
    updatedAt: "2025-12-18",
    sources: [
      { title: "Register loss in Indonesian screen translation", author: "N. Suryani", year: "2023" },
    ],
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
    author: "Bella Lestari",
    authorRole: "Research editor",
    reviewedBy: "Upper Kapuas Forest Custodians",
    updatedAt: "2025-12-02",
    sources: [
      { title: "Adat mapping as enforcement: evidence from Kalimantan", author: "B. Lestari, M. Iban", year: "2024" },
    ],
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
    author: "Sari Prameswari",
    authorRole: "Contributing editor, design",
    updatedAt: "2025-11-20",
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
    author: "Editorial team",
    authorRole: "Dispatch",
    updatedAt: "2025-11-04",
    sources: [
      { title: "Visitor load and stone wear at Borobudur", author: "Borobudur Conservation Office", year: "2024" },
    ],
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
    author: "Hendra Wibowo",
    authorRole: "Food writer",
    updatedAt: "2025-10-14",
    sources: [
      { title: "Spice as infrastructure", author: "Hendra Wibowo", year: "2025" },
    ],
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
  {
    id: "st-gamelan-essential", slug: "what-is-gamelan", title: "What Is Gamelan?",
    dek: "A clear introduction to Indonesia’s family of bronze ensembles, their tuning, instruments and social setting.",
    kind: "Feature", deliveryType: "Knowledge", contentSource: "Internal", topics: ["Music"], readingMinutes: 6,
    publishedAt: "2026-02-20", image: gamelan, imageAlt: "Musicians seated around a bronze gamelan ensemble",
    body: ["Gamelan is not one fixed orchestra but a family of ensemble traditions found across Java, Bali and other parts of Indonesia.", "Its instruments are built and tuned as a set. The relationships between tones, players and occasions matter as much as any single instrument."],
    formIds: ["cf-gamelan"], peopleIds: ["pe-2", "pe-c2"], placeIds: ["pl-yogya"], author: "Indonesia Vibes editorial team",
  },
  {
    id: "st-gamelan-deep", slug: "understanding-gamelan-beyond-the-orchestra", title: "Understanding Gamelan Beyond the Orchestra",
    dek: "How tuning, collective attention and community practice make gamelan a social form as well as a musical one.",
    kind: "Feature", deliveryType: "Semantic", contentSource: "Internal", topics: ["Music"], readingMinutes: 10,
    publishedAt: "2026-02-18", image: gamelan, imageAlt: "Bronze instruments and players during a gamelan rehearsal",
    body: ["To understand gamelan only as sound is to miss the relationships that sustain it.", "Ensembles are tuned together, learned together and carried through rehearsal, ceremony and experimentation."],
    formIds: ["cf-gamelan"], peopleIds: ["pe-2", "pe-c2"], placeIds: ["pl-yogya"], author: "Indonesia Vibes editorial team",
  },
  {
    id: "st-gamelan-perspective", slug: "gamelan-global-cultural-language", title: "How Gamelan Became a Global Cultural Language",
    dek: "What changes when an ensemble travels—and why exchange works best when knowledge, credit and relationships travel with it.",
    kind: "Feature", deliveryType: "Pragmatic", contentSource: "Internal", topics: ["Music", "Cultural Exchange"], readingMinutes: 9,
    publishedAt: "2026-02-16", image: gamelan, imageAlt: "A gamelan ensemble prepared for an international performance",
    body: ["Gamelan’s global presence is not simply a story of export. It is a network of teachers, students, institutions and long-term exchange.", "Its strongest international future depends on keeping those relationships visible."],
    formIds: ["cf-gamelan"], peopleIds: ["pe-2", "pe-c2"], placeIds: ["pl-yogya", "pl-berlin"], author: "Indonesia Vibes editorial team",
    sources: [{ title: "Beating frequencies and the perception of gamelan tuning", author: "D. Prayoga, K. Meurer", year: "2024" }],
  },
  {
    id: "st-civilization-essential", slug: "introduction-early-civilizations-indonesian-archipelago", title: "An Introduction to Early Civilizations in the Indonesian Archipelago",
    dek: "A starting point for the ports, kingdoms, belief systems and communities that shaped the archipelago.",
    kind: "Feature", deliveryType: "Knowledge", contentSource: "Internal", topics: ["History & Civilization"], readingMinutes: 7,
    publishedAt: "2026-02-14", image: heritage, imageAlt: "Carved stone reliefs recording life in the Indonesian archipelago",
    body: ["The Indonesian archipelago has long been connected by sea, trade, language and belief.", "Its early civilizations developed through local knowledge and sustained contact across Asia and the Indian Ocean."],
    formIds: ["cf-temple"], peopleIds: [], placeIds: ["pl-borobudur"], author: "Indonesia Vibes research desk",
  },
  {
    id: "st-civilization-deep", slug: "maritime-networks-shaped-archipelago-civilizations", title: "How Maritime Networks Shaped Civilizations Across the Archipelago",
    dek: "Ports and sea routes connected local societies to one another and to wider worlds without making them culturally uniform.",
    kind: "Feature", deliveryType: "Semantic", contentSource: "Internal", topics: ["History & Civilization", "Maritime Culture"], readingMinutes: 11,
    publishedAt: "2026-02-12", image: maritime, imageAlt: "A traditional wooden vessel crossing Indonesian waters",
    body: ["Water joined the archipelago long before modern roads did.", "Maritime networks moved objects and ideas, while communities adapted them through local institutions and languages."],
    formIds: ["cf-phinisi", "cf-temple"], peopleIds: ["pe-4"], placeIds: ["pl-bira", "pl-borobudur"], author: "Indonesia Vibes research desk",
  },
  {
    id: "st-civilization-perspective", slug: "indonesia-story-world-ancient-civilizations", title: "Indonesia and the Story of the World’s Ancient Civilizations",
    dek: "Why global histories become more accurate when the archipelago is treated as a centre of exchange, not a distant edge.",
    kind: "Feature", deliveryType: "Pragmatic", contentSource: "Internal", topics: ["History & Civilization", "Cultural Exchange"], readingMinutes: 10,
    publishedAt: "2026-02-10", image: heritage, imageAlt: "Historic stone reliefs depicting exchange and daily life",
    body: ["Evidence supports a long history of complex societies and international exchange across the archipelago.", "The careful claim is not that one civilization owns the world’s oldest story, but that global history is incomplete without Indonesia’s many centres."],
    formIds: ["cf-temple", "cf-phinisi"], peopleIds: ["pe-4"], placeIds: ["pl-borobudur", "pl-bira"], author: "Indonesia Vibes editorial board",
    sources: [{ title: "Proportional rule systems in Konjo hull construction", author: "B. Lestari, A. Ridwan", year: "2025" }],
  },
  {
    id: "st-textiles-essential", slug: "understanding-batik-ikat-songket", title: "Understanding Batik, Ikat, and Songket",
    dek: "Three textile traditions, three different techniques—and many distinct communities, meanings and histories.",
    kind: "Feature", deliveryType: "Knowledge", contentSource: "Internal", topics: ["Textiles", "Heritage & Traditions"], readingMinutes: 7,
    publishedAt: "2026-02-08", image: textileHero, imageAlt: "Indigo textile threads prepared on a traditional loom",
    body: ["Batik, ikat and songket are not interchangeable labels for Indonesian cloth.", "Each names a different process, and each process varies across the communities that practise it."],
    formIds: ["cf-ikat"], peopleIds: ["pe-1", "pe-c1"], placeIds: ["pl-sumba"], author: "Indonesia Vibes editorial team",
  },
  {
    id: "st-textiles-deep", slug: "many-lives-indonesian-textiles", title: "The Many Lives of Indonesian Textiles",
    dek: "Cloth can be clothing, inheritance, ceremony, livelihood, archive and contemporary design material at once.",
    kind: "Feature", deliveryType: "Semantic", contentSource: "By Curation", sourceAttribution: "Kaliuda Weaving Community", topics: ["Textiles", "Craft & Design"], readingMinutes: 12,
    publishedAt: "2026-02-06", image: textileHero, imageAlt: "A handwoven textile being examined in natural light",
    body: ["A textile changes meaning as it moves between household, ceremony, market, museum and runway.", "Following those lives reveals how value, authority and credit are negotiated."],
    formIds: ["cf-ikat"], peopleIds: ["pe-1", "pe-c1", "pe-3"], placeIds: ["pl-sumba"], author: "Curated by Indonesia Vibes",
    sources: [{ title: "Morinda dye chemistry and the two-year hinggi", author: "R. A. Hàmu, S. Prameswari", year: "2025" }],
  },
  {
    id: "st-textiles-perspective", slug: "textile-traditions-future-indonesian-design", title: "Why Textile Traditions Matter to the Future of Indonesian Design",
    dek: "The strongest design futures do not extract pattern; they sustain the people, materials and authority behind it.",
    kind: "Feature", deliveryType: "Pragmatic", contentSource: "Internal", topics: ["Textiles", "Craft & Design"], readingMinutes: 9,
    publishedAt: "2026-02-04", image: design, imageAlt: "Textile and material samples in an Indonesian design studio",
    body: ["Tradition is not a pattern library. It is a system of knowledge, labour and permission.", "Design becomes more original—not less—when it works within those relationships and credits them clearly."],
    formIds: ["cf-ikat", "cf-design"], peopleIds: ["pe-1", "pe-7"], placeIds: ["pl-sumba", "pl-jakarta"], author: "Indonesia Vibes design desk",
    sources: [{ title: "Morinda dye chemistry and the two-year hinggi", author: "R. A. Hàmu, S. Prameswari", year: "2025" }],
  },
];

export const collections: Collection[] = [
  { id: "co-1", slug: "made-slowly", title: "Made slowly", dek: "Six stories about work that resists compression: ikat, phinisi, stone, dye.", image: textileHero, storyIds: ["st-1", "st-3", "st-7"], formIds: ["cf-ikat", "cf-phinisi", "cf-temple"] },
  { id: "co-2", slug: "loud-decade", title: "A loud decade", dek: "Cinema, sound and performance made in the last ten years, and where it travelled.", image: cinema, storyIds: ["st-2", "st-4", "st-6"], formIds: ["cf-cinema", "cf-sound", "cf-design"] },
  { id: "co-3", slug: "who-holds-the-knowledge", title: "Who holds the knowledge", dek: "Attribution, restitution and the politics of credit across the archipelago.", image: forest, storyIds: ["st-5", "st-1", "st-8"], formIds: ["cf-forest", "cf-ikat", "cf-spice"] },
];

const eventsSource: CulturalEvent[] = [
  {
    id: "ev-1", slug: "warp-and-weft-london", title: "Warp & Weft: Two Years in a Cloth", type: "Exhibition",
    startDate: "2026-02-10", endDate: "2026-05-24", placeId: "pl-london", image: exhibition, formIds: ["cf-ikat"], live: true,
    peopleIds: ["pe-1", "pe-c1"],
    summary: "Thirty-one hinggi from East Sumba, shown with the names and timelines of every weaver.",
    organiser: "Indonesia Vibes with the Kaliuda Weaving Community",
    venue: "Textile Hall, South Kensington",
    localTime: "Tue–Sun, 10:00–18:00; Thursdays until 21:00",
    timeZone: "GMT",
    admission: "Free, timed entry",
    audience: "General visitors, textile specialists, school groups",
    programme: [
      "Thirty-one hinggi kombu, each captioned with its weaver, binding season and dye cycle",
      "Weekly loom demonstration by a visiting weaver from Kaliuda (Saturdays, 14:00)",
      "Curators' walkthrough on the first Thursday of each month",
      "Schools programme for Key Stage 3 and above, booked through the venue",
    ],
    context: "The exhibition is a loan agreed in a village meeting, on terms that require every weaver involved to be named. It is the first time these cloths have travelled with their production timelines published alongside them.",
    lastChecked: "2026-02-16",
  },
  {
    id: "ev-2", slug: "bronze-circuit-berlin", title: "Bronze / Circuit", type: "Performance",
    startDate: "2026-03-06", endDate: "2026-03-08", placeId: "pl-berlin", image: gamelan, formIds: ["cf-gamelan", "cf-sound"],
    peopleIds: ["pe-2", "pe-c2"],
    summary: "Full gamelan and modular synthesis across three nights, with an open rehearsal on the Saturday.",
    organiser: "Sekar Bronze Ensemble with a Berlin concert-hall partner",
    venue: "Chamber hall, Mitte",
    localTime: "Doors 19:00, performance 20:00; open rehearsal Saturday 11:00",
    timeZone: "CET",
    admission: "Ticketed; open rehearsal free",
    audience: "Concert audiences, composers, students",
    programme: [
      "Friday: court repertoire, played on the ensemble's own tuning",
      "Saturday: open rehearsal, then the première of a new commission with live electronics",
      "Sunday: full programme with a post-show conversation about tuning and sampling",
    ],
    context: "The ensemble tours with its own instruments because the tuning cannot be substituted — a cost that shapes the whole programme.",
    lastChecked: "2026-02-11",
  },
  {
    id: "ev-3", slug: "new-cinema-nyc", title: "New Indonesian Cinema", type: "Screening",
    startDate: "2026-04-02", endDate: "2026-04-12", placeId: "pl-nyc", image: cinema, formIds: ["cf-cinema"],
    peopleIds: ["pe-4"],
    summary: "Eleven features and a shorts programme, all newly subtitled with register-faithful translation.",
    organiser: "Indonesia Vibes with a New York cinémathèque partner",
    venue: "Two screens, Lower Manhattan",
    localTime: "Evening screenings from 18:30; weekend matinées from 14:00",
    timeZone: "EDT",
    admission: "Ticketed, with a pass for the full season",
    audience: "Cinema audiences, programmers, translators",
    programme: [
      "Eleven features made since 2019, four in regional languages",
      "A shorts programme from regional collectives outside Java",
      "Director Q&As on the opening and closing weekends",
      "A translators' panel on pronouns, honorifics and register in subtitling",
    ],
    context: "Every film in the season was re-subtitled for this programme; the previous English versions flattened honorifics that carry class and intimacy in the original.",
    lastChecked: "2026-02-09",
  },
  {
    id: "ev-4", slug: "hull-first-tokyo", title: "Hull First: Konjo Boatbuilding", type: "Workshop",
    startDate: "2026-04-18", endDate: "2026-04-20", placeId: "pl-tokyo", image: maritime, formIds: ["cf-phinisi"],
    peopleIds: ["pe-c3"],
    summary: "Three days with two Bira shipwrights and Japanese wooden-boat builders, working at quarter scale.",
    organiser: "Bira Boatwrights with a Tokyo maritime museum",
    venue: "Boatbuilding shed, waterfront",
    localTime: "09:00–17:00 daily; public viewing 15:00–17:00",
    timeZone: "JST",
    admission: "Participation by application; public viewing free",
    audience: "Boatbuilders, conservators, maritime researchers",
    programme: [
      "Day one: timber selection and the oral proportional system, explained by the master builder",
      "Day two: hull-first planking at quarter scale, worked alongside Japanese builders",
      "Day three: comparison of fairing methods, with a public viewing session",
    ],
    context: "Both traditions build without drawings. The exchange tests whether two oral proportional systems can be described to each other without either being written into the other's terms.",
    lastChecked: "2026-02-05",
  },
  {
    id: "ev-5", slug: "body-court-melbourne", title: "Body / Court", type: "Performance",
    startDate: "2026-05-14", endDate: "2026-05-16", placeId: "pl-melbourne", image: performance, formIds: ["cf-performance"],
    summary: "Two choreographers dismantle Javanese court vocabulary for a black-box stage.",
    organiser: "Indonesia Vibes with a Melbourne dance house",
    venue: "Black-box theatre, Southbank",
    localTime: "19:30 nightly; Saturday matinée 15:00",
    timeZone: "AEST",
    admission: "Ticketed",
    audience: "Dance audiences, choreographers, students",
    programme: [
      "Two new works, each around forty minutes, shown on the same bill",
      "A studio showing of the rehearsal process on the Friday afternoon",
      "Post-show conversation with both choreographers on the Saturday",
    ],
    context: "Both choreographers trained inside court traditions before leaving them. Their teachers are credited by name in the programme.",
    lastChecked: "2026-02-02",
  },
  {
    id: "ev-6", slug: "material-futures-sao-paulo", title: "Material Futures", type: "Exhibition",
    startDate: "2026-06-01", endDate: "2026-08-30", placeId: "pl-saopaulo", image: design, formIds: ["cf-design"],
    peopleIds: ["pe-3", "pe-7"],
    summary: "Indonesian and Brazilian studios on tropical material practice, credit and export.",
    organiser: "Indonesia Vibes with a São Paulo design institute",
    venue: "Design institute, Jardins",
    localTime: "Tue–Sun, 11:00–19:00",
    timeZone: "BRT",
    admission: "Free",
    audience: "Designers, buyers, students, general visitors",
    programme: [
      "Work from six Indonesian and five Brazilian studios, with every producing workshop named",
      "A materials room comparing rattan, bamboo and volcanic stone supply chains",
      "Monthly talks on attribution and export pricing",
    ],
    context: "The exhibition's organising question is commercial as much as curatorial: what changes when the workshop that made an object appears on the label next to the designer.",
    lastChecked: "2026-01-28",
  },
  {
    id: "ev-7", slug: "south-south-textiles-nairobi", title: "South–South Textiles", type: "Residency",
    startDate: "2026-07-05", endDate: "2026-09-05", placeId: "pl-nairobi", image: textileHero, formIds: ["cf-ikat"],
    peopleIds: ["pe-c1"],
    summary: "Eight weeks pairing Sumba weavers with Kenyan dyers around natural pigment research.",
    organiser: "Indonesia Vibes with a Nairobi textile studio",
    venue: "Studio and dye garden, Karen",
    localTime: "Working residency; public open days on the final weekend of each month",
    timeZone: "EAT",
    admission: "Open days free; residency by selection",
    audience: "Dyers, weavers, material researchers",
    programme: [
      "Eight weeks of paired work between two Sumba weavers and three Kenyan dyers",
      "Comparative trials on morinda, indigo and local pigment sources",
      "Monthly open days with the dye garden in use",
      "A jointly authored technical note published at the close",
    ],
    context: "The residency treats dye chemistry as the shared language: both traditions depend on plants, water and time rather than on equipment.",
    lastChecked: "2026-01-24",
  },

  /* ---------- source-provided upcoming activity (2026) ----------
   * Supplied by the project team as real calendar dates. These records are NOT
   * part of the rolling prototype calendar (`fixedDate`), and they carry only
   * confirmed information: venue, organiser, programme, partners and official
   * sources stay absent until verified. `needsVerification` is internal.
   */
  {
    id: "ev-8", slug: "syeikh-yusuf-netherlands", title: "Syeikh Yusuf Exhibition and Seminar",
    workingTitle: true, type: "Exhibition & Seminar", fixedDate: true,
    startDate: "2026-10-08", endDate: "2026-10-12", formIds: [],
    location: { country: "Netherlands", lat: 52.13, lng: 5.29, continent: "Europe" },
    sourceNote: "Pameran dan seminar Syeikh Yusuf, Belanda",
    needsVerification: ["City", "Venue", "Organiser", "Programme", "Official source", "Registration or access information", "Partners"],
  },
  {
    id: "ev-9", slug: "indonesia-megadiversity-fire-and-ash", title: "Indonesia Megadiversity: Fire and Ash",
    fixedDate: true, startDate: "2026-10-20", endDate: "2026-10-26", formIds: [],
    location: { city: "Chicago", country: "United States", lat: 41.878, lng: -87.63, continent: "Americas" },
    needsVerification: ["Venue", "Organiser", "Event format", "Programme description", "Official source", "Registration or access", "Partners"],
  },
  {
    id: "ev-10", slug: "russia-east-festival-kazan", title: "The 5th International Festival of National Cultures \u201cRussia-East\u201d",
    type: "Festival", fixedDate: true, startDate: "2026-11-21", formIds: [],
    location: { city: "Kazan", country: "Russia", lat: 55.796, lng: 49.106, continent: "Europe" },
    needsVerification: ["Venue", "Indonesian programme", "Participating artists", "Organiser", "Official source", "Partners"],
  },
  {
    id: "ev-11", slug: "venice-biennale-closing", title: "Venice Biennale \u2014 Closing",
    workingTitle: true, fixedDate: true, startDate: "2026-11-22", formIds: [],
    location: { city: "Venice", country: "Italy", lat: 45.438, lng: 12.327, continent: "Europe" },
    needsVerification: ["Specific Biennale programme", "Indonesian participation context", "Venue", "Organiser", "Official source", "Participating artists or institutions"],
  },
  {
    id: "ev-12", slug: "al-burda-award", title: "Al Burda Award",
    type: "Award", fixedDate: true, startDate: "2026-11-24", formIds: [],
    location: { city: "Abu Dhabi", country: "United Arab Emirates", lat: 24.453, lng: 54.377, continent: "Asia" },
    needsVerification: ["Venue", "Indonesia-related participation", "Programme", "Organiser", "Official source", "Participating people or institutions"],
  },
  {
    id: "ev-13", slug: "turkey-international-book-fair", title: "Turkey International Book Fair",
    workingTitle: true, type: "Book Fair", fixedDate: true,
    startDate: "2026-12-01", datePrecision: "month", formIds: [],
    location: { country: "T\u00fcrkiye", lat: 39.0, lng: 35.24, continent: "Asia" },
    needsVerification: ["Official event name", "Exact dates", "City", "Venue", "Indonesian participation", "Organiser", "Programme", "Official source", "Partners"],
  },
];


export const papers: ResearchPaper[] = [
  { id: "rp-1", title: "Proportional rule systems in Konjo hull construction", authors: "B. Lestari, A. Ridwan", year: 2025, discipline: "Maritime history", abstract: "A first formal notation for the oral ratios governing phinisi hull fairing, recorded across nine builds at Tanjung Bira." },
  { id: "rp-2", title: "Morinda dye chemistry and the two-year hinggi", authors: "R. A. Hàmu, S. Prameswari", year: 2025, discipline: "Material science", abstract: "Why compression of the mordanting cycle degrades colourfastness, with fade data across 24 months of exposure." },
  { id: "rp-3", title: "Adat mapping as enforcement: evidence from Kalimantan", authors: "B. Lestari, M. Iban", year: 2024, discipline: "Environmental law", abstract: "Concession outcomes in 47 mapped versus 51 unmapped customary territories between 2016 and 2023." },
  { id: "rp-4", title: "Beating frequencies and the perception of gamelan tuning", authors: "D. Prayoga, K. Meurer", year: 2024, discipline: "Acoustics", abstract: "Measuring what is lost when paired instruments are sampled rather than played, and why audiences notice." },
  { id: "rp-5", title: "Register loss in Indonesian screen translation", authors: "N. Suryani", year: 2023, discipline: "Translation studies", abstract: "A corpus study of 62 subtitled features, and a proposed style guide for pronoun and honorific handling." },
];

/* ---------- rolling prototype calendar ----------
 * Authored dates are relative to the anchor below. Every date in the demo
 * dataset is shifted by the same whole number of days so the calendar, the
 * statuses and the freshness model stays truthful whenever the prototype is opened.
 */
const PROTOTYPE_ANCHOR = "2026-02-16";

const dayShift = (() => {
  const anchor = Date.UTC(2026, 1, 16);
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((today - anchor) / 86_400_000);
})();

const roll = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  const shifted = new Date(Date.UTC(y, m - 1, d + dayShift));
  return shifted.toISOString().slice(0, 10);
};

export const prototypeAnchor = PROTOTYPE_ANCHOR;

export const stories: Story[] = storiesSource.map((s) => ({
  ...s,
  deliveryType: s.deliveryType ?? (s.kind === "Dispatch" ? "Knowledge" : s.kind === "Feature" ? "Semantic" : "Pragmatic"),
  contentSource: s.contentSource ?? "Internal",
  topics: s.topics ?? [...new Set(s.formIds.flatMap((id) => forms.find((f) => f.id === id)?.themes ?? []))],
  publishedAt: roll(s.publishedAt),
  ...(s.updatedAt ? { updatedAt: roll(s.updatedAt) } : {}),
}));

export const events: CulturalEvent[] = eventsSource.map((e) =>
  e.fixedDate
    ? e
    : {
        ...e,
        startDate: roll(e.startDate),
        ...(e.endDate ? { endDate: roll(e.endDate) } : {}),
        ...(e.lastChecked ? { lastChecked: roll(e.lastChecked) } : {}),
      },
);

const authoredWorldNodes: WorldNode[] = [
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

/**
 * Events that carry their own geography become map locations automatically, so
 * a location on Indonesia Around the World is never a second copy of an event.
 * Several activities in one place are grouped into a single location.
 */
const derivedWorldNodes: WorldNode[] = (() => {
  const groups = new Map<string, WorldNode>();
  for (const e of events) {
    if (!e.location) continue;
    const key = `${e.location.city ?? ""}|${e.location.country}`;
    const existing = groups.get(key);
    if (existing) {
      existing.eventIds.push(e.id);
      existing.programme = `${existing.eventIds.length} activities listed`;
      continue;
    }
    groups.set(key, {
      id: `wn-ev-${e.id}`,
      city: e.location.city ?? e.location.country,
      country: e.location.country,
      continent: e.location.continent,
      lat: e.location.lat,
      lng: e.location.lng,
      programme: e.title,
      eventIds: [e.id],
      status: e.startDate >= new Date().toISOString().slice(0, 10) ? "Upcoming" : "Archive",
    });
  }
  return [...groups.values()];
})();

export const worldNodes: WorldNode[] = [...authoredWorldNodes, ...derivedWorldNodes];



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

/** Month and year only, for records where the exact dates are not confirmed. */
export const formatMonth = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The one place event dates are turned into words. A record with month-only
 * precision reads "December 2026" — never an invented day.
 */
export const formatEventDates = (event: CulturalEvent) => {
  if (event.datePrecision === "month") return formatMonth(event.startDate);
  if (!event.endDate || event.endDate === event.startDate) return formatDate(event.startDate);
  return formatRange(event.startDate, event.endDate);
};

/** City and country as far as they are confirmed. */
export const eventLocationLabel = (event: CulturalEvent) => {
  const place = event.placeId ? placeMap.get(event.placeId) : undefined;
  if (place) return [place.city ?? place.name, place.country].filter(Boolean).join(", ");
  if (event.location) return [event.location.city, event.location.country].filter(Boolean).join(", ");
  return "";
};

export const eventCountry = (event: CulturalEvent) =>
  (event.placeId ? placeMap.get(event.placeId)?.country : undefined) ?? event.location?.country ?? "";

/** Internal: records whose operational fields are not yet confirmed. */
export const eventsNeedingVerification = () =>
  events.filter((e) => (e.needsVerification?.length ?? 0) > 0);

/** Derived from the dates, so the label never contradicts the calendar. */
export type EventStatus = "Upcoming" | "On now" | "Past";

export const eventStatus = (event: CulturalEvent, now: Date = new Date()): EventStatus => {
  const start = new Date(event.startDate + "T00:00:00Z").getTime();
  const lastDay =
    event.datePrecision === "month"
      ? new Date(Date.UTC(new Date(event.startDate + "T00:00:00Z").getUTCFullYear(), new Date(event.startDate + "T00:00:00Z").getUTCMonth() + 1, 0)).toISOString().slice(0, 10)
      : (event.endDate ?? event.startDate);
  const end = new Date(lastDay + "T23:59:59Z").getTime();

  const t = now.getTime();
  if (t < start) return "Upcoming";
  if (t > end) return "Past";
  return "On now";
};

export const deadlineStatus = (iso: string, now: Date = new Date()) => {
  const due = new Date(iso + "T23:59:59Z").getTime();
  const days = Math.ceil((due - now.getTime()) / 86_400_000);
  if (days < 0) return { label: "Closed", state: "Closed" as const, open: false, days };
  if (days === 0) return { label: "Closes today", state: "Closing soon" as const, open: true, days };
  if (days <= 21)
    return {
      label: `Closes in ${days} day${days === 1 ? "" : "s"}`,
      state: "Closing soon" as const,
      open: true,
      days,
    };
  return { label: `Open until ${formatDate(iso)}`, state: "Open" as const, open: true, days };
};
