import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { RemoteCatalog } from "@/lib/catalog";
import { uploadAsset } from "@/lib/admin";
import { useLocale } from "@/lib/i18n";
import { AssetPicker } from "./fields";

export function BrandingManager({ remote, refresh }: { remote: RemoteCatalog; refresh: () => Promise<void> }) {
  const { language } = useLocale(); const fr = language === "fr";
  const [busy, setBusy] = useState(false);
  const logo = remote.settings?.logo_path ?? null; const favicon = remote.settings?.favicon_path ?? null;

  const save = async (patch: { logo_path?: string | null; favicon_path?: string | null }) => {
    setBusy(true);
    const { error } = await supabase.from("site_settings").upsert({ id: "site", logo_path: logo, favicon_path: favicon, ...patch, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { toast.error(fr ? "Enregistrement impossible." : "Could not save."); return; }
    toast.success(fr ? "Enregistré." : "Saved."); await refresh();
  };
  const upload = async (file: File, key: "logo_path" | "favicon_path") => {
    setBusy(true);
    try { const path = await uploadAsset(file, "site"); await save({ [key]: path }); } catch { toast.error(fr ? "Échec de l'envoi." : "Upload failed."); setBusy(false); }
  };

  return <div className="grid gap-6 md:grid-cols-2">
    <section className="border border-border p-5"><h2 className="font-display text-xl font-bold">Logo</h2><p className="mt-1 mb-4 text-sm text-muted-foreground">{fr ? "Affiché dans l'en-tête et le pied de page. PNG, SVG ou WebP, fond transparent conseillé." : "Shown in the header and footer. PNG, SVG or WebP, transparent background recommended."}</p>
      <AssetPicker paths={logo ? [logo] : []} accept="image/png,image/svg+xml,image/webp,image/jpeg" label={fr ? "Choisir un logo" : "Choose logo"} busy={busy} onAdd={(f) => upload(f[0]!, "logo_path")} onRemove={() => save({ logo_path: null })} /></section>
    <section className="border border-border p-5"><h2 className="font-display text-xl font-bold">Favicon</h2><p className="mt-1 mb-4 text-sm text-muted-foreground">{fr ? "Petite icône de l'onglet du navigateur. Image carrée PNG, ICO ou SVG (64×64 conseillé)." : "Small browser-tab icon. Square PNG, ICO or SVG (64×64 recommended)."}</p>
      <AssetPicker paths={favicon ? [favicon] : []} accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml" label={fr ? "Choisir un favicon" : "Choose favicon"} busy={busy} onAdd={(f) => upload(f[0]!, "favicon_path")} onRemove={() => save({ favicon_path: null })} /></section>
  </div>;
}
