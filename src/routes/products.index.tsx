import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ProductCatalog } from "@/components/product-catalog";

const searchSchema = z.object({ category: z.string().optional() });

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  head: () => ({ meta: [
    { title: "Catalogue de produits | FINOUQ" },
    { name: "description", content: "Découvrez l'outillage, les fixations, les raccords industriels et la robinetterie FINOUQ par catégorie et caractéristique." },
    { property: "og:title", content: "Catalogue industriel | FINOUQ" },
    { property: "og:description", content: "Recherchez nos produits industriels par catégorie, référence et caractéristique." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: ProductsPage,
});

function ProductsPage() {
  const { category } = Route.useSearch();
  return <ProductCatalog initialCategory={category ?? "all"} />;
}
