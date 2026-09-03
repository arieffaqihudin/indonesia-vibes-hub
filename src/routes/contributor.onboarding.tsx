import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

import { AuthShell } from "@/components/contributor/WorkspaceShell";
import { btn, inputClass } from "@/components/contributor/primitives";
import { SUBMISSION_TYPES } from "@/lib/contributor/schema";
import { ORGANISATION_TYPES, useWorkspace } from "@/lib/contributor/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contributor/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your workspace — Indonesia Vibes Contributor" },
      {
        name: "description",
        content: "Three short steps: about you, your organisation, and what you would like to contribute.",
      },
      { property: "og:title", content: "Set up your workspace — Indonesia Vibes Contributor" },
      { property: "og:description", content: "About you, your organisation, and what you would like to contribute." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

const LANGUAGES = ["English", "Bahasa Indonesia", "Portuguese", "Japanese", "French", "Other"];

function OnboardingPage() {
  const { user, organisation, completeOnboarding } = useWorkspace();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [you, setYou] = useState({
    name: user?.name ?? "",
    role: user?.role ?? "",
    bio: user?.bio ?? "",
    country: user?.country ?? "",
    language: user?.language ?? "English",
  });
  const [org, setOrg] = useState({
    name: organisation.name,
    type: organisation.type,
    country: organisation.country,
    city: organisation.city,
    website: organisation.website,
    description: organisation.description,
  });
  const [interests, setInterests] = useState<string[]>([]);

  const input = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts?: { textarea?: boolean; type?: string; options?: readonly string[]; help?: string },
  ) => {
    const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
        {opts?.help ? <p className="mb-2 text-xs text-muted-foreground">{opts.help}</p> : null}
        {opts?.options ? (
          <select id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Please choose…</option>
            {opts.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : opts?.textarea ? (
          <textarea id={id} rows={4} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input
            id={id}
            type={opts?.type ?? "text"}
            className={inputClass}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    );
  };

  const steps = ["About you", "Your organisation", "What you would like to contribute", "Ready"];

  return (
    <AuthShell
      title={step === 3 ? "Your workspace is ready." : steps[step]!}
      intro={
        step === 0
          ? "So our editors know who they are working with."
          : step === 1
            ? "This appears alongside anything your organisation contributes."
            : step === 2
              ? "Only to shape your starting point — you can submit any type at any time."
              : "You can change any of this later in Account and Organisation."
      }
    >
      <div className="mb-6 flex gap-1" aria-hidden>
        {steps.map((s, i) => (
          <span key={s} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {steps.length}: {steps[step]}
      </p>

      {step === 0 ? (
        <div className="space-y-4">
          {input("Full name", you.name, (v) => setYou({ ...you, name: v }))}
          {input("Role", you.role, (v) => setYou({ ...you, role: v }))}
          {input("Short professional profile", you.bio, (v) => setYou({ ...you, bio: v }), {
            textarea: true,
            help: "Two or three lines. What you work on, and what you know well.",
          })}
          {input("Country", you.country, (v) => setYou({ ...you, country: v }))}
          {input("Preferred language", you.language, (v) => setYou({ ...you, language: v }), {
            options: LANGUAGES,
          })}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          {input("Organisation name", org.name, (v) => setOrg({ ...org, name: v }))}
          {input("Organisation type", org.type, (v) => setOrg({ ...org, type: v }), {
            options: ORGANISATION_TYPES,
          })}
          {input("Country", org.country, (v) => setOrg({ ...org, country: v }))}
          {input("City", org.city, (v) => setOrg({ ...org, city: v }))}
          {input("Website", org.website, (v) => setOrg({ ...org, website: v }), { type: "url" })}
          {input("Short description", org.description, (v) => setOrg({ ...org, description: v }), {
            textarea: true,
          })}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-3">
          {SUBMISSION_TYPES.map((t) => {
            const active = interests.includes(t.label);
            return (
              <label
                key={t.type}
                className={cn(
                  "cursor-pointer rounded-lg border p-4 transition-colors",
                  active ? "border-primary bg-blush" : "border-border hover:border-primary",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() =>
                    setInterests(active ? interests.filter((x) => x !== t.label) : [...interests, t.label])
                  }
                />
                <span className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{t.label}</span>
                  {active ? <Check className="h-4 w-4 text-primary" aria-hidden /> : null}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {t.description}
                </span>
              </label>
            );
          })}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            You can now prepare submissions, invite colleagues, and follow each contribution through
            editorial review. Everything saves as you go.
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && step < 3 ? (
          <button type="button" className={btn.secondary} onClick={() => setStep(step - 1)}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        ) : null}
        {step < 2 ? (
          <button type="button" className={btn.primary} onClick={() => setStep(step + 1)}>
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
        {step === 2 ? (
          <button
            type="button"
            className={btn.primary}
            onClick={() => {
              completeOnboarding(
                {
                  name: you.name || "Contributor",
                  role: you.role,
                  bio: you.bio,
                  country: you.country,
                  language: you.language,
                },
                { ...org, interests },
              );
              setStep(3);
            }}
          >
            Finish setup
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
        {step === 3 ? (
          <button type="button" className={btn.primary} onClick={() => navigate({ to: "/contributor" })}>
            Start contributing
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </AuthShell>
  );
}
