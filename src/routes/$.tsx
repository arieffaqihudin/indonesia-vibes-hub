import { createFileRoute, Link } from "@tanstack/react-router";

import { popularSearches } from "@/data/graph";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page not found — Indonesia Vibes" },
      { name: "description", content: "This page does not exist. Find your way back into the platform." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Page not found — Indonesia Vibes" },
      { property: "og:description", content: "This page does not exist." },
    ],
  }),
  component: NotFoundPage,
});

const ROUTES = [
  { to: "/understand-indonesia" as const, label: "Understand Indonesia" },
  { to: "/events-places" as const, label: "Events & Places" },
  { to: "/around-the-world" as const, label: "Indonesia Around the World" },
  { to: "/collaborate" as const, label: "Collaborate with Indonesia" },
  { to: "/about" as const, label: "About" },
];

function NotFoundPage() {
  return (
    <div className="wave-field bg-sand">
      <div className="container-editorial py-24 md:py-32">
        <p className="eyebrow text-primary">404</p>
        <h1 className="display-1 mt-5 max-w-3xl text-ink">
          This page has travelled somewhere else
        </h1>
        <p className="standfirst mt-6 max-w-2xl">
          The address does not match anything on the platform. Search the whole knowledge network, or
          pick up one of the main routes below.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/search"
            search={{ q: "" }}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-deep-red"
          >
            Search Indonesia Vibes
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-full border border-border px-6 text-sm font-medium text-ink hover:border-primary hover:text-primary"
          >
            Back to the home page
          </Link>
        </div>

        <ul className="mt-14 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROUTES.map((r) => (
            <li key={r.to} className="border-l-2 border-primary/30 pl-5">
              <Link to={r.to} className="link-underline text-ink">
                {r.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-14 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Popular searches:</span>
          {popularSearches.map((s) => (
            <Link
              key={s}
              to="/search"
              search={{ q: s }}
              className="min-h-9 text-primary underline underline-offset-4"
            >
              {s}
            </Link>
          ))}
        </p>
      </div>
    </div>
  );
}
