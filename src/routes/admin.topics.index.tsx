import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { FilterToolbar, PageHeading, SearchInput, SelectFilter, StatusIndicator, Table, Td, abtn, dateFmt } from "@/components/admin/primitives";
import { useAdmin } from "@/lib/admin/store";
import { TOPIC_CATEGORIES, useTopics } from "@/lib/topics";

export const Route = createFileRoute("/admin/topics/")({
  head: () => ({ meta: [{ title: "Topics — Indonesia Vibes CMS" }, { name: "description", content: "Manage the cultural topic catalogue." }, { property: "og:title", content: "Topics — Indonesia Vibes CMS" }, { property: "og:description", content: "Manage the cultural topic catalogue." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Topics,
});

function Topics() {
  const { content } = useAdmin();
  const [topics] = useTopics();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const needle = query.trim().toLowerCase();
  const visible = topics.filter((topic) => (!needle || `${topic.id} ${topic.intro} ${topic.aliases.join(" ")}`.toLowerCase().includes(needle)) && (!category || topic.category === category) && (!status || topic.status === status));
  return <>
    <PageHeading eyebrow="Understand Indonesia / Topics" title="Topics" description="Manage the subject catalogue. Article connections are derived automatically from article topics." actions={<Link to="/admin/topics/$slug" params={{ slug: "new" }} className={abtn.primary}>+ New Topic</Link>} />
    <FilterToolbar search={<SearchInput value={query} onChange={setQuery} label="Search topics" placeholder="Search topics" />}>
      <SelectFilter label="Category" value={category} onChange={setCategory} options={[...TOPIC_CATEGORIES]} />
      <SelectFilter label="Status" value={status} onChange={setStatus} options={["Draft", "Published", "Archived"]} />
    </FilterToolbar>
    <p className="mb-3 text-xs text-muted-foreground">{visible.length} topic{visible.length === 1 ? "" : "s"}</p>
    <Table caption="Topics" head={["Topic", "Description", "Articles", "Status", "Updated", "Action"]}>
      {visible.map((topic) => {
        const articleCount = content.filter((item) => item.kind === "story" && item.topics?.includes(topic.id)).length;
        return <tr key={topic.id} className="group">
          <Td><Link to="/admin/topics/$slug" params={{ slug: topic.slug }} className="font-medium hover:text-primary">{topic.id}</Link><span className="mt-1 block text-xs text-muted-foreground">{topic.category}</span></Td>
          <Td className="max-w-md text-xs text-muted-foreground">{topic.intro}</Td>
          <Td>{articleCount}</Td>
          <Td><StatusIndicator attention={topic.status !== "Published"}>{topic.status}</StatusIndicator></Td>
          <Td>{dateFmt(topic.updatedAt)}</Td>
          <Td><Link to="/admin/topics/$slug" params={{ slug: topic.slug }} className={abtn.quiet}>Edit</Link></Td>
        </tr>;
      })}
    </Table>
  </>;
}