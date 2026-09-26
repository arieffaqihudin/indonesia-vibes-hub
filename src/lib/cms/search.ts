/** Loose search-param reader shared by CMS list routes. */
export const stringSearch = (search: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(search).filter(([, v]) => typeof v === "string")) as Record<string, string | undefined>;

export const matches = (text: string, q: string) => text.toLowerCase().includes(q.trim().toLowerCase());
export const uniq = (values: (string | undefined)[]) => [...new Set(values.filter((v): v is string => Boolean(v)))].sort();
