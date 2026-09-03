import { Check, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { searchRecords } from "@/data/graph";
import { SENSITIVITY_FLAGS, type FieldDef } from "@/lib/contributor/schema";
import { cn } from "@/lib/utils";
import { inputClass } from "./primitives";

function TagInput({
  value,
  onChange,
  id,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  id: string;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          className={inputClass}
          value={draft}
          placeholder={placeholder ?? "Type and press Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-md border border-border px-3 text-sm text-ink hover:border-primary hover:text-primary"
        >
          Add
        </button>
      </div>
      {value.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-xs text-clay">
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => onChange(value.filter((t) => t !== tag))}
                  className="text-clay/60 hover:text-primary"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ConnectionPicker({
  entity,
  value,
  onChange,
  id,
}: {
  entity: string;
  value: string[];
  onChange: (v: string[]) => void;
  id: string;
}) {
  const [query, setQuery] = useState("");
  const pool = useMemo(
    () => searchRecords.filter((r) => (entity === "Story" ? r.type === "Story" : r.type === entity)),
    [entity],
  );
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return pool.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 6);
  }, [pool, query]);

  const toggle = (title: string) =>
    onChange(value.includes(title) ? value.filter((v) => v !== title) : [...value, title]);

  return (
    <div>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id={id}
          className={cn(inputClass, "pl-9")}
          value={query}
          placeholder={`Search ${entity.toLowerCase()} on Indonesia Vibes`}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {query.trim() ? (
        <ul className="mt-2 divide-y divide-border overflow-hidden rounded-md border border-border">
          {matches.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  toggle(m.title);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-sand"
              >
                <span>
                  <span className="text-ink">{m.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{m.context}</span>
                </span>
                {value.includes(m.title) ? <Check className="h-4 w-4 text-primary" aria-hidden /> : null}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => {
                const t = `Suggested: ${query.trim()}`;
                if (!value.includes(t)) onChange([...value, t]);
                setQuery("");
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-primary hover:bg-sand"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Suggest a new profile for “{query.trim()}”
            </button>
          </li>
        </ul>
      ) : null}
      {value.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {value.map((v) => (
            <li key={v}>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs",
                  v.startsWith("Suggested:") ? "border border-border text-muted-foreground" : "bg-blush text-clay",
                )}
              >
                {v}
                <button
                  type="button"
                  aria-label={`Remove ${v}`}
                  onClick={() => onChange(value.filter((x) => x !== v))}
                  className="opacity-60 hover:text-primary hover:opacity-100"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        Nothing is created automatically. Suggested profiles are reviewed by our editors first.
      </p>
    </div>
  );
}

export function FieldControl({
  field,
  value,
  onChange,
  error,
  highlight,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  error?: string;
  highlight?: boolean;
}) {
  const id = `f-${field.name}`;
  const describedBy = [field.help ? `${id}-help` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  const common = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    className: cn(inputClass, error && "border-destructive focus-visible:border-destructive"),
  } as const;

  const asString = typeof value === "string" ? value : "";
  const asArray = Array.isArray(value) ? (value as string[]) : [];

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          {...common}
          rows={field.rows ?? 4}
          value={asString}
          placeholder={field.placeholder ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "select":
      control = (
        <select {...common} value={asString} onChange={(e) => onChange(e.target.value)}>
          <option value="">Please choose…</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
      break;
    case "radio":
      control = (
        <div role="radiogroup" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-2">
          {field.options?.map((o) => (
            <label
              key={o}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors",
                asString === o
                  ? "border-primary bg-blush text-clay"
                  : "border-border text-muted-foreground hover:border-primary hover:text-ink",
              )}
            >
              <input
                type="radio"
                name={field.name}
                value={o}
                checked={asString === o}
                onChange={() => onChange(o)}
                className="sr-only"
              />
              {o}
            </label>
          ))}
        </div>
      );
      break;
    case "checkboxes":
      control = (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((o) => {
            const checked = asArray.includes(o);
            return (
              <label
                key={o}
                className={cn(
                  "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  checked
                    ? "border-primary bg-blush text-clay"
                    : "border-border text-muted-foreground hover:border-primary hover:text-ink",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange(checked ? asArray.filter((x) => x !== o) : [...asArray, o])}
                  className="sr-only"
                />
                {o}
              </label>
            );
          })}
        </div>
      );
      break;
    case "tags":
      control = (
        <TagInput
          id={id}
          value={asArray}
          onChange={onChange}
          {...(field.placeholder ? { placeholder: field.placeholder } : {})}
        />
      );
      break;
    case "connections":
      control = <ConnectionPicker id={id} entity={field.entity ?? "Culture"} value={asArray} onChange={onChange} />;
      break;
    case "consent":
      control = (
        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-sand p-3.5">
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            aria-describedby={describedBy || undefined}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[oklch(0.5705_0.2242_31.05)]"
          />
          <span className="text-sm leading-relaxed text-ink">{field.label}</span>
        </label>
      );
      break;
    case "boolean":
      control = (
        <label className="flex cursor-pointer items-center gap-3">
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 accent-[oklch(0.5705_0.2242_31.05)]"
          />
          <span className="text-sm text-ink">Yes</span>
        </label>
      );
      break;
    case "sensitivity":
      control = (
        <div className="rounded-md border border-border bg-sand p-4">
          <p className="text-sm text-ink">Does this submission contain any of the following?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SENSITIVITY_FLAGS.map((flag) => {
              const checked = asArray.includes(flag);
              return (
                <label
                  key={flag}
                  className={cn(
                    "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    checked
                      ? "border-primary bg-background text-clay"
                      : "border-border bg-background text-muted-foreground hover:border-primary hover:text-ink",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChange(checked ? asArray.filter((x) => x !== flag) : [...asArray, flag])
                    }
                    className="sr-only"
                  />
                  {flag}
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Nothing here is rejected automatically. Flagged submissions are handled with additional
            editorial care and, where needed, a permission check with the community involved.
          </p>
        </div>
      );
      break;
    case "date":
    case "time":
    case "url":
      control = (
        <input
          {...common}
          type={field.type === "url" ? "url" : field.type}
          value={asString}
          placeholder={field.type === "url" ? "https://" : (field.placeholder ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    default:
      control = (
        <input
          {...common}
          type="text"
          value={asString}
          placeholder={field.placeholder ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }

  const labelless = field.type === "consent";

  return (
    <div
      className={cn(
        field.half ? "sm:col-span-1" : "sm:col-span-2",
        highlight && "rounded-lg border-l-2 border-primary bg-blush/40 py-3 pl-4",
      )}
    >
      {!labelless ? (
        <label
          id={`${id}-label`}
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          {field.label}
          {field.required ? (
            <span className="ml-1 text-primary" aria-hidden>
              *
            </span>
          ) : (
            <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
          )}
        </label>
      ) : null}
      {field.help ? (
        <p id={`${id}-help`} className="mb-2 text-xs leading-relaxed text-muted-foreground">
          {field.help}
        </p>
      ) : null}
      {control}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
