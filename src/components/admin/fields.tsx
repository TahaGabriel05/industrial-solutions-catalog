import { useRef, type ReactNode } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productImageUrl } from "@/lib/catalog";

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <label className={`block text-xs font-semibold ${className}`}><span className="mb-1.5 block text-muted-foreground">{label}</span>{children}</label>;
}

export const lines = (value: string) => value.split("\n").map((l) => l.trim()).filter(Boolean);

/** Upload button + thumbnails for storage paths. */
export function AssetPicker({ paths, onAdd, onRemove, accept, multiple, label, busy, pdf }: {
  paths: string[]; onAdd: (files: File[]) => void; onRemove: (index: number) => void; accept: string; multiple?: boolean; label: string; busy?: boolean; pdf?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return <div>
    <div className="flex flex-wrap gap-2">
      {paths.map((path, i) => <div key={path} className="relative border border-border bg-muted">
        {pdf ? <a href={productImageUrl(path)} target="_blank" rel="noopener noreferrer" className="flex h-16 items-center gap-2 px-3 text-xs"><FileText className="size-4" />PDF</a>
          : <img src={productImageUrl(path)} alt="" className="size-16 object-contain" />}
        <button type="button" onClick={() => onRemove(i)} className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-destructive text-destructive-foreground" aria-label="Remove"><X className="size-3" /></button>
      </div>)}
      {(multiple || paths.length === 0) && <Button type="button" variant="outline" className="h-16" disabled={busy} onClick={() => ref.current?.click()}><Upload />{label}</Button>}
    </div>
    <input ref={ref} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { const files = Array.from(e.target.files ?? []); e.target.value = ""; if (files.length) onAdd(files); }} />
  </div>;
}
