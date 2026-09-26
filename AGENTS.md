<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Architecture rules
- CMS state lives in a module-level persisted store (`src/lib/cms/store.tsx`) because the admin layout remounts on navigation.
- CMS UI uses `src/components/cms/*`; legacy `/admin/*` paths redirect via `admin.$.tsx`.
- Topic icons are controlled Lucide names stored on Topic records; public surfaces share one renderer and legacy browser-saved Topics receive defaults at read time, so editors can change an icon without diverging displays.
- CMS users, access roles and the activity log live in the database (cms_users, cms_access_roles, cms_activity) with permissions enforced by `cms_can` in RLS plus the /admin route gate; menu keys come from `src/lib/cms/access.ts` — so hiding a menu is never the only protection.
- CMS lists paginate browser-persisted records; sidebar state persists locally so navigation retains choices.
- CMS list filter presentation lives in `src/components/cms/FilterBar.tsx` while filtering stays in each list route — so visual changes cannot alter the records or matching rules.
- Public SEO identity is defined in `src/lib/public-seo.ts`, with server-rendered leaf metadata and one canonical per page; browser-local CMS edits are not crawlable, so the sitemap includes only code-backed meaningful public records.
- Social previews use `src/lib/social-image.ts` and share-sized crops of the same cover images under `public/share/`; do not tag a different image from the one shown or invent a public URL for browser-local uploads.
- Authored article publication and modification dates are fixed editorial facts; only explicitly prototype calendar events may use the rolling date demonstration in `src/data/content.ts`.
- The CMS dashboard keeps audience data separate from editorial tasks; unconnected analytics stay empty and example seed records do not become live alerts.
