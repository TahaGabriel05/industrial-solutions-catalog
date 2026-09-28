import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Boxes, CircleCheck, Cog, Headphones, PackageCheck, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categories } from "@/lib/catalog";
import toolsCover from "@/assets/tools-cover.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Atlas Industrial Supply | Tools, Fasteners, Fittings & Valves" },
    { name: "description", content: "Professional tools, hardware, fasteners, industrial fittings and valves for maintenance, construction and industry." },
    { property: "og:title", content: "Atlas Industrial Supply" },
    { property: "og:description", content: "Industrial products specified for professional performance." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative min-h-[620px] overflow-hidden bg-primary text-primary-foreground lg:min-h-[680px]">
        <img src={toolsCover} alt="Professional industrial hand tools" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-24 sm:px-6 lg:min-h-[680px] lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker text-accent">Industrial supply · Technical support</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[0.98] text-primary-foreground sm:text-6xl lg:text-7xl">The right equipment.<br />Ready for real work.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/75 sm:text-lg">Professional tools, fasteners, fittings and flow-control products selected for reliability in demanding environments.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/products">Browse Products <ArrowRight /></Link></Button><Button asChild variant="outline" size="lg" className="border-primary-foreground/40 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/contact">Request a Quote</Link></Button></div>
            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-4 border-t border-primary-foreground/20 pt-6 text-xs text-primary-foreground/65 sm:grid-cols-3"><span className="flex items-center gap-2"><CircleCheck className="size-4 text-accent" /> Verified specifications</span><span className="flex items-center gap-2"><CircleCheck className="size-4 text-accent" /> Trade-grade supply</span><span className="flex items-center gap-2"><CircleCheck className="size-4 text-accent" /> Responsive quotations</span></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-6"><div><p className="section-kicker">Core range</p><h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Product Categories</h2></div><Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/products">View full catalog <ArrowRight /></Link></Button></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} to="/products" search={{ category: category.id }} className="group relative aspect-[4/5] overflow-hidden bg-primary">
              <img src={category.image} alt={category.name} width={1536} height={1024} loading="lazy" className="h-full w-full object-cover opacity-65 transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-category-overlay" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">{category.subcategories.length} product groups</span><h3 className="mt-2 font-display text-2xl font-bold">{category.name}</h3><p className="mt-2 text-xs leading-5 text-primary-foreground/70">{category.description}</p><span className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em]">Explore range <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted">
        <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-3">
          {[{ icon: ShieldCheck, title: "Specified with confidence", text: "Clear technical details help procurement and maintenance teams select correctly." }, { icon: PackageCheck, title: "Built around your requirement", text: "Tell us the application and quantity; we will quote the appropriate solution." }, { icon: Headphones, title: "Support from real specialists", text: "Practical product guidance from inquiry through delivery." }].map((item) => <div key={item.title} className="bg-muted px-6 py-10 lg:px-10"><item.icon className="size-7 text-accent" /><h3 className="mt-5 font-display text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p></div>)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8 lg:py-20"><div><p className="section-kicker">Need help sourcing?</p><h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Send us your technical requirement.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Reference a catalog item or describe the part, specification and quantity you need. Our team will prepare a tailored quotation.</p></div><Button asChild size="lg"><Link to="/contact"><Cog /> Start your request</Link></Button></section>
    </>
  );
}
