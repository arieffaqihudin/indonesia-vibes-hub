import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FilterBar } from "@/components/editorial/FilterBar";
import { InstitutionCard, PersonCard } from "@/components/editorial/EntityCards";
import { PageHeader } from "@/components/editorial/Section";
import { people } from "@/data/content";
import { institutions } from "@/data/institutions";

const TYPES = ["People", "Communities", "Museums", "Universities", "Cultural Organisations", "Research Centres", "Other"];
export const Route = createFileRoute("/people-organisations")({ head: () => ({ meta: [
  { title: "People & Organisations — Indonesia Vibes" }, { name: "description", content: "Meet the people, communities and organisations connected to Indonesian culture." },
  { property: "og:title", content: "People & Organisations — Indonesia Vibes" }, { property: "og:description", content: "Meet the people, communities and organisations connected to Indonesian culture." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: Directory });
function Directory() {
  const [query, setQuery] = useState(""); const [type, setType] = useState<string | null>(null);
  const q = query.toLowerCase();
  const visiblePeople = useMemo(() => people.filter((item) => (!type || (type === "People" && item.entity === "person") || (type === "Communities" && item.entity === "community")) && `${item.name} ${item.role} ${item.based}`.toLowerCase().includes(q)), [q, type]);
  const visibleOrgs = useMemo(() => institutions.filter((item) => {
    const group = item.type === "Museum" ? "Museums" : item.type === "University" ? "Universities" : item.type === "Research Centre" ? "Research Centres" : ["Cultural Centre", "Cultural Community", "Festival Organisation"].includes(item.type) ? "Cultural Organisations" : "Other";
    return (!type || group === type) && `${item.name} ${item.type} ${item.city}`.toLowerCase().includes(q);
  }), [q, type]);
  const organisationsOnly = Boolean(type && !["People", "Communities"].includes(type));
  return <><PageHeader eyebrow="Understand Indonesia" title="People & Organisations" intro="The people, communities, museums, universities and cultural organisations that create, carry and support Indonesian cultural knowledge." /><FilterBar search={{ value: query, onChange: setQuery, placeholder: "Name, practice, city or organisation" }} primary={[{ id: "type", label: "Type", options: TYPES, value: type, onChange: setType, allLabel: "All people & organisations" }]} resultCount={(organisationsOnly ? 0 : visiblePeople.length) + (["People", "Communities"].includes(type ?? "") ? 0 : visibleOrgs.length)} resultNoun="profiles" /><div className="container-editorial py-14"><ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{!organisationsOnly && visiblePeople.map((item) => <li key={item.id}><PersonCard person={item} /></li>)}{!["People", "Communities"].includes(type ?? "") && visibleOrgs.map((item) => <li key={item.id}><InstitutionCard institution={item} /></li>)}</ul>{!visiblePeople.length && !visibleOrgs.length ? <p className="text-muted-foreground">No profiles match those filters. <Link to="/contact" search={{}} className="text-primary underline">Suggest one</Link>.</p> : null}</div></>;
}