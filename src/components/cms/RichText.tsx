import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Heading2, Heading3, ImageIcon, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

const tool = "inline-flex h-9 w-9 items-center justify-center rounded-[var(--btn-radius-sm)] text-muted-foreground transition-colors duration-150 hover:bg-sand hover:text-ink";

/** A calm writing surface. Stores HTML. */
export function RichText({ value, onChange, placeholder = "Start writing…", minimal = false }: { value: string; onChange: (html: string) => void; placeholder?: string; minimal?: boolean }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), Link.configure({ openOnClick: false }), Image.configure({ allowBase64: true }), Placeholder.configure({ placeholder })],
    content: value,
    editorProps: { attributes: { class: cn("prose-editorial cms-richtext outline-none text-ink", minimal ? "min-h-[10rem]" : "min-h-[24rem]") } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  useEffect(() => () => editor?.destroy(), [editor]);
  if (!editor) return <div className={minimal ? "min-h-[10rem]" : "min-h-[24rem]"} />;

  const addLink = () => { const url = window.prompt("Link address")?.trim(); if (url) editor.chain().focus().setLink({ href: url }).run(); else editor.chain().focus().unsetLink().run(); };
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = () => { const file = input.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => editor.chain().focus().setImage({ src: String(reader.result) }).run(); reader.readAsDataURL(file); };
    input.click();
  };
  const on = (active: boolean) => cn(tool, active && "bg-blush text-primary");

  return <div>
    <div className="sticky top-28 z-10 -mx-1 mb-4 flex flex-wrap items-center gap-0.5 border-b border-border bg-background/95 px-1 py-1 backdrop-blur">
      <button type="button" aria-label="Heading" className={on(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></button>
      <button type="button" aria-label="Subheading" className={on(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></button>
      <button type="button" aria-label="Bold" className={on(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></button>
      <button type="button" aria-label="Italic" className={on(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></button>
      <button type="button" aria-label="Link" className={on(editor.isActive("link"))} onClick={addLink}><Link2 className="h-4 w-4" /></button>
      <button type="button" aria-label="Bulleted list" className={on(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></button>
      <button type="button" aria-label="Numbered list" className={on(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></button>
      <button type="button" aria-label="Quote" className={on(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></button>
      {!minimal ? <button type="button" aria-label="Insert image" className={tool} onClick={addImage}><ImageIcon className="h-4 w-4" /></button> : null}
      <span className="ml-auto flex">
        <button type="button" aria-label="Undo" className={tool} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></button>
        <button type="button" aria-label="Redo" className={tool} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></button>
      </span>
    </div>
    <EditorContent editor={editor} />
  </div>;
}
