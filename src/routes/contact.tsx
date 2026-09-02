import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "@/components/editorial/Section";
import { brand } from "@/lib/brand";
import { INQUIRY_TOPICS, STRUCTURED_TOPICS, isInquiryTopic } from "@/lib/inquiry";
import type { InquiryTopic } from "@/lib/inquiry";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    topic: isInquiryTopic(search.topic) ? search.topic : undefined,
    subject: typeof search.subject === "string" ? search.subject : undefined,
    ref: typeof search.ref === "string" ? search.ref : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact & Introductions — Indonesia Vibes" },
      {
        name: "description",
        content:
          "Request an introduction to an artist, community or institution, propose a collaboration, or send an editorial question to the Indonesia Vibes team.",
      },
      { property: "og:title", content: "Contact & Introductions — Indonesia Vibes" },
      {
        property: "og:description",
        content: "One managed inbox for introductions, partnerships and editorial questions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { topic: presetTopic, subject: presetSubject, ref } = Route.useSearch();
  const [topic, setTopic] = useState<InquiryTopic>(presetTopic ?? "General question");
  const [sent, setSent] = useState(false);
  const structured = STRUCTURED_TOPICS.includes(topic);

  return (
    <>
      <PageHeader
        eyebrow="Connect"
        title="Contact and introductions"
        intro="Every request is read by a person. Introductions to artists, communities and institutions are made by the programme team with their consent — we never publish personal contact details."
      />

      <div
        id="inquiry"
        className="container-editorial grid scroll-mt-28 gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]"
      >
        <form
          className="max-w-xl space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {presetSubject ? (
            <p className="border-l-2 border-primary bg-sand p-4 text-sm leading-relaxed text-ink">
              This form is prefilled for <span className="font-medium">{presetSubject}</span>. Add
              your context below and we will route it to the right people.
            </p>
          ) : null}

          <div>
            <label htmlFor="topic" className="text-sm font-medium text-ink">
              What is this about?
            </label>
            <select
              id="topic"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value as InquiryTopic)}
              className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink"
            >
              {INQUIRY_TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="text-sm font-medium text-ink">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              defaultValue={presetSubject ?? ""}
              required
              className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-ink">
                Your name
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink"
              />
            </div>
          </div>

          <div>
            <label htmlFor="organisation" className="text-sm font-medium text-ink">
              Organisation <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="organisation"
              name="organisation"
              className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink"
            />
          </div>

          {structured ? (
            <fieldset className="space-y-6 border border-border p-5">
              <legend className="px-2 text-sm font-medium text-ink">About the collaboration</legend>
              <div>
                <label htmlFor="intent" className="text-sm font-medium text-ink">
                  What are you hoping to do together?
                </label>
                <textarea
                  id="intent"
                  name="intent"
                  rows={3}
                  className="mt-2 w-full border border-border bg-background p-3 text-sm text-ink"
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="timeframe" className="text-sm font-medium text-ink">
                    Timeframe
                  </label>
                  <input
                    id="timeframe"
                    name="timeframe"
                    placeholder="e.g. autumn 2027"
                    className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink"
                  />
                </div>
                <div>
                  <label htmlFor="audience" className="text-sm font-medium text-ink">
                    Audience or venue
                  </label>
                  <input
                    id="audience"
                    name="audience"
                    className="mt-2 min-h-11 w-full border border-border bg-background px-3 text-sm text-ink"
                  />
                </div>
              </div>
            </fieldset>
          ) : null}

          <div>
            <label htmlFor="message" className="text-sm font-medium text-ink">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className="mt-2 w-full border border-border bg-background p-3 text-sm text-ink"
            />
          </div>

          {ref ? <input type="hidden" name="ref" value={ref} /> : null}

          <button
            type="submit"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-deep-red"
          >
            Send inquiry
          </button>
          <p aria-live="polite" className="text-sm text-clay">
            {sent
              ? "Thank you — this demonstration form does not send yet. In production the team replies within five working days."
              : ""}
          </p>
        </form>

        <aside className="space-y-8 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <div>
            <p className="eyebrow text-muted-foreground">Email</p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-2 block text-sm text-primary underline underline-offset-4"
            >
              {brand.email}
            </a>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">Response time</p>
            <p className="mt-2 text-sm text-ink">Five working days, in English or Indonesian.</p>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">How introductions work</p>
            <ol className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>1. You describe the project and the timeframe.</li>
              <li>2. We check interest and availability with the practitioner or institution.</li>
              <li>3. If both sides agree, we introduce you directly.</li>
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}
