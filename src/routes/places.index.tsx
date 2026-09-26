import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/places/")({ beforeLoad: () => { throw redirect({ to: "/events-places", statusCode: 301 }); } });
