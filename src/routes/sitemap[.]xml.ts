import { createFileRoute } from "@tanstack/react-router";

import { publicUrl } from "@/lib/public-seo";
import { events, people, places, stories } from "@/data/content";
import { TOPICS } from "@/lib/topics";
import { heritageRecords } from "@/lib/heritage";
import { COLLECTIONS } from "@/lib/collections";

/** Public records are currently code-backed; browser-local CMS edits cannot be crawled. */
const staticPaths = [
  "/", "/understand-indonesia", "/understand-indonesia/topics",
  "/understand-indonesia/heritage", "/understand-indonesia/collections",
  "/understand-indonesia/people-organisations", "/experience", "/events-places",
  "/around-the-world", "/collaborate", "/about", "/editorial-standards",
  "/faq", "/contact", "/contribute",
];

const esc = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
})[char] ?? char);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = new Set(staticPaths);
        stories.filter((story) => Boolean(story.title && story.dek && story.body.length && story.publishedAt)).forEach((story) => paths.add(`/stories/${story.slug}`));
        TOPICS.filter((topic) => topic.status === "Published" && topic.intro.trim().length >= 50).forEach((topic) => paths.add(`/understand-indonesia/topics/${topic.slug}`));
        heritageRecords.filter((item) => Boolean(item.whatItIs?.trim() && item.whyMatters?.trim())).forEach((item) => paths.add(`/understand-indonesia/heritage/${item.slug}`));
        COLLECTIONS.filter((item) => item.status === "Published" && item.longIntroduction.trim() && item.storyIds.filter((id) => stories.some((story) => story.id === id)).length >= 2).forEach((item) => paths.add(`/understand-indonesia/collections/${item.slug}`));
        people.filter((person) => (person.intro ?? person.bio).trim().length > 100).forEach((person) => paths.add(`/people/${person.slug}`));
        events.filter((event) => Boolean(event.fixedDate && event.title && (event.summary || event.context))).forEach((event) => paths.add(`/events/${event.slug}`));
        places.filter((place) => Boolean(place.whyMatters || place.significance?.length)).forEach((place) => paths.add(`/places/${place.slug}`));

        const urls = [...paths].sort().map((path) => `<url><loc>${esc(publicUrl(path))}</loc></url>`).join("");
        return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});