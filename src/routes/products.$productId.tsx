import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Download, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, categoryName, findProductById, mergeRemoteCatalog, productName } from "@/lib/catalog";
import { getImportedCatalog } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/products/$productId")({
  loader: async ({ params }) => {
    let product = findProductById(params.productId);
    if (!product) { try { mergeRemoteCatalog(await getImportedCatalog()); } catch { /* catalog stays static */ } product = findProductById(params.productId); }
    if (!product) throw notFound();
    return product;
  },
  notFoundComponent: () => <div className="mx-auto max-w-7xl px-4 py-20 text-center"><h1 className="font-display text-2xl font-bold">Produit introuvable / Product not found</h1><Link to="/products" className="mt-4 inline-block text-accent">Catalogue</Link></div>,
  errorComponent: () => <div className="mx-auto max-w-7xl px-4 py-20 text-center"><h1 className="font-display text-2xl font-bold">Erreur de chargement / Loading error</h1><Link to="/products" className="mt-4 inline-block text-accent">Catalogue</Link></div>,
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.nameFr} | Atlas Industrial Supply` : "Produit introuvable | Atlas" },
    { name: "description", content: loaderData?.descriptionFr ?? "Consultez notre catalogue de produits industriels." },
    { property: "og:title", content: loaderData?.nameFr ?? "Produit introuvable | Atlas" },
    { property: "og:description", content: loaderData?.descriptionFr ?? "Catalogue Atlas Industrial Supply" },
    { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ProductPage,
});
function ProductPage() {
  const product = Route.useLoaderData(); const { language, t } = useLocale(); const { add } = useCart();
  const [quantity, setQuantity] = useState(1); const [added, setAdded] = useState(false); const [image, setImage] = useState(0);
  const images = product.images?.length ? product.images : [product.image];
  const category = categories.find((item) => item.id === product.category);
   const details = [
     [t("reference"), product.sku], [t("brand"), product.brand], [t("color"), product.color === "Zinc plated" && language === "fr" ? "Zingué" : product.color], [t("dimensions"), product.dimensions], [t("weight"), product.weight], [t("power"), product.power],
  ].filter((row): row is [string, string] => typeof row[1] === "string" && row[1].length > 0);
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"><ArrowLeft className="size-4" />{t("allProducts")}</Link><div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14"><div><div className="aspect-[4/3] overflow-hidden bg-muted"><img src={images[image]} alt={productName(product, language)} className="h-full w-full object-cover" /></div>{images.length > 1 && <div className="mt-3 flex gap-2">{images.map((src, index) => <Button key={`${src}-${index}`} variant="outline" className={`h-20 w-24 overflow-hidden p-0 ${index === image ? "border-accent" : ""}`} onClick={() => setImage(index)} aria-label={`${t("products")} ${index + 1}`}><img src={src} alt="" className="h-full w-full object-cover" /></Button>)}</div>}</div><div className="min-w-0"><p className="section-kicker">{category ? categoryName(category, language) : t("products")}</p>{product.brand && <p className="mt-3 text-sm font-semibold uppercase text-muted-foreground">{product.brand}</p>}<h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">{productName(product, language)}</h1><p className="mt-3 font-mono text-xs font-semibold text-accent">REF: {product.sku}</p>{product.stock !== undefined && <p className={`mt-2 text-sm font-semibold ${product.stock > 0 ? "text-foreground" : "text-muted-foreground"}`}>{product.stock > 0 ? (language === "fr" ? `En stock : ${product.stock}` : `In stock: ${product.stock}`) : (language === "fr" ? "Sur commande" : "On request")}</p>}<p className="mt-7 text-sm leading-7 text-muted-foreground">{language === "fr" ? product.descriptionFr : product.description}</p><div className="mt-8 border-t border-border pt-6"><h2 className="font-display text-2xl font-bold">{t("technical")}</h2><dl className="mt-4 divide-y divide-border border-b border-border">{details.map(([label, value]) => <div key={label} className="grid grid-cols-[110px_1fr] gap-3 py-3 text-sm sm:grid-cols-[150px_1fr]"><dt className="font-semibold text-muted-foreground">{label}</dt><dd>{value}</dd></div>)}{(language === "fr" ? product.specsFr : product.specs).map((spec, index) => <div key={spec} className="grid grid-cols-[110px_1fr] gap-3 py-3 text-sm sm:grid-cols-[150px_1fr]"><dt className="font-semibold text-muted-foreground">{language === "fr" ? "Détail" : "Detail"} {index + 1}</dt><dd>{spec}</dd></div>)}</dl></div>{((product.badges?.length ?? 0) > 0 || (product.badgeImages?.length ?? 0) > 0) && <div className="mt-7"><h2 className="font-display text-xl font-bold">{t("advantages")}</h2><div className="mt-3 flex flex-wrap items-center gap-2">{product.badgeImages?.map((src) => <img key={src} src={src} alt="" className="h-12 w-auto border border-border bg-background object-contain p-1" />)}{product.badges?.map((badge) => <span key={badge} className="border border-border bg-muted px-3 py-2 text-xs font-semibold">{badge}</span>)}</div></div>}{product.technicalSheetUrl && <a href={product.technicalSheetUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"><Download className="size-4" />{t("sheet")}</a>}<div className="mt-8 flex flex-wrap items-end gap-3 border-t border-border pt-6"><div><label htmlFor="detail-quantity" className="mb-2 block text-xs font-semibold">{t("quantity")}</label><Input id="detail-quantity" type="number" min="1" max="9999" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(9999, Number(event.target.value) || 1)))} className="w-24" /></div><Button size="lg" onClick={() => { add(product.id, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 2000); }}>{added ? <Check /> : <ShoppingBasket />}{added ? t("added") : t("addCart")}</Button><Button asChild variant="outline" size="lg"><Link to="/contact" search={{ product: product.sku }}>{t("quote")}</Link></Button></div></div></div></div>;
}