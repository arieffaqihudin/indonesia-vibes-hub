# Indonesia Vibes Admin Visual Hard Reset

## Goal
Rebuild only the internal `/admin` experience into a visibly flatter, denser operational workspace. Preserve all workflows, roles, data, Indonesia Vibes branding, public pages, and contributor pages.

## What will change

1. **Replace the admin shell composition**
   - Rebuild the desktop sidebar at 260px expanded and 72px collapsed.
   - Keep compact grouped navigation and move Settings into its own labelled group.
   - Place the persistent collapse control directly over the sidebar boundary at mid-screen.
   - Rebuild the 64–72px flat top header with workspace context, notifications, and user menu.
   - Remove the centred content constraint so admin pages use the available width with 24–32px desktop gutters.

2. **Replace the shared admin visual primitives**
   - Introduce a compact page header with breadcrumb, 24px title, subtitle, and right-aligned actions.
   - Recompose tabs as text-and-underline navigation.
   - Rebuild filters as one equal-height horizontal toolbar with search aligned right.
   - Rebuild summaries as one bordered strip with vertical dividers.
   - Make tables the dominant surface: dense rows, subtle separators, strong first column, compact status dots, and one overflow action.
   - Flatten section and context-panel components; reserve shadows for overlays and the collapse trigger only.

3. **Rebuild the dashboard home**
   - Remove KPI and two-column card layouts.
   - Use three full-width operational lists: Needs Your Attention, Coming Up, and Recent Activity.
   - Keep role-aware counts and links without changing dashboard logic.

4. **Standardise core admin list pages**
   - Apply the shared order: breadcrumb/title → tabs where relevant → filter toolbar → summary strip → results count → table.
   - Update All Content, Submissions, Review, Calendar, Inquiries, Partners, Follow-ups, Settings, Events, Opportunities, Collaborations, and Users.
   - Replace row text-button clusters with a compact overflow action where the workflow permits.

5. **Flatten create, edit, and detail experiences**
   - Convert Create New and new-record forms from card grids to sectioned rows and dividers.
   - Recompose content, inquiry, partner, and collaboration detail pages into a wide main column plus a divider-separated context panel.
   - Keep Edit / Connections / Media / Review / More tabs and all advanced sources, claims, rights, history, taxonomy, roles, and relationship capabilities.
   - Remove card styling from form sections while preserving their existing behaviour.

6. **Admin-only design guardrails**
   - Apply DM Sans and the existing red, deep red, blush, deep brown, and warm-neutral tokens.
   - Cap ordinary admin radii at 8–12px and remove non-overlay shadows.
   - Scope changes to admin components and admin routes; do not alter public or contributor presentation.

## Validation
- Compare desktop screenshots of Dashboard, All Content, Review, and a detail page against the requested composition.
- Check tablet and mobile sidebar, filters, summary strips, adaptive tables, and detail panels.
- Verify all simplified-sidebar routes plus create/edit/detail screens render without overflow or runtime errors.
- Confirm the latest preview build succeeds and public/contributor files remain untouched.
