# Article Create/Edit Redesign

## Goal

Turn article creation and editing into one calm, editor-first workspace while leaving dashboard, lists, review queues, events, people, collaborations, and all other operational CMS pages unchanged.

## Experience

- Clicking **+ New Article** opens the writing canvas immediately with **Add title**, **Add a short introduction…**, **Add cover image**, and **Start writing…**.
- New and existing articles use the same editor component and layout.
- Desktop uses a wide writing canvas plus a collapsible 280–320px settings panel; tablet and mobile use a settings drawer.
- A dedicated top bar provides Back to Articles, draft/autosave state, Preview, Save Draft, Settings, Focus Mode, and Submit for Review/Publish.
- Focus Mode hides the CMS navigation, settings, and secondary controls until exited.

## Rich block editor

- Add a proven React rich-text foundation and store a versioned JSON document rather than a plain narrative textarea.
- Support paragraphs, H2/H3, bold, italic, underline, links, bulleted and numbered lists, quotes, pull quotes, images, galleries, video/external embeds, dividers, callouts, tables, captions, undo, and redo.
- Provide a compact selection toolbar, slash-command menu, and lightweight block controls for insert, drag reorder, duplicate, and delete.
- Keep blocks visually unboxed on the writing canvas; show controls only on focus or hover.
- Convert existing article narrative text into paragraph blocks on first edit while preserving the legacy field for compatibility.

## Article media

- Place cover-image controls directly above the body with change, caption, credit, permission, and focal-point controls.
- Let image/gallery blocks upload a local preview or select an existing CMS asset, then edit caption, credit, alt text, and permission in context.
- Preserve the existing media-rights checks; advanced rights information remains collapsed until needed.

## Settings panel

Use collapsed groups so metadata supports writing rather than competing with it:

- **Article**: status, searchable topics with a primary topic, delivery type with public mapping, content source, author, publication date, and slug.
- **By Curation**: reveal Original Source, Source Organisation, Original Author, Original URL, and Original Publication Date only when selected.
- **Homepage Hero**: feature toggle plus order 1–5 and optional image/headline/summary overrides, connected to existing homepage settings and limit enforcement.
- **Connections**: searchable additions for topics, people, organisations, events, places, collections, and collaborations using existing relationships.
- **Sources**: compact add/edit fields for title, author/institution, year, and URL without data-layer terminology.
- **Editorial Review**: show Main Claim, Evidence, and Context/Nuance only for Pragmatic articles; retain existing review/history capabilities through contextual secondary panels.

## Autosave, preview, and publishing

- Debounce draft autosave and show quiet **Saving…**, **Saved**, and relative saved-time states without repeated notifications.
- Keep explicit **Save Draft** for reassurance and log meaningful manual/workflow changes without flooding activity history.
- Rebuild article preview from the same document renderer used by the editor, styled like the public article and labelled **Preview — Not Published** when appropriate.
- Open a compact pre-publication panel listing required checks for title, topic, content, cover image, source requirements, and media permissions; connections remain recommended, not blocking.
- Submit or publish through the existing role-aware workflow after blocking only genuine required issues.

## Technical integration

- Add focused article-editor components and document/media helpers; keep the current generic content workspace for every non-article record.
- Extend the article content model additively for block JSON, structured curation details, cover metadata, and pragmatic review fields; migrate legacy local prototype records safely on read.
- Add the minimal store actions needed for article drafts and media insertion while preserving One Data relationships, sources, claims, roles, history, and local prototype persistence.
- Add an editor-mode signal to the existing admin shell so Focus Mode can hide and restore its navigation/header without affecting other routes.
- Keep current URLs and entry points working; article links open the new editor, while non-article links continue to open the operational record workspace.

## Validation

- Test new article creation, existing article editing, autosave/reload persistence, formatting, slash insertion, block reorder/duplicate/delete, cover and inline media, conditional source/pragmatic settings, Hero limit, connections, sources, preview, pre-publication checks, and workflow transition.
- Verify desktop, tablet, and mobile layouts, including drawers and Focus Mode, with no horizontal overflow or trapped controls.
- Verify non-article CMS pages remain operational and visually unchanged, then confirm type checks, preview build health, runtime console health, and route metadata.
