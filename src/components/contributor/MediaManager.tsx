import { FileText, Image as ImageIcon, Link2, Music, Plus, Trash2, Video } from "lucide-react";
import { useRef, useState } from "react";

import {
  PERMISSION_STATUSES,
  type MediaItem,
  type MediaKind,
  type PermissionStatus,
} from "@/lib/contributor/schema";
import { cn } from "@/lib/utils";
import { btn, inputClass } from "./primitives";

const uid = () => Math.random().toString(36).slice(2, 10);

const KIND_ICON: Record<MediaKind, typeof ImageIcon> = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  document: FileText,
};

function Row({
  item,
  onChange,
  onRemove,
}: {
  item: MediaItem;
  onChange: (m: MediaItem) => void;
  onRemove: () => void;
}) {
  const Icon = KIND_ICON[item.kind];
  const field = (
    label: string,
    key: keyof MediaItem,
    placeholder?: string,
  ) => (
    <div>
      <label htmlFor={`${item.id}-${key}`} className="mb-1 block text-xs font-medium text-ink">
        {label}
      </label>
      <input
        id={`${item.id}-${key}`}
        className={inputClass}
        value={(item[key] as string) ?? ""}
        placeholder={placeholder ?? ""}
        onChange={(e) => onChange({ ...item, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <li className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-start gap-4">
        {item.kind === "image" && item.url ? (
          <img
            src={item.url}
            alt=""
            className="h-20 w-20 shrink-0 rounded-md object-cover"
          />
        ) : (
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-sand text-muted-foreground">
            <Icon className="h-6 w-6" aria-hidden />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{item.title || "Untitled file"}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {item.kind}
                {item.fileName ? ` · ${item.fileName}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-sand hover:text-destructive"
              aria-label={`Remove ${item.title || "media item"}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
          {!item.permission ? (
            <p className="mt-2 inline-flex rounded-full bg-blush px-2.5 py-1 text-[0.7rem] text-clay">
              Rights status still needed
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {field("Title", "title")}
        {field("Caption", "caption")}
        {field("Creator", "creator")}
        {field("Credit line", "credit", "As it should appear")}
        {field("Rights holder", "rightsHolder")}
        <div>
          <label htmlFor={`${item.id}-perm`} className="mb-1 block text-xs font-medium text-ink">
            Permission status
          </label>
          <select
            id={`${item.id}-perm`}
            className={inputClass}
            value={item.permission ?? ""}
            onChange={(e) => onChange({ ...item, permission: e.target.value as PermissionStatus })}
          >
            <option value="">Please choose…</option>
            {PERMISSION_STATUSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        {field("Usage restrictions", "restrictions", "e.g. web only, no cropping")}
        {item.kind === "image" ? field("Alt text", "altText", "What is in the image?") : null}
        {item.kind !== "image" || !item.fileName ? field("Link", "url", "https://") : null}
      </div>
    </li>
  );
}

export function MediaManager({
  value,
  onChange,
}: {
  value: MediaItem[];
  onChange: (v: MediaItem[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [linkKind, setLinkKind] = useState<MediaKind | null>(null);
  const [linkUrl, setLinkUrl] = useState("");

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: MediaItem[] = Array.from(files).map((file) => ({
      id: uid(),
      kind: file.type.startsWith("image/") ? "image" : "document",
      title: file.name.replace(/\.[^.]+$/, ""),
      fileName: file.name,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      permission: "",
    }));
    onChange([...value, ...next]);
  };

  return (
    <div>
      <ul className="space-y-3">
        {value.map((item) => (
          <Row
            key={item.id}
            item={item}
            onChange={(m) => onChange(value.map((v) => (v.id === m.id ? m : v)))}
            onRemove={() => onChange(value.filter((v) => v.id !== item.id))}
          />
        ))}
      </ul>

      <div className="mt-4 rounded-lg border border-dashed border-border p-5 text-center">
        <p className="text-sm text-ink">Add images, documents, or links</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Prototype upload — files stay in your browser and are not sent anywhere.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button type="button" className={btn.secondary} onClick={() => fileRef.current?.click()}>
            <Plus className="h-4 w-4" aria-hidden />
            Choose files
          </button>
          <button type="button" className={btn.quiet} onClick={() => setLinkKind("video")}>
            <Link2 className="h-3.5 w-3.5" aria-hidden /> Video link
          </button>
          <button type="button" className={btn.quiet} onClick={() => setLinkKind("audio")}>
            <Link2 className="h-3.5 w-3.5" aria-hidden /> Audio link
          </button>
          <button type="button" className={btn.quiet} onClick={() => setLinkKind("document")}>
            <Link2 className="h-3.5 w-3.5" aria-hidden /> Document link
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="sr-only"
          aria-label="Choose media files"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {linkKind ? (
          <div className="mx-auto mt-4 flex max-w-md gap-2">
            <label htmlFor="media-link" className="sr-only">
              {linkKind} link
            </label>
            <input
              id="media-link"
              className={inputClass}
              value={linkUrl}
              placeholder="https://"
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <button
              type="button"
              className={cn(btn.secondary, "shrink-0")}
              onClick={() => {
                if (!linkUrl.trim()) return;
                onChange([
                  ...value,
                  { id: uid(), kind: linkKind, title: linkUrl.trim(), url: linkUrl.trim(), permission: "" },
                ]);
                setLinkUrl("");
                setLinkKind(null);
              }}
            >
              Add
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
