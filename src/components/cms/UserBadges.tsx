import { cn } from "@/lib/utils";

/** Connected is a brand highlight (red), not an error. */
export function ConnectionLabel({ connected }: { connected: boolean }) {
  return <span className={cn("inline-flex items-center gap-1 text-[0.6875rem] font-medium", connected ? "text-primary" : "text-muted-foreground")}>
    <span className={cn("h-1.5 w-1.5 rounded-full", connected ? "bg-primary" : "bg-muted-foreground/50")} />{connected ? "Connected" : "Not Connected"}
  </span>;
}

export function ActiveLabel({ active }: { active: boolean }) {
  return <span className={cn("inline-flex h-5 items-center rounded-md px-1.5 text-[0.6875rem] font-medium", active ? "bg-sand text-ink ring-1 ring-border" : "bg-muted text-muted-foreground")}>{active ? "Active" : "Inactive"}</span>;
}
