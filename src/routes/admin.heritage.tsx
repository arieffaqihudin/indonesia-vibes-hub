import { createFileRoute } from "@tanstack/react-router";
import { ContentListing } from "@/components/admin/ContentListing";

export const Route = createFileRoute("/admin/heritage")({
  head: () => ({ meta: [
    { title: "Heritage — Indonesia Vibes CMS" },
    { name: "description", content: "Manage canonical Heritage records such as Gamelan, Wayang and Phinisi." },
    { property: "og:title", content: "Heritage — Indonesia Vibes CMS" },
    { property: "og:description", content: "Manage canonical Heritage records." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ContentListing title="Heritage" description="One record per cultural heritage. Articles, people, places and events all connect to the same record." kinds={["culture"]} createKind="culture" createLabel="New Heritage" />,
});
