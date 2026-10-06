import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Boxes, CircleCheck, Cog, Headphones, PackageCheck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { categories, categoryName } from "@/lib/catalog";
import { useLocale } from "@/lib/i18n";
import toolsCover from "@/assets/tools-cover.jpg";
import fastenersCover from "@/assets/fasteners-cover.jpg";
import fittingsCover from "@/assets/fittings-cover.jpg";
import valvesCover from "@/assets/valves-cover.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "FINOUQ | Outillage, fixations, raccords et vannes" },
    { name: "description", content: "Outillage professionnel, fixations, raccords industriels et robinetterie pour la maintenance, la construction et l'industrie." },
    { property: "og:title", content: "FINOUQ" },
    { property: "og:description", content: "Produits industriels conçus pour les professionnels." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function Index() {
  const { language, t } = useLocale();
  const slides = [toolsCover, fastenersCover, fittingsCover, valvesCover];
  const [slide, setSlide] = useState(0);
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 5000); return () => window.clearInterval(timer); }, []);
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground lg:min-h-[680px]">
        {slides.map((src, index) => <img key={src} src={src} alt="" aria-hidden="true" width={1536} height={1024} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${slide === index ? "opacity-35" : "opacity-0"}`} />)}
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex max-w-7xl items-center px-4 py-12 sm:px-6 sm:py-20 lg:min-h-[680px] lg:px-8">
          <div className="max-w-3xl">
             <p className="section-kicker text-accent">{language === "fr" ? "Fournitures industrielles · Assistance technique" : "Industrial supply · Technical support"}</p>
             <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[0.98] text-primary-foreground sm:text-6xl lg:text-7xl">{language === "fr" ? <>Le bon équipement.<br />Pour le travail de terrain.</> : <>The right equipment.<br />Ready for real work.</>}</h1>
             <p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/75 sm:text-lg">{language === "fr" ? "Outillage, fixations, raccords et robinetterie sélectionnés pour leur fiabilité dans les environnements exigeants." : "Professional tools, fasteners, fittings and flow-control products selected for reliability in demanding environments."}</p>
             <div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/products">{t("browse")} <ArrowRight /></Link></Button><Button asChild variant="outline" size="lg" className="border-primary-foreground/40 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/contact">{t("quote")}</Link></Button></div>
              <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 border-t border-primary-foreground/20 pt-5 text-xs text-primary-foreground/65 sm:mt-12 sm:grid-cols-3 sm:gap-4 sm:pt-6"><span className="flex items-center gap-2"><CircleCheck className="size-4 text-accent" /> {language === "fr" ? "Caractéristiques détaillées" : "Verified specifications"}</span><span className="flex items-center gap-2"><CircleCheck className="size-4 text-accent" /> {language === "fr" ? "Fournitures professionnelles" : "Trade-grade supply"}</span><span className="flex items-center gap-2"><CircleCheck className="size-4 text-accent" /> {language === "fr" ? "Devis personnalisés" : "Responsive quotations"}</span></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
         <div className="mb-8 flex items-end justify-between gap-6"><div><p className="section-kicker">{language === "fr" ? "Notre sélection" : "Core range"}</p><h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{t("categories")}</h2></div><Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/products">{t("allProducts")} <ArrowRight /></Link></Button></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} to="/products" search={{ category: category.id }} className="group relative aspect-[4/5] overflow-hidden bg-primary">
               <img src={category.image} alt={categoryName(category, language)} width={1536} height={1024} loading="lazy" className="h-full w-full object-cover opacity-65 transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-category-overlay" />
               <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">{category.subcategories.length} {language === "fr" ? "groupes de produits" : "product groups"}</span><h3 className="mt-2 font-display text-2xl font-bold">{categoryName(category, language)}</h3><p className="mt-2 text-xs leading-5 text-primary-foreground/70">{language === "fr" ? category.descriptionFr : category.description}</p><span className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em]">{language === "fr" ? "Découvrir" : "Explore range"} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted">
        <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-3">
           {(language === "fr" ? [{ icon: ShieldCheck, title: "Choisir avec confiance", text: "Des détails techniques clairs pour faire le bon choix." }, { icon: PackageCheck, title: "Adapté à vos besoins", text: "Précisez votre usage et votre quantité pour un devis adapté." }, { icon: Headphones, title: "Une équipe à votre écoute", text: "Des conseils pratiques du premier contact à la livraison." }] : [{ icon: ShieldCheck, title: "Specified with confidence", text: "Clear technical details help procurement and maintenance teams select correctly." }, { icon: PackageCheck, title: "Built around your requirement", text: "Tell us the application and quantity; we will quote the appropriate solution." }, { icon: Headphones, title: "Support from real specialists", text: "Practical product guidance from inquiry through delivery." }]).map((item) => <div key={item.title} className="bg-muted px-6 py-10 lg:px-10"><item.icon className="size-7 text-accent" /><h3 className="mt-5 font-display text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p></div>)}
        </div>
      </section>

       <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8 lg:py-20"><div><p className="section-kicker">{language === "fr" ? "Besoin d'un produit ?" : "Need help sourcing?"}</p><h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{language === "fr" ? "Transmettez-nous vos besoins techniques." : "Send us your technical requirement."}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{language === "fr" ? "Indiquez la référence, les caractéristiques et la quantité souhaitées. Notre équipe préparera un devis personnalisé." : "Reference a catalog item or describe the part, specification and quantity you need. Our team will prepare a tailored quotation."}</p></div><Button asChild size="lg"><Link to="/contact"><Cog /> {t("quote")}</Link></Button></section>
    </>
  );
}
