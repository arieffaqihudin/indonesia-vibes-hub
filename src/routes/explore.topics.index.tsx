import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/explore/topics/")({ beforeLoad: () => { throw redirect({ to: "/understand-indonesia/topics" }); } });
