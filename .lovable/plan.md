# Expand the FINOUQ Admin Panel

## What will be added

- Add two organized request views:
  - **Quote Requests** for individual-product and general quote submissions.
  - **Confirmed Cart Inquiries** for submissions containing cart products and quantities.
- Let admins search, inspect, update status, add internal notes, and delete submitted requests.
- Add a **Homepage Wallpapers** manager to upload, preview, reorder, and remove slideshow images.
- Add a **Website Theme** editor for the main text, background, surface, button, accent, border, and muted colors, with a reset option and immediate preview.
- Add an **Icons** manager covering all public-facing icon slots. Each slot can use its current built-in icon or an uploaded custom image.
- Reorganize the admin navigation into clear Catalog, Requests, and Appearance groups while preserving the current industrial design.

## Data and security

- Extend existing site settings with ordered wallpaper paths, theme values, and icon overrides.
- Extend inquiries with a workflow status and private admin notes.
- Keep customer details private: only verified admins can list, update, or delete inquiries.
- Keep appearance settings publicly readable so the website can render them, while only admins can change them.
- Continue storing uploads in the existing private media storage and serving them through the existing safe image endpoint.

## Public website behavior

- Use uploaded homepage wallpapers in their saved order; fall back to the current four images when none are configured.
- Apply saved theme colors globally without changing page structure or typography.
- Apply custom icons everywhere a public icon slot is configured; otherwise retain the current built-in icons.
- Keep French as default, English available, and all controls mobile-friendly.

## Technical details

- Apply an additive Lovable Cloud migration for the new settings and inquiry workflow fields, grants, and admin-only policies.
- Add focused admin managers for inquiries, wallpapers, theme, and icons rather than enlarging existing product/category forms.
- Extend the existing root settings load so appearance changes propagate across all public pages.
- Validate request management, uploads, ordering, theme changes, icon overrides, and public rendering in the live preview.