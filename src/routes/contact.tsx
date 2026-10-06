import { createFileRoute } from "@tanstack/react-router";
import { Building2, CheckCircle2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitInquiry } from "@/lib/inquiries.functions";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { findProductById, findProductBySku, productName } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/i18n";
import { BUSINESS } from "@/lib/business";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const searchSchema = z.object({ product: z.string().optional() });
export const Route = createFileRoute("/contact")({ validateSearch: searchSchema,
  head: () => ({ meta: [
    { title: "Contact et devis | FINOUQ" }, { name: "description", content: "Demandez un devis pour l'outillage, la visserie, les raccords et la robinetterie FINOUQ." },
    { property: "og:title", content: "Demander un devis industriel | FINOUQ" }, { property: "og:description", content: "Envoyez vos références, quantités et besoins à notre équipe." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ContactPage,
});
function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) { return <div><Label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-[0.08em]">{label}</Label>{children}</div>; }
function ContactPage() {
  const { product: sku } = Route.useSearch(); const selected = findProductBySku(sku);
  const { items, clear } = useCart(); const { language, t } = useLocale(); const [submitted, setSubmitted] = useState(false); const [pending, setPending] = useState(false); const [error, setError] = useState(""); const saveInquiry = useServerFn(submitInquiry);
  const lines = items.flatMap((line) => { const product = findProductById(line.id); return product ? [{ product, quantity: line.quantity }] : []; });
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      await saveInquiry({ data: {
        name: String(form.get("name") ?? ""), company: String(form.get("company") ?? ""),
        phone: String(form.get("phone") ?? ""), email: String(form.get("email") ?? ""),
        productReference: String(form.get("product") ?? ""), quantity: Number(form.get("quantity") ?? 1),
        message: String(form.get("message") ?? ""), website: String(form.get("website") ?? ""),
        items: lines.map(({ product, quantity }) => ({ id: product.id, quantity })),
      } });
      clear(); setSubmitted(true);
    } catch { setError(language === "fr" ? "Impossible d'enregistrer votre demande. Veuillez réessayer." : "Could not save your inquiry. Please try again."); }
    finally { setPending(false); }
  };
  const sendWhatsApp = (event: React.MouseEvent<HTMLButtonElement>) => {
    const formElement = event.currentTarget.form;
    if (!formElement) return;
    const form = new FormData(formElement);
    const productText = String(form.get("product") ?? "").trim();
    const whatsappLines = lines.map(({ product, quantity }) => ({ name: productName(product, language), sku: product.sku, quantity }));
    if (productText) whatsappLines.push({ name: productText, sku: productText, quantity: Math.max(1, Number(form.get("quantity") ?? 1) || 1) });
    window.open(buildWhatsAppUrl(whatsappLines, { name: String(form.get("name") ?? ""), company: String(form.get("company") ?? ""), phone: String(form.get("phone") ?? ""), email: String(form.get("email") ?? "") }, language), "_blank", "noopener,noreferrer");
  };
  return <div className="bg-muted"><section className="border-b border-border bg-primary text-primary-foreground"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18"><p className="section-kicker">{language === "fr" ? "Contact et devis" : "Contact & quotation"}</p><h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{language === "fr" ? "Parlez-nous de votre projet." : "Tell us what you need."}</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/70">{language === "fr" ? "Indiquez vos références, vos quantités et vos besoins pour préparer votre demande." : "Share your product references, specifications and quantities to prepare your inquiry."}</p></div></section><div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8 lg:py-16"><aside className="space-y-8"><div><h2 className="font-display text-2xl font-bold">{language === "fr" ? "Contactez notre équipe" : "Talk to our team"}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{language === "fr" ? "Pour les disponibilités, les références et les demandes commerciales, utilisez le formulaire ci-contre." : "For product matching, availability and commercial inquiries, use the form."}</p></div><div className="space-y-4 border-t border-border pt-6"><div className="flex gap-3"><Phone className="mt-0.5 size-5 text-accent" /><div><strong className="block text-sm">{t("phone")}</strong><a href={`tel:${BUSINESS.internationalPhone}`} className="text-sm text-muted-foreground hover:text-accent">{BUSINESS.phone}</a></div></div><div className="flex gap-3"><Mail className="mt-0.5 size-5 text-accent" /><div><strong className="block text-sm">{t("email")}</strong><a href={`mailto:${BUSINESS.email}`} className="text-sm text-muted-foreground hover:text-accent">{BUSINESS.email}</a></div></div><div className="flex gap-3"><Building2 className="mt-0.5 size-5 text-accent" /><div><strong className="block text-sm">{language === "fr" ? "Horaires" : "Business hours"}</strong><span className="text-sm text-muted-foreground">{language === "fr" ? "Lundi–vendredi, 08:00–17:00" : "Monday–Friday, 08:00–17:00"}</span></div></div></div><p className="border-l-2 border-accent pl-4 text-xs leading-5 text-muted-foreground">{language === "fr" ? "Horaires provisoires, à confirmer." : "Business hours are provisional, to be confirmed."}</p></aside><section className="border border-border bg-background p-5 sm:p-8">{submitted ? <div className="grid min-h-[460px] place-items-center text-center"><div><CheckCircle2 className="mx-auto size-12 text-accent" /><h2 className="mt-5 font-display text-3xl font-bold">{t("prepared")}</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">{language === "fr" ? "Votre demande a été enregistrée. Notre équipe doit consulter les demandes dans Lovable Cloud ; aucun e-mail automatique n’est envoyé." : "Your inquiry has been recorded. Your team can review inquiries in Lovable Cloud; no automatic email is sent."}</p><Button className="mt-6" onClick={() => setSubmitted(false)}>{t("again")}</Button></div></div> : <form onSubmit={submit}><div className="mb-7 border-b border-border pb-5"><p className="section-kicker">{language === "fr" ? "Formulaire de devis" : "Quotation form"}</p><h2 className="mt-2 font-display text-2xl font-bold">{t("quote")}</h2>{selected && <div className="mt-4 bg-muted p-4"><span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">{t("reference")} · {selected.sku}</span><strong className="mt-1 block text-sm">{productName(selected, language)}</strong></div>}{lines.length > 0 && <div className="mt-4 bg-muted p-4"><strong className="block text-sm">{t("cart")}</strong><ul className="mt-2 space-y-1 text-xs text-muted-foreground">{lines.map(({ product, quantity }) => <li key={product.id}>{quantity} × {productName(product, language)} — {product.sku}</li>)}</ul></div>}</div><div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div><div className="grid gap-5 sm:grid-cols-2"><Field label={`${t("name")} *`} id="name"><Input id="name" name="name" required autoComplete="name" /></Field><Field label={`${t("company")} *`} id="company"><Input id="company" name="company" required autoComplete="organization" /></Field><Field label={`${t("phone")} *`} id="phone"><Input id="phone" name="phone" type="tel" required autoComplete="tel" /></Field><Field label={`${t("email")} *`} id="email"><Input id="email" name="email" type="email" required autoComplete="email" /></Field><Field label={t("productReference")} id="product"><Input id="product" name="product" key={`${selected?.sku ?? "none"}-${language}`} defaultValue={selected ? `${productName(selected, language)} — ${selected.sku}` : ""} placeholder={language === "fr" ? "Produit ou référence" : "Product name or SKU"} /></Field><Field label={`${t("quantity")} *`} id="quantity"><Input id="quantity" name="quantity" type="number" min="1" required defaultValue="1" /></Field><div className="sm:col-span-2"><Field label={t("message")} id="message"><Textarea id="message" name="message" rows={5} placeholder={language === "fr" ? "Usage, spécifications, lieu de livraison ou autres produits..." : "Application, technical requirements, delivery location or additional products..."} /></Field></div></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto"><Send />{pending ? (language === "fr" ? "Enregistrement..." : "Saving...") : t("submit")}</Button><Button type="button" size="lg" onClick={sendWhatsApp} className="w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 sm:w-auto"><MessageCircle />{t("sendWhatsApp")}</Button></div>{error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}<p className="mt-4 text-xs text-muted-foreground">{language === "fr" ? "La demande sera enregistrée et consultable par votre équipe ; aucun paiement ni commande n’est effectué." : "The inquiry is recorded for your team; no payment or order is placed."}</p></form>}</section></div></div>;
}