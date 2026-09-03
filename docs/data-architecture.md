# Indonesia Vibes — canonical data architecture

One entity, one record, many relationships. The public platform, Contributor
Workspace and Editorial Dashboard read the same cultural knowledge graph.

## Layers

| Layer | Module | Responsibility |
| --- | --- | --- |
| Enums | `src/lib/data/enums.ts` | Every status, visibility, provenance and steward role, declared once. |
| Entities | `src/lib/data/entities.ts` | Canonical records, stable ids, aliases, ownership, redirects. |
| Relationships | `src/lib/data/relationships.ts` | Typed, directional, provenance-bearing links. |
| Taxonomy | `src/lib/data/taxonomy.ts` | Shared themes and synonyms for classification, filters and search. |
| Geography | `src/lib/data/geography.ts` | Countries and places referenced by id, never re-typed. |
| Schema | `src/lib/data/schema.ts` | Zod definitions and registry validation. |
| Graph | `src/lib/data/graph-api.ts` | Neighbours, related content, subject networks, impact, merge comparison. |
| Integrity | `src/lib/data/integrity.ts` | Health checks that return records, not just counts. |

Import everything from `@/lib/data`.

## Identity

A canonical id is `type:source-id` — for example `cs:gamelan`, `pe:rahayu`,
`in:isi-surakarta`. Ids are stable and never reused. Renaming a record changes
its name and slug, never its id. A merged record is archived and redirected
via `redirectTo`; it is never deleted, so existing URLs and citations survive.

## Entity types

Cultural subject, person, community, institution, place, country, event,
opportunity, story, collection, knowledge resource, collaboration.

Each carries: `uid`, `sourceId`, `slug`, `name`, `aliases`, `summary`,
`themes`, `countries`, `publicationStatus`, `visibility`, `owner`,
`publicPath`, `updatedAt`.

## Relationships

Controlled vocabulary only: `practises`, `originates_in`, `located_in`,
`held_by`, `affiliated_with`, `takes_place_at`, `organised_by`,
`participates_in`, `about_subject`, `features_person`, `set_in_place`,
`curates`, `documents`, `partner_in`, `offered_by`, `in_country`.

Every relationship records where the assertion came from: editorial,
contributor, partner, import or derived. Relationships are directional and
have a defined inverse label so both sides of a link read naturally.

## Publication, visibility and access

`publicationStatus` — draft, in review, approved, scheduled, published,
updated, archived. `visibility` — public, internal, restricted. A contributor
can propose; only the editorial team publishes. Restricted records never reach
a public route regardless of status.

## Graph queries

Related content is a query, never a hand-written list. Traversal is one hop,
typed, and capped by an explicit limit. `relatedContent` widens to records that
share a cultural subject when direct links are sparse.

## Integrity and merges

`dataHealth()` returns broken relationships, structural gaps, orphans, stale
records, schema violations and search-coverage gaps — each as a list of
records with a route to fix them. Duplicate candidates are surfaced, never
merged automatically; `compareEntities` produces a merge preview showing
combined aliases, relationship counts, published URLs to redirect and
conflicts. Classification and merging always require a human decision.
