import { Plus, Trash2 } from "lucide-react";

import { SOURCE_TYPES, type SourceItem, type SourceType } from "@/lib/contributor/schema";
import { btn, inputClass } from "./primitives";

const uid = () => Math.random().toString(36).slice(2, 10);

export function SourceManager({
  value,
  onChange,
}: {
  value: SourceItem[];
  onChange: (v: SourceItem[]) => void;
}) {
  const patch = (id: string, p: Partial<SourceItem>) =>
    onChange(value.map((s) => (s.id === id ? { ...s, ...p } : s)));

  return (
    <div>
      <ul className="space-y-3">
        {value.map((s, i) => (
          <li key={s.id} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Source {String(i + 1).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x.id !== s.id))}
                aria-label={`Remove source ${i + 1}`}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-sand hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={`${s.id}-title`} className="mb-1 block text-xs font-medium text-ink">
                  Source title
                </label>
                <input
                  id={`${s.id}-title`}
                  className={inputClass}
                  value={s.title}
                  onChange={(e) => patch(s.id, { title: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor={`${s.id}-author`} className="mb-1 block text-xs font-medium text-ink">
                  Author / institution
                </label>
                <input
                  id={`${s.id}-author`}
                  className={inputClass}
                  value={s.author ?? ""}
                  onChange={(e) => patch(s.id, { author: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor={`${s.id}-year`} className="mb-1 block text-xs font-medium text-ink">
                  Year
                </label>
                <input
                  id={`${s.id}-year`}
                  className={inputClass}
                  value={s.year ?? ""}
                  onChange={(e) => patch(s.id, { year: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor={`${s.id}-publisher`} className="mb-1 block text-xs font-medium text-ink">
                  Publisher
                </label>
                <input
                  id={`${s.id}-publisher`}
                  className={inputClass}
                  value={s.publisher ?? ""}
                  onChange={(e) => patch(s.id, { publisher: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor={`${s.id}-type`} className="mb-1 block text-xs font-medium text-ink">
                  Source type
                </label>
                <select
                  id={`${s.id}-type`}
                  className={inputClass}
                  value={s.type ?? ""}
                  onChange={(e) => patch(s.id, { type: e.target.value as SourceType })}
                >
                  <option value="">Please choose…</option>
                  {SOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`${s.id}-url`} className="mb-1 block text-xs font-medium text-ink">
                  URL
                </label>
                <input
                  id={`${s.id}-url`}
                  className={inputClass}
                  value={s.url ?? ""}
                  placeholder="https://"
                  onChange={(e) => patch(s.id, { url: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`${s.id}-notes`} className="mb-1 block text-xs font-medium text-ink">
                  Notes
                </label>
                <textarea
                  id={`${s.id}-notes`}
                  rows={2}
                  className={inputClass}
                  value={s.notes ?? ""}
                  onChange={(e) => patch(s.id, { notes: e.target.value })}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`${btn.secondary} mt-4`}
        onClick={() => onChange([...value, { id: uid(), title: "", type: "" }])}
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add a source
      </button>
    </div>
  );
}
