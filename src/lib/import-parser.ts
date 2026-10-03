import Papa from "papaparse";
import JSZip from "jszip";
import { categories, products, isImported, type Product } from "./catalog";

export type InputFile = { path: string; file: Blob };
export type DraftRow = {
  key: string; sku: string; name: string; nameFr: string; categoryId: string; categoryLabel: string; newCategory: boolean;
  subcategory: string; file?: Blob | undefined; ext?: string | undefined; previewUrl?: string | undefined; existing?: Product | undefined; status: "new" | "update"; error?: string | undefined;
  brand?: string | undefined; color?: string | undefined; dimensions?: string | undefined; weight?: string | undefined; power?: string | undefined; description?: string | undefined; descriptionFr?: string | undefined; specs?: string[] | undefined; specsFr?: string[] | undefined;
};

const IMAGE = /\.(jpe?g|png|webp|gif)$/i;
export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
export const slugify = (value: string) => normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "item";
const baseName = (path: string) => path.split("/").pop() ?? path;
const stripExt = (name: string) => name.replace(/\.[^.]+$/, "");
const cleanName = (name: string) => stripExt(name).replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
const ignored = (path: string) => path.split("/").some((part) => part.startsWith(".") || part === "__MACOSX");

export async function expandZip(file: Blob): Promise<InputFile[]> {
  const zip = await JSZip.loadAsync(file);
  const out: InputFile[] = [];
  for (const entry of Object.values(zip.files) as JSZip.JSZipObject[]) if (!entry.dir) out.push({ path: entry.name, file: await entry.async("blob") });
  return out;
}

function resolveCategory(label: string, created: Map<string, string>) {
  const needle = normalize(label);
  const found = categories.find((c) => [c.id, c.name, c.nameFr].some((v) => normalize(v) === needle));
  if (found) return { id: found.id, label: found.nameFr, isNew: false };
  const id = slugify(label); created.set(id, label);
  return { id, label, isNew: !categories.some((c) => c.id === id) };
}

const splitSpecs = (value?: string) => (value ?? "").split("|").map((s) => s.trim()).filter(Boolean);

export async function buildDrafts(input: InputFile[]): Promise<DraftRow[]> {
  // Expand ZIPs, drop system files
  let files: InputFile[] = [];
  for (const item of input) {
    if (ignored(item.path)) continue;
    if (/\.zip$/i.test(item.path)) files.push(...(await expandZip(item.file)).filter((f) => !ignored(f.path)));
    else files.push(item);
  }
  const images = files.filter((f) => IMAGE.test(f.path));
  const csvs = files.filter((f) => /\.csv$/i.test(f.path));

  // Strip a shared root folder (the folder the user selected / the ZIP's top folder)
  let parts = images.map((f) => f.path.split("/").filter(Boolean));
  const first = parts[0]?.[0];
  if (parts.length && parts.every((p) => p.length >= 3 && p[0] === first)) parts = parts.map((p) => p.slice(1));
  const imageByName = new Map<string, { file: Blob; parts: string[] }>();
  images.forEach((img, i) => imageByName.set(normalize(baseName(img.path)), { file: img.file, parts: parts[i]! }));

  const created = new Map<string, string>();
  const rows: DraftRow[] = [];
  const used = new Set<string>();

  for (const csv of csvs) {
    const text = await csv.file.text();
    const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true, transformHeader: (h: string) => normalize(h).replace(/\s+/g, "_") });
    parsed.data.forEach((r: Record<string, string>, i: number) => {
      const name = (r["name"] || r["name_fr"] || r["nom"] || "").trim();
      const nameFr = (r["name_fr"] || r["nom"] || r["name"] || "").trim();
      const catLabel = (r["category"] || r["categorie"] || "Divers").trim();
      const cat = resolveCategory(catLabel, created);
      const imgKey = r["image"] ? normalize(baseName(r["image"])) : "";
      const img = imgKey ? imageByName.get(imgKey) : undefined;
      if (img) used.add(imgKey);
      rows.push({
        key: `csv-${i}-${csv.path}`, sku: (r["reference"] || r["sku"] || "").trim(), name, nameFr, categoryId: cat.id, categoryLabel: cat.label, newCategory: cat.isNew,
        subcategory: (r["subcategory"] || r["sous_categorie"] || "").trim(), file: img?.file, ext: imgKey ? imgKey.split(".").pop() : undefined,
        brand: r["brand"] || r["marque"] || undefined, color: r["color"] || r["couleur"] || undefined, dimensions: r["dimensions"] || undefined,
        weight: r["weight"] || r["poids"] || undefined, power: r["power"] || r["puissance"] || undefined,
        description: r["description"] || undefined, descriptionFr: r["description_fr"] || undefined,
        specs: splitSpecs(r["specs"]), specsFr: splitSpecs(r["specs_fr"]),
        status: "new", error: name ? (imgKey && !img && !r["image"]?.startsWith("http") ? undefined : undefined) : "Nom manquant / Missing name",
      });
    });
  }

  for (const [key, img] of imageByName) {
    if (used.has(key)) continue;
    const p = img.parts;
    const catLabel = p.length >= 2 ? p[0]! : "Divers";
    const cat = resolveCategory(catLabel, created);
    const name = cleanName(p[p.length - 1]!);
    rows.push({ key: `img-${key}-${p.join("/")}`, sku: "", name, nameFr: name, categoryId: cat.id, categoryLabel: cat.label, newCategory: cat.isNew, subcategory: p.length >= 3 ? p[1]! : "", file: img.file, ext: key.split(".").pop(), status: "new" });
  }

  // Match existing imported products (by reference, else same name in same category) and assign references
  const taken = new Set(products.map((p) => p.sku.toLowerCase()));
  for (const row of rows) {
    const existing = products.find((p) => isImported(p) && ((row.sku && p.sku.toLowerCase() === row.sku.toLowerCase()) || (!row.sku && p.category === row.categoryId && normalize(p.nameFr) === normalize(row.nameFr))));
    if (existing) { row.existing = existing; row.status = "update"; row.sku = existing.sku; continue; }
    if (row.sku && taken.has(row.sku.toLowerCase())) { row.error = "Référence déjà utilisée / Reference already used"; continue; }
    if (!row.sku) {
      const prefix = (slugify(row.categoryLabel).replace(/-/g, "").slice(0, 3) || "PRD").toUpperCase();
      let n = products.length + 1;
      while (taken.has(`${prefix}-${String(n).padStart(4, "0")}`.toLowerCase())) n++;
      row.sku = `${prefix}-${String(n).padStart(4, "0")}`;
    }
    taken.add(row.sku.toLowerCase());
  }
  rows.forEach((row) => { if (row.file) row.previewUrl = URL.createObjectURL(row.file); });
  return rows;
}

export const CSV_TEMPLATE = "reference,name,name_fr,category,subcategory,brand,color,dimensions,weight,power,description,description_fr,specs,specs_fr,image\n" +
  "VL-0001,Brass ball valve 1in,Vanne laiton 1 pouce,Vannes et robinetterie,Vannes à boisseau,Atlas,Laiton,1 in BSP,0.4 kg,,Full-bore valve,Vanne à passage intégral,PN25|PTFE seat,PN25|Siège PTFE,vanne-laiton.jpg\n";
