import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, Phone, ShieldCheck, ShoppingBasket, Wrench, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale, type CopyKey } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const navItems: { label: CopyKey; to: "/" | "/products" | "/about" | "/contact" | "/cart" }[] = [
  { label: "home", to: "/" }, { label: "products", to: "/products" }, { label: "about", to: "/about" }, { label: "contact", to: "/contact" },
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLocale();
  const { count } = useCart();
  return <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
    <div className="border-b border-border bg-primary text-primary-foreground"><div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8"><span>{language === "fr" ? "Spécialistes des fournitures industrielles" : "Industrial supply specialists"}</span><span className="hidden items-center gap-2 sm:flex"><ShieldCheck className="size-3.5" />{language === "fr" ? "Assistance technique à chaque demande" : "Technical support for every order"}</span></div></div>
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Atlas Industrial Supply"><span className="grid size-10 place-items-center bg-accent text-accent-foreground"><Wrench className="size-5" /></span><span className="leading-none"><strong className="block font-display text-lg text-foreground">ATLAS</strong><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Industrial Supply</span></span></Link>
      <nav className="hidden items-center gap-5 md:flex" aria-label="Primary navigation">{navItems.map((item) => <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className="whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>{t(item.label)}</Link>)}<Button asChild size="sm"><Link to="/contact"><Phone />{t("quote")}</Link></Button></nav>
      <div className="flex items-center gap-1"><div className="flex items-center border border-border text-xs font-bold" aria-label="Language"><Button variant={language === "fr" ? "secondary" : "ghost"} size="sm" className="h-8 px-2" onClick={() => setLanguage("fr")} aria-label="Français" aria-pressed={language === "fr"}>FR</Button><Button variant={language === "en" ? "secondary" : "ghost"} size="sm" className="h-8 px-2" onClick={() => setLanguage("en")} aria-label="English" aria-pressed={language === "en"}>ENG</Button></div><Button asChild variant="ghost" size="icon" className="relative" title={t("cart")}><Link to="/cart" aria-label={`${t("cart")} (${count})`}><ShoppingBasket className="size-5" />{count > 0 && <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center bg-accent px-1 text-[10px] text-accent-foreground">{count}</span>}</Link></Button><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</Button></div>
    </div>
    {open && <nav className="border-t border-border bg-background px-4 py-4 md:hidden" aria-label="Mobile navigation"><div className="mx-auto flex max-w-7xl flex-col gap-1">{[...navItems, { label: "cart" as CopyKey, to: "/cart" as const }].map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="px-3 py-3 text-sm font-semibold text-foreground">{t(item.label)}</Link>)}</div></nav>}
  </header>;
}
export function WhatsAppFab() {
  const { language, t } = useLocale();
  return <a href={buildWhatsAppUrl([], {}, language)} target="_blank" rel="noopener noreferrer" aria-label={t("whatsapp")} title={t("whatsapp")} className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"><MessageCircle className="size-7" /></a>;
}
export function SiteFooter() {
  const { language, t } = useLocale();
  return <footer className="border-t border-border bg-primary text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8"><div><div className="flex items-center gap-3"><span className="grid size-9 place-items-center bg-accent text-accent-foreground"><Wrench className="size-4" /></span><strong className="font-display text-lg">ATLAS INDUSTRIAL SUPPLY</strong></div><p className="mt-4 max-w-md text-sm leading-6 text-primary-foreground/70">{language === "fr" ? "Outillage, fixations, raccords et robinetterie pour les professionnels de l'industrie." : "Dependable tools, fasteners, fittings and flow-control products for industrial teams."}</p></div><div><h2 className="text-sm font-bold uppercase tracking-[0.14em]">{t("products")}</h2><div className="mt-4 flex flex-col gap-2 text-sm text-primary-foreground/70"><Link to="/products">{t("allProducts")}</Link><Link to="/products" search={{ category: "tools" }}>{language === "fr" ? "Outillage" : "Tools"}</Link><Link to="/products" search={{ category: "valves" }}>{language === "fr" ? "Robinetterie" : "Valves & faucets"}</Link></div></div><div><h2 className="text-sm font-bold uppercase tracking-[0.14em]">Atlas</h2><div className="mt-4 flex flex-col gap-2 text-sm text-primary-foreground/70"><Link to="/about">{t("about")}</Link><Link to="/contact">{t("contact")}</Link><Link to="/cart">{t("cart")}</Link></div></div></div><div className="border-t border-primary-foreground/15 px-4 py-5 text-center text-xs text-primary-foreground/55">© 2026 Atlas Industrial Supply. {language === "fr" ? "Au service des professionnels." : "Built for professional procurement."}</div></footer>;
}