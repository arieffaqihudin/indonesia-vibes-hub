import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/collaborate")({ beforeLoad: () => { throw redirect({ to: "/connect", statusCode: 301 }); } });
