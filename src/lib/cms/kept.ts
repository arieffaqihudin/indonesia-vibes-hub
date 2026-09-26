import { useCallback, useState } from "react";

/** List filters/search/page kept in memory for the session, so Back restores them. */
const kept = new Map<string, unknown>();

export function useKept<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => (kept.has(key) ? (kept.get(key) as T) : initial));
  const set = useCallback((v: T) => { kept.set(key, v); setValue(v); }, [key]);
  return [value, set];
}
