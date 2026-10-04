import { createFileRoute } from "@tanstack/react-router";

const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml", ico: "image/x-icon", pdf: "application/pdf" };

export const Route = createFileRoute("/api/public/product-image/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        // Only plain catalog image paths: "category/file.ext"
        if (!/^[a-z0-9-]+\/[a-z0-9._-]+\.(jpe?g|png|webp|gif|svg|ico|pdf)$/.test(path) || path.includes("..")) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("product-images").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        const ext = path.split(".").pop()!;
        return new Response(data, { headers: { "content-type": types[ext] ?? "application/octet-stream", "cache-control": "public, max-age=300", ...(ext === "svg" ? { "content-security-policy": "script-src 'none'" } : {}) } });
      },
    },
  },
});
