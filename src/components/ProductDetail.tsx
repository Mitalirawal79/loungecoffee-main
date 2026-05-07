import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart } from "lucide-react";
import { formatPrice, resolveImage, type DbProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

export const ProductDetail = ({ product, onClose }: { product: DbProduct | null; onClose: () => void }) => {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wishKey = product ? `featured:${product.id}` : "";
  const wished = product ? has(wishKey) : false;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-espresso/80 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-10 w-full max-w-5xl bg-card rounded-3xl overflow-hidden shadow-warm grid md:grid-cols-2"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={() =>
                product &&
                toggle({
                  product_key: wishKey,
                  product_name: product.name,
                  product_price: formatPrice(product.price_cents),
                  product_image: resolveImage(product.image_url),
                  category_slug: null,
                })
              }
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wished}
              className="absolute top-5 left-5 z-20 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Heart className={`w-5 h-5 transition-colors ${wished ? "fill-red-500 text-red-500" : "text-primary"}`} />
            </button>

            <div className="relative bg-gradient-warm flex items-center justify-center p-10 min-h-[320px] md:min-h-[520px]">
              <div className="absolute inset-0 bg-gradient-glow opacity-60" />
              <motion.img
                key={product.id}
                src={resolveImage(product.image_url)}
                alt={product.name}
                width={768}
                height={768}
                initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative max-w-[80%] max-h-[420px] object-contain drop-shadow-2xl"
              />
            </div>

            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="p-8 md:p-12 flex flex-col justify-center"
            >
              <p className="text-accent uppercase tracking-[0.3em] text-xs mb-3">{product.flavor}</p>
              <h2 className="font-display text-4xl md:text-5xl text-primary mb-4">{product.name}</h2>
              <p className="text-muted-foreground italic mb-6">{product.notes}</p>

              <div className="space-y-3 border-y border-border py-5 mb-6">
                <Row label="Origin" value={product.origin || "—"} />
                <Row label="Roast" value={product.roast || "—"} />
                <Row label="Ingredients" value={(product.ingredients || []).join(" · ")} />
              </div>

              <div className="flex items-center justify-between gap-6">
                <span className="font-display text-4xl text-primary">{formatPrice(product.price_cents)}</span>
                <button
                  onClick={() => {
                    add({ id: product.id, name: product.name, price_cents: product.price_cents, image_url: product.image_url, sku: product.sku });
                    onClose();
                  }}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-muted-foreground uppercase tracking-wider text-xs">{label}</span>
    <span className="text-primary text-right">{value}</span>
  </div>
);
