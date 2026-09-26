import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/institutions/")({ beforeLoad: () => { throw redirect({ to: "/understand-indonesia/people-organisations" }); } });
