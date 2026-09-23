export interface NavLeaf {
  label: string;
  to: string;
  hash?: string;
  description: string;
}

export interface NavGroup {
  label: string;
  to?: string;
  /** Journey stage this section serves. */
  stage: string;
  intro: string;
  items: NavLeaf[];
}

export const navigation: NavGroup[] = [
  {
    label: "Explore",
    to: "/explore",
    stage: "Understand Indonesia",
    intro: "Stories, ideas, people and connected cultural knowledge.",
    items: [
      { label: "All Content", to: "/explore", description: "Essentials, deep dives and perspectives across Indonesia." },
      { label: "Topics", to: "/explore/topics", description: "Enter through music, textiles, history, film and more." },
      { label: "Collections", to: "/explore/collections", description: "Curated journeys connecting content, people and places." },
      { label: "People & Communities", to: "/people", description: "The people who create, carry and reinterpret culture." },
      { label: "Institutions", to: "/institutions", description: "Museums, universities, archives and cultural organisations." },
    ],
  },
  {
    label: "Experience",
    to: "/experience",
    stage: "Experience",
    intro: "In a room, on a stage, or on the ground.",
    items: [
      { label: "Events", to: "/events", description: "Exhibitions, performances, screenings, workshops, residencies." },
      { label: "Places", to: "/places", description: "A map and directory of cultural places across the archipelago." },
      { label: "Indonesia Around the World", to: "/around-the-world", description: "The live map of every programme abroad." },
    ],
  },
  {
    label: "Connect",
    stage: "Connect",
    intro: "Funding, partnership and a way to reach a human.",
    items: [
      { label: "International Collaborations", to: "/collaborations", description: "Exchanges, joint exhibitions and research partnerships." },
      { label: "Opportunities", to: "/opportunities", description: "Grants, residencies, fellowships and open calls." },
      { label: "Submit an Inquiry", to: "/inquiry", description: "Request an introduction or propose a collaboration." },
    ],
  },
  {
    label: "About",
    to: "/about",
    stage: "Collaborate",
    intro: "Who we are and the principles we work under.",
    items: [
      { label: "About Indonesia Vibes", to: "/about", description: "Mission, method and the people behind the platform." },
      { label: "Editorial Standards", to: "/editorial-standards", description: "How we research, verify, attribute and correct." },
      { label: "Partners & Contributors", to: "/partners", description: "The people and organisations who help build the platform." },
      { label: "Contact", to: "/contact", description: "Contact the Indonesia Vibes team." },
    ],
  },
];