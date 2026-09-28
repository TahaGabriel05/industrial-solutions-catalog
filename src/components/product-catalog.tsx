import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, Filter, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories, products, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function CategoryFilters({ selected, subcategory, onCategory, onSubcategory }: { selected: string; subcategory: string; onCategory: (id: string) => void; onSubcategory: (name: string) => void }) {
  return (
    <div>
      <button type="button" onClick={() => onCategory("all")} className={cn("flex w-full items-center justify-between border-b border-border px-1 py-3 text-left text-sm font-semibold", selected === "all" ? "text-accent" : "text-foreground")}>
        All Products <span className="text-xs text-muted-foreground">{products.length}</span>
      </button>
      {categories.map((category) => {
        const count = products.filter((product) => product.category === category.id).length;
        const active = selected === category.id;
        return (
          <div key={category.id} className="border-b border-border">
            <button type="button" onClick={() => onCategory(category.id)} className={cn("flex w-full items-center justify-between px-1 py-3 text-left text-sm font-semibold", active ? "text-accent" : "text-foreground")}>
              <span>{category.name}</span><span className="flex items-center gap-1 text-xs text-muted-foreground">{count}<ChevronRight className={cn("size-3.5 transition-transform", active && "rotate-90")} /></span>
            </button>
            {active && (
              <div className="pb-3 pl-3">
                {category.subcategories.map((item) => (
                  <button key={item} type="button" onClick={() => onSubcategory(subcategory === item ? "" : item)} className={cn("flex w-full items-center gap-2 py-1.5 text-left text-xs", subcategory === item ? "font-semibold text-accent" : "text-muted-foreground")}>
                    <span className="grid size-3 place-items-center border border-border">{subcategory === item && <Check className="size-2.5" />}</span>{item}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden border border-border bg-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-industrial">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} width={1536} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">REF: {product.sku}</span>
        <h2 className="mt-2 font-display text-lg font-bold leading-snug text-card-foreground">{product.name}</h2>
        <ul className="mt-4 flex-1 space-y-2 border-t border-border pt-4">
          {product.specs.map((spec) => <li key={spec} className="flex gap-2 text-xs leading-5 text-muted-foreground"><span className="mt-2 size-1 shrink-0 bg-accent" />{spec}</li>)}
        </ul>
        <Button asChild className="mt-5 w-full"><Link to="/contact" search={{ product: product.sku }}>Request a Quote <ChevronRight /></Link></Button>
      </div>
    </article>
  );
}

export function ProductCatalog({ initialCategory = "all" }: { initialCategory?: string }) {
  const validInitial = categories.some((category) => category.id === initialCategory) ? initialCategory : "all";
  const [category, setCategory] = useState(validInitial);
  const [subcategory, setSubcategory] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesSubcategory = !subcategory || product.subcategory === subcategory;
      const matchesQuery = !needle || [product.name, product.sku, product.subcategory, ...product.specs].join(" ").toLowerCase().includes(needle);
      return matchesCategory && matchesSubcategory && matchesQuery;
    });
  }, [category, query, subcategory]);

  const chooseCategory = (id: string) => { setCategory(id); setSubcategory(""); };
  const filters = <CategoryFilters selected={category} subcategory={subcategory} onCategory={chooseCategory} onSubcategory={setSubcategory} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="section-kicker">Industrial catalog</p><h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Products built for the job</h1></div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">Search by product, reference or specification. Contact our team for availability, technical support and a tailored quotation.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="flex items-center gap-2 border-b-2 border-accent pb-3"><SlidersHorizontal className="size-4 text-accent" /><h2 className="font-display text-base font-bold">Product Categories</h2></div>
            {filters}
          </div>
        </aside>

        <section aria-label="Product results">
          <div className="mb-6 flex gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, references or specifications" className="h-11 pl-10" aria-label="Search products" /></div>
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="lg" className="lg:hidden"><Filter /> Filters</Button></SheetTrigger>
              <SheetContent side="left"><SheetHeader><SheetTitle>Product Categories</SheetTitle><SheetDescription>Filter the catalog by category and type.</SheetDescription></SheetHeader><div className="mt-6">{filters}</div></SheetContent>
            </Sheet>
          </div>

          <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground"><span><strong className="text-foreground">{filtered.length}</strong> products</span>{(category !== "all" || subcategory) && <Button variant="ghost" size="sm" onClick={() => { setCategory("all"); setSubcategory(""); }}>Clear filters</Button>}</div>
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          ) : (
            <div className="border border-dashed border-border py-20 text-center"><Search className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-4 font-display text-xl font-bold">No products found</h2><p className="mt-2 text-sm text-muted-foreground">Try another reference, keyword or category.</p></div>
          )}
        </section>
      </div>
    </div>
  );
}
