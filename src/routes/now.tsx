import { createFileRoute, redirect } from "@tanstack/react-router";

/** Compatibility route: the old NOW destination now forwards to the homepage. */
export const Route = createFileRoute("/now")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
