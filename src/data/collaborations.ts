import type { Collaboration } from "@/types/content";

import cinema from "@/assets/cinema.jpg";
import gamelan from "@/assets/gamelan.jpg";
import maritime from "@/assets/maritime.jpg";
import textileHero from "@/assets/textile-hero.jpg";
import design from "@/assets/design.jpg";

/**
 * Prototype collaboration records. Partners, dates and outcomes are
 * illustrative demo content and do not describe real agreements.
 */
export const collaborations: Collaboration[] = [
  {
    id: "cl-jp-film",
    slug: "indonesia-japan-film-exchange",
    title: "Indonesia–Japan Film Exchange",
    type: "Film Collaboration",
    status: "Active",
    countries: ["Indonesia", "Japan"],
    regions: ["Asia"],
    years: "2024 – 2027",
    image: cinema,
    featured: true,
    intro:
      "A three-year exchange pairing Indonesian and Japanese documentary makers around shared editing residencies, festival slots and an Indonesian-led subtitling standard.",
    objectives: [
      "Move co-production decisions — final cut, subtitle register, festival strategy — into shared hands.",
      "Build a working subtitle style guide for Indonesian regional languages into Japanese and English.",
      "Give early-career directors on both sides a second market without a distributor in between.",
    ],
    themes: ["Film", "Contemporary Culture"],
    indonesianPartnerIds: ["in-screen-festival"],
    internationalPartners: [
      { name: "Setagaya Documentary Forum", country: "Japan", city: "Tokyo", type: "Festival Organisation" },
      { name: "Kansai Screen Archive", country: "Japan", city: "Osaka", type: "Archive" },
    ],
    timeline: [
      { period: "2024", label: "Exchange agreed", note: "Two festivals set shared selection criteria and a translation standard." },
      { period: "2025", label: "First editing residency", note: "Four directors, eight weeks, split between Jakarta and Tokyo." },
      { period: "2026", label: "Touring season", note: "Eleven features screened in New York and Tokyo with new subtitles." },
      { period: "2027", label: "Review", note: "Both partners assess whether the co-production lab becomes permanent." },
    ],
    activities: [
      "Paired editing residencies",
      "Joint festival selection panel",
      "Subtitle style guide workshops",
      "Public masterclasses in both cities",
    ],
    peopleIds: ["pe-5", "pe-3"],
    outputs: [
      "Two co-produced feature documentaries",
      "A published Indonesian–Japanese–English subtitling style guide",
      "A touring screening programme of eleven features",
    ],
    outcomes: [
      "A standing co-production lab that now runs annually",
      "Indonesian-led subtitling adopted by three further festival partners",
      "Two directors placed in ongoing international distribution conversations",
    ],
    eventIds: ["ev-3"],
    storyIds: ["st-2"],
    formIds: ["cf-cinema"],
    placeIds: ["pl-jakarta", "pl-tokyo"],
    documentation:
      "Residency notes, selection panel minutes and the subtitling style guide are published openly by both partners.",
    future: [
      "Extend the lab to fiction as well as documentary",
      "Add a third partner in Southeast Asia",
      "Fund a translator apprenticeship alongside the director places",
    ],
  },
  {
    id: "cl-uk-music",
    slug: "indonesia-uk-music-research",
    title: "Indonesia–UK Music Research Collaboration",
    type: "Research Partnership",
    status: "Ongoing",
    countries: ["Indonesia", "United Kingdom"],
    regions: ["Europe", "Asia"],
    years: "2023 – ongoing",
    image: gamelan,
    intro:
      "An acoustics and performance research partnership studying what is lost when paired gamelan instruments are sampled rather than played together.",
    objectives: [
      "Measure the perceptual effect of beating frequencies in paired bronze instruments.",
      "Publish measurement data and recordings open access, with players credited as contributors.",
      "Feed the findings back into composition and touring decisions rather than leaving them in a journal.",
    ],
    themes: ["Music", "Performing Arts"],
    indonesianPartnerIds: ["in-arts-institute", "in-sound-archive"],
    internationalPartners: [
      { name: "Northgate University Acoustics Group", country: "United Kingdom", city: "Manchester", type: "University" },
      { name: "Thames Sound Institute", country: "United Kingdom", city: "London", type: "Research Centre" },
    ],
    timeline: [
      { period: "2023", label: "Pilot measurements", note: "Recording sessions in Yogyakarta with a full ensemble." },
      { period: "2024", label: "First publication", note: "Open-access paper on beating frequencies and perceived tuning." },
      { period: "2025", label: "Listening trials", note: "Audience studies in Yogyakarta and Manchester." },
      { period: "2026", label: "Composition strand", note: "New commissions written against the measured data." },
    ],
    activities: [
      "Joint recording sessions with a full ensemble",
      "Audience listening trials in both countries",
      "Open data publication",
      "Composer workshops using the findings",
    ],
    peopleIds: ["pe-2", "pe-c2"],
    outputs: [
      "Open-access paper on beating frequencies and gamelan tuning",
      "A published measurement dataset and reference recordings",
      "Two new commissions for bronze ensemble and electronics",
    ],
    outcomes: [
      "Touring budgets now argued on evidence that instruments cannot be substituted",
      "A continuing PhD exchange between the partners",
      "Players credited as research contributors on every publication",
    ],
    eventIds: ["ev-2"],
    storyIds: ["st-2"],
    formIds: ["cf-gamelan", "cf-sound"],
    placeIds: ["pl-yogya", "pl-london"],
    documentation: "Datasets, recordings and trial protocols are deposited with both partners and released openly.",
    future: [
      "Extend the method to other tuned percussion traditions",
      "Add a instrument-maintenance strand with bronze smiths",
    ],
  },
  {
    id: "cl-pt-maritime",
    publicStory: true,
    slug: "indonesia-portugal-maritime-heritage",
    title: "Indonesia–Portugal Maritime Heritage Project",
    type: "Museum Partnership",
    status: "Completed",
    countries: ["Indonesia", "Portugal"],
    regions: ["Europe", "Asia"],
    years: "2021 – 2024",
    image: maritime,
    intro:
      "A shared reading of Indian Ocean maritime records, matching Konjo boatbuilding knowledge against European archive material and publishing both side by side.",
    objectives: [
      "Bring builder knowledge and archive documents into the same record rather than treating one as evidence for the other.",
      "Digitise and cross-index route material held in two countries.",
      "Return copies of all digitised material to the communities described in it.",
    ],
    themes: ["Heritage", "Indigenous Knowledge"],
    indonesianPartnerIds: ["in-maritime-centre"],
    internationalPartners: [
      { name: "Tagus Maritime Museum", country: "Portugal", city: "Lisbon", type: "Museum" },
      { name: "Atlantic Archive Foundation", country: "Portugal", city: "Porto", type: "Archive" },
    ],
    timeline: [
      { period: "2021", label: "Archive survey", note: "Route and cargo material identified in both countries." },
      { period: "2022", label: "Field season", note: "Build documentation at Tanjung Bira with master builders." },
      { period: "2023", label: "Joint exhibition", note: "Shown in Lisbon, with Konjo terminology used throughout the labels." },
      { period: "2024", label: "Return of copies", note: "Digitised material handed back to the yards and to Makassar." },
    ],
    activities: [
      "Two archive digitisation seasons",
      "Field documentation at eight beach yards",
      "A bilingual exhibition in Lisbon",
      "Community return of all digitised copies",
    ],
    peopleIds: ["pe-4", "pe-c3"],
    outputs: [
      "A bilingual exhibition and catalogue",
      "A cross-indexed digital archive of route and build material",
      "A glossary of Konjo boatbuilding terms with archival equivalents",
    ],
    outcomes: [
      "A standing relationship that continues to supply reference material to both partners",
      "Konjo terminology now used as the primary vocabulary in partner records",
      "A follow-up documentation season funded independently in Makassar",
    ],
    eventIds: [],
    storyIds: ["st-3"],
    formIds: ["cf-phinisi"],
    placeIds: ["pl-bira", "pl-lisbon"],
    documentation:
      "The catalogue, glossary and archive index remain published and in use; completion is a milestone, not an ending.",
    future: [
      "Extend the glossary to Bugis and Mandar terminology",
      "Bring a third Indian Ocean partner into the index",
    ],
  },
  {
    id: "cl-sea-textile",
    slug: "southeast-asian-textile-research-programme",
    title: "Southeast Asian Textile Research Programme",
    type: "Multilateral Programme",
    status: "Active",
    countries: ["Indonesia", "Malaysia", "Philippines", "Kenya"],
    regions: ["Asia", "Africa"],
    years: "2025 – 2028",
    image: textileHero,
    featured: true,
    intro:
      "A multi-country research and residency programme on natural dye chemistry, motif rights and the economics of slow cloth.",
    objectives: [
      "Build shared fade and colourfastness data across four dye traditions.",
      "Test motif-rights frameworks that keep decisions with weaving communities.",
      "Pair weavers directly rather than routing exchange through institutions only.",
    ],
    themes: ["Craft & Design", "Heritage", "Indigenous Knowledge"],
    indonesianPartnerIds: ["in-textile-museum", "in-kaliuda"],
    internationalPartners: [
      { name: "Selangor Craft Research Unit", country: "Malaysia", city: "Shah Alam", type: "Research Centre" },
      { name: "Visayas Weaving Network", country: "Philippines", city: "Iloilo", type: "Cultural Community" },
      { name: "Rift Valley Dye Studio", country: "Kenya", city: "Nairobi", type: "Cultural Centre" },
    ],
    timeline: [
      { period: "2025", label: "Programme opens", note: "Shared testing protocol agreed across four partners." },
      { period: "2026", label: "Residency season", note: "Eight weeks pairing Sumba weavers with Kenyan dyers." },
      { period: "2027", label: "Rights framework draft", note: "Motif governance model tested with three communities." },
      { period: "2028", label: "Publication", note: "Combined dataset and framework released open access." },
    ],
    activities: [
      "Cross-country dye testing to one protocol",
      "Weaver-to-weaver residencies",
      "Motif rights workshops",
      "Joint market and pricing study",
    ],
    peopleIds: ["pe-1", "pe-c1", "pe-3"],
    outputs: [
      "A shared colourfastness dataset across four traditions",
      "A residency series pairing weavers directly",
      "A draft motif governance framework",
    ],
    outcomes: [
      "Pricing conversations now start from documented production time",
      "Two communities have adopted the governance draft locally",
      "A south–south exchange route that no longer needs a northern intermediary",
    ],
    eventIds: ["ev-7", "ev-1"],
    storyIds: ["st-1"],
    formIds: ["cf-ikat"],
    placeIds: ["pl-sumba", "pl-kaliuda", "pl-nairobi"],
    documentation: "Testing protocols and interim data are published as they are produced.",
    future: [
      "Add a Pacific partner in the second phase",
      "Fund a shared dye-garden seed exchange",
    ],
  },
  {
    id: "cl-br-design",
    slug: "indonesia-brazil-material-design",
    title: "Indonesia–Brazil Material Design Residency",
    type: "Residency Programme",
    status: "Planned",
    countries: ["Indonesia", "Brazil"],
    regions: ["Asia", "Americas"],
    years: "2026 – 2027",
    image: design,
    intro:
      "A planned residency exchange on tropical material practice — rattan, bamboo, stone — and on how workshop credit is carried through to export.",
    objectives: [
      "Compare credit and attribution models used by studios in both countries.",
      "Prototype objects jointly with named workshops on both sides.",
      "Publish a shared position on origin labelling for exported design.",
    ],
    themes: ["Craft & Design", "Architecture", "Contemporary Culture"],
    indonesianPartnerIds: ["in-ruang-baru"],
    internationalPartners: [
      { name: "Paulista Material Studio", country: "Brazil", city: "São Paulo", type: "Gallery" },
      { name: "Tropical Design Faculty", country: "Brazil", city: "Rio de Janeiro", type: "University" },
    ],
    timeline: [
      { period: "2026", label: "Exhibition first", note: "Material Futures opens in São Paulo as the programme's opening move." },
      { period: "2026–2027", label: "Residency exchange", note: "Two designers each way, twelve weeks." },
      { period: "2027", label: "Joint position paper", note: "Shared origin-labelling proposal published." },
    ],
    activities: [
      "Studio-to-studio residencies",
      "Joint prototyping with named workshops",
      "Public exhibition and talks programme",
    ],
    peopleIds: ["pe-7", "pe-3"],
    outputs: [
      "A joint exhibition in São Paulo",
      "Prototype object series with shared credits",
      "A published position on origin labelling",
    ],
    outcomes: [
      "An intended standing exchange between two tropical design scenes",
      "A credit model that buyers can check rather than take on trust",
    ],
    eventIds: ["ev-6"],
    storyIds: ["st-6"],
    formIds: ["cf-design"],
    placeIds: ["pl-jakarta", "pl-saopaulo"],
    documentation: "Programme design documents are shared with prospective partners on request.",
    future: [
      "Bring a West African studio into a third phase",
      "Add a materials-testing strand with both universities",
    ],
  },
];
