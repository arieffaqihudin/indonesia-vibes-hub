import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/collections/$slug")({
  beforeLoad: ({ params }) => { throw redirect({ to: "/understand-indonesia/collections/$slug", params: { slug: params.slug }, statusCode: 301 }); },
});