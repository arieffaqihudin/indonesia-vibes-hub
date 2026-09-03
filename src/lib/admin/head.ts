/** Internal screens carry their own titles and are never indexed. */
export const adminHead = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} — Indonesia Vibes Editorial & Partnership Dashboard` },
    { name: "description", content: description },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: `${title} — Indonesia Vibes internal workspace` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
