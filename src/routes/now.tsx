import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Compatibility route. NOW is no longer a destination — freshness lives across
 * the platform, led by the homepage In Focus composition.
 */
export const Route = createFileRoute("/now")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "in-focus" });
  },
});
