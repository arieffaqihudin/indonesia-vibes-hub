import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/contemporary")({
  beforeLoad: () => { throw redirect({ to: "/understand-indonesia" }); },
});