import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthShell } from "@/components/contributor/WorkspaceShell";
import { btn, inputClass, PrototypeNote } from "@/components/contributor/primitives";
import { useWorkspace } from "@/lib/contributor/store";

export const Route = createFileRoute("/contributor/register")({
  head: () => ({
    meta: [
      { title: "Become a contributor — Indonesia Vibes" },
      {
        name: "description",
        content:
          "Create a contributor account to propose articles, events, cultural profiles and collaborations to the Indonesia Vibes editorial team.",
      },
      { property: "og:title", content: "Become a contributor — Indonesia Vibes" },
      { property: "og:description", content: "Join embassies, museums, universities and communities contributing to Indonesia Vibes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useWorkspace();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    organisation: "",
    role: "",
    country: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const field = (key: keyof typeof form, label: string, type = "text", autoComplete?: string) => (
    <div>
      <label htmlFor={key} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={key}
        type={type}
        autoComplete={autoComplete ?? "off"}
        className={inputClass}
        value={form[key]}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
      {errors[key] ? (
        <p id={`${key}-error`} role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {errors[key]}
        </p>
      ) : null}
    </div>
  );

  return (
    <AuthShell
      title="Become a contributor"
      intro="Six short questions. Your organisation profile comes next, and you can finish it later."
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/contributor/login" className="text-primary underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const found: Record<string, string> = {};
          if (!form.name.trim()) found["name"] = "Please tell us your name.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) found["email"] = "Enter a valid work email address.";
          if (!form.organisation.trim()) found["organisation"] = "Which organisation are you contributing for?";
          if (!form.country.trim()) found["country"] = "Please add a country.";
          if (form.password.length < 8) found["password"] = "Use at least 8 characters.";
          setErrors(found);
          if (Object.keys(found).length > 0) return;
          register({
            name: form.name,
            email: form.email,
            role: form.role,
            country: form.country,
            workspaceRole: "Organisation Admin",
          });
          navigate({ to: "/contributor/verify-email" });
        }}
      >
        {field("name", "Full name", "text", "name")}
        {field("email", "Work email", "email", "email")}
        {field("organisation", "Organisation")}
        {field("role", "Role / position")}
        {field("country", "Country")}
        {field("password", "Password", "password", "new-password")}
        <button type="submit" className={`${btn.primary} w-full`}>
          Create account
        </button>
        <PrototypeNote>
          Prototype registration. Nothing is sent, and no identity documents are required.
        </PrototypeNote>
      </form>
    </AuthShell>
  );
}
