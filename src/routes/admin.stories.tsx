import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/stories")({ beforeLoad: () => { throw redirect({ to: "/admin/articles" }); } });