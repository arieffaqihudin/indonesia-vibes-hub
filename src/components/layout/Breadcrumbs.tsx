import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: string; params?: Record<string, string> };

/** Page trail shown at the top of public detail pages, e.g. Understand Indonesia → Heritage → Gamelan. */
export function Breadcrumbs({ items, tone = "dark", className = "" }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const linkCls = tone === "light" ? "text-background/80 hover:text-background hover:underline" : "text-muted-foreground hover:text-primary hover:underline";
  const sepCls = tone === "light" ? "text-background/50" : "text-muted-foreground/60";
  const currentCls = tone === "light" ? "text-background" : "text-ink";
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium tracking-wide uppercase">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight className={`h-3 w-3 ${sepCls}`} aria-hidden /> : null}
              {last || !item.to ? (
                <span aria-current={last ? "page" : undefined} className={last ? currentCls : linkCls}>{item.label}</span>
              ) : (
                <Link to={item.to} params={item.params} className={`inline-flex min-h-6 items-center ${linkCls}`}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
