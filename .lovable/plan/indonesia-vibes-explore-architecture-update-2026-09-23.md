# Indonesia Vibes Explore Architecture Update

## Goal
Unify the product around Public Platform, Contributor Workspace, Internal CMS, and One Data. Replace the old Discover/Culture split with Explore, migrate stories into editorial content, and keep the public experience simple while preserving the connected data, workflows, routes, visual identity, and responsive system.

## Public platform

### Navigation and routes
- Replace the public navigation with Explore, Experience, Connect, About, and Search.
- Build `/explore`, `/explore/topics`, `/explore/topics/$slug`, and `/explore/collections`; preserve existing people, institutions, events, places, Around the World, opportunities, collaborations, inquiry/contact, and about routes.
- Keep useful legacy URLs working through route-level redirects or compatibility pages: Stories enters Explore; Heritage, Contemporary, and Research resolve into relevant topic views; Collections resolve under Explore; Collaborate resolves to Inquiry.
- Remove the obsolete NOW route and every remaining Discover, Culture-as-top-level, and NOW navigation reference.

### Editorial content model and presentation
- Extend existing Story records into a compatible Editorial Content model with three independent dimensions:
  - Topic: centrally managed subject taxonomy.
  - Internal delivery type: Knowledge, Semantic, Pragmatic.
  - Content source: Internal, By Curation.
- Map internal delivery types automatically to public labels: Essentials, Deep Dive, Perspectives.
- Keep content source separate from supporting references and show public attribution only where useful.
- Seed the requested Gamelan, Indonesian Civilization, and Living Textile Traditions examples without duplicating their topic records.
- Update public cards, detail pages, search, freshness, collections, and One Data registry to use Editorial Content and public format labels.

### Explore experience
- Build `/explore` as the all-content discovery destination with Search, Topic, Format, and compact More Filters controls.
- Build topic index and topic detail pages combining introduction, Editorial Content by format, People & Communities, Institutions, Places, Events, Collaborations, and references from existing relationships.
- Keep Collections as curated mixed-object journeys and route them under Explore.
- Update Search filters to All, Essentials, Deep Dive, Perspectives, People, Institutions, Places, Events, Opportunities, and Collaborations.
- Ensure public pages never expose Semantic, Pragmatic, taxonomy IDs, provenance, canonical entity, or other internal terms.

### Homepage and supporting pages
- Reorder the homepage to Hero, In Focus, Featured Content, Explore by Topic, Indonesia Around the World, Coming Up, People to Know, Current Collaborations, Open Opportunities, Latest Content, Newsletter.
- Keep the homepage visual and curated, not index-like.
- Add `/experience`, `/inquiry`, and `/partners` destinations using existing content and inquiry/partner language.
- Update public descriptions and metadata so Explore means understand, Experience means participate, and Connect means engage.

## Internal CMS

### Navigation and content entry
- Reduce the sidebar to Dashboard; Content: All Content, Create New; Editorial: Submissions, Review, Calendar; Partnerships: Inquiries, Partners, Follow-ups; Settings.
- Keep specialist routes available for deep links and advanced administration but remove them from everyday navigation.
- Add `/admin/create` with Editorial Content, Person / Community, Institution, Place, Event, Opportunity, Collaboration, and Collection choices.
- Reuse the existing draft creation and duplicate checks; rename technical duplicate language to “Similar content already exists.”

### Editorial Content workflow
- Treat existing Story records as Editorial Content while preserving their IDs, relationships, versions, activity, and public paths through compatibility mapping.
- For Editorial Content, collect title, standfirst, Topic, delivery type, content source, location, and author/editor.
- Show contextual writing prompts for Knowledge, Semantic, and Pragmatic.
- When By Curation is selected, reveal original source, institution, creator, link, permission, and editorial notes.
- For Pragmatic content, reveal claim, evidence, nuance, sensitivity, and Perspective Review requirements; require evidence before publication.
- Keep Content Source distinct from factual references in state, forms, validation, and review.

### Lists, editing, review, and preview
- Rebuild All Content tabs as All, Editorial Content, People, Institutions, Places, Events, Opportunities, Collaborations, Collections.
- Use the seven simple statuses in ordinary lists while preserving detailed workflow stages underneath.
- Present the editor as Basic Information, Content, Connections, Media, Review & Publish, with advanced data hidden under More.
- Translate Knowledge/Semantic/Pragmatic to Essentials/Deep Dive/Perspectives in public preview automatically.
- Consolidate Review around Editorial Review, Source Verification, Claim Review, Media, Language, and Cultural Context.
- Preserve sources, media rights, publication blockers, contributor workflow, audit history, duplicate/merge tools, and relationship mapping.

## Contributor Workspace and partnerships
- Preserve the existing Contributor Workspace and submission forms.
- When an accepted submission becomes Editorial Content, default Source to By Curation and require Topic plus delivery type during editorial intake.
- Keep the existing inquiry/partner/follow-up data and routes; align public entry language to “How would you like to connect with Indonesia?” and retain the approved linear internal partnership flow.

## Technical approach
- Add compatibility helpers rather than rewriting storage: delivery/source mappings, public labels, topic lookups, and legacy route mappings.
- Extend the canonical registry from Story to Editorial Content without changing stable source IDs or duplicating cultural subjects/topics.
- Expand the shared topic vocabulary centrally and reuse it in public filters, search, CMS forms, and One Data relationships.
- Preserve all design tokens, DM Sans, motion, responsive utilities, reusable components, and local prototype persistence.
- Every new or changed public route receives unique title, description, Open Graph, and Twitter metadata.

## Validation
- Check that no public screen exposes Knowledge, Semantic, Pragmatic, Discover, Culture as a top-level destination, or NOW.
- Test Explore and topic journeys, the three seeded topic examples, search filters, legacy links, and mobile/tablet/desktop navigation.
- Test CMS creation for Internal and By Curation Editorial Content, Pragmatic claim review, preview label mapping, role-aware navigation, submissions, and publication blockers.
- Run TypeScript checks, route/build validation, runtime diagnostics, and Playwright interaction checks across the public platform and CMS.
