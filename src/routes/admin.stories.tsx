import { createFileRoute } from "@tanstack/react-router";

import { ContentListing } from "@/components/admin/ContentListing";
import { adminHead } from "@/lib/admin/head";

export const Route = createFileRoute("/admin/stories")({
  head: adminHead("Stories", "Everything published as a story, and everything on its way there."),
  component: Stories,
});

function Stories() {
  return (
    <ContentListing
      title="Stories"
      description="Everything published as a story, and everything on its way there."
      kinds={["story"]}
      createKind="story"
      
    />
  );
}
