import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/collaborations/")({ beforeLoad: () => { throw redirect({ to: "/collaborate" }); } });
