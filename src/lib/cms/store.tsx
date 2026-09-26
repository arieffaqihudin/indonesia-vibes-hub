import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { seedPages, seedRecords, seedRequests, seedSettings, seedTeam } from "./seed";
import type { CmsPage, CmsRecord, CmsRequest, CmsSettings, CmsTeamMember, CmsType, PageId } from "./types";

const STORAGE_KEY = "iv-cms-v1";

interface CmsState {
  records: CmsRecord[];
  requests: CmsRequest[];
  pages: CmsPage[];
  team: CmsTeamMember[];
  settings: CmsSettings;
}

const initial = (): CmsState => ({ records: seedRecords(), requests: seedRequests(), pages: seedPages(), team: seedTeam(), settings: seedSettings() });
const now = () => new Date().toISOString();
export const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

interface CmsContextValue extends CmsState {
  editorName: string;
  setEditorName: (name: string) => void;
  getRecord: (id: string) => CmsRecord | undefined;
  byType: (...types: CmsType[]) => CmsRecord[];
  createRecord: (type: CmsType, patch?: Partial<CmsRecord>) => CmsRecord;
  updateRecord: (id: string, patch: Partial<CmsRecord>) => void;
  deleteRecord: (id: string) => void;
  updateRequest: (id: string, patch: Partial<CmsRequest>) => void;
  updatePage: (id: PageId, patch: Partial<CmsPage>) => void;
  setTeam: (team: CmsTeamMember[]) => void;
  updateSettings: (patch: Partial<CmsSettings>) => void;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CmsState>(initial);
  const [editorName, setEditorName] = useState("Editor");
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initial(), ...(JSON.parse(raw) as Partial<CmsState>) });
    } catch { /* storage is best effort */ }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore quota */ }
  }, [state]);

  const updateRecord = useCallback((id: string, patch: Partial<CmsRecord>) => {
    setState((s) => ({ ...s, records: s.records.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: now(), updatedBy: editorName } : r)) }));
  }, [editorName]);

  const value = useMemo<CmsContextValue>(() => ({
    ...state,
    editorName,
    setEditorName,
    getRecord: (id) => state.records.find((r) => r.id === id),
    byType: (...types) => state.records.filter((r) => types.includes(r.type)),
    createRecord: (type, patch = {}) => {
      const record: CmsRecord = {
        id: newId(type.slice(0, 3)), type, title: "", slug: "", status: "Draft", summary: "", body: "", image: "",
        fields: type === "article" ? { format: "Knowledge", source: "Internal" } : {}, relations: {},
        createdAt: now(), updatedAt: now(), updatedBy: editorName, ...patch,
      };
      setState((s) => ({ ...s, records: [record, ...s.records] }));
      return record;
    },
    updateRecord,
    deleteRecord: (id) => setState((s) => ({ ...s, records: s.records.filter((r) => r.id !== id) })),
    updateRequest: (id, patch) => setState((s) => ({ ...s, requests: s.requests.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
    updatePage: (id, patch) => setState((s) => ({ ...s, pages: s.pages.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: now(), updatedBy: editorName } : p)) })),
    setTeam: (team) => setState((s) => ({ ...s, team })),
    updateSettings: (patch) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
  }), [state, editorName, updateRecord]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside CmsProvider");
  return ctx;
}

export const slugify = (text: string) => text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const formatWhen = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");
