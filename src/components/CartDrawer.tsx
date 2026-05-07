import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice, resolveImage } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CartDrawer = () => {
  const { items, open, setOpen, setQty, remove, totalCents, clear } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const checkout = async () => {
    if (!user) {
      setOpen(false);
      navigate("/login");
      toast.info("Please sign in to checkout");
      return;
    }
    if (items.length === 0) return;
    setBusy(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({ user_id: user.id, total_cents: totalCents, status: "pending" })
        .select()
        .single();
      if (error) throw error;
      const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_id: uuidRe.test(i.id) ? i.id : null,
          product_name: i.name,
          product_sku: i.sku ?? null,
          unit_price_cents: i.price_cents,
          quantity: i.quantity,
        }))
      );
      if (itemsErr) throw itemsErr;
      toast.success("Order placed! Thank you ☕");
      clear();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 opacity-30" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3 p-3 rounded-xl bg-secondary/40">
                  <img src={resolveImage(i.image_url)} alt={i.name} className="w-16 h-16 object-contain rounded-lg bg-background/50" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display text-primary">{i.name}</h4>
                      <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-accent">{formatPrice(i.price_cents)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQty(i.id, i.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-border grid place-items-center hover:bg-accent/10"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{i.quantity}</span>
                      <button
                        onClick={() => setQty(i.id, i.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-border grid place-items-center hover:bg-accent/10"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between font-display text-xl">
                <span>Total</span>
                <span className="text-accent">{formatPrice(totalCents)}</span>
              </div>
              <Button onClick={checkout} disabled={busy} className="w-full h-12 rounded-full uppercase tracking-wider text-sm">
                {busy ? "Placing order..." : user ? "Place Order" : "Sign in to Checkout"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
