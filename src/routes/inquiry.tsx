import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/inquiry")({ beforeLoad: () => { throw redirect({ to: "/connect", statusCode: 301 }); } });