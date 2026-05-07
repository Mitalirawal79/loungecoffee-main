import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export type WishlistItem = {
  id: string;
  product_key: string;
  product_name: string;
  product_price: string | null;
  product_image: string | null;
  category_slug: string | null;
  created_at: string;
};

type Ctx = {
  items: WishlistItem[];
  loading: boolean;
  has: (key: string) => boolean;
  toggle: (item: Omit<WishlistItem, "id" | "created_at">) => Promise<void>;
  remove: (key: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const WishlistCtx = createContext<Ctx | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as WishlistItem[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const has = (key: string) => items.some((i) => i.product_key === key);

  const toggle: Ctx["toggle"] = async (item) => {
    if (!user) {
      toast.error("Please sign in to save items.");
      return;
    }
    if (has(item.product_key)) {
      await remove(item.product_key);
      return;
    }
    const { error } = await supabase.from("wishlists").insert({
      user_id: user.id,
      product_key: item.product_key,
      product_name: item.product_name,
      product_price: item.product_price,
      product_image: item.product_image,
      category_slug: item.category_slug,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Added to wishlist");
    refresh();
  };

  const remove = async (key: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("product_key", key);
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.product_key !== key));
  };

  return (
    <WishlistCtx.Provider value={{ items, loading, has, toggle, remove, refresh }}>
      {children}
    </WishlistCtx.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistCtx);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
