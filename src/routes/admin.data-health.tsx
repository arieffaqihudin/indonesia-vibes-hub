import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/data-health")({ beforeLoad: () => { throw redirect({ to: "/admin/settings" }); } });
