import { useEffect, useState } from "react";

/** One canonical FAQ library, reused centrally and contextually — never duplicated. */
export const FAQ_CATEGORIES = [
  "About Indonesia Vibes",
  "Content & Editorial",
  "Events & Places",
  "Collaboration",
  "Using the Platform",
] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const FAQ_STATUSES = ["Draft", "Published", "Archived"] as const;
export type FaqStatus = (typeof FAQ_STATUSES)[number];

export const FAQ_PLACEMENTS = [
  { id: "faq", label: "Main FAQ Page" },
  { id: "connect", label: "Collaborate with Indonesia" },
  { id: "editorial-standards", label: "Editorial Standards" },
  { id: "events-places", label: "Events & Places" },
  { id: "contact", label: "Contact" },
] as const;
export type FaqPlacement = (typeof FAQ_PLACEMENTS)[number]["id"];

export interface Faq {
  id: string;
  question: string;
  /** Basic rich text (HTML from the simple FAQ editor). */
  answer: string;
  category: FaqCategory;
  status: FaqStatus;
  order: number;
  placements: FaqPlacement[];
  relatedPage?: string;
  updatedAt: string;
}

const p = (text: string) => `<p>${text}</p>`;
let n = 0;
const seed = (category: FaqCategory, question: string, answer: string, placements: FaqPlacement[] = ["faq"]): Faq => ({
  id: `faq-${++n}`, question, answer: p(answer), category, status: "Published", order: n, placements, updatedAt: "2026-09-01T09:00:00.000Z",
});

export const SEED_FAQS: Faq[] = [
  seed("About Indonesia Vibes", "What is Indonesia Vibes?", "A cultural diplomacy platform that helps people around the world understand Indonesian culture, experience it, and build collaborations with Indonesia."),
  seed("About Indonesia Vibes", "Who is Indonesia Vibes for?", "Curious readers, cultural institutions, researchers, artists, students, diplomats and anyone looking for a trustworthy way into Indonesian culture.", ["faq", "contact"]),
  seed("About Indonesia Vibes", "Who manages Indonesia Vibes?", "An editorial and partnerships team working with Indonesian cultural institutions, communities and specialists.", ["faq", "contact"]),
  seed("Content & Editorial", "Can I submit a story or cultural reference?", "Yes. Contributors can send material through the Contributor Workspace. Every submission is reviewed by an editor before anything is published.", ["faq", "editorial-standards", "contact"]),
  seed("Content & Editorial", "How does Indonesia Vibes select content?", "Editors look for accuracy, cultural significance, clear sources and respect for the communities involved.", ["faq", "editorial-standards"]),
  seed("Content & Editorial", "Can content from external authors be published?", "Yes. Articles by external researchers, writers and institutions sit alongside our own work. The author is always credited by name, and our editorial role is stated clearly.", ["faq", "editorial-standards"]),
  seed("Content & Editorial", "How are sources checked?", "Factual claims are checked against named references. Where information cannot yet be confirmed, we leave it out rather than guess.", ["faq", "editorial-standards"]),
  seed("Content & Editorial", "Can published information be corrected?", "Yes. Write to us with the correction and, if possible, a source. Corrections are dated on the article.", ["faq", "editorial-standards", "contact"]),
  seed("Events & Places", "How can an event be considered for Indonesia Vibes?", "Send the organiser, dates, venue and a short description through the contact form. Editors confirm details before listing it.", ["faq", "events-places"]),
  seed("Events & Places", "Does Indonesia Vibes organise every listed event?", "No. Many events are run by partners and independent organisers. Each listing names the organiser.", ["faq", "events-places"]),
  seed("Events & Places", "How is information about places verified?", "Place details are checked with the institution or community concerned, and reviewed regularly.", ["faq", "events-places"]),
  seed("Collaboration", "Who can collaborate with Indonesia Vibes?", "Museums, universities, festivals, cultural organisations, artists and communities — in Indonesia or anywhere in the world.", ["faq", "connect"]),
  seed("Collaboration", "Can international institutions propose a collaboration?", "Yes. International proposals are welcome and are a core part of our work.", ["faq", "connect"]),
  seed("Collaboration", "What kinds of cultural collaboration can be proposed?", "Exhibitions, performances, residencies, research, co-commissions, education programmes and archive or object loans.", ["faq", "connect"]),
  seed("Collaboration", "Does submitting an inquiry guarantee a partnership?", "No. Every inquiry is read and answered, but a partnership depends on fit, timing and resources.", ["faq", "connect"]),
  seed("Collaboration", "How long does a collaboration inquiry take to review?", "You will usually hear from us within ten working days.", ["faq", "connect", "contact"]),
  seed("Using the Platform", "How do I find content about a particular topic?", "Open Understand Indonesia and choose a topic, or use Search. Topic pages bring articles, people, events and collaborations together."),
  seed("Using the Platform", "How can I find Indonesian cultural activity in another country?", "Use Indonesia Around the World under Experience to see activity by country on the map."),
];

export const FAQ_STORAGE_KEY = "iv-faq-v1";
const EVENT = "iv-faq-change";

export function readFaqs(): Faq[] {
  if (typeof window === "undefined") return SEED_FAQS;
  try {
    const raw = window.localStorage.getItem(FAQ_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Faq[]) : SEED_FAQS;
  } catch {
    return SEED_FAQS;
  }
}

export function useFaqs() {
  const [faqs, setState] = useState<Faq[]>(SEED_FAQS);
  useEffect(() => {
    const sync = () => setState(readFaqs());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const setFaqs = (next: Faq[]) => {
    setState(next);
    window.localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  };
  return [faqs, setFaqs] as const;
}

export const faqText = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export const sortFaqs = (items: Faq[]) =>
  [...items].sort((a, b) => FAQ_CATEGORIES.indexOf(a.category) - FAQ_CATEGORIES.indexOf(b.category) || a.order - b.order);

export const publishedFor = (items: Faq[], placement: FaqPlacement) =>
  sortFaqs(items.filter((f) => f.status === "Published" && f.placements.includes(placement)));

/** Keep only a safe subset of basic formatting tags in rendered answers. */
export function safeAnswerHtml(html: string) {
  return html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/href="\s*javascript:[^"]*"/gi, 'href="#"');
}
