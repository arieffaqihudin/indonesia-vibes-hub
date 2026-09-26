/** CMS menus in sidebar order. `key` is stored on access roles; never shown to editors. */
export type MenuKey = "dashboard" | "articles" | "heritage" | "topics" | "collections" | "people" | "experience" | "collaborations" | "homepage" | "pages" | "access" | "users" | "activity" | "profile";

export const MENU_GROUPS: { label?: string; items: { key: MenuKey; label: string; to: string }[] }[] = [
  { items: [{ key: "dashboard", label: "Dashboard", to: "/studio/dashboard" }] },
  { label: "Content", items: [
    { key: "articles", label: "Articles", to: "/studio/articles" },
    { key: "heritage", label: "Heritage", to: "/studio/heritage" },
    { key: "topics", label: "Topics", to: "/studio/topics" },
    { key: "collections", label: "Collections", to: "/studio/collections" },
  ] },
  { label: "Directory", items: [
    { key: "people", label: "People & Organisations", to: "/studio/people-organisations" },
    { key: "experience", label: "Experience", to: "/studio/experience" },
  ] },
  { label: "Engagement", items: [{ key: "collaborations", label: "Collaborations", to: "/studio/collaborations" }] },
  { label: "Website", items: [
    { key: "homepage", label: "Homepage", to: "/studio/homepage" },
    { key: "pages", label: "Pages", to: "/studio/pages" },
  ] },
  { label: "User Management", items: [
    { key: "access", label: "Access", to: "/studio/access" },
    { key: "users", label: "User", to: "/studio/users" },
  ] },
  { label: "Log Activity", items: [{ key: "activity", label: "Activity", to: "/studio/activity" }] },
  { label: "Setting", items: [{ key: "profile", label: "Profile", to: "/studio/profile" }] },
];

export const ALL_MENUS = MENU_GROUPS.flatMap((g) => g.items);

/** Which menu a CMS address belongs to; previews follow Articles etc. loosely and are allowed. */
export function menuForPath(pathname: string): MenuKey | null {
  const hit = ALL_MENUS.find((m) => pathname === m.to || pathname.startsWith(`${m.to}/`));
  return hit?.key ?? null;
}
