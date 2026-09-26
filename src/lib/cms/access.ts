/** CMS menus in sidebar order. `key` is stored on access roles; never shown to editors. */
export type MenuKey = "dashboard" | "articles" | "heritage" | "topics" | "collections" | "people" | "experience" | "collaborations" | "homepage" | "pages" | "access" | "users" | "activity" | "profile";

export const MENU_GROUPS: { label?: string; items: { key: MenuKey; label: string; to: string }[] }[] = [
  { items: [{ key: "dashboard", label: "Dashboard", to: "/admin/dashboard" }] },
  { label: "Content", items: [
    { key: "articles", label: "Articles", to: "/admin/articles" },
    { key: "heritage", label: "Heritage", to: "/admin/heritage" },
    { key: "topics", label: "Topics", to: "/admin/topics" },
    { key: "collections", label: "Collections", to: "/admin/collections" },
  ] },
  { label: "Directory", items: [
    { key: "people", label: "People & Organisations", to: "/admin/people-organisations" },
    { key: "experience", label: "Experience", to: "/admin/experience" },
  ] },
  { label: "Engagement", items: [{ key: "collaborations", label: "Collaborations", to: "/admin/collaborations" }] },
  { label: "Website", items: [
    { key: "homepage", label: "Homepage", to: "/admin/homepage" },
    { key: "pages", label: "Pages", to: "/admin/pages" },
  ] },
  { label: "User Management", items: [
    { key: "access", label: "Access", to: "/admin/access" },
    { key: "users", label: "User", to: "/admin/users" },
  ] },
  { label: "Log Activity", items: [{ key: "activity", label: "Activity", to: "/admin/activity" }] },
  { label: "Setting", items: [{ key: "profile", label: "Profile", to: "/admin/profile" }] },
];

export const ALL_MENUS = MENU_GROUPS.flatMap((g) => g.items);

/** Which menu a CMS address belongs to; previews follow Articles etc. loosely and are allowed. */
export function menuForPath(pathname: string): MenuKey | null {
  const hit = ALL_MENUS.find((m) => pathname === m.to || pathname.startsWith(`${m.to}/`));
  return hit?.key ?? null;
}
