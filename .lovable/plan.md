# Editorial homepage hero carousel

## Scope
Redesign only the public homepage hero. Keep the existing CMS Hero source, article records, homepage sections, navigation, and brand system unchanged.

## Implementation
- Replace the current split hero and numbered chips with one immersive, photography-led editorial carousel.
- Resolve 1–5 valid CMS-selected articles in saved Hero order, using each Hero image/headline/summary/CTA override before article defaults.
- Show only public-facing topic and Essentials / Deep Dive / Perspectives labels, plus human-readable attribution when relevant.
- Add accessible Previous and Next controls, compact numeric progress, keyboard navigation, and a subtle next-slide peek on larger screens.
- Add touch swipe and pointer drag without causing page-level horizontal overflow.
- Use a controlled horizontal image transition with a subtle content fade/shift; reduce or remove movement under reduced-motion preferences.
- Render a single selected article as a static editorial hero with no arrows, progress, drag, or swipe behavior.
- Preserve responsive readability: layered composition on desktop where photography supports it, and image-first content flow on smaller screens.

## Verification
- Check CMS ordering and overrides, 1-slide and multi-slide states, public labels, attribution, links, arrows, keyboard controls, swipe/drag, Back navigation, and active slide announcements.
- Inspect desktop, tablet, and mobile layouts for cropping, touch targets, readability, and horizontal overflow.
- Confirm the preview build remains healthy and no public or CMS area outside the homepage hero changes.
