import toolsCover from "@/assets/tools-cover.jpg";
import valvesCover from "@/assets/valves-cover.jpg";
import fastenersCover from "@/assets/fasteners-cover.jpg";
import fittingsCover from "@/assets/fittings-cover.jpg";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  image: string;
  specs: string[];
  specsFr: string[];
  nameFr: string;
  description: string;
  descriptionFr: string;
  brand?: string;
  color?: string;
  dimensions?: string;
  weight?: string;
  power?: string;
  images?: string[];
  technicalSheetUrl?: string;
  badges?: string[];
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
  nameFr: string;
  descriptionFr: string;
  subcategoriesFr: string[];
};

export const categories: Category[] = [
  {
    id: "tools",
    name: "Professional Tools",
    description: "Workshop-grade hand tools engineered for daily industrial use.",
    image: toolsCover,
    subcategories: ["Hand Tools", "Socket & Torque", "Cutting Tools"],
    nameFr: "Outillage professionnel", descriptionFr: "Outils d'atelier conçus pour un usage industriel quotidien.", subcategoriesFr: ["Outils à main", "Douilles et serrage", "Outils de coupe"],
  },
  {
    id: "fasteners",
    name: "Fasteners & Fixings",
    description: "Certified fastening systems for fabrication, construction and maintenance.",
    image: fastenersCover,
    subcategories: ["Bolts & Nuts", "Anchors", "Washers & Rods"],
    nameFr: "Fixations et visserie", descriptionFr: "Systèmes de fixation pour la fabrication, le bâtiment et la maintenance.", subcategoriesFr: ["Boulons et écrous", "Chevilles", "Rondelles et tiges"],
  },
  {
    id: "fittings",
    name: "Industrial Fittings",
    description: "Precision connections for hydraulic, pneumatic and process applications.",
    image: fittingsCover,
    subcategories: ["Hydraulic Fittings", "Flanges", "Couplings"],
    nameFr: "Raccords industriels", descriptionFr: "Connexions de précision pour applications hydrauliques et industrielles.", subcategoriesFr: ["Raccords hydrauliques", "Brides", "Coupleurs"],
  },
  {
    id: "valves",
    name: "Valves & Faucets",
    description: "Reliable flow-control components for water and industrial systems.",
    image: valvesCover,
    subcategories: ["Ball Valves", "Gate Valves", "Process Valves"],
    nameFr: "Vannes et robinetterie", descriptionFr: "Composants fiables de régulation de débit pour l'eau et l'industrie.", subcategoriesFr: ["Vannes à boisseau", "Vannes à opercule", "Vannes de procédé"],
  },
];

export const products: Product[] = [
  {
    id: "combination-wrench-set",
    sku: "TL-CWS-12",
    name: "12-Piece Combination Wrench Set",
    category: "tools",
    subcategory: "Hand Tools",
    image: toolsCover,
    specs: ["Chrome vanadium steel", "Sizes 8–24 mm", "DIN 3113 compliant"],
    specsFr: ["Acier chrome-vanadium", "Tailles 8 à 24 mm", "Conforme à la norme DIN 3113"],
    nameFr: "Jeu de 12 clés mixtes", description: "A workshop-ready combination wrench set for routine maintenance and assembly.", descriptionFr: "Jeu de clés mixtes pour les travaux quotidiens de maintenance et d'assemblage.",
  },
  {
    id: "socket-ratchet-set",
    sku: "TL-SRS-24",
    name: "Industrial Socket & Ratchet Set",
    category: "tools",
    subcategory: "Socket & Torque",
    image: toolsCover,
    specs: ["1/2 in drive", "72-tooth ratchet", "24-piece metric set"],
    specsFr: ["Carré d'entraînement 1/2 pouce", "Cliquet 72 dents", "Coffret métrique de 24 pièces"],
    nameFr: "Coffret de douilles et cliquet industriel", description: "Metric socket and ratchet set for workshop fastening tasks.", descriptionFr: "Coffret métrique de douilles et cliquet pour les travaux de serrage en atelier.",
  },
  {
    id: "hex-bolt-88",
    sku: "FT-HB88-M12",
    name: "High-Tensile Hex Bolt",
    category: "fasteners",
    subcategory: "Bolts & Nuts",
    image: fastenersCover,
    specs: ["Grade 8.8", "M12 × 60 mm", "Zinc plated finish"],
    specsFr: ["Classe 8.8", "M12 × 60 mm", "Finition zinguée"],
    nameFr: "Boulon hexagonal haute résistance", description: "Grade 8.8 hex bolt with a zinc-plated finish for industrial fastening.", descriptionFr: "Boulon hexagonal de classe 8.8 avec finition zinguée pour la fixation industrielle.", dimensions: "M12 × 60 mm", color: "Zinc plated",
  },
  {
    id: "wedge-anchor",
    sku: "FT-WA-A4-10",
    name: "Stainless Steel Wedge Anchor",
    category: "fasteners",
    subcategory: "Anchors",
    image: fastenersCover,
    specs: ["A4 stainless steel", "M10 × 100 mm", "Concrete applications"],
    specsFr: ["Acier inoxydable A4", "M10 × 100 mm", "Pour applications sur béton"],
    nameFr: "Goujon d'ancrage en acier inoxydable", description: "A4 stainless steel wedge anchor for concrete applications.", descriptionFr: "Goujon d'ancrage en inox A4 destiné aux applications sur béton.", dimensions: "M10 × 100 mm",
  },
  {
    id: "hydraulic-coupling",
    sku: "IF-QC-38-S",
    name: "Quick-Release Hydraulic Coupling",
    category: "fittings",
    subcategory: "Hydraulic Fittings",
    image: fittingsCover,
    specs: ["316 stainless steel", "3/8 in BSP", "350 bar working pressure"],
    specsFr: ["Acier inoxydable 316", "Filetage BSP 3/8 pouce", "Pression de service 350 bar"],
    nameFr: "Coupleur hydraulique rapide", description: "Quick-release hydraulic connection for demanding fluid systems.", descriptionFr: "Connexion hydraulique rapide pour les circuits de fluides exigeants.", dimensions: "3/8 in BSP",
  },
  {
    id: "weld-neck-flange",
    sku: "IF-WNF-DN50",
    name: "Weld Neck Flange",
    category: "fittings",
    subcategory: "Flanges",
    image: fittingsCover,
    specs: ["DN50 / PN16", "Raised face", "EN 1092-1 standard"],
    specsFr: ["DN50 / PN16", "Face surélevée", "Norme EN 1092-1"],
    nameFr: "Bride à collerette à souder", description: "Raised-face weld neck flange for industrial pipe connections.", descriptionFr: "Bride à collerette avec face surélevée pour les raccordements de tuyauterie industrielle.", dimensions: "DN50 / PN16",
  },
  {
    id: "brass-ball-valve",
    sku: "VL-BBV-100",
    name: "Full-Bore Brass Ball Valve",
    category: "valves",
    subcategory: "Ball Valves",
    image: valvesCover,
    specs: ["1 in BSP female", "PN25 rated", "PTFE seat"],
    specsFr: ["Filetage femelle BSP 1 pouce", "Pression nominale PN25", "Siège en PTFE"],
    nameFr: "Vanne à boisseau sphérique en laiton", description: "Full-bore brass ball valve for reliable flow isolation.", descriptionFr: "Vanne à passage intégral en laiton pour une isolation fiable du débit.", dimensions: "1 in BSP",
  },
  {
    id: "gate-valve",
    sku: "VL-GV-DN40",
    name: "Industrial Brass Gate Valve",
    category: "valves",
    subcategory: "Gate Valves",
    image: valvesCover,
    specs: ["DN40 connection", "PN16 rated", "Non-rising stem"],
    specsFr: ["Raccordement DN40", "Pression nominale PN16", "Tige non montante"],
    nameFr: "Vanne à opercule industrielle en laiton", description: "Brass gate valve for controlled flow in industrial systems.", descriptionFr: "Vanne à opercule en laiton pour la régulation du débit dans les installations industrielles.", dimensions: "DN40",
  },
];

export const findProductBySku = (sku?: string) => products.find((product) => product.sku === sku);
export const findProductById = (id?: string) => products.find((product) => product.id === id);
export const productName = (product: Product, language: "fr" | "en") => language === "fr" ? product.nameFr : product.name;
export const categoryName = (category: Category, language: "fr" | "en") => language === "fr" ? category.nameFr : category.name;
export const subcategoryName = (name: string, language: "fr" | "en") => {
  if (language === "en") return name;
  for (const category of categories) {
    const index = category.subcategories.indexOf(name);
    if (index >= 0) return category.subcategoriesFr[index] ?? name;
  }
  return name;
};
