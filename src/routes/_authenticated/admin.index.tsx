import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { FileUp, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { mergeRemoteCatalog, type RemoteCatalog } from "@/lib/catalog";
import { getImportedCatalog } from "@/lib/catalog.functions";
import { useAdminStatus } from "@/lib/admin";
import { useLocale } from "@/lib/i18n";
import { ProductManager } from "@/components/admin/product-manager";
import { CategoryManager } from "@/components/admin/category-manager";
import { BrandingManager } from "@/components/admin/branding-manager";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [
    { title: "Panneau d'administration | Atlas Industrial Supply" },
    { name: "description", content: "Gérer les produits, catégories, logo et favicon du catalogue." },
    { property: "og:title", content: "Panneau d'administration | Atlas" },
    { property: "og:description", content: "Gestion du catalogue Atlas." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdminPage,
});

export type Refresh = () => Promise<void>;

function AdminPage() {
  const { language } = useLocale(); const fr = language === "fr";
  const router = useRouter();
  const { isAdmin, email } = useAdminStatus();
  const [remote, setRemote] = useState<RemoteCatalog | null>(null);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(async () => {
    const data = await getImportedCatalog(); mergeRemoteCatalog(data); setRemote(data); setVersion((v) => v + 1); await router.invalidate();
  }, [router]);
  useEffect(() => { if (isAdmin) void refresh(); }, [isAdmin, refresh]);

  const signOut = async () => { await supabase.auth.signOut(); router.navigate({ to: "/auth" }); };
  if (isAdmin === null) return <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-muted-foreground">…</div>;
  if (!isAdmin) return <div className="mx-auto max-w-xl px-4 py-16"><h1 className="font-display text-2xl font-bold">{fr ? "Accès réservé" : "Restricted access"}</h1><p className="mt-3 text-sm text-muted-foreground">{fr ? `Le compte ${email} n'a pas les droits administrateur.` : `The account ${email} does not have admin rights.`}</p><Button variant="outline" className="mt-6" onClick={signOut}><LogOut />{fr ? "Se déconnecter" : "Sign out"}</Button></div>;

  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div><p className="section-kicker">Admin</p><h1 className="mt-2 font-display text-3xl font-bold">{fr ? "Panneau d'administration" : "Admin panel"}</h1><p className="mt-2 text-sm text-muted-foreground">{email}</p></div>
      <div className="flex gap-2"><Button asChild variant="outline" size="sm"><Link to="/admin/import"><FileUp />{fr ? "Import" : "Import"}</Link></Button><Button variant="ghost" size="sm" onClick={signOut} aria-label={fr ? "Se déconnecter" : "Sign out"}><LogOut /></Button></div>
    </div>
    {!remote ? <p className="py-10 text-sm text-muted-foreground">{fr ? "Chargement…" : "Loading…"}</p> :
    <Tabs defaultValue="products" className="mt-6">
      <TabsList className="flex h-auto w-full flex-wrap justify-start"><TabsTrigger value="products">{fr ? "Produits" : "Products"}</TabsTrigger><TabsTrigger value="categories">{fr ? "Catégories" : "Categories"}</TabsTrigger><TabsTrigger value="branding">{fr ? "Logo & Favicon" : "Logo & Favicon"}</TabsTrigger></TabsList>
      <TabsContent value="products"><ProductManager key={`p${version}`} remote={remote} refresh={refresh} /></TabsContent>
      <TabsContent value="categories"><CategoryManager key={`c${version}`} remote={remote} refresh={refresh} /></TabsContent>
      <TabsContent value="branding"><BrandingManager key={`b${version}`} remote={remote} refresh={refresh} /></TabsContent>
    </Tabs>}
  </div>;
}
