import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/partners/")({ beforeLoad: () => { throw redirect({ to: "/admin/people-organisations" }); } });
