import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/inquiries/")({ beforeLoad: () => { throw redirect({ to: "/admin/collaborations" }); } });
