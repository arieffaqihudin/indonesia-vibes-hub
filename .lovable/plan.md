# Simplify the Indonesia Vibes CMS

## Goal
Make the internal workspace understandable to a first-time editor within minutes while preserving One Data, connected records, verification, sources, rights, contributor workflows, partnerships, roles, and history underneath.

## What will change

### 1. Short, role-aware navigation
- Replace the content-type-heavy sidebar with Dashboard, All Content, Create New, Submissions, Review, Calendar, Inquiries, Partners, Follow-ups, and Settings.
- Show only the groups relevant to the current role.
- Keep existing specialist routes working, but remove them from everyday navigation.
- Keep the approved collapsible desktop sidebar and mobile drawer behavior.

### 2. All Content as the editorial home
- Rebuild `/admin/content` as one flat, table-first workspace.
- Add content-type tabs: All, Stories, Culture, People, Institutions, Places, Events, Opportunities, Collaborations, Collections.
- Keep Search and Status immediately visible; place editor, theme, and country under More Filters.
- Use the simplified publication states: Draft, In Review, Needs Changes, Ready, Scheduled, Published, Archived.
- Keep columns focused on Title, Type, Status, Last Updated, Assigned To, Public, and Actions.

### 3. Beginner-friendly Create New and guided editing
- Add `/admin/create` with clear icon choices and short descriptions for each content type.
- Keep `/admin/content/new` compatible and use it as the guided first step after a type is selected.
- Simplify the content detail workspace to Edit, Connections, Media, Review, and More.
- Put Sources, History, and Advanced Data inside More.
- Organize fields into progressive, human-language sections based on content type.
- Keep draft creation, duplicate warnings, connected records, sources, media rights, review history, and advanced IDs operational.
- Surface subtle saved feedback and keep Preview Public Page prominent.

### 4. Contextual quality and publication controls
- Present sources only when missing or when verification requires them.
- Present media permission in plain language and reveal legal details only when needed.
- Replace the visible internal stage chain with one simple status plus useful context.
- Add a concise publication checklist and only block publication for genuine blockers.

### 5. Consolidated review and submissions
- Rebuild `/admin/review` around Needs Review, Needs Changes, and Ready, with an optional review-type filter.
- Show each item’s issue, assignment, update time, and one primary action.
- Keep content and review requests together on the content detail page.
- Simplify submissions into New, In Review, Needs Changes, Accepted, and Declined views using existing workflow data.
- Replace technical duplicate language with “Similar content already exists” and plain actions.

### 6. Action-focused dashboards
- Tailor the dashboard to editorial, partnership, and admin roles.
- Keep Needs Your Attention, Recently Edited, Coming Up, and Quick Create as flat operational sections.
- Remove technical labels and links from ordinary dashboard tasks while retaining their destinations through contextual actions or Settings.

### 7. Linear partnerships and consolidated Settings
- Reorganize inquiry detail into Request, Related Content, Find Partner, Introduction, Follow-up, and Outcome.
- Keep partner and follow-up workflows direct, with common-language labels and existing audit history intact.
- Rebuild Settings with General, Users & Roles, Categories, and Advanced.
- Move Data Health, duplicate/merge tools, activity, technical taxonomy, sources, media rights, and curation links into role-gated Advanced settings.

### 8. QA
- Verify role switching changes navigation and dashboard priorities correctly.
- Test the three supplied journeys: create an event, process a contributor submission, and route a Gamelan-related inquiry.
- Test desktop, tablet, and mobile layouts without changing the approved visual system.
- Run TypeScript checks, production build validation, route checks, and interaction checks for preview, review, filters, drawers, and forms.

## Technical notes
- Existing state types, selectors, persistence, graph links, source records, media records, activity entries, and detailed workflow statuses remain unchanged as the underlying model.
- A presentation mapping will translate detailed workflow stages into the seven simple statuses.
- Existing specialist URLs remain available for deep links and advanced administration; only the normal navigation and default presentation are simplified.
- No public-platform or Contributor Workspace redesign is included.
