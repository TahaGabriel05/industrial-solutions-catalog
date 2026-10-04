import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { RemoteCatalog } from "./catalog";

/** Public read of imported categories/products (no prices or private data exist in these tables). */
export const getImportedCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<RemoteCatalog> => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const client = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  const [cats, prods, settings] = await Promise.all([
    client.from("catalog_categories").select("id, name, name_fr, subcategories, image_url, description, description_fr, sort_order, hidden").order("created_at"),
    client.from("catalog_products").select("id, sku, name, name_fr, category_id, subcategory, image_url, specs, specs_fr, description, description_fr, brand, color, dimensions, weight, power, stock, images, technical_sheet_path, badges, badge_images, hidden").order("created_at"),
    client.from("site_settings").select("logo_path, favicon_path").eq("id", "site").maybeSingle(),
  ]);
  return { categories: cats.data ?? [], products: prods.data ?? [], settings: settings.data ?? null };
});
