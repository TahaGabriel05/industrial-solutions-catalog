import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { Download, FileSpreadsheet, FolderOpen, FileArchive, LogOut, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { categories, isImported, mergeRemoteCatalog } from "@/lib/catalog";
import { buildDrafts, CSV_TEMPLATE, slugify, type DraftRow, type InputFile } from "@/lib/import-parser";
import { getImportedCatalog } from "@/lib/catalog.functions";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/admin/import")({
  head: () => ({ meta: [
    { title: "Import de produits | Atlas Industrial Supply" },
    { name: "description", content: "Importer des produits par dossier, ZIP ou CSV." },
    { property: "og:title", content: "Import de produits | Atlas" },
    { property: "og:description", content: "Outil d'import du catalogue." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: ImportPage,
});

async function readDropped(items: DataTransferItemList): Promise<InputFile[]> {
  const out: InputFile[] = [];
  const walk = async (entry: FileSystemEntry, prefix: string): Promise<void> => {
    if (entry.isFile) { const file = await new Promise<File>((res, rej) => (entry as FileSystemFileEntry).file(res, rej)); out.push({ path: prefix + entry.name, file }); return; }
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    let batch: FileSystemEntry[];
    do { batch = await new Promise((res, rej) => reader.readEntries(res, rej)); for (const child of batch) await walk(child, `${prefix}${entry.name}/`); } while (batch.length);
  };
  const entries = Array.from(items).map((i) => i.webkitGetAsEntry()).filter((e): e is FileSystemEntry => !!e);
  for (const entry of entries) await walk(entry, "");
  return out;
}

function ImportPage() {
  const { language } = useLocale(); const fr = language === "fr";
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [busy, setBusy] = useState(false); const [progress, setProgress] = useState(0); const [drag, setDrag] = useState(false);
  const folderRef = useRef<HTMLInputElement>(null); const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { (async () => {
    const { data } = await supabase.auth.getUser(); setEmail(data.user?.email ?? "");
    const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user!.id, _role: "admin" }); setIsAdmin(!!ok);
  })(); }, []);
  useEffect(() => { folderRef.current?.setAttribute("webkitdirectory", ""); }, [isAdmin]);

  const load = async (files: InputFile[]) => {
    if (!files.length) return; setBusy(true);
    try { setRows(await buildDrafts(files)); } catch { toast.error(fr ? "Fichier illisible." : "Could not read the file."); }
    setBusy(false);
  };
  const fromInput = (list: FileList | null) => load(Array.from(list ?? []).map((file) => ({ path: file.webkitRelativePath || file.name, file })));
  const onDrop = async (event: DragEvent) => { event.preventDefault(); setDrag(false); await load(await readDropped(event.dataTransfer.items)); };

  const valid = rows.filter((r) => !r.error);
  const runImport = async () => {
    setBusy(true); setProgress(0);
    try {
      const total = valid.length + 1; let done = 0;
      const imagePaths = new Map<string, string>();
      for (const row of valid) {
        if (row.file) {
          const path = `${slugify(row.categoryId)}/${slugify(row.sku)}.${(row.ext ?? "jpg").toLowerCase()}`;
          const { error } = await supabase.storage.from("product-images").upload(path, row.file, { upsert: true, ...(row.file.type ? { contentType: row.file.type } : {}) });
          if (error) throw error;
          imagePaths.set(row.key, path);
        }
        setProgress(Math.round((++done / total) * 100));
      }
      // Categories (create missing, add new subcategories)
      const { data: existingCats } = await supabase.from("catalog_categories").select("id, subcategories, image_url");
      const catRows = new Map<string, { id: string; name: string; name_fr: string; subcategories: string[]; image_url: string | null }>();
      for (const row of valid) {
        const known = categories.find((c) => c.id === row.categoryId); const stored = existingCats?.find((c) => c.id === row.categoryId);
        const entry = catRows.get(row.categoryId) ?? { id: row.categoryId, name: known?.name ?? row.categoryLabel, name_fr: known?.nameFr ?? row.categoryLabel, subcategories: [...(stored?.subcategories ?? [])], image_url: stored?.image_url ?? null };
        if (row.subcategory && !entry.subcategories.includes(row.subcategory)) entry.subcategories.push(row.subcategory);
        if (!entry.image_url) entry.image_url = imagePaths.get(row.key) ?? null;
        catRows.set(row.categoryId, entry);
      }
      const { error: catError } = await supabase.from("catalog_categories").upsert([...catRows.values()]); if (catError) throw catError;
      const productRows = valid.map((row) => {
        const ex = row.existing && isImported(row.existing) ? row.existing : undefined;
        return {
          id: ex?.id ?? `imp-${slugify(row.sku)}`, sku: row.sku, name: row.name || ex?.name || row.nameFr, name_fr: row.nameFr || ex?.nameFr || row.name,
          hidden: false, category_id: row.categoryId, subcategory: row.subcategory || ex?.subcategory || "", image_url: imagePaths.get(row.key) ?? ex?.imagePath ?? null,
          specs: row.specs?.length ? row.specs : ex?.specs ?? [], specs_fr: row.specsFr?.length ? row.specsFr : ex?.specsFr ?? [],
          description: row.description ?? ex?.description ?? "", description_fr: row.descriptionFr ?? ex?.descriptionFr ?? "",
          brand: row.brand ?? ex?.brand ?? null, color: row.color ?? ex?.color ?? null, dimensions: row.dimensions ?? ex?.dimensions ?? null, weight: row.weight ?? ex?.weight ?? null, power: row.power ?? ex?.power ?? null,
        };
      });
      for (let i = 0; i < productRows.length; i += 200) { const { error } = await supabase.from("catalog_products").upsert(productRows.slice(i, i + 200), { onConflict: "sku" }); if (error) throw error; }
      setProgress(100);
      mergeRemoteCatalog(await getImportedCatalog()); await router.invalidate();
      toast.success(fr ? `${productRows.length} produits importés.` : `${productRows.length} products imported.`);
      setRows([]);
    } catch (error) { console.error(error); toast.error(fr ? "L'import a échoué. Réessayez." : "Import failed. Please try again."); }
    setBusy(false);
  };
  const downloadTemplate = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([CSV_TEMPLATE], { type: "text/csv" })); a.download = "modele-produits.csv"; a.click(); };
  const signOut = async () => { await supabase.auth.signOut(); router.navigate({ to: "/auth" }); };

  if (isAdmin === null) return <div className="mx-auto max-w-5xl px-4 py-16 text-sm text-muted-foreground">{fr ? "Chargement…" : "Loading…"}</div>;
  if (!isAdmin) return <div className="mx-auto max-w-xl px-4 py-16"><h1 className="font-display text-2xl font-bold">{fr ? "Accès réservé" : "Restricted access"}</h1><p className="mt-3 text-sm text-muted-foreground">{fr ? `Le compte ${email} n'a pas encore les droits administrateur.` : `The account ${email} does not have admin rights yet.`}</p><Button variant="outline" className="mt-6" onClick={signOut}><LogOut />{fr ? "Se déconnecter" : "Sign out"}</Button></div>;

  const newCount = valid.filter((r) => r.status === "new").length;
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6"><div><p className="section-kicker">Admin</p><h1 className="mt-2 font-display text-3xl font-bold">{fr ? "Importer des produits" : "Import products"}</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{fr ? "Chaque dossier = une catégorie, chaque image = un produit (nom du fichier = nom du produit). Les sous-dossiers deviennent des sous-catégories. Le CSV ajoute les références et caractéristiques." : "Each folder = a category, each image = a product (filename = product name). Sub-folders become subcategories. CSV adds references and specifications."}</p></div>
      <div className="flex gap-2"><Button variant="outline" size="sm" onClick={downloadTemplate}><Download />{fr ? "Modèle CSV" : "CSV template"}</Button><Button variant="ghost" size="sm" onClick={signOut}><LogOut /></Button></div></div>

    <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop} className={`mt-8 border-2 border-dashed p-8 text-center transition-colors ${drag ? "border-accent bg-accent/5" : "border-border"}`}>
      <Upload className="mx-auto size-8 text-accent" /><p className="mt-3 font-semibold">{fr ? "Glissez un dossier, un ZIP ou un CSV ici" : "Drop a folder, ZIP or CSV here"}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3"><Button variant="outline" onClick={() => folderRef.current?.click()} disabled={busy}><FolderOpen />{fr ? "Choisir un dossier" : "Choose folder"}</Button><Button variant="outline" onClick={() => fileRef.current?.click()} disabled={busy}><FileArchive /><FileSpreadsheet />{fr ? "ZIP / CSV / images" : "ZIP / CSV / images"}</Button></div>
      <input ref={folderRef} type="file" multiple hidden onChange={(e) => { fromInput(e.target.files); e.target.value = ""; }} />
      <input ref={fileRef} type="file" multiple hidden accept=".zip,.csv,image/*" onChange={(e) => { fromInput(e.target.files); e.target.value = ""; }} />
    </div>

    {busy && <Progress value={progress} className="mt-6" />}
    {rows.length > 0 && <section className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm"><strong>{valid.length}</strong> {fr ? "produits prêts" : "products ready"} · {newCount} {fr ? "nouveaux" : "new"} · {valid.length - newCount} {fr ? "mises à jour" : "updates"}{rows.length > valid.length && <span className="text-destructive"> · {rows.length - valid.length} {fr ? "erreurs" : "errors"}</span>}</p>
        <div className="flex gap-2"><Button variant="ghost" onClick={() => setRows([])} disabled={busy}>{fr ? "Annuler" : "Cancel"}</Button><Button onClick={runImport} disabled={busy || !valid.length}><Upload />{fr ? `Importer ${valid.length} produits` : `Import ${valid.length} products`}</Button></div></div>
      <div className="overflow-x-auto border border-border"><table className="w-full text-left text-sm"><thead className="bg-muted text-xs uppercase text-muted-foreground"><tr><th className="p-3">Image</th><th className="p-3">{fr ? "Produit" : "Product"}</th><th className="p-3">{fr ? "Référence" : "Reference"}</th><th className="p-3">{fr ? "Catégorie" : "Category"}</th><th className="p-3">Statut</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.key} className="border-t border-border"><td className="p-2">{row.previewUrl ? <img src={row.previewUrl} alt="" className="size-12 object-cover" /> : <div className="size-12 bg-muted" />}</td><td className="p-3 font-semibold">{row.nameFr || row.name || "—"}</td><td className="p-3 font-mono text-xs">{row.sku}</td><td className="p-3">{row.categoryLabel}{row.newCategory && <span className="ml-2 bg-accent px-1.5 py-0.5 text-[10px] text-accent-foreground">{fr ? "nouvelle" : "new"}</span>}{row.subcategory && <span className="block text-xs text-muted-foreground">{row.subcategory}</span>}</td><td className="p-3 text-xs">{row.error ? <span className="text-destructive">{row.error}</span> : row.status === "new" ? (fr ? "Nouveau" : "New") : (fr ? "Mise à jour" : "Update")}</td></tr>)}</tbody></table></div>
    </section>}
    <p className="mt-8 text-xs text-muted-foreground"><Link to="/products" className="text-accent">{fr ? "Voir le catalogue" : "View catalog"}</Link></p>
  </div>;
}
