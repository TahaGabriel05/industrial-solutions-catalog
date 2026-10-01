import type { Language } from "./i18n";

// Business WhatsApp number in international format, digits only (no "+").
// Placeholder — replace with the company's real WhatsApp Business number.
export const WHATSAPP_NUMBER = "212600000000";

export type WhatsAppLine = { name: string; sku: string; quantity: number };

export type WhatsAppCustomer = { name?: string; company?: string; phone?: string; email?: string };

export function buildWhatsAppUrl(lines: WhatsAppLine[], customer: WhatsAppCustomer, language: Language): string {
  const fr = language === "fr";
  const message: string[] = [fr ? "Bonjour, je souhaite demander un devis pour :" : "Hello, I would like to request a quote for:", ""];
  lines.forEach((line, index) => {
    message.push(`${index + 1}. ${line.name}`, `   ${fr ? "Référence" : "Reference"}: ${line.sku}`, `   ${fr ? "Quantité" : "Quantity"}: ${line.quantity}`);
  });
  message.push("", `${fr ? "Total articles" : "Total items"}: ${lines.reduce((sum, line) => sum + line.quantity, 0)} (${lines.length} ${fr ? "produits" : "products"})`);
  const contact = [customer.name, customer.company, customer.phone, customer.email].filter((value) => value && value.trim());
  if (contact.length) message.push("", fr ? "Coordonnées :" : "Contact details:", ...contact.map((value) => `- ${value!.trim()}`));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message.join("\n"))}`;
}
