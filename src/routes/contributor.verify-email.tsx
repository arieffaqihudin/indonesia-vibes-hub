import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";

import { AuthShell } from "@/components/contributor/WorkspaceShell";
import { btn, PrototypeNote } from "@/components/contributor/primitives";
import { useWorkspace } from "@/lib/contributor/store";

export const Route = createFileRoute("/contributor/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — Indonesia Vibes Contributor Workspace" },
      { name: "description", content: "Confirm your work email to finish setting up your contributor account." },
      { property: "og:title", content: "Verify your email — Indonesia Vibes" },
      { property: "og:description", content: "Confirm your work email to finish setting up your contributor account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { user, verifyEmail } = useWorkspace();
  const navigate = useNavigate();

  return (
    <AuthShell
      title="Check your inbox"
      intro={`We have sent a confirmation link to ${user?.email || "your work email"}. Confirming it helps our editors know who they are working with.`}
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
          <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm leading-relaxed text-muted-foreground">
            The link expires in 24 hours. If it does not arrive, check your spam folder or ask us to
            send it again.
          </p>
        </div>
        <button
          type="button"
          className={`${btn.primary} w-full`}
          onClick={() => {
            verifyEmail();
            navigate({ to: "/contributor/onboarding" });
          }}
        >
          I have confirmed my email
        </button>
        <button type="button" className={`${btn.secondary} w-full`}>
          Send the link again
        </button>
        <PrototypeNote>Prototype verification — the button above stands in for the emailed link.</PrototypeNote>
      </div>
    </AuthShell>
  );
}
