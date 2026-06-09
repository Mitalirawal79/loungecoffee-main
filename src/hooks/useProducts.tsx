import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  flavor: string | null;
  price_cents: number;
  image_url: string | null;
  origin: string | null;
  roast: string | null;
  notes: string | null;
  ingredients: string[] | null;
  active: boolean;
  sort_order: number;
  sku: string | null;
  category: string;
  stock: number;
};

// Map DB image_url (which may be a /src/assets/... path from seed) to bundled asset
import yellow from "@/assets/lounge-yellow.png";
import red from "@/assets/lounge-red.png";
import black from "@/assets/lounge-black.png";
import orange from "@/assets/lounge-orange.png";

const assetMap: Record<string, string> = {
  "/src/assets/lounge-yellow.png": yellow,
  "/src/assets/lounge-red.png": red,
  "/src/assets/lounge-black.png": black,
  "/src/assets/lounge-orange.png": orange,
};

const fallbackProducts: DbProduct[] = [
  {
    id: "classic",
    slug: "lounge-classic",
    name: "Lounge Classic",
    flavor: "Rich & Aromatic",
    price_cents: 550,
    image_url: "/src/assets/lounge-yellow.png",
    origin: "Ethiopia, Yirgacheffe",
    roast: "Medium",
    notes: "Citrus zest, milk chocolate, soft floral finish",
    ingredients: ["Single-origin espresso", "Steamed milk", "Vanilla bean"],
    active: true,
    sort_order: 1,
    sku: "LOUNGE-CLASSIC",
    category: "coffee",
    stock: 25,
  },
  {
    id: "ruby",
    slug: "lounge-ruby",
    name: "Lounge Ruby",
    flavor: "Bold & Berry",
    price_cents: 600,
    image_url: "/src/assets/lounge-red.png",
    origin: "Colombia, Huila",
    roast: "Medium-Dark",
    notes: "Red berries, caramel, creamy body",
    ingredients: ["Cold brew", "Berry reduction", "Cream swirl"],
    active: true,
    sort_order: 2,
    sku: "LOUNGE-RUBY",
    category: "coffee",
    stock: 25,
  },
  {
    id: "midnight",
    slug: "lounge-midnight",
    name: "Lounge Midnight",
    flavor: "Bold & Intense",
    price_cents: 350,
    image_url: "/src/assets/lounge-black.png",
    origin: "Brazil, Cerrado",
    roast: "Dark",
    notes: "Dark chocolate, hazelnut, lingering finish",
    ingredients: ["Double espresso", "Golden crema"],
    active: true,
    sort_order: 3,
    sku: "LOUNGE-MIDNIGHT",
    category: "coffee",
    stock: 25,
  },
  {
    id: "sunset",
    slug: "lounge-sunset",
    name: "Lounge Sunset",
    flavor: "Warm & Spiced",
    price_cents: 475,
    image_url: "/src/assets/lounge-orange.png",
    origin: "Guatemala, Antigua",
    roast: "Medium",
    notes: "Cinnamon, brown sugar, vanilla cream",
    ingredients: ["Espresso", "Pumpkin spice", "Velvet foam"],
    active: true,
    sort_order: 4,
    sku: "LOUNGE-SUNSET",
    category: "coffee",
    stock: 25,
  },
];

export const resolveImage = (url: string | null) => {
  if (!url) return yellow;
  return assetMap[url] ?? url;
};

export const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const useProducts = (opts: { includeInactive?: boolean } = {}) => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      let q = supabase.from("products").select("*").order("sort_order", { ascending: true });
      if (!opts.includeInactive) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      setProducts(data?.length ? (data as DbProduct[]) : fallbackProducts);
    } catch (error) {
      console.error("Unable to load products", error);
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [opts.includeInactive]);

  return { products, loading, refresh };
};