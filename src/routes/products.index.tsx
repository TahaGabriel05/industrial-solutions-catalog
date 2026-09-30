import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ProductCatalog } from "@/components/product-catalog";

const searchSchema = z.object({ category: z.string().optional() });

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  head: () => ({ meta: [
    { title: "Product Catalog | Atlas Industrial Supply" },
    { name: "description", content: "Browse professional tools, fasteners, industrial fittings, valves and faucets by category and specification." },
    { property: "og:title", content: "Industrial Product Catalog | Atlas" },
    { property: "og:description", content: "Search our professional industrial supply range by category, reference and specification." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: ProductsPage,
});

function ProductsPage() {
  const { category } = Route.useSearch();
  return <ProductCatalog initialCategory={category ?? "all"} />;
}
