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
    intro: "Browse Articles, choose a subject, follow a reading journey, or discover who carries the culture.",
    items: [
      { label: "Topics", to: "/understand-indonesia/topics", description: "Enter through music, textiles, history, film and more." },
      { label: "Collections", to: "/understand-indonesia/collections", description: "Follow a deliberate sequence of stories selected to be read together." },
      { label: "People & Organisations", to: "/understand-indonesia/people-organisations", description: "The people, communities and organisations who carry culture." },
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
    label: "About",
    to: "/about",
    stage: "About",
    intro: "Who we are and the principles we work under.",
    items: [
      { label: "About Indonesia Vibes", to: "/about", description: "Mission, method and the people behind the platform." },
      { label: "Editorial Standards", to: "/editorial-standards", description: "How we research, verify, attribute and correct." },
      { label: "FAQ", to: "/faq", description: "Short answers to common questions." },
      { label: "Contact", to: "/contact", description: "Contact the Indonesia Vibes team." },
    ],
  },
];