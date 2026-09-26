import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOPIC_ICONS, TopicIcon, type TopicIconName } from "@/components/editorial/TopicIcon";
import { inputClass } from "@/components/cms/ui";

export function TopicIconPicker({ value, onChange }: { value?: TopicIconName; onChange: (icon: TopicIconName) => void }) {
  const [search, setSearch] = useState("");
  const icons = (Object.keys(TOPIC_ICONS) as TopicIconName[]).filter((name) => name.toLowerCase().includes(search.trim().toLowerCase()));
  return <div className="space-y-3">
    <div className="flex items-center gap-2 text-sm text-ink"><TopicIcon topic={{ icon: value }} size={24} /><span>{value ? value.replace(/([a-z])([A-Z0-9])/g, "$1 $2") : "Default icon"}</span></div>
    <label className="relative block">
      <span className="sr-only">Search icons</span>
      <Search aria-hidden="true" className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search icons" className={`${inputClass} pl-9`} />
    </label>
    <div className="grid max-h-52 grid-cols-4 gap-1 overflow-y-auto sm:grid-cols-5" role="group" aria-label="Choose a Topic icon">
      {icons.map((name) => <Button key={name} type="button" variant="outline" title={name.replace(/([a-z])([A-Z0-9])/g, "$1 $2")} aria-label={name.replace(/([a-z])([A-Z0-9])/g, "$1 $2")} aria-pressed={value === name} onClick={() => onChange(name)} className={`h-12 rounded-sm p-0 ${value === name ? "border-primary text-primary" : "text-ink"}`}><TopicIcon topic={{ icon: name }} size={22} /></Button>)}
    </div>
    {!icons.length ? <p className="text-xs text-muted-foreground">No icons found.</p> : null}
  </div>;
}