# Audit: independent Topic, internal delivery type and content source dimensions

Scope: `src/lib/data/*` (One Data), `src/data/content.ts` (Story), `src/types/content.ts`,
`src/components/editorial/StoryCard.tsx`, `src/routes/stories.*`, `src/routes/admin.data-health.tsx`.
Goal: add three independent dimensions without breaking `uid`, relationships, search or public
routes, and migrate `Story` → `Editorial Content` with zero duplicate records.

## 1. What exists today (traced)

| Concern | Where it lives now | Notes |
| --- | --- | --- |
| Entity type | `ENTITY_TYPES` in `src/lib/data/entities.ts` | `story` is one of 12 fixed types; drives `ENTITY_PREFIX` (`st:`), `ENTITY_LAYER`, `ENTITY_LABEL`. |
| "Topic" (theme) | `THEMES` in `src/types/content.ts`, wrapped by `src/lib/data/taxonomy.ts` | Only one taxonomy axis exists (`themes: ThemeId[]` on `CanonicalEntity`). Stories are built with `themes: []` — they carry **no topic today** (`storyEntities` in `entities.ts:226-244`); a story's theme is derived indirectly through its `formIds` (`StoryCard.tsx:16`, `graph.ts:214`). There is no independent "Topic" concept distinct from cultural-subject theme. |
| Internal delivery type | Doesn't exist. `Story.kind` (`"Feature" \| "Dispatch" \| "Interview" \| "Field note"`, `types/content.ts:205`) is the closest analogue, but it is a **public-facing editorial format label**, hard-coded into the `Story` interface, used directly as a UI badge (`StoryCard.tsx:34`) and as a filter value (`stories.index.tsx:9,35`). It conflates "how the piece is delivered internally" with "what a reader sees," which is exactly the coupling that must be split. |
| Content source | Doesn't exist as a field. Provenance exists only at the *relationship* level (`ProvenanceSource` in `enums.ts:42-49`, used by `Relationship.provenance`). No entity-level "where did this content originate" (editorial desk, contributor submission, partner feed, import) is captured on `Story`/`CanonicalEntity`. |
| Story storage | `stories: Story[]` in `src/data/content.ts` | Flat array, `id`/`slug`/`kind`/`formIds`/`peopleIds`/`placeIds`. |
| Story → canonical wrapping | `storyEntities` in `src/lib/data/entities.ts:226-244` | One-way, derived, not stored twice: canonical record wraps `s.id` as `sourceId`, `s.title` as `name`, etc. `getEntityBySource("story", id)` recovers the source row. |
| Story relationships | `src/lib/data/relationships.ts:135-140` | `about_subject` (form), `features_person`, `set_in_place`, plus `collections.curates`, `collaborations.documents`. |
| Story in search | `storyRecord()` in `src/data/graph.ts:205-225` | `type: "Story"` literal, themes derived from linked forms only. |
| Story surfaces | `StoryCard.tsx`, `stories.index.tsx`, `stories.$slug.tsx`, `collections.*`, `around-the-world.tsx`, `index.tsx`, `heritage.tsx`, `contemporary.tsx`, `research.tsx` | All read `Story` fields directly (`.kind`, `.dek`, `.readingMinutes`), not through canonical entity. |
| Schema validation | `schema.ts` — `canonicalEntitySchema` | Generic across all entity types; no story-specific schema exists yet, so nothing must be relaxed to widen the model. |
| Integrity checks | `integrity.ts:115-118` | One story-specific structural rule (`imageAlt` required) keyed on `getEntityBySource("story", s.id)`. |
| Admin surfaces | `admin.data-health.tsx` | Reads only from `@/lib/data` (taxonomy, dataHealth, graphStats) — never touches `src/data/content` directly, so it is insulated from this change already. |

Key finding: **"Story" is not a duplicated concept** — it is a single source array (`src/data/content.ts`) wrapped once into the canonical registry (`entities.ts`). The migration risk is not de-duplication of records, it's **renaming/generalising the entity type in place** (`story` → `editorial_content`) while every module above keys off the literal string `"story"` or the `Story` type name.

## 2. Design: three new independent dimensions

Each dimension gets its own controlled vocabulary module, mirroring how `enums.ts` and `taxonomy.ts` already work — declared once, imported everywhere, never inlined as string literals in a component.

### 2.1 Topic (independent of cultural-subject theme)

New file `src/lib/data/topics.ts`, same shape as `taxonomy.ts` but a distinct id space so it is not confused with `ThemeId`:

```ts
export const TOPIC_IDS = [
  "field-report",        // seed 1
  "practice-and-technique",// seed 2
  "policy-and-heritage-law",// seed 3
  ...
] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export interface Topic {
  id: TopicId;
  label: string;        // internal working label
  publicLabel: string;  // what readers see — see §4 mapping
  synonyms: string[];
  usageCount: number;
}
```

Three seeded topic examples (internal id → internal label → public label, per the requested mapping in §4):

1. `field-report` — "Field Report" → public label **"On the Ground"**
2. `practice-and-technique` — "Practice & Technique" → public label **"How It's Made"**
3. `policy-and-heritage-law` — "Policy & Heritage Law" → public label **"Policy Watch"**

Add `topicIds: TopicId[]` to `CanonicalEntity` as an **optional, additive** field (parallel to existing `themes`, never replacing it). `themes` stays the cultural-subject taxonomy; `topics` is the new independent editorial axis. This keeps `themes` semantics untouched for `cultural_subject`, `person`, `institution`, etc., while giving editorial content (and, if useful later, events/collections) a second classification axis.

### 2.2 Internal delivery type

New file `src/lib/data/delivery.ts`:

```ts
export const DELIVERY_TYPES = ["longform", "dispatch", "interview_transcript", "field_note", "wire_import"] as const;
export type DeliveryType = (typeof DELIVERY_TYPES)[number];

export const DELIVERY_LABEL: Record<DeliveryType, string> = { ... }; // internal, ops-facing only
```

This is deliberately **not shown to readers** — it replaces the ops meaning currently overloaded onto `Story.kind`. `Story.kind` keeps its current four public values (`Feature`, `Dispatch`, `Interview`, `Field note`) as the **display format**; `deliveryType` becomes a separate internal field describing how the piece was produced/handled (e.g. `wire_import` for syndicated partner copy that renders identically to `dispatch` on the public card but is tracked differently for editorial workflow and rights). Add `deliveryType?: DeliveryType` to `CanonicalEntity` (or to a narrower `EditorialContentEntity` extension — see §3) so admin/editorial screens can filter/report on it without ever leaking it to a public component.

### 2.3 Content source

New file `src/lib/data/content-source.ts`, reusing the existing `ProvenanceSource` vocabulary shape but as an entity-level field, not a relationship-level one:

```ts
export const CONTENT_SOURCES = ["staff", "contributor", "partner_feed", "syndicated", "commissioned"] as const;
export type ContentSource = (typeof CONTENT_SOURCES)[number];
```

Add `contentSource?: ContentSource` to `CanonicalEntity`. This is intentionally distinct from `Relationship.provenance` (which records where a *link/assertion* came from) — `contentSource` records where the *content itself* came from. Conflating the two would break `relationshipSchema` semantics and the data-health "broken relationship" report, which already relies on `provenance` meaning "assertion provenance."

All three dimensions are additive, optional fields on the shared `CanonicalEntity` interface (`entities.ts:90-116`) and on `canonicalEntitySchema` (`schema.ts:23-41`) as `.optional()` Zod fields — existing records (people, institutions, places, etc.) validate unchanged with no back-fill required.

## 3. Story → Editorial Content migration (no duplication)

Because `Story` is wrapped, never copied, the migration is a **rename-and-extend of the wrapper**, not a data move:

1. **Type rename, source array kept**: rename the `Story` interface to `EditorialContent` in `src/types/content.ts`, add `topicIds?`, `deliveryType?`, `contentSource?`. Keep a `export type Story = EditorialContent` alias for one release to avoid a big-bang rename across ~9 route files.
2. **Entity type generalised, not duplicated**: in `entities.ts`, change `"story"` to `"editorial_content"` in `ENTITY_TYPES`, `ENTITY_PREFIX` (keep prefix `st` for id stability — canonical ids like `st:field-note-1` must not change), `ENTITY_LABEL` (public string can become "Story" still, or "Editorial Content" internally vs `ENTITY_PUBLIC_LABEL` — see §4). `storyEntities` becomes `editorialContentEntities`, still built by mapping over the **same** `stories` (renamed `editorialContent`) array in `src/data/content.ts` — one source array, one wrap, no second list.
3. **Compatibility shim**: keep `entitiesOfType("story")` working via a small alias map, or update the two call sites (`relationships.ts` story loop, `graph.ts` `storyRecord`) to the new type string. Since `EntityType` is a literal union checked by TypeScript, the compiler will surface every call site that still says `"story"` — this is the safety net, not a manual grep.
4. **`sourceId`/`uid` stability**: `canonicalId("editorial_content", s.id)` must still produce `st:<id>` (prefix keyed off type, not label) so every existing `publicPath` (`/stories/:slug`), relationship (`about_subject`, `features_person`, `set_in_place`, `curates`, `documents`), and bookmarked/shared URL keeps resolving. This is the highest-risk step — the prefix map is the seam that must not move.
5. **No new array, no dual-write**: `getEntityBySource("editorial_content", id)` replaces `getEntityBySource("story", id)` in `integrity.ts:117`; the underlying `stories` array in `src/data/content.ts` is untouched, so there is exactly one row of truth per piece of content before and after.
6. **Search index**: `storyRecord()` in `graph.ts` renames to `editorialContentRecord()`; `SearchRecord.type` literal `"Story"` (declared in `types/content.ts:471`) either stays as the public-facing search facet label or is driven from the new public-label map (§4) instead of being hard-coded a second time.

Net effect: zero duplicate records, one rename of the wrapping type/entity-type string, three additive optional fields, and one union-of-literal type per dimension.

## 4. Public label mapping

Internal identifiers and internal labels must never leak to a reader-facing surface as raw enum strings (this already fails once today: `Story.kind` values are shown verbatim as the card badge). The fix is one small, testable map per dimension, imported wherever a badge/filter renders:

| Dimension | Internal id | Internal/admin label | Public label shown to readers |
| --- | --- | --- | --- |
| Entity type | `editorial_content` | "Editorial Content" | "Story" (unchanged — `ENTITY_LABEL` already public-safe) |
| Topic | `field-report` | "Field Report" | **"On the Ground"** |
| Topic | `practice-and-technique` | "Practice & Technique" | **"How It's Made"** |
| Topic | `policy-and-heritage-law` | "Policy & Heritage Law" | **"Policy Watch"** |
| Delivery type | `wire_import` | "Wire import" | *(not shown — internal only; card falls back to `kind`)* |
| Delivery type | `longform` | "Longform" | *(not shown — internal only)* |
| Content source | `staff` | "Staff" | *(not shown — internal only)* |
| Content source | `partner_feed` | "Partner feed" | "In partnership with …" (attribution line only, never the raw enum) |

Implementation: add `TOPIC_PUBLIC_LABEL: Record<TopicId, string>` next to `TOPIC_LABEL` in `topics.ts`, mirroring the existing `RELATIONSHIP_LABEL` / `RELATIONSHIP_INVERSE` pattern in `relationships.ts` (one map per audience). `StoryCard.tsx` and `stories.index.tsx` read `TOPIC_PUBLIC_LABEL[id]`, never `id` or the internal `label` directly. Delivery type and content source have **no public map entries by default** — they are ops-only dimensions; a route that wants to surface partner attribution does so through an explicit, reviewed label, not by rendering the enum.

## 5. Exact files touched

| File | Change |
| --- | --- |
| `src/lib/data/topics.ts` (new) | Topic vocabulary, `TOPIC_PUBLIC_LABEL`, `matchTopics`, `unusedTopics` — mirrors `taxonomy.ts`. |
| `src/lib/data/delivery.ts` (new) | `DELIVERY_TYPES`, `DELIVERY_LABEL` (internal only). |
| `src/lib/data/content-source.ts` (new) | `CONTENT_SOURCES`, `CONTENT_SOURCE_LABEL`, `CONTENT_SOURCE_PUBLIC_LABEL` (attribution only). |
| `src/lib/data/entities.ts` | Add `topicIds?`, `deliveryType?`, `contentSource?` to `CanonicalEntity`; rename `story` → `editorial_content` in `ENTITY_TYPES`/`ENTITY_PREFIX` (prefix stays `st`)/`ENTITY_LAYER`; rename `storyEntities` → `editorialContentEntities`, pass through new fields from the source row. |
| `src/lib/data/schema.ts` | Add three optional fields to `canonicalEntitySchema`. |
| `src/lib/data/relationships.ts` | Update the `for (const s of stories)` loop's `link("story", …)` calls to `"editorial_content"`. |
| `src/lib/data/integrity.ts` | `getEntityBySource("story", …)` → `getEntityBySource("editorial_content", …)`. |
| `src/lib/data/index.ts` | `export * from "./topics"`, `./delivery`, `./content-source`. |
| `src/types/content.ts` | Rename `Story` → `EditorialContent` (+ `export type Story = EditorialContent` compatibility alias); add `topicIds?`, `deliveryType?`, `contentSource?`. |
| `src/data/content.ts` | Rename `stories` export → `editorialContent` (+ `export const stories = editorialContent` alias); add optional seed values for the three new fields on a few entries. |
| `src/data/graph.ts` | `storyRecord` → reads new `topicIds`; use `TOPIC_PUBLIC_LABEL` if topic is surfaced in `meta`/`keywords`. |
| `src/components/editorial/StoryCard.tsx` | Optionally render a topic chip via `TOPIC_PUBLIC_LABEL`; `deliveryType`/`contentSource` never referenced here. |
| `src/routes/stories.index.tsx` | Optional new "Topic" filter alongside existing "Kind" filter, sourced from `TOPIC_PUBLIC_LABEL`. |
| `docs/data-architecture.md` | Add Topic/Delivery/Content-source rows to the layer table and note the `editorial_content` rename. |

## 6. Risks and mitigations

- **Prefix/id drift** — renaming the entity type string must not change `ENTITY_PREFIX.editorial_content` away from `"st"`, or every `st:*` canonical id, public path and relationship breaks at once. Mitigation: keep the prefix map keyed by the *new* type name but with the *old* value; add a schema/integrity check asserting `entitiesOfType("editorial_content").every(e => e.uid.startsWith("st:"))`.
- **Hidden literal `"story"` strings** — TypeScript's literal union will catch typed call sites, but string literals inside JSX (e.g. any hard-coded `"Story"` badge text) or `SearchRecord.type` won't be caught by the compiler. Mitigation: grep for `"story"` (already run above) before merging, and add the compatibility alias exports so the rename can land without a single flag-day PR.
- **Conflating provenance and content source** — `Relationship.provenance` and the new `contentSource` look similar; keeping them in separate files/vocabularies (§2.3) prevents a future contributor from overloading one field for both meanings.
- **Topic vs theme confusion** — because `taxonomy.ts` already owns `ThemeId`, naming the new axis "Topic" with its own `TopicId` type (not extending `ThemeId`) avoids silent merges in `matchTerms`/`matchTopics` search helpers.
- **Public leakage of internal enums** — `Story.kind` today is rendered as-is (`StoryCard.tsx:34`), which is the exact anti-pattern the new dimensions must avoid. Mitigation: delivery type and content source get no default public map (§4); any surface that wants to show them must go through an explicit reviewed label, enforced by code review / lint rule banning raw enum interpolation in `.tsx` files under `src/components` and `src/routes` (excluding `admin.*`).
- **Backwards compatibility for existing imports** — `export * from "./entities"` re-exports are consumed widely via `@/lib/data`; adding fields is additive and safe, but the `EntityType` union rename is a breaking type change for any code matching on `"story"` — mitigated by the alias exports in §3 and the compiler-enforced call-site list already identified in §1.
- **No database rewrite required** — all changes are additive TypeScript modules plus one literal rename inside the existing in-memory registry; the "one entity, one record" wrapping pattern (`src/data/*` as storage, `src/lib/data/*` as the canonical layer) is preserved exactly as documented in `docs/data-architecture.md`.
