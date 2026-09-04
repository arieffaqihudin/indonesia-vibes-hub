import { createFileRoute } from "@tanstack/react-router";

import { ContentListing } from "@/components/admin/ContentListing";
import { adminHead } from "@/lib/admin/head";

export const Route = createFileRoute("/admin/places")({
  head: adminHead("Places", "Museums, heritage sites, villages and landscapes shown on the public map."),
  component: Places,
});

function Places() {
  return (
    <ContentListing
      title="Places"
      description="Museums, heritage sites, villages and landscapes shown on the public map."
      kinds={["place"]}
      createKind="place"
      
    />
  );
}
