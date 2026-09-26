import { GripVertical, ImageIcon, Plus, Search, Upload, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useCms } from "@/lib/cms/store";
import { btn, inputClass } from "./ui";

export interface Option { id: string; label: string; meta?: string | undefined }

/** Pick several existing items: chips + a search box. */
export function MultiPicker({ label, options, value, onChange, placeholder }: { label: string; options: Option[]; value: string[]; onChange: (ids: string[]) => void; placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = value.map((id) => options.find((o) => o.id === id) ?? { id, label: id });
  const matches = options.filter((o) => !value.includes(o.id) && o.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  return <div className="space-y-1.5">
    <p className="text-xs font-medium text-ink">{label}</p>
    {selected.length ? <ul className="flex flex-wrap gap-1.5">{selected.map((o) => <li key={o.id} className="inline-flex max-w-full items-center gap-1 rounded bg-background py-0.5 pr-0.5 pl-2 text-xs text-ink ring-1 ring-border">
      <span className="truncate">{o.label}</span>
      <button type="button" aria-label={`Remove ${o.label}`} onClick={() => onChange(value.filter((v) => v !== o.id))} className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-ink"><X className="h-3 w-3" /></button>
    </li>)}</ul> : null}
    <div className="relative">
      <input value={query} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} placeholder={placeholder ?? `Add ${label.toLowerCase()}…`} className={cn(inputClass, "h-8 text-xs")} aria-label={`Add ${label}`} />
      {open && matches.length ? <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-background py-1 shadow-lg">
        {matches.map((o) => <li key={o.id}><button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange([...value, o.id]); setQuery(""); }} className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs hover:bg-sand">
          <span className="truncate text-ink">{o.label}</span>{o.meta ? <span className="shrink-0 text-muted-foreground">{o.meta}</span> : null}
        </button></li>)}
      </ul> : null}
    </div>
  </div>;
}

/** An ordered list with drag and keyboard-friendly up/down. */
export function OrderedList({ items, onChange, render, max }: { items: string[]; onChange: (ids: string[]) => void; render: (id: string) => { title: string; meta?: string | undefined; image?: string | undefined }; max?: number }) {
  const drag = useRef<number | null>(null);
  const move = (from: number, to: number) => { if (to < 0 || to >= items.length) return; const next = [...items]; const [m] = next.splice(from, 1); next.splice(to, 0, m!); onChange(next); };
  return <ol className="divide-y divide-border rounded-md border border-border bg-background">
    {items.map((id, index) => { const r = render(id); return <li key={id} draggable onDragStart={() => { drag.current = index; }} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag.current !== null) move(drag.current, index); drag.current = null; }} className="flex items-center gap-3 px-3 py-2">
      <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" aria-hidden />
      <span className="w-6 shrink-0 font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
      {r.image ? <img src={r.image} alt="" className="h-9 w-12 shrink-0 rounded object-cover" /> : null}
      <span className="min-w-0 flex-1"><span className="block truncate text-sm text-ink">{r.title}</span>{r.meta ? <span className="block truncate text-xs text-muted-foreground">{r.meta}</span> : null}</span>
      <span className="flex shrink-0">
        <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)} className={btn.icon}>↑</button>
        <button type="button" aria-label="Move down" disabled={index === items.length - 1} onClick={() => move(index, index + 1)} className={btn.icon}>↓</button>
        <button type="button" aria-label={`Remove ${r.title}`} onClick={() => onChange(items.filter((i) => i !== id))} className={btn.icon}><X className="h-4 w-4" /></button>
      </span>
    </li>; })}
    {max ? <li className="px-3 py-1.5 text-xs text-muted-foreground">{items.length} / {max}</li> : null}
  </ol>;
}

/** Search existing items and add one. */
export function AddSearch({ options, onAdd, placeholder, disabled }: { options: Option[]; onAdd: (id: string) => void; placeholder: string; disabled?: boolean }) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [], [options, query]);
  return <div className="relative">
    <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <input disabled={disabled} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} className={cn(inputClass, "pl-8")} />
    {matches.length ? <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-md border border-border bg-background py-1 shadow-lg">
      {matches.map((o) => <li key={o.id}><button type="button" onClick={() => { onAdd(o.id); setQuery(""); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-sand"><Plus className="h-3.5 w-3.5 text-primary" /><span className="flex-1 truncate text-ink">{o.label}</span>{o.meta ? <span className="text-xs text-muted-foreground">{o.meta}</span> : null}</button></li>)}
    </ul> : null}
  </div>;
}

/** Cover image: upload a file or choose one already used elsewhere. */
export function ImageField({ value, onChange, label = "Cover image" }: { value: string; onChange: (src: string) => void; label?: string }) {
  const { records, team } = useCms();
  const [choosing, setChoosing] = useState(false);
  const library = useMemo(() => [...new Set([...records.map((r) => r.image), ...team.map((t) => t.photo)].filter(Boolean))], [records, team]);
  const upload = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = () => { const file = input.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => onChange(String(reader.result)); reader.readAsDataURL(file); };
    input.click();
  };
  return <div className="space-y-1.5">
    <p className="text-xs font-medium text-ink">{label}</p>
    {value ? <div className="group relative overflow-hidden rounded-md border border-border"><img src={value} alt="" className="aspect-[16/10] w-full object-cover" /><button type="button" onClick={() => onChange("")} className="absolute top-1.5 right-1.5 inline-flex h-7 w-7 items-center justify-center rounded bg-background/90 text-ink hover:bg-background" aria-label="Remove image"><X className="h-3.5 w-3.5" /></button></div>
      : <div className="flex aspect-[16/10] items-center justify-center rounded-md border border-dashed border-border bg-background text-muted-foreground"><ImageIcon className="h-6 w-6" /></div>}
    <div className="flex gap-2">
      <button type="button" onClick={upload} className={cn(btn.secondary, "h-8 flex-1 text-xs")}><Upload className="h-3.5 w-3.5" />Upload</button>
      <button type="button" onClick={() => setChoosing(true)} className={cn(btn.secondary, "h-8 flex-1 text-xs")}>Choose existing</button>
    </div>
    {choosing ? <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Choose an image">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/40" onClick={() => setChoosing(false)} />
      <div className="relative max-h-[80dvh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background p-5">
        <div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold text-ink">Choose an existing image</p><button type="button" onClick={() => setChoosing(false)} className={btn.icon} aria-label="Close"><X className="h-4 w-4" /></button></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{library.map((src) => <button key={src} type="button" onClick={() => { onChange(src); setChoosing(false); }} className={cn("overflow-hidden rounded-md ring-2 ring-transparent hover:ring-primary", src === value && "ring-primary")}><img src={src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" /></button>)}</div>
      </div>
    </div> : null}
  </div>;
}
