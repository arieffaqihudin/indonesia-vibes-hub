import LinkExtension from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Link2, List, ListOrdered } from "lucide-react";

import { cn } from "@/lib/utils";

/** Basic rich text only: paragraph, bold, italic, link, bullet and numbered lists. */
export function FaqAnswerEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, blockquote: false, codeBlock: false, code: false, horizontalRule: false, strike: false }),
      LinkExtension.configure({ openOnClick: false, autolink: true }),
    ],
    content: value,
    editorProps: { attributes: { class: "faq-answer min-h-40 px-3 py-3 text-sm leading-relaxed text-ink focus:outline-none", "aria-label": "Answer" } },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  const btn = (active: boolean) => cn("inline-flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-ink", active && "bg-blush text-primary");

  return (
    <div className="rounded border border-border bg-card">
      <div className="flex flex-wrap gap-1 border-b border-border p-1">
        <button type="button" title="Bold" aria-label="Bold" className={btn(!!editor?.isActive("bold"))} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></button>
        <button type="button" title="Italic" aria-label="Italic" className={btn(!!editor?.isActive("italic"))} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></button>
        <button
          type="button" title="Link" aria-label="Link" className={btn(!!editor?.isActive("link"))}
          onClick={() => {
            if (!editor) return;
            if (editor.isActive("link")) { editor.chain().focus().unsetLink().run(); return; }
            const url = window.prompt("Link URL");
            if (url && /^(https?:\/\/|\/|mailto:)/.test(url)) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        ><Link2 className="h-4 w-4" /></button>
        <button type="button" title="Bullet list" aria-label="Bullet list" className={btn(!!editor?.isActive("bulletList"))} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></button>
        <button type="button" title="Numbered list" aria-label="Numbered list" className={btn(!!editor?.isActive("orderedList"))} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
