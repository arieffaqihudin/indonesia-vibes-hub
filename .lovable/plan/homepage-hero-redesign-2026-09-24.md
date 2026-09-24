# Homepage Hero Redesign

## Scope
Update only the public homepage Hero and its existing CMS Hero manager. Preserve navigation, homepage sections, article records, DM Sans, and the current Indonesia Vibes colour system.

## Implementation
- Recompose the Hero as a full-width cinematic editorial spread using each selected article's cover image as the stage.
- Show one active story with eyebrow, large clickable title, concise standfirst, and a clear “Read Story” action.
- Replace the large bottom article rail with a restrained numbered 01–05 navigation system, visible previous/next controls, and progress feedback.
- Support 3–5 CMS-selected published articles, focal points, overrides, graceful image fallbacks, and a static single-item state.
- Add calm 6-second auto-rotation that pauses on hover, focus, reduced-motion preference, and user interaction.
- Keep keyboard arrow navigation, mobile swipe, meaningful labels, active state, and 44px touch targets.
- Refine the existing Homepage → Hero screen so each selected article visibly includes its thumbnail, title, topic, status, order handle, overrides, and preview path without creating separate Hero records.

## Responsive QA
- Desktop: immersive full-width image and editorial copy with a slim vertical selector.
- Tablet: reduced copy width and height with controls remaining easy to reach.
- Mobile: shorter image-led stage, concise copy, bottom numbered pagination, swipe support, and no horizontal overflow.
- Verify article changes update image, label, title, excerpt, and destination; verify arrows, indicators, keyboard, swipe, and reduced motion.
