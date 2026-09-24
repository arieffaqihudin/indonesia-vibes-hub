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
    label: "Understand Indonesia",
    to: "/understand-indonesia",
    stage: "Understand Indonesia",
    intro: "Articles, topics, people, organisations and connected cultural knowledge.",
    items: [
      { label: "Topics", to: "/understand-indonesia/topics", description: "Enter through music, textiles, history, film and more." },
      { label: "Collections", to: "/understand-indonesia/collections", description: "Curated journeys connecting articles, people, places and activity." },
      { label: "People & Organisations", to: "/people-organisations", description: "The people, communities and organisations who carry culture." },
    ],
  },
  {
    label: "Experience",
    to: "/experience",
    stage: "Experience",
    intro: "In a room, on a stage, or on the ground.",
    items: [
      { label: "Events & Places", to: "/events-places", description: "What is happening and the places that give it context." },
      { label: "Indonesia Around the World", to: "/around-the-world", description: "The live map of every programme abroad." },
    ],
  },
  {
    label: "Connect",
    stage: "Connect",
    intro: "Begin a cultural collaboration with Indonesia.",
    items: [
      { label: "Collaborate with Indonesia", to: "/collaborate", description: "See existing exchanges and start a conversation with the team." },
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
      { label: "Contact", to: "/contact", description: "Contact the Indonesia Vibes team." },
    ],
  },
];