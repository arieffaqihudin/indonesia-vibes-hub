import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/places")({ beforeLoad: () => { throw redirect({ to: "/admin/events-places" }); } });