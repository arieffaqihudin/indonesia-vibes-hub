import { useState } from "react";

import { field } from "@/components/admin/primitives";
import { useAdmin } from "@/lib/admin/store";
import { graphEntriesFor, graphEntry } from "@/lib/admin/selectors";
import type { Relationships } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

/** Focused picker for one relationship type (e.g. Related Heritage). */
export function RelationPicker({ id, group, label, placeholder, filter, exclude = [] }: { id: string; group: keyof Relationships; label: string; placeholder: string; filter?: (detail?: string) => boolean; exclude?: string[] }) {
  const admin = useAdmin();
  const item = admin.getContent(id);
  const [query, setQuery] = useState("");
  if (!item) return null;
  const selected = item.relationships[group] ?? [];
  const options = graphEntriesFor(group).filter((entry) => (!filter || filter(entry.detail)) && !selected.includes(entry.id) && !exclude.includes(entry.id) && `${entry.label} ${entry.detail ?? ""}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  return <div>
    <p className="text-xs font-medium text-ink">{label}</p>
    <div className="mt-1 space-y-1">
      {selected.length ? selected.map((rid) => <div key={rid} className="flex items-center justify-between gap-2 border border-border px-2 py-1.5 text-xs"><span className="min-w-0 truncate text-ink">{graphEntry(rid)?.label ?? rid}</span><button type="button" className="shrink-0 text-muted-foreground hover:text-primary" onClick={() => admin.removeRelationship(id, group, rid)} aria-label={`Remove ${graphEntry(rid)?.label ?? rid}`}>Remove</button></div>) : <p className="text-xs text-muted-foreground">None linked yet.</p>}
    </div>
    <input aria-label={`Add ${label}`} className={cn(field, "mt-2 min-h-9 py-1.5 text-xs")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} />
    {query ? <ul className="max-h-40 overflow-auto border border-border bg-card">{options.length ? options.map((entry) => <li key={entry.id}><button type="button" className="w-full px-2 py-2 text-left text-xs text-ink hover:bg-muted" onClick={() => { admin.addRelationship(id, group, entry.id); setQuery(""); }}>{entry.label}{entry.detail ? <span className="block text-muted-foreground">{entry.detail}</span> : null}</button></li>) : <li className="px-2 py-2 text-xs text-muted-foreground">No matches</li>}</ul> : null}
  </div>;
}
