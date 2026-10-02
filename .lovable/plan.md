# Product Import Tool

Add a private admin page where you upload a folder, a ZIP or a CSV, preview what will be created, then import in one click. Imported products appear in the existing catalog with the current design unchanged.

## What you get

- **Admin sign-in** (email + password, admin role only). Visitors can never see or use the import tool.
- **Import page** (`/admin/import`) with one drop zone accepting:
  - **Folder**: each sub-folder = a category, each image = a product, filename = product name (e.g. `Vannes/Vanne laiton 1 pouce.jpg`). Sub-sub-folders become subcategories.
  - **ZIP**: same structure, unpacked in the browser.
  - **CSV**: columns `reference, name, name_fr, category, subcategory, brand, color, dimensions, weight, power, description, description_fr, specs, specs_fr, image` (specs separated by `|`). Matches an image by filename when uploaded together; updates an existing product with the same reference.
- **Preview table** before importing: category, product name, reference, image thumbnail, "new" or "update" status, and any row errors.
- **Import button** with a progress bar; existing categories are reused, missing ones created automatically.
- Downloadable **CSV template**.
- Auto-generated reference (e.g. `VAN-0012`) when none is given.

## Catalog behavior

- The 8 existing products stay; imported products are added alongside them in Products, search, filters, product pages, cart and WhatsApp messages.
- Missing French/English names fall back to the other language.

## Technical details

- Cloud tables `catalog_categories` and `catalog_products` (public read, admin-only write via `user_roles` + `has_role`), public storage bucket `product-images`.
- Catalog page/product page read static data merged with database products via a server function + React Query.
- Folder/ZIP parsing in the browser (`webkitdirectory`, `jszip`, `papaparse`); images uploaded directly to storage, records saved through an admin-checked server function.
- First admin: you sign up on `/auth`, then I grant your account the admin role.
