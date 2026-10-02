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
  const [cats, prods] = await Promise.all([
    client.from("catalog_categories").select("id, name, name_fr, subcategories, image_url").order("created_at"),
    client.from("catalog_products").select("id, sku, name, name_fr, category_id, subcategory, image_url, specs, specs_fr, description, description_fr, brand, color, dimensions, weight, power").order("created_at"),
  ]);
  return { categories: cats.data ?? [], products: prods.data ?? [] };
});
