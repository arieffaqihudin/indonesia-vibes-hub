# Indonesia Vibes CMS hard reset

## Goal
Replace the current admin experience with one quiet, familiar content-management system: choose content, edit it directly, save or publish. Preserve all existing content, relationships, public pages, Homepage Hero behavior, attribution logic, FAQ reuse, and Indonesia Vibes branding.

## 1. One CMS shell
- Rebuild the admin shell as a compact light sidebar, simple top header, and efficient full-width workspace.
- Keep only the approved navigation: Dashboard; Homepage; Understand Indonesia; Experience; Connect; About; Settings.
- Remove the global create modal, admin-wide search/widgets, legacy notification/review shortcuts, and links to obsolete admin modules from the visible interface.
- Keep desktop collapse, mobile off-canvas navigation, clear active states, and the user profile menu.
- Add edit-page header support for Back, title, save state, Preview, Save Draft, Publish/Update, and mobile settings.

## 2. Shared CMS design system
- Consolidate reusable primitives for page headers, compact filters, content tables, adaptive mobile rows, row actions, tabs, conventional forms, editor layouts/toolbars/sidebar, media picker, publish action, status controls, sortable lists, and collapsible settings.
- Remove card-heavy styling, large radii, decorative widgets, excessive helper copy, and nested boxed panels.
- Use thin borders, white/warm-neutral surfaces, restrained blush active states, DM Sans, and red only for primary actions and active states.

## 3. Dashboard and content lists
- Replace the dashboard with one compact summary row and simple sections for Needs Attention, Recent Content, Homepage Hero, Coming Events, and Recent Activity.
- Rebuild Articles around a conventional searchable/filterable table with thumbnail/title metadata, Author, Topic, Hero, simple Status, Updated, and a compact action menu.
- Make rows/titles open editors immediately; keep Preview, Duplicate, Archive, and Delete in the action menu where supported.
- Apply the same list-first pattern to Topics, Collections, People & Organisations, Events & Places, Collaborations/Requests, FAQ, Homepage Hero, and Homepage Sections.

## 4. Direct create and edit flows
- Make every visible “New” action open its editor immediately, without type selection, wizard, or intermediary detail screen.
- Keep one article editor for both create and edit.
- Add or normalize direct create/edit screens for Topics, Collections, People & Organisations, Events, Places, Collaborations, and FAQ using their existing records and relationships.
- Make About Indonesia Vibes, Editorial Standards, and Contact open a simple page editor directly.
- Keep Indonesia Around the World as a management view over canonical records, not duplicate content.

## 5. Article editor
- Keep the editor-first canvas and rebuild its chrome into a conventional CMS editor: wide title, standfirst, body, sticky toolbar, right Post Settings panel, and minimal publication actions.
- Expand the Tiptap toolbar to expose paragraph/headings, bold, italic, underline, strike, link, lists, quote/pull quote, alignment, image, gallery, video, embed, table, divider, callout, undo, and redo.
- Keep slash commands, inline selection toolbar, block reorder/duplicate/delete, contextual media upload/library selection, captions, alt text, credit, permissions, and cover focal point.
- Preserve autosave, actual article preview path, focus mode, responsive settings drawer, Homepage Hero limit/order/overrides, Internal/By Curation progressive fields, sources, connections, editorial checks, and publication checks.
- Simplify visible statuses to Draft, In Review, Published, Archived, and Scheduled while retaining the underlying workflow data.

## 6. Editorial management screens
- Topics: compact table and direct simple editor; related records remain derived.
- Collections: editorial list and direct editor with cover, introduction, status, featured state, article picker, drag reorder, remove, and preview.
- People & Organisations: one tabbed module and simple direct editor.
- Events & Places: one tabbed list with separate direct Event and Place editors.
- Collaborations: one tabbed Collaborations/Requests list and a plain collaboration editor, without CRM-style workflow UI.
- FAQ: one canonical list and direct editor with category, status, reusable placements, ordering, and basic rich answer editing.
- Homepage Hero and Homepage Sections: flat sortable lists only.

## 7. Legacy cleanup and validation
- Redirect obsolete admin URLs to the nearest approved CMS destination where needed, while removing them from navigation and normal workflows.
- Remove unused legacy admin presentation components only after every approved route uses the new shared system.
- Verify route metadata for all changed content routes.
- Test desktop, tablet, and mobile CMS navigation; direct create/edit; article writing, media, settings, autosave, preview, Hero toggle, and publish actions; representative non-article editors; responsive tables/drawers; keyboard access; and no horizontal overflow.
- Confirm public pages are visually unchanged and the preview build is clean.

## Technical notes
- Continue using TanStack Router route files and the existing local CMS store/data graph.
- Reuse Tiptap rather than introducing another editor framework.
- No backend/schema changes and no public-site redesign.
- Work will be tracked in `roadmap.md` because this redesign spans the full CMS.
