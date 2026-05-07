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
    let q = supabase.from("products").select("*").order("sort_order", { ascending: true });
    if (!opts.includeInactive) q = q.eq("active", true);
    const { data } = await q;
    setProducts((data as DbProduct[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [opts.includeInactive]);

  return { products, loading, refresh };
};
