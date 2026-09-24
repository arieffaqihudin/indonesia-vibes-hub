import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/culture")({ beforeLoad: () => { throw redirect({ to: "/admin/topics" }); } });
