import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "@/components/editorial/Section";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Indonesia Vibes" },
      { name: "description", content: "Send an inquiry to the Indonesia Vibes programme team." },
      { property: "og:title", content: "Contact — Indonesia Vibes" },
      { property: "og:description", content: "Send an inquiry to the Indonesia Vibes programme team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Contact"
        intro="One form, read by a person. Press, partnership and application questions all land in the same place."
      />
      <div className="container-editorial grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <form
          className="max-w-xl space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <label htmlFor="name" className="text-sm font-medium text-ink">Name</label>
            <input id="name" name="name" required className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink" />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">Email</label>
            <input id="email" name="email" type="email" required className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink" />
          </div>
          <div>
            <label htmlFor="topic" className="text-sm font-medium text-ink">Topic</label>
            <select id="topic" name="topic" className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink">
              <option>Partnership</option>
              <option>Press</option>
              <option>Open call or funding</option>
              <option>Research</option>
              <option>Something else</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-medium text-ink">Message</label>
            <textarea id="message" name="message" rows={6} required className="mt-2 w-full border border-border bg-background p-3 text-sm text-ink" />
          </div>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red"
          >
            Send inquiry
          </button>
          <p aria-live="polite" className="text-sm text-clay">
            {sent ? "Thank you — this demo form does not send yet, but the team would reply within five working days." : ""}
          </p>
        </form>

        <aside className="space-y-6 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <div>
            <p className="eyebrow text-muted-foreground">Email</p>
            <a href={`mailto:${brand.email}`} className="mt-2 block text-sm text-primary underline underline-offset-4">
              {brand.email}
            </a>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">Response time</p>
            <p className="mt-2 text-sm text-ink">Five working days, in English or Indonesian.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
