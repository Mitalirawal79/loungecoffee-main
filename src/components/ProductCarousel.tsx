import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useProducts, formatPrice, resolveImage, type DbProduct } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";

export const ProductCarousel = ({ onSelect }: { onSelect: (p: DbProduct) => void }) => {
  const { products, loading } = useProducts();
  const { has, toggle } = useWishlist();
  const loop = [...products, ...products];

  return (
    <section id="collection" className="relative py-28 bg-background overflow-hidden">
      <div className="container mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent uppercase tracking-[0.4em] text-xs mb-4"
        >
          Our Collection
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-7xl text-primary text-balance"
        >
          Crafted for the Senses
        </motion.h2>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Brewing the menu...</p>
      ) : (
        <div className="relative marquee-pause">
          <div className="flex w-max animate-marquee gap-10 px-6">
            {loop.map((p, i) => {
              const key = `featured:${p.id}`;
              const active = has(key);
              return (
                <div key={`${p.id}-${i}`} className="group relative w-[280px] md:w-[340px] shrink-0 text-left">
                  <button onClick={() => onSelect(p)} className="block w-full text-left">
                    <div className="relative aspect-square rounded-2xl bg-secondary overflow-hidden shadow-warm">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={resolveImage(p.image_url)}
                        alt={p.name}
                        loading="lazy"
                        width={768}
                        height={768}
                        className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
                      />
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-2xl text-primary">{p.name}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{p.flavor}</p>
                      </div>
                      <span className="text-accent font-semibold">{formatPrice(p.price_cents)}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle({
                        product_key: key,
                        product_name: p.name,
                        product_price: formatPrice(p.price_cents),
                        product_image: resolveImage(p.image_url),
                        category_slug: null,
                      });
                    }}
                    aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={active}
                    className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-background/85 backdrop-blur-sm shadow-warm hover:bg-background transition-all duration-300 hover:scale-110"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${active ? "fill-red-500 text-red-500" : "text-primary"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mt-12">
        Hover to pause · Click to explore
      </p>
    </section>
  );
};
