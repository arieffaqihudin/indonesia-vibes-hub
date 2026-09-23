import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading } from "@/components/admin/primitives";
import { CONTENT_KINDS } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/create")({ component: CreateChooser });

function CreateChooser() {
  return <>
    <PageHeading eyebrow="Content" title="What would you like to create?" description="Choose the public record you need. Every new item starts as a draft." />
    <ul className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
      {CONTENT_KINDS.filter((item) => item.kind !== "community").map((item) => <li key={item.kind} className="border-r border-b border-border">
        <Link to="/admin/content/new" search={{ kind: item.kind }} className="group block min-h-36 p-6 hover:bg-muted/50">
          <h2 className="text-base font-semibold text-ink group-hover:text-primary">{item.kind === "story" ? "Editorial Content" : item.label}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.kind === "story" ? "An essential, deep dive or perspective." : item.kind === "culture" ? "A reusable cultural knowledge subject." : `A new ${item.label.toLowerCase()} record.`}</p>
          <span className="mt-5 block text-xs font-medium text-primary">Create draft →</span>
        </Link>
      </li>)}
    </ul>
  </>;
}