# Indonesia Vibes Final Product Architecture

## Goal
Simplify the existing product around four public purposes—Understand Indonesia, Experience, Connect, and About—while preserving the approved brand, responsive behavior, editorial quality, Contributor Workspace, and One Data capabilities beneath a beginner-friendly CMS.

## Public platform

### Navigation and canonical routes
- Replace the shared header, mobile menu, footer, and navigation data with exactly:
  - **Understand Indonesia** → `/understand-indonesia`
    - Topics → `/understand-indonesia/topics`
    - Collections → `/understand-indonesia/collections`
    - People & Organisations → `/people-organisations`
  - **Experience** → `/experience`
    - Events & Places → `/events-places`
    - Indonesia Around the World → `/around-the-world`
  - **Connect**
    - Collaborate with Indonesia → `/collaborate`
  - **About**
    - About Indonesia Vibes → `/about`
    - Editorial Standards → `/editorial-standards`
    - Contact → `/contact`
  - Search remains a direct primary action.
- Keep existing detail records and reusable detail presentations where structurally appropriate, while routing all directory discovery through the new combined destinations.
- Preserve old published URLs with redirects to their new canonical destinations instead of leaving dead links.

### Understand Indonesia
- Promote the current editorial discovery experience into `/understand-indonesia` with introduction, featured and latest Articles, topic browsing, collections, People & Organisations, search, compact Topic/Format/Location/Recency filters, and relevant activity.
- Move Topics and Collections under the new route hierarchy and update all links and metadata.
- Merge People, Communities, and Institutions into one `/people-organisations` directory with one search and type-aware filters; retain canonical person/community/institution records underneath.
- Strengthen topic detail pages into connected hubs showing Essentials, Deep Dive, Perspectives, People & Organisations, Events & Places, Collections, Collaborations, and references when data exists.
- Use “Article” in visible product language while retaining compatible internal IDs and existing story records.

### Experience and Connect
- Build `/events-places` as one destination with All / Events / Places tabs, shared search, and adaptive filters; keep event and place detail data structurally separate.
- Keep Around the World derived from canonical international events, collaborations, organisations, and relevant places—never copied map records.
- Expand `/collaborate` into the complete Collaborate with Indonesia experience: featured examples, areas and support, involved people/organisations, and a simple collaboration-request form.
- Route old collaboration index and standalone inquiry entry points into this destination; collaboration detail pages remain available from examples.

### Homepage and search
- Recompose the homepage in the final order: Hero, In Focus, Understand Indonesia, Topics, Featured Collection, People & Organisations, Coming Up, Around the World, Collaborate with Indonesia, Latest Content, and the existing appropriate closing section.
- Remove every Opportunities block, label, CTA, filter, and empty state.
- Make the homepage Hero consume the CMS’s ordered 1–5 published Article references, with one primary slide and controlled additional slides rather than equal cards.
- Update search to only Articles, Topics, Collections, People & Organisations, Events, Places, and Collaborations; update result labels, links, suggestions, and copy.

## CMS

### Final sidebar and routes
- Replace the sidebar with exactly:
  - Dashboard
  - Homepage: Hero, Homepage Sections
  - Understand Indonesia: Articles, Topics, Collections, People & Organisations
  - Experience: Events & Places, Indonesia Around the World
  - Connect: Collaborations
  - About: About Indonesia Vibes, Editorial Standards, Contact
  - Settings: Settings
- Add canonical beginner-facing routes such as `/admin/articles`, `/admin/homepage/hero`, `/admin/homepage/sections`, `/admin/people-organisations`, `/admin/events-places`, and `/admin/around-the-world`.
- Remove obsolete items from global create/search actions. Convert superseded admin routes to compatibility redirects or keep advanced tools reachable only contextually from Settings/article editing, never in the sidebar.

### Articles and editor
- Make `/admin/articles` the article-only operational table with compact Search, Topic, Delivery Type, Content Source, Status, More Filters, continuous summary strip, and Title/Topic/Delivery/Source/Status/Hero/Updated/Action columns.
- Use summary values derived from current CMS state: Total Articles, Published, In Review, Draft, Hero X/5.
- Refocus the Article editor into Basic Information, Content, Connections, Media, and Review & Publish.
- Preserve source verification, references, claims, media rights, history, relationships, roles, and review stages behind contextual sections.
- Keep Topic, Delivery Type, and Content Source independent. Show By Curation’s original-source fields only when selected. Show Main Claim, Supporting Evidence, Sources, Context/Nuance, and Editorial Review progressively for Pragmatic content.

### Homepage management
- Add shared Homepage state with:
  - 1–5 ordered Hero Article references
  - optional image, headline, summary, and CTA overrides per Hero item
  - Homepage section visibility, order, and optional featured selection
- Hero management only offers published Articles, supports drag reorder plus accessible move controls, remove, and public preview.
- Enforce five active items in state updates and show the exact limit message when a sixth is attempted.
- Add the Homepage Hero toggle and order/override controls to Article editing.
- Homepage Sections remains a constrained ordering/visibility tool, not a page builder.

### Consolidated management screens
- Topics: ordinary labels, descriptions, imagery, status, and related record summaries without technical IDs.
- Collections: title, introduction, image, status, reusable linked items, and editorial ordering.
- People & Organisations: All / People / Communities / Organisations tabs over existing records.
- Events & Places: All / Events / Places tabs with type-aware fields and international visibility.
- Around the World: management view over canonical international records with country filters and map preview.
- Collaborations: Collaborations / Requests tabs, preserving the existing inquiry, partner, follow-up, and relationship machinery beneath the simplified screen.
- About: three simple editors for About Indonesia Vibes, Editorial Standards, and Contact.

### Dashboard
- Replace legacy dashboard metrics with a live horizontal summary strip: Total Articles, Published, In Review, Hero Active, Coming Events.
- Add compact, data-derived delivery distribution, source distribution, most-used topics, Hero slot/order status, upcoming-event verification summary, Needs Attention, quick actions, and non-technical recent activity.
- Ensure all counts update from the same CMS state after edits, publishing, Hero changes, events, and requests.

## Data migration and compatibility
- Preserve existing Story records as Articles without duplicating IDs.
- Surface people, communities, and institutions through one combined view; surface events and places through one combined view; preserve their distinct schemas and detail records.
- Preserve collaboration and inquiry records but expose requests only within Collaborations.
- Remove Opportunity types, records, imports, routes, selectors, statistics, search entries, homepage sections, CMS options, and related references from the active product.
- Keep One Data, relationship mapping, verification, sources, rights, contributor workflow, roles, audit history, and taxonomy functioning underneath simplified UI.
- Add route-specific title, description, Open Graph, and Twitter metadata to every new content route.

## Validation
- Test the four required public journeys without dead ends and confirm public pages never display Knowledge, Semantic, or Pragmatic.
- Test Article creation/editing, publishing, Hero add/limit/reorder/remove/preview, Homepage visibility, international event mapping, collaboration publication, request handling, and live dashboard updates.
- Check Header/mobile navigation, homepage, all new combined directories, CMS dashboard, Hero, Articles, Topics, Collections, People & Organisations, Events & Places, Around the World, Collaborations, About editors, and Settings at mobile, tablet, and desktop sizes.
- Verify old URLs redirect, Opportunities and outdated labels are absent, no horizontal overflow occurs, all routes return successfully, and the latest build is clean.
