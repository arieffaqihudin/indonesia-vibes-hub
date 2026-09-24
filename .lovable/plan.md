# Understand Indonesia and Collections rebuild

## Public experience
- Make **Understand Indonesia** itself a real link to `/understand-indonesia` on desktop and mobile, while keeping Topics, Collections, and People & Organisations available beneath it.
- Rework `/understand-indonesia` into the all-published-articles destination with immediate search, Topic and Format filters, Latest/Oldest sorting, and a compact editorial article listing showing image, topic, format, title, standfirst, attribution, and date.
- Preserve Topics as the existing dense, searchable subject catalogue and keep People & Organisations as its separate directory.

## Curated Collections
- Rebuild the Collections landing around a large featured journey and spacious secondary journeys. Every preview will expose the ordered first stories, story count, verified aggregate reading time, and **Start the Collection** language.
- Strengthen Collection detail pages with an editorial introduction, Start Reading action, reading summary, and a connected numbered journey with a clear **Start here** first article.
- Carry Collection context into article links through URL search state, then show previous, next, and back-to-collection controls only when a reader entered through that Collection.
- Upgrade the homepage Featured Collection to show its introduction, reading summary, and first 2–3 sequenced story titles.

## CMS
- Keep the approved CMS navigation unchanged.
- Keep Collections as a simple table with the requested columns and an actions menu.
- Refine the direct Collection editor so the ordered story sequence remains the primary workflow, with article search/add/remove/reorder/preview, a public preview action, and a warning that blocks publishing fewer than two stories while still allowing draft saves.

## Technical details
- Continue using the existing canonical article and Collection records; manual `storyIds` order remains authoritative.
- Calculate total reading time only from existing article `readingMinutes`; do not invent estimates.
- Preserve local persistence and existing editorial design tokens.
- Validate route behavior, keyboard access, back navigation, responsive layouts, active navigation, sequence links, and zero horizontal overflow.