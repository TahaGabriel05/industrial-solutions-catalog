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

## Project architecture

- Keep catalog hierarchy and product records centralized in `src/lib/catalog.ts` so future products and translations remain data-driven.
- Keep shared public-site navigation and footer in `src/components/site-shell.tsx` so all catalog pages use one consistent shell.
- Keep French/English interface copy in `src/lib/i18n.tsx` and translated catalog records in `src/lib/catalog.ts` so language changes stay consistent across pages.
- Keep the inquiry cart in `src/lib/cart.tsx` with browser-local persistence; only a successful form submission becomes a saved inquiry, never an order.
- Save public quote inquiries through a validated server function into a private Cloud table, since customer contact details must not be readable by visitors.
- Imported products live in Cloud tables (catalog_categories/catalog_products) and are merged into the static catalog arrays via `mergeRemoteCatalog` (root loader + product loader), so all synchronous lookups keep working.
- Product images are stored in a private bucket and served through `/api/public/product-image/*`, because public buckets are blocked in this workspace.
- Catalog writes are admin-only via `user_roles` + `has_role` RLS; the import tool lives under `_authenticated/`.
- Keep public contact details and fixed inquiry recipients in `src/lib/business.ts` so contact links and WhatsApp actions use one source of truth.
