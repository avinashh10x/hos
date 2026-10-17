// Product data scraped from zyroindia.com (see content/zyro/products.md).
// Colours sampled from the real packs and listing banners.

export type LineId = "energy" | "hydrate" | "indie" | "skinny";

export type Product = {
  id: string;
  name: string;
  line: LineId;
  volume: string;
  price: number;
  blurb: string;
  notes: string[];
  /** Two short claims printed beside the badge on the can */
  facts: [string, string][];
  /** Can label colours */
  label: { bg: string; logo: string; text: string; badgeBg: string; badgeFg: string };
  url: string;
  photo: string;
  /** Real flat label artwork, when we have it */
  labelArt?: string;
  /** Hydrate+ ships in a 400ml bottle: the 3D can morphs into one. Value is the cap colour. */
  cap?: string;
};

export type Line = {
  id: LineId;
  name: string;
  short: string;
  tagline: string;
  body: string;
  specs: { k: string; v: string }[];
  products: string[];
};

const shop = (handle: string) => `https://zyroindia.com/products/${handle}`;

export const PRODUCTS: Record<string, Product> = {
  "blue-bolt": {
    id: "blue-bolt",
    name: "Blue Bolt",
    line: "energy",
    volume: "250ml",
    price: 90,
    blurb:
      "A clean, refreshing boost with caffeine, taurine and three B-group vitamins. Supports alertness and focus.",
    notes: ["Caffeine", "Taurine", "B3 · B6 · B12"],
    facts: [["CAFFEINE", "SUPPORTS ALERTNESS & FOCUS"], ["B3 · B6 · B12", "B-GROUP VITAMINS + TAURINE"]],
    label: { bg: "#1c2a58", logo: "#ea4330", text: "#cfe0f2", badgeBg: "#a9c6e6", badgeFg: "#1c2a58" },
    url: shop("blue-bolt"),
    photo: "/products/blue-bolt.jpg",
  },
  "berry-blast": {
    id: "berry-blast",
    name: "Berry Blast",
    line: "energy",
    volume: "250ml",
    price: 90,
    blurb:
      "Berry-forward energy with zero sugar and zero calories. Caffeine, taurine, B3, B6 and B12. Best enjoyed chilled.",
    notes: ["Caffeine", "Taurine", "B3 · B6 · B12"],
    facts: [["CAFFEINE", "SUPPORTS ALERTNESS & FOCUS"], ["B3 · B6 · B12", "B-GROUP VITAMINS + TAURINE"]],
    label: { bg: "#6b1b40", logo: "#a9dff0", text: "#f3cfe0", badgeBg: "#f2b8ce", badgeFg: "#6b1b40" },
    url: shop("berry-blast"),
    photo: "/products/berry-blast.jpg",
  },
  "green-apple": {
    id: "green-apple",
    name: "Green Apple",
    line: "hydrate",
    volume: "400ml",
    price: 60,
    blurb:
      "A refreshing burst of green apple with potassium to help replenish electrolytes. Sugar-free and caffeine-free.",
    notes: ["Potassium", "Electrolytes", "Caffeine-free"],
    facts: [["POTASSIUM", "HELPS REPLENISH ELECTROLYTES"], ["CAFFEINE FREE", "SUGAR FREE HYDRATION"]],
    label: { bg: "#a6d23b", logo: "#e5197f", text: "#ffffff", badgeBg: "#ffffff", badgeFg: "#5c8a12" },
    url: shop("green-apple"),
    photo: "/products/green-apple.jpg",
    cap: "#79bf2b",
  },
  "lime-lemon": {
    id: "lime-lemon",
    name: "Lime & Lemon",
    line: "hydrate",
    volume: "400ml",
    price: 60,
    blurb:
      "Sharp citrus notes of lime and lemon with potassium for electrolyte replenishment. Bright, zesty, instantly refreshing.",
    notes: ["Potassium", "Electrolytes", "Caffeine-free"],
    facts: [["POTASSIUM", "HELPS REPLENISH ELECTROLYTES"], ["CAFFEINE FREE", "SUGAR FREE HYDRATION"]],
    label: { bg: "#f4da15", logo: "#4b2a8c", text: "#2b2b2b", badgeBg: "#ffffff", badgeFg: "#4b2a8c" },
    url: shop("lime-lemon"),
    photo: "/products/lime-lemon.jpg",
    cap: "#e9cf0c",
  },
  "strawberry-watermelon": {
    id: "strawberry-watermelon",
    name: "Strawberry & Watermelon",
    line: "hydrate",
    volume: "400ml",
    price: 60,
    blurb:
      "Juicy strawberry and watermelon, crafted to hydrate and revive. Light, balanced, no sugar or caffeine.",
    notes: ["Potassium", "Electrolytes", "Caffeine-free"],
    facts: [["POTASSIUM", "HELPS REPLENISH ELECTROLYTES"], ["CAFFEINE FREE", "SUGAR FREE HYDRATION"]],
    label: { bg: "#ec2a47", logo: "#f3e01f", text: "#ffffff", badgeBg: "#ffffff", badgeFg: "#ec2a47" },
    url: shop("strawberry-watermelon"),
    photo: "/products/strawberry-watermelon.jpg",
    cap: "#d9202c",
  },
  "masala-cola": {
    id: "masala-cola",
    name: "Masala Cola",
    line: "indie",
    volume: "250ml",
    price: 60,
    blurb:
      "A classic cola with a distinctly Indian twist. Familiar cola notes, warm desi spice and old-school soda nostalgia.",
    notes: ["Desi spice", "Cola", "Zero sugar"],
    facts: [["DESI SPICE", "INSPIRED BY CLASSIC DESI SODAS"], ["ZERO SUGAR", "PURE NOSTALGIA, ZERO GUILT"]],
    label: { bg: "#d3272c", logo: "#171212", text: "#fbefe0", badgeBg: "#f1dcc0", badgeFg: "#b4252a" },
    url: shop("masala-cola"),
    photo: "/products/masala-cola.jpg",
  },
  "jeera-soda": {
    id: "jeera-soda",
    name: "Jeera Soda",
    line: "indie",
    volume: "250ml",
    price: 60,
    blurb:
      "Sparkling carbonation with warm, savoury jeera and a hint of tang. The classic desi cooler, made without sugar.",
    notes: ["Jeera", "Tangy", "Zero sugar"],
    facts: [["JEERA", "WARM, SAVOURY, A HINT OF TANG"], ["ZERO SUGAR", "THE CLASSIC DESI COOLER"]],
    label: { bg: "#555b22", logo: "#dbe33c", text: "#f1f2dc", badgeBg: "#f3f1e2", badgeFg: "#555b22" },
    url: shop("jeera-soda"),
    photo: "/products/jeera-soda.jpg",
  },
  "vita-cola": {
    id: "vita-cola",
    name: "Vita Cola",
    line: "skinny",
    volume: "250ml",
    price: 60,
    blurb:
      "Bold cola fizz, zero sugar spark. A timeless rush with a caffeine kick and added vitamins C and B12.",
    notes: ["Vitamin C", "Vitamin B12", "Caffeine"],
    facts: [["VITAMIN C", "SUPPORTS NORMAL IMMUNE FUNCTION"], ["VITAMIN B12", "SUPPORTS ENERGY METABOLISM"]],
    label: { bg: "#f2efe9", logo: "#d3272c", text: "#c4242a", badgeBg: "#d3272c", badgeFg: "#ffffff" },
    url: shop("vita-cola"),
    labelArt: "/labels/vita-cola.jpg",
    photo: "/products/vita-cola.jpg",
  },
  "tonic-water": {
    id: "tonic-water",
    name: "Tonic Water",
    line: "skinny",
    volume: "250ml",
    price: 60,
    blurb:
      "Crafted with quinine for that timeless bitter edge. A refined fizz for mocktails or your evening ritual.",
    notes: ["Quinine", "Mixer", "Zero calorie"],
    facts: [["QUININE", "THAT TIMELESS BITTER EDGE"], ["ZERO CALORIE", "MADE FOR MOCKTAILS"]],
    label: { bg: "#f5aa1f", logo: "#151515", text: "#151515", badgeBg: "#151515", badgeFg: "#f5aa1f" },
    url: shop("tonic-water"),
    photo: "/products/tonic-water.jpg",
  },
  "ginger-ale-flavoured": {
    id: "ginger-ale-flavoured",
    name: "Ginger Ale",
    line: "skinny",
    volume: "250ml",
    price: 60,
    blurb:
      "The refreshing, distinctive bite of ginger. Made for evening snacks and every sip in between.",
    notes: ["Ginger", "Mixer", "Zero calorie"],
    facts: [["GINGER", "DISTINCTIVE & REFRESHING"], ["ZERO CALORIE", "MADE FOR MOCKTAILS"]],
    label: { bg: "#1f5a34", logo: "#f2ebd3", text: "#f2ebd3", badgeBg: "#f2ebd3", badgeFg: "#1f5a34" },
    url: shop("ginger-ale-flavoured"),
    photo: "/products/ginger-ale-flavoured.jpg",
  },
};

export const LINES: Line[] = [
  {
    id: "energy",
    name: "Energy Pop",
    short: "Energy",
    tagline: "Designed for those who refuse to settle.",
    body: "Feel the rush of clarity and focus in every sip. Zero sugar, zero calories, powered by caffeine for everyday alertness.",
    specs: [
      { k: "Caffeine", v: "Clean lift" },
      { k: "Taurine", v: "Added" },
      { k: "B3 · B6 · B12", v: "B-vitamins" },
    ],
    products: ["blue-bolt", "berry-blast"],
  },
  {
    id: "hydrate",
    name: "Hydrate+",
    short: "Hydrate",
    tagline: "The companion you didn't know you needed.",
    body: "Fruit-flavoured electrolyte hydration with potassium. Cool, balanced and effortlessly refreshing, with no sugar and no caffeine.",
    specs: [
      { k: "Potassium", v: "Electrolytes" },
      { k: "Caffeine", v: "None" },
      { k: "Bottle", v: "400ml" },
    ],
    products: ["green-apple", "lime-lemon", "strawberry-watermelon"],
  },
  {
    id: "indie",
    name: "Indie Pop",
    short: "Indie",
    tagline: "Fizzy, flavourful and boldly reimagined.",
    body: "Indian-flavoured fizzy drinks. A celebration of pure nostalgia, the old-school soda moment, with zero guilt.",
    specs: [
      { k: "Flavour", v: "Desi" },
      { k: "Sugar", v: "0g" },
      { k: "Can", v: "250ml" },
    ],
    products: ["masala-cola", "jeera-soda"],
  },
  {
    id: "skinny",
    name: "Skinny Pop",
    short: "Skinny",
    tagline: "The classics, minus everything.",
    body: "Cola, tonic and ginger ale with zero sugar and zero calories. Sip it solo or make it the mixer.",
    specs: [
      { k: "Vitamins", v: "C · B12" },
      { k: "Mixers", v: "Tonic · Ginger" },
      { k: "Can", v: "250ml" },
    ],
    products: ["vita-cola", "tonic-water", "ginger-ale-flavoured"],
  },
];

export const LINE_BY_ID = Object.fromEntries(LINES.map((l) => [l.id, l])) as Record<LineId, Line>;
export const ALL_PRODUCTS = Object.values(PRODUCTS);

export const TOUR = [
  { date: "14.03", city: "Chandigarh" },
  { date: "21.03", city: "Indore" },
  { date: "29.03", city: "Bengaluru" },
  { date: "03.04", city: "Kolkata" },
  { date: "05.04", city: "Jaipur" },
  { date: "12.04", city: "Mumbai" },
];
