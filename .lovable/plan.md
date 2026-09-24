# Public Navigation Consolidation

## Scope
Update public navigation and collaboration links only. Keep the CMS label “Collaborations” and preserve all existing collaboration content and functionality.

## Changes
- Remove Connect from the shared primary navigation data, leaving Understand Indonesia, Experience, and About as menu groups.
- Keep one prominent Collaborate link in desktop, tablet, and mobile headers, with active styling across `/collaborate` and collaboration detail pages.
- Make `/collaborate` the canonical “Collaborate with Indonesia” page with its own metadata.
- Redirect legacy `/connect`, `/collaborations`, `/inquiry`, and `/opportunities` entry routes to `/collaborate` while preserving collaboration detail routes.
- Update public footer, homepage CTAs, FAQ links, topic relationships, search shortcuts, About copy, and not-found shortcuts to use Collaborate and `/collaborate`.
- Preserve legitimate contextual verbs such as “Connect with this institution” and all internal CMS terminology.

## Verification
- Test desktop at 1440px, tablet at 820px, and mobile at 375px.
- Confirm Connect is absent, Collaborate remains visible and keyboard/touch accessible, active states work, search does not collide, the mobile drawer stays clear, and legacy routes redirect correctly.
