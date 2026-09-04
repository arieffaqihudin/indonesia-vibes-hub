import { createFileRoute } from "@tanstack/react-router";

import { ContentListing } from "@/components/admin/ContentListing";
import { adminHead } from "@/lib/admin/head";

export const Route = createFileRoute("/admin/culture")({
  head: adminHead("Culture", "Cultural subjects — the forms, practices and traditions the rest of the platform connects to."),
  component: Culture,
});

function Culture() {
  return (
    <ContentListing
      title="Culture"
      description="Cultural subjects — the forms, practices and traditions the rest of the platform connects to."
      kinds={["culture"]}
      createKind="culture"
      
    />
  );
}
