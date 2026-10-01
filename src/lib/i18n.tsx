import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "fr" | "en";
const translations = {
  home: ["Accueil", "Home"], products: ["Produits", "Products"], about: ["À propos", "About Us"], contact: ["Contact", "Contact"], cart: ["Panier", "Cart"], quote: ["Demander un devis", "Request a Quote"],
  browse: ["Voir les produits", "Browse Products"], categories: ["Catégories de produits", "Product Categories"], allProducts: ["Tous les produits", "All Products"],
  search: ["Rechercher un produit, une référence ou une caractéristique", "Search products, references or specifications"], filters: ["Filtres", "Filters"], clear: ["Effacer les filtres", "Clear filters"], results: ["produits", "products"], noResults: ["Aucun produit trouvé", "No products found"], tryAgain: ["Essayez une autre référence, un mot-clé ou une catégorie.", "Try another reference, keyword or category."],
  technical: ["Caractéristiques techniques", "Technical specifications"], description: ["Description", "Description"], brand: ["Marque", "Brand"], color: ["Couleur", "Color"], dimensions: ["Dimensions", "Dimensions"], weight: ["Poids", "Weight"], power: ["Puissance", "Power"], reference: ["Référence", "Reference"], sheet: ["Fiche technique PDF", "Technical Sheet PDF"], advantages: ["Conformité & Atouts", "Compliance & Benefits"],
  addCart: ["Ajouter au panier", "Add to cart"], added: ["Ajouté au panier", "Added to cart"], remove: ["Retirer", "Remove"], quantity: ["Quantité", "Quantity"], continue: ["Continuer les achats", "Continue browsing"], sendInquiry: ["Préparer la demande", "Prepare inquiry"], emptyCart: ["Votre panier est vide", "Your cart is empty"], cartIntro: ["Sélectionnez les produits et quantités pour préparer votre demande de devis.", "Choose products and quantities to prepare your quote inquiry."],
  name: ["Nom", "Name"], company: ["Entreprise", "Company"], phone: ["Téléphone", "Phone"], email: ["E-mail", "Email"], message: ["Message", "Message"], productReference: ["Produit / Référence", "Product / Reference"], submit: ["Valider la demande de devis", "Submit quote inquiry"], prepared: ["Demande enregistrée", "Inquiry recorded"], again: ["Nouvelle demande", "New inquiry"],
} as const;
export type CopyKey = keyof typeof translations;
type LocaleContext = { language: Language; setLanguage: (language: Language) => void; t: (key: CopyKey) => string };
const Context = createContext<LocaleContext | null>(null);
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  useEffect(() => { const saved = window.localStorage.getItem("atlas-language"); if (saved === "fr" || saved === "en") setLanguageState(saved); }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const setLanguage = (next: Language) => { setLanguageState(next); window.localStorage.setItem("atlas-language", next); };
  return <Context.Provider value={{ language, setLanguage, t: (key) => translations[key][language === "fr" ? 0 : 1] }}>{children}</Context.Provider>;
}
export function useLocale() { const value = useContext(Context); if (!value) throw new Error("LocaleProvider missing"); return value; }