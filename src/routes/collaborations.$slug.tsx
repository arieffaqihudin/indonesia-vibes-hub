import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/collaborations/$slug")({
  beforeLoad: ({ params }) => { throw redirect({ to: "/collaborate/$slug", params: { slug: params.slug }, statusCode: 301 }); },
});
