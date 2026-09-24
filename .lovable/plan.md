# Fix public Connect navigation

## Changes
- Define **Connect** as a direct `/connect` destination with no submenu metadata.
- Update desktop and mobile navigation rendering so groups without submenu items use an accessible link, including active state for `/connect` and collaboration detail pages.
- Move the existing **Collaborate with Indonesia** landing experience to `/connect`, retaining its inquiry CTA and expanding it only where needed to match the requested page structure.
- Redirect legacy `/collaborate`, `/collaborations`, `/inquiry`, and `/opportunities` compatibility paths to `/connect`; preserve individual collaboration detail pages and mark Connect active there.
- Update internal public links and canonical page metadata to use `/connect`.

## Verification
- Check desktop, tablet, and mobile navigation.
- Verify mouse/tap, keyboard Enter, browser Back, direct route loading, active state, CTA inquiry opening, legacy redirects, and page overflow.
- Confirm the preview build has no errors.
