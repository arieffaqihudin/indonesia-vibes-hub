import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/people/")({ beforeLoad: () => { throw redirect({ to: "/understand-indonesia/people-organisations", statusCode: 301 }); } });
