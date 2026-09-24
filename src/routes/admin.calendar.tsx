import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/calendar")({ beforeLoad: () => { throw redirect({ to: "/admin/events-places" }); } });
