import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old CMS addresses forward to the module that now owns them. */
const LEGACY: [RegExp, string, Record<string, string>?][] = [
  [/^(stories|content|create|review|submissions|activity|calendar|notifications|follow-ups)/, "/admin/articles"],
  [/^(culture)/, "/admin/heritage"],
  [/^(taxonomy)/, "/admin/topics"],
  [/^(people|institutions|partners)/, "/admin/people-organisations"],
  [/^(events|places|events-places|data-health)/, "/admin/experience"],
  [/^around-the-world/, "/admin/experience", { tab: "world" }],
  [/^inquiries/, "/admin/collaborations", { tab: "requests" }],
  [/^(homepage|curation)/, "/admin/homepage"],
  [/^about/, "/admin/pages/about"],
  [/^editorial-standards/, "/admin/pages/editorial-standards"],
  [/^contact/, "/admin/pages/contact"],
  [/^faq/, "/admin/pages/faq"],
  [/^(users)/, "/admin/settings", { tab: "users" }],
  [/^(media|sources|settings)/, "/admin/settings"],
];

export const Route = createFileRoute("/admin/$")({
  beforeLoad: ({ params }) => {
    const rest = params._splat ?? "";
    const match = LEGACY.find(([pattern]) => pattern.test(rest));
    throw redirect({ to: match?.[1] ?? "/admin/dashboard", ...(match?.[2] ? { search: match[2] } : {}), replace: true } as never);
  },
});
