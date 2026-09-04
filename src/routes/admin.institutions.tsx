import { createFileRoute } from "@tanstack/react-router";

import { ContentListing } from "@/components/admin/ContentListing";
import { adminHead } from "@/lib/admin/head";

export const Route = createFileRoute("/admin/institutions")({
  head: adminHead("Institutions", "Museums, universities, archives and cultural organisations profiled publicly."),
  component: Institutions,
});

function Institutions() {
  return (
    <ContentListing
      title="Institutions"
      description="Museums, universities, archives and cultural organisations profiled publicly."
      kinds={["institution"]}
      createKind="institution"
      
    />
  );
}
