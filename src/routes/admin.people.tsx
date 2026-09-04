import { createFileRoute } from "@tanstack/react-router";

import { ContentListing } from "@/components/admin/ContentListing";
import { adminHead } from "@/lib/admin/head";

export const Route = createFileRoute("/admin/people")({
  head: adminHead("People & Communities", "Named practitioners and the communities that hold knowledge collectively."),
  component: PeopleAndCommunities,
});

function PeopleAndCommunities() {
  return (
    <ContentListing
      title="People & Communities"
      description="Named practitioners and the communities that hold knowledge collectively."
      kinds={["person", "community"]}
      createKind="person"
      showTypeColumn
    />
  );
}
