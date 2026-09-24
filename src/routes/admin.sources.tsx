import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/sources")({ beforeLoad: () => { throw redirect({ to: "/admin/settings" }); } });
