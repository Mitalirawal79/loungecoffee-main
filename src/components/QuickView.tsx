import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { CategoryItem } from "@/data/categories";

const parseCents = (price: string) => {
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return Math.round((isNaN(n) ? 0 : n) * 100);
};

export const QuickView = ({
  item,
  categoryLabel,
  onClose,
}: {
  item: (CategoryItem & { key?: string }) | null;
  categoryLabel?: string;
  onClose: () => void;
}) => {
  const { add } = useCart();

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/70 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-10 w-full max-w-4xl bg-card rounded-3xl overflow-hidden shadow-warm grid md:grid-cols-2"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-primary" />
            </button>

            <div className="relative bg-secondary aspect-square md:aspect-auto md:min-h-[460px] overflow-hidden">
              <motion.img
                src={item.image}
                alt={item.name}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-full h-full object-cover"
              />
            </div>

            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="p-8 md:p-12 flex flex-col justify-center"
            >
              {categoryLabel && (
                <p className="text-accent uppercase tracking-[0.3em] text-xs mb-3">
                  {categoryLabel}
                </p>
              )}
              <h2 className="font-display text-4xl md:text-5xl text-primary mb-4 leading-tight">
                {item.name}
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between gap-6 border-t border-border pt-6">
                <span className="font-display text-3xl text-primary">{item.price}</span>
                <button
                  onClick={() => {
                    add({
                      id: item.key || item.name,
                      name: item.name,
                      price_cents: parseCents(item.price),
                      image_url: item.image,
                    });
                    onClose();
                  }}
                  className="flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
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
