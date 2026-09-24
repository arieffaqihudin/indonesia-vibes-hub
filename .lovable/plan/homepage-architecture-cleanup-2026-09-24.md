# Homepage architecture cleanup

## Goal
Restructure only the public homepage and its two existing CMS controls so the page supports six clear experiences without duplicate or obsolete modules. Preserve the approved navigation, brand, Hero behavior, public detail pages, and canonical content records.

## Public homepage
- Keep the approved CMS-driven Hero unchanged as the first section.
- Replace the current independent blocks with this exact sequence:
  1. Understand Indonesia: one umbrella section containing a compact 6–10 topic directory, one CMS-selected published featured collection, and 3–6 CMS-selected or featured People & Organisations.
  2. Latest Articles: 4–8 published articles sorted newest first, optionally excluding current Hero articles.
  3. Experience Indonesia: one shared section containing 3–5 upcoming events and 3–5 selected or featured places.
  4. Indonesia Around the World: keep the map as a standalone signature section and derive highlights from existing international records.
  5. Collaborate with Indonesia: one closing action section with 1–2 referenced collaborations and up to four canonical Connect FAQ records.
  6. Existing footer.
- Remove In Focus, the old featured-article block, separate collection/topics/people blocks, standalone Coming Up, standalone collaborations, newsletter/about callout, and all legacy spacing around them.
- Avoid repeating Hero articles in Latest Articles when enough alternatives are available.

## CMS homepage controls
- Keep only the existing Hero and Homepage Sections sidebar entries.
- Replace legacy section settings with five approved top-level sections and nested controls for their existing records.
- Provide only show/hide, order, record selection where relevant, latest-article count, and Hero exclusion.
- Reference existing Topics, published Collections, People & Organisations, Places, world records, Collaborations, and FAQ entries; do not create homepage-only copies.
- Migrate old browser-saved homepage settings into the new defaults safely, discarding obsolete section IDs.

## Technical details
- Extend the homepage settings type with focused fields for topic, collection, people/organisation, place, world, and collaboration references plus Latest Articles display options.
- Use existing local persistence and canonical content hooks; preserve SSR-safe fallback data.
- Keep the Hero selection limit and ordering unchanged.
- Retain `/opportunities` only as the existing compatibility redirect; confirm the term is absent from visible navigation, search, CMS, dashboard, mock content, and homepage.

## Verification
- Check the homepage at desktop, tablet, and mobile widths for exact order, no obsolete headings, no overflow, and intact Hero controls.
- Verify CMS section controls persist and affect the homepage without duplicating records.
- Verify links, console/runtime state, typecheck/build, and key public pages remain unchanged outside the homepage.
