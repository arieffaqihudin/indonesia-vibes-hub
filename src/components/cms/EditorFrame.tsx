import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Eye, Loader2, SlidersHorizontal, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { CmsStatus } from "@/lib/cms/types";
import { StatusBadge, btn } from "./ui";

export type SaveState = "idle" | "saving" | "saved";

/** The one edit pattern: Back · Title · Save Draft · Preview · Publish, main canvas + settings sidebar. */
export function EditorFrame({ backTo, backLabel, title, status, saveState, onSaveDraft, onPreview, onPublish, canPublish = true, main, sidebar }: {
  backTo: string;
  backLabel: string;
  title: string;
  status?: CmsStatus;
  saveState: SaveState;
  onSaveDraft?: (() => void) | undefined;
  onPreview?: (() => void) | undefined;
  onPublish?: (() => void) | undefined;
  canPublish?: boolean;
  main: ReactNode;
  sidebar: ReactNode;
}) {
  const [drawer, setDrawer] = useState(false);
  const published = status === "Published";
  const publishLabel = !canPublish ? "Submit for Review" : published ? "Update" : "Publish";

  const actions = <>
    {onSaveDraft && !published ? <button type="button" onClick={onSaveDraft} className={btn.secondary}>Save Draft</button> : null}
    {onPreview ? <button type="button" onClick={onPreview} className={btn.secondary}><Eye className="h-4 w-4" />Preview</button> : null}
    {onPublish ? <button type="button" onClick={onPublish} className={btn.primary}>{publishLabel}</button> : null}
  </>;

  return <div className="-mx-4 -my-5 flex min-h-[calc(100dvh-3.5rem)] flex-col sm:-mx-6 lg:-mx-8">
    <div className="sticky top-14 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Link to={backTo as any} className={cn(btn.ghost, "px-2")} aria-label={`Back to ${backLabel}`}><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">{backLabel}</span></Link>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <p className="truncate text-sm font-medium text-ink">{title || "Untitled"}</p>
        {status ? <StatusBadge status={status} /> : null}
        <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex" aria-live="polite">
          {saveState === "saving" ? <><Loader2 className="h-3 w-3 animate-spin" />Saving…</> : saveState === "saved" ? <><Check className="h-3 w-3" />Saved</> : null}
        </span>
      </div>
      <div className="hidden items-center gap-2 md:flex">{actions}</div>
      <button type="button" onClick={() => setDrawer(true)} className={cn(btn.secondary, "lg:hidden")} aria-label="Open settings"><SlidersHorizontal className="h-4 w-4" /><span className="hidden sm:inline">Settings</span></button>
    </div>

    <div className="flex flex-1">
      <div className="min-w-0 flex-1 px-4 py-8 pb-28 sm:px-8 md:pb-10 lg:px-12">{main}</div>
      <aside aria-label="Settings" className="hidden w-80 shrink-0 border-l border-border bg-sand/40 px-5 lg:block">{sidebar}</aside>
    </div>

    {drawer ? <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Settings">
      <button type="button" aria-label="Close settings" className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} />
      <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-xl bg-background px-5 pb-8 sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-96 sm:rounded-none">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background py-3"><p className="text-sm font-semibold text-ink">Settings</p><button type="button" onClick={() => setDrawer(false)} className={btn.icon} aria-label="Close"><X className="h-4 w-4" /></button></div>
        {sidebar}
      </div>
    </div> : null}

    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-end gap-2 border-t border-border bg-background px-4 py-2.5 md:hidden">{actions}</div>
  </div>;
}
