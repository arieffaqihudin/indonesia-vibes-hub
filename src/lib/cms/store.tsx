import { useMemo, useSyncExternalStore, type ReactNode } from "react";

import { seedPages, seedRecords, seedRequests, seedSettings, seedTeam } from "./seed";
import { logActivity } from "./activity";
import { TYPE_LABEL } from "./types";
import type { CmsPage, CmsRecord, CmsRequest, CmsSettings, CmsTeamMember, CmsType, PageId } from "./types";

/**
 * CMS state lives outside React so it survives route transitions and is
 * persisted synchronously on every change. Stored in this browser only.
 */
const STORAGE_KEY = "iv-cms-v1";

interface CmsState {
  records: CmsRecord[];
  requests: CmsRequest[];
  pages: CmsPage[];
  team: CmsTeamMember[];
  settings: CmsSettings;
  editorName: string;
}

const initial = (): CmsState => ({ records: seedRecords(), requests: seedRequests(), pages: seedPages(), team: seedTeam(), settings: seedSettings(), editorName: "Editor" });
const now = () => new Date().toISOString();
export const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const serverState = initial();
let state: CmsState | null = null;
const listeners = new Set<() => void>();

function read(): CmsState {
  if (state) return state;
  if (typeof window === "undefined") return serverState;
  state = initial();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...state, ...(JSON.parse(raw) as Partial<CmsState>) };
  } catch { /* storage is best effort */ }
  return state;
}

function write(update: (s: CmsState) => CmsState) {
  state = update(read());
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore quota */ }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };

const MODULE: Record<CmsRecord["type"], string> = {
  article: "Articles", heritage: "Heritage", person: "People & Organisations", community: "People & Organisations", organisation: "People & Organisations",
  event: "Experience", place: "Experience", collaboration: "Collaborations",
};

/** Status changes are the meaningful events; plain autosaved edits are not logged. */
function logStatus(id: string, patch: Partial<CmsRecord>) {
  const r = read().records.find((x) => x.id === id);
  if (!r || !patch.status || patch.status === r.status) return;
  const action = patch.status === "Published" ? "Publish" : patch.status === "Archived" ? "Archive" : r.status === "Published" ? "Unpublish" : `Set to ${patch.status}`;
  void logActivity(action, MODULE[r.type], patch.title ?? r.title ?? "Untitled", { "Previous status": r.status, "New status": patch.status, Type: TYPE_LABEL[r.type].one });
}

const actions = {
  setEditorName: (name: string) => { if (read().editorName !== name) write((s) => ({ ...s, editorName: name })); },
  createRecord: (type: CmsType, patch: Partial<CmsRecord> = {}): CmsRecord => {
    const s = read();
    const record: CmsRecord = {
      id: newId(type.slice(0, 3)), type, title: "", slug: "", status: "Draft", summary: "", body: "", image: "",
      fields: type === "article" ? { format: "Knowledge", source: "Internal" } : {}, relations: {},
      createdAt: now(), updatedAt: now(), updatedBy: s.editorName, ...patch,
    };
    write((x) => ({ ...x, records: [record, ...x.records] }));
    void logActivity("Create", MODULE[type], record.title || `New ${TYPE_LABEL[type].one}`);
    return record;
  },
  updateRecord: (id: string, patch: Partial<CmsRecord>) => { logStatus(id, patch); write((s) => ({ ...s, records: s.records.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: now(), updatedBy: s.editorName } : r)) })); },
  deleteRecord: (id: string) => { const r = read().records.find((x) => x.id === id); if (r) void logActivity("Delete", MODULE[r.type], r.title || "Untitled"); write((s) => ({ ...s, records: s.records.filter((r) => r.id !== id) })); },
  updateRequest: (id: string, patch: Partial<CmsRequest>) => write((s) => ({ ...s, requests: s.requests.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
  updatePage: (id: PageId, patch: Partial<CmsPage>) => { if (patch.status && patch.status !== read().pages.find((p) => p.id === id)?.status) void logActivity(patch.status === "Published" ? "Publish" : `Set to ${patch.status}`, "Pages", id); write((s) => ({ ...s, pages: s.pages.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: now(), updatedBy: s.editorName } : p)) })); },
  setTeam: (team: CmsTeamMember[]) => write((s) => ({ ...s, team })),
  updateSettings: (patch: Partial<CmsSettings>) => write((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
};

export function useCms() {
  const s = useSyncExternalStore(subscribe, read, () => serverState);
  return useMemo(() => ({
    ...s,
    ...actions,
    getRecord: (id: string) => s.records.find((r) => r.id === id),
    byType: (...types: CmsType[]) => s.records.filter((r) => types.includes(r.type)),
  }), [s]);
}

/** Kept for layout composition; state itself is global. */
export function CmsProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const slugify = (text: string) => text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const formatWhen = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");
