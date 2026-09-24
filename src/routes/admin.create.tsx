import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading } from "@/components/admin/primitives";
import { CONTENT_KINDS } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/create")({ head: () => ({ meta: [{ title: "Create — Indonesia Vibes CMS" }, { name: "description", content: "Create an Indonesia Vibes article or connected cultural record." }, { property: "og:title", content: "Create — Indonesia Vibes CMS" }, { property: "og:description", content: "Create an Indonesia Vibes article or connected cultural record." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: CreateChooser });

function CreateChooser() {
  return <>
    <PageHeading eyebrow="Content" title="What would you like to create?" description="Choose the public record you need. Every new item starts as a draft." />
    <ul className="max-w-5xl border-t border-border">
      {CONTENT_KINDS.filter((item) => item.kind !== "community").map((item) => <li key={item.kind} className="border-b border-border">
        <Link to="/admin/content/new" search={{ kind: item.kind }} className="group grid min-h-20 gap-2 px-3 py-4 hover:bg-blush/35 sm:grid-cols-[14rem_1fr_auto] sm:items-center sm:px-4">
          <h2 className="text-sm font-semibold text-ink group-hover:text-primary">{item.kind === "story" ? "Article" : item.label}</h2>
          <p className="text-sm text-muted-foreground">{item.kind === "story" ? "An essential, deep dive or perspective article." : item.kind === "culture" ? "A reusable cultural knowledge subject." : `A new ${item.label.toLowerCase()} record.`}</p>
          <span className="text-xs font-medium text-primary">Create draft →</span>
        </Link>
      </li>)}
    </ul>
  </>;
}