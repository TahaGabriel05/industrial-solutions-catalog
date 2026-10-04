import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/import-parser";

export const ASSET_BUCKET = "product-images";

/** Admin check through the has_role RPC (RLS also enforces it on every write). */
export function useAdminStatus() {
  const [state, setState] = useState<{ isAdmin: boolean | null; email: string }>({ isAdmin: null, email: "" });
  useEffect(() => { (async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) { setState({ isAdmin: false, email: "" }); return; }
    const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
    setState({ isAdmin: !!ok, email: data.user.email ?? "" });
  })(); }, []);
  return state;
}

/** Uploads a file to the private asset bucket and returns its storage path (served via /api/public/product-image/). */
export async function uploadAsset(file: File, folder: string) {
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace("jpeg", "jpg");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 40);
  const path = `${folder}/${base}-${Date.now().toString(36)}.${ext}`;
  const { error } = await supabase.storage.from(ASSET_BUCKET).upload(path, file, { upsert: true, ...(file.type ? { contentType: file.type } : {}) });
  if (error) throw error;
  return path;
}
