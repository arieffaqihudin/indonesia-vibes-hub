/** Public URLs are stable and never depend on filters or tracking parameters. */
export const SITE_URL = "https://indonesia-vibes-hub.lovable.app";

export function publicUrl(path: string) {
  return new URL(path, SITE_URL).href;
}

export function pageIdentity(path: string) {
  const url = publicUrl(path);
  return {
    meta: [{ property: "og:url", content: url }],
    links: [{ rel: "canonical", href: url }],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: publicUrl(item.path),
      })),
    }),
  };
}