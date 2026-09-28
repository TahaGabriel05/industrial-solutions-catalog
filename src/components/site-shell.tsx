import { Link } from "@tanstack/react-router";
import { Menu, Phone, ShieldCheck, Wrench, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", to: "/" as const },
  { label: "Products", to: "/products" as const },
  { label: "About Us", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
          <span>Industrial supply specialists</span>
          <span className="hidden items-center gap-2 sm:flex"><ShieldCheck className="size-3.5" /> Technical support for every order</span>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Atlas Industrial Supply home">
          <span className="grid size-10 place-items-center bg-accent text-accent-foreground"><Wrench className="size-5" /></span>
          <span className="leading-none">
            <strong className="block font-display text-lg tracking-normal text-foreground">ATLAS</strong>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Industrial Supply</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
              {item.label}
            </Link>
          ))}
          <Button asChild><Link to="/contact"><Phone /> Request a Quote</Link></Button>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-4 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="px-3 py-3 text-sm font-semibold text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3"><span className="grid size-9 place-items-center bg-accent text-accent-foreground"><Wrench className="size-4" /></span><strong className="font-display text-lg">ATLAS INDUSTRIAL SUPPLY</strong></div>
          <p className="mt-4 max-w-md text-sm leading-6 text-primary-foreground/70">Dependable tools, fasteners, fittings and flow-control products for industrial teams.</p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Catalog</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm text-primary-foreground/70"><Link to="/products">All products</Link><Link to="/products" search={{ category: "tools" }}>Tools</Link><Link to="/products" search={{ category: "valves" }}>Valves & faucets</Link></div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Company</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm text-primary-foreground/70"><Link to="/about">About us</Link><Link to="/contact">Contact & quote</Link></div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-4 py-5 text-center text-xs text-primary-foreground/55">© 2026 Atlas Industrial Supply. Built for professional procurement.</div>
    </footer>
  );
}
