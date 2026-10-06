import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, ShoppingBasket, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findProductById, productName } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/i18n";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [
    { title: "Panier de demande | FINOUQ" }, { name: "description", content: "Préparez une demande de devis pour vos produits industriels." },
    { property: "og:title", content: "Panier de demande | FINOUQ" }, { property: "og:description", content: "Sélectionnez vos produits et quantités pour une demande de devis." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: CartPage,
});
function CartPage() {
  const { items, remove, setQuantity } = useCart(); const { language, t } = useLocale();
  const lines = items.flatMap((line) => { const product = findProductById(line.id); return product ? [{ product, quantity: line.quantity }] : []; });
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><p className="section-kicker">FINOUQ</p><h1 className="mt-2 font-display text-4xl font-bold">{t("cart")}</h1><p className="mt-3 text-sm text-muted-foreground">{t("cartIntro")}</p>{lines.length ? <><div className="mt-9 divide-y divide-border border-y border-border">{lines.map(({ product, quantity }) => <div key={product.id} className="flex flex-wrap items-center gap-4 py-5 sm:flex-nowrap"><Link to="/products/$productId" params={{ productId: product.id }} className="h-20 w-24 shrink-0 overflow-hidden bg-muted"><img src={product.image} alt="" className="h-full w-full object-cover" /></Link><div className="min-w-[140px] flex-1"><Link to="/products/$productId" params={{ productId: product.id }} className="font-display text-xl font-bold hover:text-accent">{productName(product, language)}</Link><p className="mt-1 font-mono text-xs text-muted-foreground">{product.sku}</p></div><div><label htmlFor={`quantity-${product.id}`} className="mb-1 block text-xs text-muted-foreground">{t("quantity")}</label><Input id={`quantity-${product.id}`} type="number" min="1" max="9999" value={quantity} onChange={(event) => setQuantity(product.id, Number(event.target.value))} className="w-20" /></div><Button variant="ghost" size="icon" onClick={() => remove(product.id)} aria-label={`${t("remove")}: ${productName(product, language)}`} title={t("remove")}><Trash2 className="size-4" /></Button></div>)}</div><div className="mt-8 flex flex-wrap justify-between gap-3"><Button asChild variant="outline"><Link to="/products">{t("continue")}</Link></Button><Button asChild><Link to="/contact" search={{}}>{t("sendInquiry")}<ArrowRight /></Link></Button></div><div className="mt-4 flex flex-wrap items-center gap-3 border border-border bg-muted/40 px-4 py-4"><Button asChild className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"><a href={buildWhatsAppUrl(lines.map(({ product, quantity }) => ({ name: productName(product, language), sku: product.sku, quantity })), {}, language)} target="_blank" rel="noopener noreferrer"><MessageCircle />{t("sendWhatsApp")}</a></Button><p className="text-xs text-muted-foreground">{t("whatsappHint")}</p></div></> : <div className="mt-10 border border-dashed border-border py-16 text-center"><ShoppingBasket className="mx-auto size-10 text-muted-foreground" /><h2 className="mt-4 font-display text-2xl font-bold">{t("emptyCart")}</h2><Button asChild className="mt-5"><Link to="/products">{t("browse")}</Link></Button></div>}</div>;
}