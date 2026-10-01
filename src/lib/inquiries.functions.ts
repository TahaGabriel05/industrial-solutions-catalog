import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { findProductById, findProductBySku } from "./catalog";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(80),
  email: z.string().email().max(254),
  productReference: z.string().trim().max(300).default(""),
  quantity: z.number().int().min(1).max(9999),
  message: z.string().trim().max(5000).default(""),
  items: z.array(z.object({ id: z.string(), quantity: z.number().int().min(1).max(9999) })).max(50),
  website: z.string().max(200).default(""),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((input) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true }; // Ignore automated submissions filling the hidden field.
    const items = data.items.map((line) => {
      const product = findProductById(line.id);
      if (!product) throw new Error("Unknown product in inquiry");
      return { sku: product.sku, name: product.name, quantity: line.quantity };
    });
    const matched = findProductBySku(data.productReference);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("inquiries").insert({
      name: data.name, company: data.company, phone: data.phone, email: data.email,
      product_reference: matched ? `${matched.name} — ${matched.sku}` : data.productReference || null,
      quantity: data.quantity, message: data.message, items,
    });
    if (error) throw new Error("Unable to save inquiry");
    return { ok: true };
  });