import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Near-full-screen on phones, centred dialog on larger screens. */
export function Modal({ title, onClose, children, footer, wide = false }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  return <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
    <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/40" onClick={onClose} />
    <div className={cn("relative flex max-h-[100dvh] w-full flex-col bg-background shadow-xl sm:max-h-[90dvh] sm:rounded-md", wide ? "sm:max-w-2xl" : "sm:max-w-md", "h-[100dvh] sm:h-auto")}>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted sm:h-8 sm:w-8"><X className="h-4 w-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      {footer ? <div className="flex justify-end gap-2 border-t border-border px-5 py-3">{footer}</div> : null}
    </div>
  </div>;
}

export function Confirm({ title, text, confirmLabel, onConfirm, onClose, danger = false, busy = false }: { title: string; text: ReactNode; confirmLabel: string; onConfirm?: () => void; onClose: () => void; danger?: boolean; busy?: boolean }) {
  return <Modal title={title} onClose={onClose} footer={<>
    <button type="button" onClick={onClose} className="inline-flex h-9 items-center rounded-md border border-border px-3.5 text-sm">{onConfirm ? "Cancel" : "OK"}</button>
    {onConfirm ? <button type="button" disabled={busy} onClick={onConfirm} className={cn("inline-flex h-9 items-center rounded-md px-3.5 text-sm font-medium text-primary-foreground disabled:opacity-60", danger ? "bg-deep-red" : "bg-primary")}>{busy ? "Working…" : confirmLabel}</button> : null}
  </>}>
    <div className="text-sm text-ink">{text}</div>
  </Modal>;
}

export const fmtDateTime = (iso?: string | null) => iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(",", " ·") : "—";
