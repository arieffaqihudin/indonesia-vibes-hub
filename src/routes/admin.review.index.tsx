import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/review/")({ beforeLoad: () => { throw redirect({ to: "/admin/articles" }); } });
