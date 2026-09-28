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
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
};

export const categories: Category[] = [
  {
    id: "tools",
    name: "Professional Tools",
    description: "Workshop-grade hand tools engineered for daily industrial use.",
    image: toolsCover,
    subcategories: ["Hand Tools", "Socket & Torque", "Cutting Tools"],
  },
  {
    id: "fasteners",
    name: "Fasteners & Fixings",
    description: "Certified fastening systems for fabrication, construction and maintenance.",
    image: fastenersCover,
    subcategories: ["Bolts & Nuts", "Anchors", "Washers & Rods"],
  },
  {
    id: "fittings",
    name: "Industrial Fittings",
    description: "Precision connections for hydraulic, pneumatic and process applications.",
    image: fittingsCover,
    subcategories: ["Hydraulic Fittings", "Flanges", "Couplings"],
  },
  {
    id: "valves",
    name: "Valves & Faucets",
    description: "Reliable flow-control components for water and industrial systems.",
    image: valvesCover,
    subcategories: ["Ball Valves", "Gate Valves", "Process Valves"],
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
  },
  {
    id: "socket-ratchet-set",
    sku: "TL-SRS-24",
    name: "Industrial Socket & Ratchet Set",
    category: "tools",
    subcategory: "Socket & Torque",
    image: toolsCover,
    specs: ["1/2 in drive", "72-tooth ratchet", "24-piece metric set"],
  },
  {
    id: "hex-bolt-88",
    sku: "FT-HB88-M12",
    name: "High-Tensile Hex Bolt",
    category: "fasteners",
    subcategory: "Bolts & Nuts",
    image: fastenersCover,
    specs: ["Grade 8.8", "M12 × 60 mm", "Zinc plated finish"],
  },
  {
    id: "wedge-anchor",
    sku: "FT-WA-A4-10",
    name: "Stainless Steel Wedge Anchor",
    category: "fasteners",
    subcategory: "Anchors",
    image: fastenersCover,
    specs: ["A4 stainless steel", "M10 × 100 mm", "Concrete applications"],
  },
  {
    id: "hydraulic-coupling",
    sku: "IF-QC-38-S",
    name: "Quick-Release Hydraulic Coupling",
    category: "fittings",
    subcategory: "Hydraulic Fittings",
    image: fittingsCover,
    specs: ["316 stainless steel", "3/8 in BSP", "350 bar working pressure"],
  },
  {
    id: "weld-neck-flange",
    sku: "IF-WNF-DN50",
    name: "Weld Neck Flange",
    category: "fittings",
    subcategory: "Flanges",
    image: fittingsCover,
    specs: ["DN50 / PN16", "Raised face", "EN 1092-1 standard"],
  },
  {
    id: "brass-ball-valve",
    sku: "VL-BBV-100",
    name: "Full-Bore Brass Ball Valve",
    category: "valves",
    subcategory: "Ball Valves",
    image: valvesCover,
    specs: ["1 in BSP female", "PN25 rated", "PTFE seat"],
  },
  {
    id: "gate-valve",
    sku: "VL-GV-DN40",
    name: "Industrial Brass Gate Valve",
    category: "valves",
    subcategory: "Gate Valves",
    image: valvesCover,
    specs: ["DN40 connection", "PN16 rated", "Non-rising stem"],
  },
];

export const findProductBySku = (sku?: string) => products.find((product) => product.sku === sku);
