import { createFileRoute } from "@tanstack/react-router";
import { Building2, CheckCircle2, Mail, Phone, Send } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { findProductBySku } from "@/lib/catalog";

const searchSchema = z.object({ product: z.string().optional() });

export const Route = createFileRoute("/contact")({
  validateSearch: searchSchema,
  head: () => ({ meta: [
    { title: "Contact & Request a Quote | Atlas Industrial Supply" },
    { name: "description", content: "Request a quotation for industrial tools, fasteners, fittings and valves from Atlas Industrial Supply." },
    { property: "og:title", content: "Request an Industrial Supply Quote | Atlas" },
    { property: "og:description", content: "Send your product reference, quantity and requirements to our industrial supply team." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: ContactPage,
});

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return <div><Label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-[0.08em]">{label}</Label>{children}</div>;
}

function ContactPage() {
  const { product: sku } = Route.useSearch();
  const selected = findProductBySku(sku);
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };

  return <div className="bg-muted">
    <section className="border-b border-border bg-primary text-primary-foreground"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18"><p className="section-kicker">Contact & quotation</p><h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Tell us what you need.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/70">Share your product reference, specification and quantity. Our team will review your requirement and respond with a tailored quotation.</p></div></section>
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8 lg:py-16">
      <aside className="space-y-8"><div><h2 className="font-display text-2xl font-bold">Talk to our team</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">For product matching, availability and commercial inquiries, use the form or contact us directly.</p></div><div className="space-y-4 border-t border-border pt-6"><div className="flex gap-3"><Phone className="mt-0.5 size-5 text-accent" /><div><strong className="block text-sm">Phone</strong><span className="text-sm text-muted-foreground">+00 000 000 000</span></div></div><div className="flex gap-3"><Mail className="mt-0.5 size-5 text-accent" /><div><strong className="block text-sm">Email</strong><span className="text-sm text-muted-foreground">sales@example.com</span></div></div><div className="flex gap-3"><Building2 className="mt-0.5 size-5 text-accent" /><div><strong className="block text-sm">Business hours</strong><span className="text-sm text-muted-foreground">Monday–Friday, 08:00–17:00</span></div></div></div><p className="border-l-2 border-accent pl-4 text-xs leading-5 text-muted-foreground">Contact details shown are placeholders and can be replaced with your business information.</p></aside>
      <section className="border border-border bg-background p-5 sm:p-8">
        {submitted ? <div className="grid min-h-[460px] place-items-center text-center"><div><CheckCircle2 className="mx-auto size-12 text-accent" /><h2 className="mt-5 font-display text-3xl font-bold">Request prepared</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">Thank you. This catalog demonstration has validated your request. Connect an email service later to deliver submissions to your sales team.</p><Button className="mt-6" onClick={() => setSubmitted(false)}>Send another request</Button></div></div> : <form onSubmit={submit}><div className="mb-7 border-b border-border pb-5"><p className="section-kicker">Quotation form</p><h2 className="mt-2 font-display text-2xl font-bold">Request product pricing</h2>{selected && <div className="mt-4 bg-muted p-4"><span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">Selected product · {selected.sku}</span><strong className="mt-1 block text-sm">{selected.name}</strong></div>}</div><div className="grid gap-5 sm:grid-cols-2"><Field label="Name *" id="name"><Input id="name" name="name" required autoComplete="name" /></Field><Field label="Company *" id="company"><Input id="company" name="company" required autoComplete="organization" /></Field><Field label="Phone *" id="phone"><Input id="phone" name="phone" type="tel" required autoComplete="tel" /></Field><Field label="Email *" id="email"><Input id="email" name="email" type="email" required autoComplete="email" /></Field><Field label="Product / Reference" id="product"><Input id="product" name="product" defaultValue={selected ? `${selected.name} — ${selected.sku}` : ""} placeholder="Product name or SKU" /></Field><Field label="Quantity *" id="quantity"><Input id="quantity" name="quantity" type="number" min="1" required defaultValue="1" /></Field><div className="sm:col-span-2"><Field label="Message" id="message"><Textarea id="message" name="message" rows={5} placeholder="Application, technical requirements, delivery location or additional products..." /></Field></div></div><Button type="submit" size="lg" className="mt-6 w-full sm:w-auto"><Send /> Submit Quote Request</Button><p className="mt-4 text-xs text-muted-foreground">We use your details only to respond to this inquiry.</p></form>}
      </section>
    </div>
  </div>;
}