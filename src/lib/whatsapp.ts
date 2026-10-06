import type { Language } from "./i18n";
import { BUSINESS } from "./business";

// Moroccan international format excludes the domestic leading zero.
export const WHATSAPP_NUMBER = BUSINESS.whatsappNumber;

export type WhatsAppLine = { name: string; sku: string; quantity: number };

export type WhatsAppCustomer = { name?: string; company?: string; phone?: string; email?: string };

export function buildWhatsAppUrl(lines: WhatsAppLine[], customer: WhatsAppCustomer, language: Language): string {
  const fr = language === "fr";
  if (!lines.length) return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fr ? "Bonjour, je souhaite demander un devis." : "Hello, I would like to request a quote.")}`;
  const message: string[] = [fr ? "Bonjour, je souhaite demander un devis pour :" : "Hello, I would like to request a quote for:", ""];
  lines.forEach((line, index) => {
    message.push(`${index + 1}. ${line.name}`, `   ${fr ? "Référence" : "Reference"}: ${line.sku}`, `   ${fr ? "Quantité" : "Quantity"}: ${line.quantity}`);
  });
  message.push("", `${fr ? "Total articles" : "Total items"}: ${lines.reduce((sum, line) => sum + line.quantity, 0)} (${lines.length} ${fr ? "produits" : "products"})`);
  const contact = [customer.name, customer.company, customer.phone, customer.email].flatMap((value) => value?.trim() ? [value.trim()] : []);
  if (contact.length) message.push("", fr ? "Coordonnées :" : "Contact details:", ...contact.map((value) => `- ${value}`));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message.join("\n"))}`;
}
