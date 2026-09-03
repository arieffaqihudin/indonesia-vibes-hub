import { Link, createFileRoute } from "@tanstack/react-router";

import { WorkspaceShell } from "@/components/contributor/WorkspaceShell";
import { btn, PageHeading, Panel } from "@/components/contributor/primitives";
import { STATUSES, SUBMISSION_TYPES } from "@/lib/contributor/schema";

export const Route = createFileRoute("/contributor/help")({
  head: () => ({
    meta: [
      { title: "Help and guidelines — Indonesia Vibes Contributor Workspace" },
      {
        name: "description",
        content:
          "How contributions are reviewed, what our editors look for, what each status means, and how to reach a human.",
      },
      { property: "og:title", content: "Help and guidelines — Indonesia Vibes Contributor Workspace" },
      { property: "og:description", content: "How review works and what our editors look for." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HelpPage,
});

const FAQ = [
  {
    q: "Who decides what gets published?",
    a: "The Indonesia Vibes editorial team. Contributors prepare and submit material; our editors verify, edit into house style and schedule publication. This keeps a single, consistent voice for a global readership.",
  },
  {
    q: "How long does review take?",
    a: "Most submissions receive a first response within five to ten working days. Time-sensitive events are prioritised, so tell us the date in the form.",
  },
  {
    q: "Can I edit something after it is published?",
    a: "Yes — open the submission and use Suggest an update. An editor will apply the change and note it on the page where relevant.",
  },
  {
    q: "What if I only have part of the information?",
    a: "Save a draft and come back. Nothing is sent to us until you choose to submit, and drafts keep everything you have entered.",
  },
  {
    q: "Do I need professional photography?",
    a: "No. Clear, well-lit images with accurate credits are more useful than polished images we cannot licence. Always tell us who took the photograph and what permission you hold.",
  },
];

const LOOKS_FOR = [
  "Accuracy: names, dates, places and spellings we can verify.",
  "Attribution: who holds the knowledge, who made the work, who took the photograph.",
  "Context: why this matters to the community it comes from, not only why it is interesting.",
  "Consent: permission for images, recordings and any restricted cultural material.",
  "Clarity: written for a reader outside Indonesia who is curious but unfamiliar.",
];

function HelpPage() {
  return (
    <WorkspaceShell>
      <PageHeading
        eyebrow="Help"
        title="How contribution works"
        intro="A short guide to what we ask for, how review runs, and where to get a human answer."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="What our editors look for">
            <ul className="space-y-2.5">
              {LOOKS_FOR.map((l) => (
                <li key={l} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                  {l}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="What each status means">
            <dl className="space-y-3">
              {Object.entries(STATUSES).map(([key, meta]) => (
                <div key={key} className="border-l-2 border-border pl-3">
                  <dt className="text-sm font-medium text-ink">{meta.label}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">{meta.meaning}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Common questions">
            <dl className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <dt className="text-sm font-medium text-ink">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="What you can submit">
            <ul className="space-y-3">
              {SUBMISSION_TYPES.map((t) => (
                <li key={t.type}>
                  <p className="text-sm font-medium text-ink">{t.label}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{t.description}</p>
                </li>
              ))}
            </ul>
            <Link to="/contributor/new" className={`${btn.secondary} mt-5`}>
              Start a submission
            </Link>
          </Panel>

          <Panel title="Cultural sensitivity">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Some knowledge is sacred, restricted, or held collectively. If material should not be photographed,
              reproduced, or described in detail, flag it in the form. We would rather publish less than publish
              something a community did not agree to.
            </p>
          </Panel>

          <Panel title="Talk to an editor">
            <p className="text-sm leading-relaxed text-muted-foreground">
              If something does not fit the forms, or you are unsure whether an idea is right for the platform, write
              to us before you spend time on it.
            </p>
            <a href="mailto:editorial@indonesiavibes.org" className={`${btn.primary} mt-4`}>
              Email the editorial team
            </a>
          </Panel>
        </div>
      </div>
    </WorkspaceShell>
  );
}
