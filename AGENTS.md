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
- CMS state lives in a module-level store (`src/lib/cms/store.tsx`, useSyncExternalStore, persisted synchronously) — admin layout remounts on navigation, so React-state providers lost edits.
- CMS UI is built only from `src/components/cms/*` (DataList for lists, EditorFrame/RecordEditor for edits); old `components/admin` CMS is gone and `/admin/*` legacy paths redirect via `admin.$.tsx`.
- Topic icons are controlled Lucide names stored on Topic records; public surfaces share one renderer and legacy browser-saved Topics receive defaults at read time, so editors can change an icon without diverging displays.
- CMS users, access roles and the activity log live in the database (cms_users, cms_access_roles, cms_activity) with permissions enforced by `cms_can` in RLS plus the /admin route gate; menu keys come from `src/lib/cms/access.ts` — so hiding a menu is never the only protection.
- CMS list pagination uses a shared client-side control over the browser-persisted CMS store; the sidebar preference uses localStorage — because records are not yet served from a paginated backend and navigation should retain UI choices.
- CMS list filter presentation lives in `src/components/cms/FilterBar.tsx` while filtering stays in each list route — so visual changes cannot alter the records or matching rules.
