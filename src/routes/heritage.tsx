import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/heritage")({
  beforeLoad: () => { throw redirect({ to: "/understand-indonesia", statusCode: 301 }); },
});