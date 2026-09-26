import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/research")({
  beforeLoad: () => { throw redirect({ to: "/understand-indonesia", statusCode: 301 }); },
});