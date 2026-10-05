import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { categories, products, type Product, type RemoteCatalog, type RemoteProduct } from "@/lib/catalog";
import { uploadAsset } from "@/lib/admin";
import { slugify } from "@/lib/import-parser";
import { useLocale } from "@/lib/i18n";
import { AssetPicker, Field, lines } from "./fields";

type Form = {
  id: string; isNew: boolean; sku: string; name: string; nameFr: string; brand: string; categoryId: string; subcategory: string;
  description: string; descriptionFr: string; specs: string; specsFr: string; color: string; dimensions: string; weight: string; power: string;
  stock: string; images: string[]; sheet: string | null; badges: string; badgeImages: string[]; fallbackImage: string;
};

const toForm = (p: Product, row?: RemoteProduct): Form => ({
  id: p.id, isNew: false, sku: p.sku, name: p.name, nameFr: p.nameFr, brand: p.brand ?? "", categoryId: p.category, subcategory: p.subcategory,
  description: p.description, descriptionFr: p.descriptionFr, specs: p.specs.join("\n"), specsFr: p.specsFr.join("\n"),
  color: p.color ?? "", dimensions: p.dimensions ?? "", weight: p.weight ?? "", power: p.power ?? "",
  stock: row?.stock != null ? String(row.stock) : "", images: row ? (row.images?.length ? row.images : row.image_url ? [row.image_url] : []) : [],
  sheet: row?.technical_sheet_path ?? null, badges: (p.badges ?? []).join("\n"), badgeImages: row?.badge_images ?? [], fallbackImage: p.image,
});
const blank = (): Form => ({ id: "", isNew: true, sku: "", name: "", nameFr: "", brand: "", categoryId: categories[0]?.id ?? "", subcategory: "", description: "", descriptionFr: "", specs: "", specsFr: "", color: "", dimensions: "", weight: "", power: "", stock: "", images: [], sheet: null, badges: "", badgeImages: [], fallbackImage: "" });

export function ProductManager({ remote, refresh }: { remote: RemoteCatalog; refresh: () => Promise<void> }) {
  const { language } = useLocale(); const fr = language === "fr";
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);
  const list = useMemo(() => { const q = query.toLowerCase(); return products.filter((p) => !q || `${p.name} ${p.nameFr} ${p.sku} ${p.brand ?? ""}`.toLowerCase().includes(q)); }, [query]);
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => f && { ...f, [key]: value });
  const category = categories.find((c) => c.id === form?.categoryId);

  const upload = async (files: File[], folder: string, apply: (paths: string[]) => void) => {
    setBusy(true);
    try { apply(await Promise.all(files.map((f) => uploadAsset(f, folder)))); } catch { toast.error(fr ? "Échec de l'envoi du fichier." : "Upload failed."); }
    setBusy(false);
  };

  const row = (f: Form, hidden: boolean) => ({
    id: f.id || `prd-${slugify(f.sku)}`, sku: f.sku.trim(), name: f.name.trim() || f.nameFr.trim(), name_fr: f.nameFr.trim() || f.name.trim(),
    category_id: f.categoryId, subcategory: f.subcategory.trim(), image_url: f.images[0] ?? null, images: f.images,
    specs: lines(f.specs), specs_fr: lines(f.specsFr), description: f.description.trim(), description_fr: f.descriptionFr.trim(),
    brand: f.brand.trim() || null, color: f.color.trim() || null, dimensions: f.dimensions.trim() || null, weight: f.weight.trim() || null, power: f.power.trim() || null,
    stock: f.stock.trim() === "" ? null : Math.max(0, Math.floor(Number(f.stock)) || 0), technical_sheet_path: f.sheet, badges: lines(f.badges), badge_images: f.badgeImages, hidden,
  });

  const save = async () => {
    if (!form) return;
    if (!form.sku.trim() || !(form.name.trim() || form.nameFr.trim()) || !form.categoryId) { toast.error(fr ? "Référence, nom et catégorie sont obligatoires." : "Reference, name and category are required."); return; }
    if (products.some((p) => p.sku === form.sku.trim() && p.id !== form.id)) { toast.error(fr ? "Cette référence existe déjà." : "This reference already exists."); return; }
    setBusy(true);
    const { error } = await supabase.from("catalog_products").upsert(row(form, false), { onConflict: "id" });
    setBusy(false);
    if (error) { toast.error(fr ? "Enregistrement impossible." : "Could not save."); return; }
    toast.success(fr ? "Produit enregistré." : "Product saved."); setForm(null); await refresh();
  };
  const remove = async () => {
    if (!form || form.isNew || !confirm(fr ? "Supprimer ce produit du catalogue ?" : "Delete this product from the catalog?")) return;
    setBusy(true);
    const { error } = await supabase.from("catalog_products").upsert(row(form, true), { onConflict: "id" });
    setBusy(false);
    if (error) { toast.error(fr ? "Suppression impossible." : "Could not delete."); return; }
    toast.success(fr ? "Produit supprimé." : "Product deleted."); setForm(null); await refresh();
  };

  return <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
    <div className="min-w-0">
      <div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={fr ? "Rechercher…" : "Search…"} className="pl-8" /></div><Button onClick={() => setForm(blank())} aria-label={fr ? "Nouveau produit" : "New product"}><Plus /></Button></div>
      <ul className="mt-3 max-h-[70vh] divide-y divide-border overflow-y-auto border border-border">
        {list.map((p) => <li key={p.id}><button type="button" onClick={() => setForm(toForm(p, remote.products.find((r) => r.id === p.id)))} className={`flex w-full items-center gap-3 p-2 text-left hover:bg-muted ${form?.id === p.id ? "bg-muted" : ""}`}><img src={p.image} alt="" className="size-10 shrink-0 bg-muted object-cover" /><span className="min-w-0"><span className="block truncate text-sm font-semibold">{fr ? p.nameFr : p.name}</span><span className="font-mono text-[11px] text-muted-foreground">{p.sku}</span></span></button></li>)}
        {list.length === 0 && <li className="p-4 text-sm text-muted-foreground">{fr ? "Aucun produit." : "No products."}</li>}
      </ul>
    </div>
    {!form ? <div className="grid min-h-40 place-items-center border border-dashed border-border p-6 text-sm text-muted-foreground">{fr ? "Sélectionnez un produit ou créez-en un." : "Select a product or create one."}</div> :
    <form className="min-w-0 space-y-5 border border-border p-4 sm:p-6" onSubmit={(e) => { e.preventDefault(); void save(); }}>
      <h2 className="font-display text-2xl font-bold">{form.isNew ? (fr ? "Nouveau produit" : "New product") : (fr ? "Modifier le produit" : "Edit product")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={fr ? "Nom (FR)" : "Name (FR)"}><Input value={form.nameFr} onChange={(e) => set("nameFr", e.target.value)} /></Field>
        <Field label={fr ? "Nom (EN)" : "Name (EN)"}><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label={fr ? "Marque" : "Brand"}><Input value={form.brand} onChange={(e) => set("brand", e.target.value)} /></Field>
        <Field label={fr ? "Référence / SKU" : "Reference / SKU"}><Input value={form.sku} onChange={(e) => set("sku", e.target.value)} className="font-mono" /></Field>
        <Field label={fr ? "Catégorie" : "Category"}><select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="h-9 w-full border border-input bg-background px-2 text-sm">{categories.map((c) => <option key={c.id} value={c.id}>{fr ? c.nameFr : c.name}</option>)}</select></Field>
        <Field label={fr ? "Sous-catégorie" : "Subcategory"}><Input list="subcats" value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} /><datalist id="subcats">{category?.subcategories.map((s) => <option key={s} value={s} />)}</datalist></Field>
        <Field label={fr ? "Stock / quantité" : "Stock / quantity"}><Input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder={fr ? "Non affiché si vide" : "Hidden if empty"} /></Field>
        <Field label={fr ? "Couleur" : "Color"}><Input value={form.color} onChange={(e) => set("color", e.target.value)} /></Field>
        <Field label="Dimensions"><Input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} /></Field>
        <Field label={fr ? "Poids" : "Weight"}><Input value={form.weight} onChange={(e) => set("weight", e.target.value)} /></Field>
        <Field label={fr ? "Puissance" : "Power"}><Input value={form.power} onChange={(e) => set("power", e.target.value)} /></Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Description (FR)"><Textarea rows={4} value={form.descriptionFr} onChange={(e) => set("descriptionFr", e.target.value)} /></Field>
        <Field label="Description (EN)"><Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
        <Field label={fr ? "Spécifications techniques (FR) — une par ligne" : "Technical specs (FR) — one per line"}><Textarea rows={4} value={form.specsFr} onChange={(e) => set("specsFr", e.target.value)} /></Field>
        <Field label={fr ? "Spécifications techniques (EN) — une par ligne" : "Technical specs (EN) — one per line"}><Textarea rows={4} value={form.specs} onChange={(e) => set("specs", e.target.value)} /></Field>
      </div>
      <Field label={fr ? "Images (la première est l'image principale)" : "Images (first one is the main image)"}>
        {form.images.length === 0 && form.fallbackImage && <p className="mb-2 flex items-center gap-2 text-xs font-normal text-muted-foreground"><img src={form.fallbackImage} alt="" className="size-10 object-cover" />{fr ? "Image actuelle (par défaut)" : "Current default image"}</p>}
        <AssetPicker paths={form.images} multiple accept="image/png,image/jpeg,image/webp,image/gif" label={fr ? "Ajouter" : "Add"} busy={busy} onAdd={(files) => upload(files, "products", (p) => set("images", [...form.images, ...p]))} onRemove={(i) => set("images", form.images.filter((_, j) => j !== i))} />
      </Field>
      <Field label={fr ? "Fiche technique (PDF)" : "Technical sheet (PDF)"}>
        <AssetPicker pdf paths={form.sheet ? [form.sheet] : []} accept="application/pdf" label="PDF" busy={busy} onAdd={(files) => upload(files.slice(0, 1), "sheets", (p) => set("sheet", p[0] ?? null))} onRemove={() => set("sheet", null)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={fr ? "Conformité & Atouts — texte, un par ligne" : "Compliance & benefits — text, one per line"}><Textarea rows={3} value={form.badges} onChange={(e) => set("badges", e.target.value)} placeholder="CE, ISO 9001…" /></Field>
        <Field label={fr ? "Conformité & Atouts — logos" : "Compliance & benefits — logos"}>
          <AssetPicker paths={form.badgeImages} multiple accept="image/png,image/jpeg,image/webp,image/svg+xml" label={fr ? "Ajouter" : "Add"} busy={busy} onAdd={(files) => upload(files, "badges", (p) => set("badgeImages", [...form.badgeImages, ...p]))} onRemove={(i) => set("badgeImages", form.badgeImages.filter((_, j) => j !== i))} />
        </Field>
      </div>
      <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-4">
        <div className="flex gap-2"><Button type="submit" disabled={busy}><Save />{fr ? "Enregistrer" : "Save"}</Button><Button type="button" variant="outline" onClick={() => setForm(null)}>{fr ? "Annuler" : "Cancel"}</Button></div>
        {!form.isNew && <Button type="button" variant="destructive" disabled={busy} onClick={remove}><Trash2 />{fr ? "Supprimer" : "Delete"}</Button>}
      </div>
    </form>}
  </div>;
}
