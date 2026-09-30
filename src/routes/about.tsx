import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, Factory, Handshake, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import fittingsCover from "@/assets/fittings-cover.jpg";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "À propos d'Atlas Industrial Supply" },
    { name: "description", content: "Découvrez comment Atlas accompagne les professionnels avec des produits fiables et des conseils techniques clairs." },
    { property: "og:title", content: "À propos d'Atlas Industrial Supply" },
    { property: "og:description", content: "Un partenaire pour la maintenance, la construction et l'industrie." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: AboutPage,
});

function AboutPage() {
  const { language, t } = useLocale();
  return <>
    <section className="border-b border-border bg-primary text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center lg:px-8 lg:py-24"><div><p className="section-kicker">{language === "fr" ? "À propos d'Atlas" : "About Atlas"}</p><h1 className="mt-4 font-display text-5xl font-bold leading-none sm:text-6xl">{language === "fr" ? "Un partenaire à la mesure de votre activité." : "A supply partner built around your operation."}</h1><p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/70">{language === "fr" ? "Nous aidons les équipes de maintenance, de construction et de l'industrie à trouver des produits fiables, avec des informations techniques claires et un accompagnement réactif." : "We help maintenance, construction and industrial teams source dependable products with clear technical information and direct, responsive support."}</p></div><img src={fittingsCover} alt="Precision industrial fittings" width={1536} height={1024} className="aspect-[4/3] w-full object-cover" /></div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="section-kicker">{language === "fr" ? "Notre approche" : "How we work"}</p><h2 className="mt-3 font-display text-3xl font-bold">{language === "fr" ? "Une expertise pratique, sans complication." : "Practical expertise, without unnecessary complexity."}</h2></div><div className="grid gap-px bg-border sm:grid-cols-2">{(language === "fr" ? [{ icon: ClipboardCheck, title: "Fiches claires", text: "Des informations techniques organisées pour bien choisir." }, { icon: ShieldCheck, title: "Qualité fiable", text: "Des matériaux et applications éprouvés." }, { icon: Factory, title: "Vocation industrielle", text: "Un catalogue adapté à la maintenance et à la production." }, { icon: Handshake, title: "Service réactif", text: "Un accompagnement direct pour vos références et devis." }] : [{ icon: ClipboardCheck, title: "Clear specifications", text: "Product information is organized for confident technical selection." }, { icon: ShieldCheck, title: "Dependable quality", text: "Our range focuses on proven materials, standards and applications." }, { icon: Factory, title: "Industrial focus", text: "A catalog shaped around real maintenance and production needs." }, { icon: Handshake, title: "Responsive service", text: "Direct support for product matching, quantities and quotations." }]).map((item) => <div key={item.title} className="bg-background p-7"><item.icon className="size-6 text-accent" /><h3 className="mt-4 font-display text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p></div>)}</div></div></section>
    <section className="border-y border-border bg-muted"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><div><h2 className="font-display text-2xl font-bold">{language === "fr" ? "Notre équipe est à votre écoute." : "Put our product team to work."}</h2><p className="mt-2 text-sm text-muted-foreground">{language === "fr" ? "Envoyez-nous votre liste, vos spécifications ou vos références." : "Send your list, specification or product reference."}</p></div><Button asChild size="lg"><Link to="/contact">{t("quote")} <ArrowRight /></Link></Button></div></section>
  </>;
}