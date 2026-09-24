import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/homepage/")({
  beforeLoad: () => { throw redirect({ to: "/admin/homepage/sections" }); },
});