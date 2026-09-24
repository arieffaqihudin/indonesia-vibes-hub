import { Node, mergeAttributes, type JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, ChevronUp, ChevronDown, Copy, Heading2, Heading3, ImageIcon, Italic, Link2,
  List, ListOrdered, Minus, PanelTop, Plus, Quote, Redo2, Rows3, Strikethrough, Table2, Trash2, UnderlineIcon, Undo2, Video,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const PullQuote = Node.create({ name: "pullQuote", group: "block", content: "inline*", defining: true, parseHTML: () => [{ tag: "blockquote[data-pull-quote]" }], renderHTML: ({ HTMLAttributes }) => ["blockquote", mergeAttributes(HTMLAttributes, { "data-pull-quote": "" }), 0] });
const Callout = Node.create({ name: "callout", group: "block", content: "inline*", defining: true, parseHTML: () => [{ tag: "aside[data-callout]" }], renderHTML: ({ HTMLAttributes }) => ["aside", mergeAttributes(HTMLAttributes, { "data-callout": "" }), 0] });
const MediaFigure = Node.create({ name: "mediaFigure", group: "block", atom: true, draggable: true, addAttributes: () => ({ src: { default: "" }, alt: { default: "" }, caption: { default: "" }, credit: { default: "" }, permission: { default: "Needs confirmation" } }), parseHTML: () => [{ tag: "figure[data-media-figure]" }], renderHTML: ({ HTMLAttributes }) => ["figure", mergeAttributes(HTMLAttributes, { "data-media-figure": "" }), ["img", { src: HTMLAttributes["src"], alt: HTMLAttributes["alt"] }], ["figcaption", {}, HTMLAttributes["caption"] || "Image"] ] });
const Gallery = Node.create({ name: "gallery", group: "block", atom: true, draggable: true, addAttributes: () => ({ images: { default: "" }, caption: { default: "" } }), parseHTML: () => [{ tag: "figure[data-gallery]" }], renderHTML: ({ HTMLAttributes }) => ["figure", mergeAttributes(HTMLAttributes, { "data-gallery": "" }), ["div", {}, `Gallery · ${String(HTMLAttributes["images"] ?? "").split("\n").filter(Boolean).length} images`], ["figcaption", {}, HTMLAttributes["caption"] || "Add a gallery caption"] ] });
const Embed = (name: "videoEmbed" | "externalEmbed", label: string) => Node.create({ name, group: "block", atom: true, draggable: true, addAttributes: () => ({ url: { default: "" } }), parseHTML: () => [{ tag: `div[data-${name}]` }], renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { [`data-${name}`]: "" }), `${label}: ${HTMLAttributes["url"]}`] });

const menuButton = "inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-ink disabled:opacity-40";

export function RichBlockEditor({ value, onChange, onAddMedia }: { value: JSONContent; onChange: (value: JSONContent) => void; onAddMedia: (kind: "image" | "gallery") => void }) {
  const [slashOpen, setSlashOpen] = useState(false);
  const [blocksOpen, setBlocksOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), Underline, TextAlign.configure({ types: ["heading", "paragraph"] }), Link.configure({ openOnClick: false }), Image.configure({ allowBase64: true }), Placeholder.configure({ placeholder: "Start writing… Press / to add a block" }), Table.configure({ resizable: true }), TableRow, TableHeader, TableCell, PullQuote, Callout, MediaFigure, Gallery, Embed("videoEmbed", "Video"), Embed("externalEmbed", "Embed")],
    content: value,
    editorProps: { attributes: { class: "article-editor-content prose-editorial min-h-[34rem] outline-none" } },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
      setSlashOpen(editor.state.selection.empty && editor.state.doc.textBetween(Math.max(0, editor.state.selection.from - 1), editor.state.selection.from) === "/");
    },
  });

  useEffect(() => () => editor?.destroy(), [editor]);
  const blocks = useMemo(() => value.content ?? [], [value]);
  if (!editor) return <div className="min-h-[34rem]" />;

  const prompt = (message: string) => window.prompt(message)?.trim() ?? "";
  const clearSlash = () => editor.chain().focus().deleteRange({ from: Math.max(1, editor.state.selection.from - 1), to: editor.state.selection.from }).run();
  const insert = (type: string) => {
    clearSlash();
    if (type === "paragraph") editor.chain().focus().setParagraph().run();
    if (type === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
    if (type === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
    if (type === "quote") editor.chain().focus().toggleBlockquote().run();
    if (type === "pullQuote") editor.chain().focus().insertContent({ type: "pullQuote", content: [{ type: "text", text: "Add a pull quote" }] }).run();
    if (type === "callout") editor.chain().focus().insertContent({ type: "callout", content: [{ type: "text", text: "Add highlighted context" }] }).run();
    if (type === "divider") editor.chain().focus().setHorizontalRule().run();
    if (type === "image" || type === "gallery") onAddMedia(type);
    if (type === "video" || type === "embed") { const url = prompt(type === "video" ? "Video URL" : "External URL"); if (url) editor.chain().focus().insertContent({ type: type === "video" ? "videoEmbed" : "externalEmbed", attrs: { url } }).run(); }
    if (type === "table") editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setSlashOpen(false);
  };
  const addLink = () => { const href = prompt("Link URL"); if (href) editor.chain().focus().extendMarkRange("link").setLink({ href }).run(); };
  const reorder = (from: number, to: number) => {
    const content = [...blocks]; const [moved] = content.splice(from, 1); if (!moved) return; content.splice(to, 0, moved); editor.commands.setContent({ type: "doc", content }); onChange(editor.getJSON());
  };
  const blockLabel = (block: JSONContent, index: number) => block.type === "heading" ? `Heading ${block.attrs?.["level"] ?? ""}` : block.type === "paragraph" ? (block.content?.map((n) => n.text).join("").slice(0, 36) || `Paragraph ${index + 1}`) : (block.type ?? "Block").replace(/([A-Z])/g, " $1");

  const slashItems = [
    ["paragraph", "Paragraph", PanelTop], ["h2", "Heading 2", Heading2], ["h3", "Heading 3", Heading3], ["image", "Image", ImageIcon], ["gallery", "Gallery", Rows3], ["quote", "Quote", Quote], ["pullQuote", "Pull quote", Quote], ["video", "Video", Video], ["embed", "External embed", Link2], ["callout", "Callout", PanelTop], ["divider", "Divider", Minus], ["table", "Table", Table2],
  ] as const;

  return <div className="relative">
    <div className="sticky top-14 z-10 -mx-2 mb-5 flex items-center justify-between gap-2 overflow-x-auto border-y border-border bg-card/95 px-2 py-2 backdrop-blur-sm">
      <div className="flex shrink-0 items-center gap-0.5" aria-label="Rich text formatting">
        <button type="button" className={menuButton} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo2 className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo2 className="h-4 w-4" /></button>
        <select aria-label="Text style" defaultValue="paragraph" onChange={(event) => { if (event.target.value === "h2") editor.chain().focus().setHeading({ level: 2 }).run(); else if (event.target.value === "h3") editor.chain().focus().setHeading({ level: 3 }).run(); else editor.chain().focus().setParagraph().run(); }} className="mx-1 h-8 rounded-md border border-border bg-card px-2 text-xs text-ink"><option value="paragraph">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option></select>
        <button type="button" className={cn(menuButton, editor.isActive("bold") && "bg-blush text-primary")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold className="h-4 w-4" /></button>
        <button type="button" className={cn(menuButton, editor.isActive("italic") && "bg-blush text-primary")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic className="h-4 w-4" /></button>
        <button type="button" className={cn(menuButton, editor.isActive("underline") && "bg-blush text-primary")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon className="h-4 w-4" /></button>
        <button type="button" className={cn(menuButton, editor.isActive("strike") && "bg-blush text-primary")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strike"><Strikethrough className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={addLink} title="Link"><Link2 className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><List className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list"><ListOrdered className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote"><Quote className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => insert("image")} title="Image"><ImageIcon className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => insert("gallery")} title="Gallery"><Rows3 className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => insert("video")} title="Video"><Video className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => insert("table")} title="Table"><Table2 className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left"><AlignLeft className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align centre"><AlignCenter className="h-4 w-4" /></button>
        <button type="button" className={menuButton} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right"><AlignRight className="h-4 w-4" /></button>
      </div>
      <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded px-2 text-xs text-muted-foreground hover:bg-muted hover:text-ink" onClick={() => setBlocksOpen((open) => !open)}><Rows3 className="h-4 w-4" /> Blocks</button>
    </div>
    <BubbleMenu editor={editor} options={{ placement: "top" }} className="flex items-center gap-0.5 rounded border border-border bg-popover p-1 shadow-md">
      <button type="button" className={cn(menuButton, editor.isActive("bold") && "bg-blush text-primary")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold className="h-4 w-4" /></button>
      <button type="button" className={cn(menuButton, editor.isActive("italic") && "bg-blush text-primary")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic className="h-4 w-4" /></button>
      <button type="button" className={cn(menuButton, editor.isActive("underline") && "bg-blush text-primary")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon className="h-4 w-4" /></button>
      <button type="button" className={menuButton} onClick={addLink} title="Link"><Link2 className="h-4 w-4" /></button>
      <button type="button" className={menuButton} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote"><Quote className="h-4 w-4" /></button>
    </BubbleMenu>
    {blocksOpen ? <div className="absolute top-12 right-0 z-20 w-72 border border-border bg-popover p-2 shadow-md">
      <p className="px-2 pb-2 text-xs font-semibold text-ink">Reorder blocks</p>
      <ul className="max-h-80 space-y-1 overflow-auto">{blocks.map((block, index) => <li key={`${block.type}-${index}`} draggable onDragStart={() => setDragIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragIndex !== null && dragIndex !== index) reorder(dragIndex, index); setDragIndex(null); }} className="flex items-center gap-1 rounded px-1 py-1 text-xs text-ink hover:bg-muted">
        <span className="cursor-grab px-1 text-muted-foreground">⋮⋮</span><span className="min-w-0 flex-1 truncate">{blockLabel(block, index)}</span>
        <button type="button" className={menuButton} disabled={index === 0} onClick={() => reorder(index, index - 1)} title="Move up"><ChevronUp className="h-3.5 w-3.5" /></button>
        <button type="button" className={menuButton} disabled={index === blocks.length - 1} onClick={() => reorder(index, index + 1)} title="Move down"><ChevronDown className="h-3.5 w-3.5" /></button>
        <button type="button" className={menuButton} onClick={() => { const content=[...blocks]; content.splice(index+1,0,structuredClone(block)); editor.commands.setContent({type:"doc",content}); }} title="Duplicate"><Copy className="h-3.5 w-3.5" /></button>
        <button type="button" className={menuButton} onClick={() => { const content=blocks.filter((_,i)=>i!==index); editor.commands.setContent({type:"doc",content:content.length?content:[{type:"paragraph"}]}); }} title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
      </li>)}</ul>
    </div> : null}
    <EditorContent editor={editor} />
    {slashOpen ? <div className="absolute left-4 z-30 mt-1 w-64 border border-border bg-popover p-1 shadow-md"><p className="px-2 py-1 text-[0.68rem] font-semibold text-muted-foreground uppercase">Add block</p>{slashItems.map(([type,label,Icon]) => <button key={type} type="button" className="flex min-h-9 w-full items-center gap-2 rounded px-2 text-left text-sm text-ink hover:bg-muted" onMouseDown={(event) => { event.preventDefault(); insert(type); }}><Icon className="h-4 w-4 text-muted-foreground" />{label}</button>)}</div> : null}
    <button type="button" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground hover:text-primary" onClick={() => insert("paragraph")}><Plus className="h-4 w-4" /> Add block</button>
  </div>;
}