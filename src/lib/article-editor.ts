import type { JSONContent } from "@tiptap/core";

import type { ContentItem } from "@/lib/admin/types";

export const EMPTY_ARTICLE_DOCUMENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function articleDocument(item: ContentItem): JSONContent {
  if (item.articleDocument) {
    try {
      return JSON.parse(item.articleDocument) as JSONContent;
    } catch {
      // A damaged prototype draft should still open for editing.
    }
  }
  const paragraphs = (item.fields["narrative"] ?? "")
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean);
  if (!paragraphs.length) return EMPTY_ARTICLE_DOCUMENT;
  return {
    type: "doc",
    content: paragraphs.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })),
  };
}

export function documentText(document: JSONContent) {
  const read = (node: JSONContent): string => {
    if (node.type === "text") return node.text ?? "";
    return (node.content ?? []).map(read).join(node.type === "paragraph" ? "" : "\n");
  };
  return (document.content ?? []).map(read).filter(Boolean).join("\n\n");
}

export function articleSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
