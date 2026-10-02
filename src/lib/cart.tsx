import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { findProductById } from "./catalog";

export type CartLine = { id: string; quantity: number };
type CartContext = { items: CartLine[]; add: (id: string, quantity?: number) => void; remove: (id: string) => void; setQuantity: (id: string, quantity: number) => void; clear: () => void; count: number };
const Context = createContext<CartContext | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const data: unknown = JSON.parse(window.localStorage.getItem("atlas-inquiry-cart") ?? "[]");
      if (Array.isArray(data)) setItems(data.filter((line): line is CartLine => typeof line?.id === "string" && !!findProductById(line.id) && Number.isInteger(line.quantity) && line.quantity > 0).map((line) => ({ id: line.id, quantity: Math.min(line.quantity, 9999) })));
    } catch { /* Discard malformed drafts. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) window.localStorage.setItem("atlas-inquiry-cart", JSON.stringify(items)); }, [items, ready]);
  const add = (id: string, quantity = 1) => { if (!findProductById(id)) return; setItems((current) => { const match = current.find((line) => line.id === id); return match ? current.map((line) => line.id === id ? { ...line, quantity: Math.min(9999, line.quantity + quantity) } : line) : [...current, { id, quantity }]; }); };
  const remove = (id: string) => setItems((current) => current.filter((line) => line.id !== id));
  const setQuantity = (id: string, quantity: number) => setItems((current) => current.map((line) => line.id === id ? { ...line, quantity: Math.max(1, Math.min(9999, Math.floor(quantity) || 1)) } : line));
  return <Context.Provider value={{ items, add, remove, setQuantity, clear: () => setItems([]), count: items.reduce((sum, line) => sum + line.quantity, 0) }}>{children}</Context.Provider>;
}
const fallback: CartContext = { items: [], add: () => {}, remove: () => {}, setQuantity: () => {}, clear: () => {}, count: 0 };
export function useCart() { return useContext(Context) ?? fallback; }