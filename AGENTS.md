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
- Keep the inquiry cart in `src/lib/cart.tsx` with browser-local persistence, since no order service is connected and drafts must not be presented as sent orders.
