import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/explore/collections")({ beforeLoad: () => { throw redirect({ to: "/understand-indonesia/collections", statusCode: 301 }); } });
