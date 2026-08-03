export interface NavLeaf {
  label: string;
  to: string;
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
    label: "Discover",
    stage: "Discover",
    intro: "Start anywhere. Stories and curated collections are the way in.",
    items: [
      { label: "Stories", to: "/stories", description: "Features, interviews and field notes from across the archipelago." },
      { label: "Collections", to: "/collections", description: "Editor-curated sets that connect stories, makers and places." },
      { label: "NOW", to: "/#now", description: "What is open, on stage or closing this week." },
    ],
  },
  {
    label: "Culture",
    stage: "Understand",
    intro: "Three pillars: what is carried, what is being made, and what we know.",
    items: [
      { label: "Heritage", to: "/heritage", description: "Living traditions and the communities who hold them." },
      { label: "Contemporary", to: "/contemporary", description: "Cinema, design, sound and performance made now." },
      { label: "Research", to: "/research", description: "Open scholarship, archives and methodology." },
    ],
  },
  {
    label: "Experience",
    stage: "Experience",
    intro: "In a room, on a stage, or on the ground.",
    items: [
      { label: "Events", to: "/events", description: "Exhibitions, performances, screenings, workshops, residencies." },
      { label: "Places", to: "/places", description: "Origins and venues, from East Sumba to São Paulo." },
      { label: "Indonesia Around the World", to: "/around-the-world", description: "The live map of every programme abroad." },
    ],
  },
  {
    label: "Connect",
    stage: "Connect",
    intro: "Funding, partnership and a way to reach a human.",
    items: [
      { label: "Opportunities", to: "/opportunities", description: "Grants, residencies, fellowships and open calls." },
      { label: "Collaborate", to: "/collaborate", description: "How institutions and festivals work with us." },
      { label: "Contact", to: "/contact", description: "Send an inquiry to the programme team." },
    ],
  },
  {
    label: "About",
    to: "/about",
    stage: "Collaborate",
    intro: "Who we are and the principles we work under.",
    items: [
      { label: "About", to: "/about", description: "Mission, method and the people behind the platform." },
    ],
  },
];