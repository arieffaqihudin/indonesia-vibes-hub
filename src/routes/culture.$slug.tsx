import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { forms } from "@/data/content";

/** Retired culture URLs have one destination and no duplicate indexable page. */
export const Route = createFileRoute("/culture/$slug")({
  beforeLoad: ({ params }) => {
    const form = forms.find((item) => item.slug === params.slug);
    if (!form) throw notFound();
    if (form.pillar === "heritage") {
      throw redirect({ to: "/understand-indonesia/heritage/$slug", params: { slug: form.slug }, statusCode: 301 });
    }
    throw redirect({ to: "/understand-indonesia", statusCode: 301 });
  },
});
