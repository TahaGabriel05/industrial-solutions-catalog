import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { categories, products, type Category, type RemoteCatalog } from "@/lib/catalog";
import { uploadAsset } from "@/lib/admin";
import { slugify } from "@/lib/import-parser";
import { useLocale } from "@/lib/i18n";
import { AssetPicker, Field, lines } from "./fields";

type Item = { id: string; name: string; nameFr: string; description: string; descriptionFr: string; subcategories: string; image: string | null; preview: string; hidden?: boolean };

export function CategoryManager({ remote, refresh }: { remote: RemoteCatalog; refresh: () => Promise<void> }) {
  const { language } = useLocale(); const fr = language === "fr";
  const toItem = (c: Category): Item => ({ id: c.id, name: c.name, nameFr: c.nameFr, description: c.description, descriptionFr: c.descriptionFr, subcategories: c.subcategories.join("\n"), image: remote.categories.find((r) => r.id === c.id)?.image_url ?? null, preview: c.image });
  const [items, setItems] = useState<Item[]>(() => categories.map(toItem));
  const [editing, setEditing] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const persist = async (next: Item[], message: string) => {
    setBusy(true);
    const rows = next.map((it, i) => ({ id: it.id, name: it.name.trim() || it.nameFr.trim(), name_fr: it.nameFr.trim() || it.name.trim(), description: it.description.trim(), description_fr: it.descriptionFr.trim(), subcategories: lines(it.subcategories), image_url: it.image, sort_order: i, hidden: !!it.hidden }));
    const { error } = await supabase.from("catalog_categories").upsert(rows);
    setBusy(false);
    if (error) { toast.error(fr ? "Enregistrement impossible." : "Could not save."); return false; }
    toast.success(message); setEditing(null); await refresh(); return true;
  };
  const update = (i: number, patch: Partial<Item>) => setItems((list) => list.map((it, j) => j === i ? { ...it, ...patch } : it));
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= items.length) return; const next = [...items]; [next[i], next[j]] = [next[j]!, next[i]!]; setItems(next); void persist(next, fr ? "Ordre enregistré." : "Order saved."); };
  const add = () => { setItems((l) => [...l, { id: "", name: "", nameFr: "", description: "", descriptionFr: "", subcategories: "", image: null, preview: "" }]); setEditing(items.length); };
  const save = (i: number) => {
    const it = items[i]!; if (!(it.name.trim() || it.nameFr.trim())) { toast.error(fr ? "Le nom est obligatoire." : "Name is required."); return; }
    let next = items;
    if (!it.id) { let id = slugify(it.nameFr || it.name); while (items.some((x, j) => j !== i && x.id === id)) id += "-2"; next = items.map((x, j) => j === i ? { ...x, id } : x); }
    void persist(next, fr ? "Catégorie enregistrée." : "Category saved.");
  };
  const remove = (i: number) => {
    const it = items[i]!; const count = products.filter((p) => p.category === it.id).length;
    if (!confirm(fr ? `Supprimer « ${it.nameFr || it.name} »${count ? ` et ses ${count} produits` : ""} ?` : `Delete "${it.name || it.nameFr}"${count ? ` and its ${count} products` : ""}?`)) return;
    if (!it.id) { setItems((l) => l.filter((_, j) => j !== i)); setEditing(null); return; }
    const hidden = items.map((x, j) => j === i ? { ...x, hidden: true } : x);
    void persist(hidden, fr ? "Catégorie supprimée." : "Category deleted");
  };

  return <div className="space-y-3">
    <div className="flex justify-end"><Button onClick={add} disabled={editing !== null}><Plus />{fr ? "Nouvelle catégorie" : "New category"}</Button></div>
    {items.map((it, i) => <div key={it.id || `new-${i}`} className="border border-border">
      <div className="flex items-center gap-3 p-3">
        {it.preview ? <img src={it.preview} alt="" className="size-12 shrink-0 object-cover" /> : <div className="size-12 shrink-0 bg-muted" />}
        <div className="min-w-0 flex-1"><p className="truncate font-semibold">{(fr ? it.nameFr : it.name) || it.name || it.nameFr || (fr ? "Nouvelle catégorie" : "New category")}</p><p className="text-xs text-muted-foreground">{products.filter((p) => p.category === it.id).length} {fr ? "produits" : "products"} · {lines(it.subcategories).length} {fr ? "sous-catégories" : "subcategories"}</p></div>
        <Button size="icon" variant="ghost" disabled={busy || i === 0 || !it.id} onClick={() => move(i, -1)} aria-label="Up"><ArrowUp /></Button>
        <Button size="icon" variant="ghost" disabled={busy || i === items.length - 1 || !it.id} onClick={() => move(i, 1)} aria-label="Down"><ArrowDown /></Button>
        <Button size="icon" variant="ghost" onClick={() => setEditing(editing === i ? null : i)} aria-label="Edit"><Pencil /></Button>
      </div>
      {editing === i && <div className="space-y-4 border-t border-border p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={fr ? "Nom (FR)" : "Name (FR)"}><Input value={it.nameFr} onChange={(e) => update(i, { nameFr: e.target.value })} /></Field>
          <Field label={fr ? "Nom (EN)" : "Name (EN)"}><Input value={it.name} onChange={(e) => update(i, { name: e.target.value })} /></Field>
          <Field label="Description (FR)"><Textarea rows={2} value={it.descriptionFr} onChange={(e) => update(i, { descriptionFr: e.target.value })} /></Field>
          <Field label="Description (EN)"><Textarea rows={2} value={it.description} onChange={(e) => update(i, { description: e.target.value })} /></Field>
          <Field label={fr ? "Sous-catégories — une par ligne" : "Subcategories — one per line"}><Textarea rows={4} value={it.subcategories} onChange={(e) => update(i, { subcategories: e.target.value })} /></Field>
          <Field label={fr ? "Image de couverture" : "Cover image"}><AssetPicker paths={it.image ? [it.image] : []} accept="image/png,image/jpeg,image/webp" label={fr ? "Choisir" : "Choose"} busy={busy} onAdd={async (files) => { setBusy(true); try { const path = await uploadAsset(files[0]!, "categories"); update(i, { image: path, preview: `/api/public/product-image/${path}` }); } catch { toast.error(fr ? "Échec de l'envoi." : "Upload failed."); } setBusy(false); }} onRemove={() => update(i, { image: null })} /></Field>
        </div>
        <div className="flex flex-wrap justify-between gap-2"><Button disabled={busy} onClick={() => save(i)}><Save />{fr ? "Enregistrer" : "Save"}</Button><Button variant="destructive" disabled={busy} onClick={() => remove(i)}><Trash2 />{fr ? "Supprimer" : "Delete"}</Button></div>
      </div>}
    </div>)}
  </div>;
}
