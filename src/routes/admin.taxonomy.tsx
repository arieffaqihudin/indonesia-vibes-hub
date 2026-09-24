import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/taxonomy")({ beforeLoad: () => { throw redirect({ to: "/admin/topics" }); } });
