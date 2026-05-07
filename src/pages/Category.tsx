import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickView } from "@/components/QuickView";
import { getCategory, type CategoryItem } from "@/data/categories";
import { useWishlist } from "@/hooks/useWishlist";

const Category = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const category = getCategory(slug);
  const [selected, setSelected] = useState<CategoryItem | null>(null);
  const { has, toggle } = useWishlist();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!category) {
    return (
      <main className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container py-32 text-center">
          <h1 className="font-display text-4xl text-primary mb-4">Category not found</h1>
          <button
            onClick={() => navigate("/")}
            className="text-accent underline underline-offset-4 hover:text-primary transition-colors"
          >
            Back to home
          </button>
        </div>
      </main>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={category.slug}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="min-h-screen bg-background"
      >
        <SiteHeader />

        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-secondary overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(34 55% 70% / 0.45), transparent 70%)" }}
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(28 45% 60% / 0.35), transparent 70%)" }}
          />

          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/70 hover:text-accent transition-colors mb-10"
              >
                <ArrowLeft size={14} /> Back
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-10 bg-primary/40" />
                  <p className="uppercase tracking-[0.4em] text-[0.65rem] text-primary/70">
                    {category.tag}
                  </p>
                </div>
                <h1 className="font-display text-5xl md:text-7xl text-primary leading-tight">
                  {category.label}
                </h1>
                <p className="mt-6 text-primary/70 text-lg max-w-md leading-relaxed">
                  {category.blurb}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden ring-1 ring-primary/10 shadow-warm"
                >
                  <img
                    src={category.hero}
                    alt={category.label}
                    className="w-full h-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 mix-blend-overlay opacity-60"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, hsl(40 60% 80% / 0.4), transparent 60%)",
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Items grid */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-accent uppercase tracking-[0.4em] text-xs mb-4">The Selection</p>
              <h2 className="font-display text-4xl md:text-5xl text-primary">
                Made for {category.label.toLowerCase()}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {category.items.map((item, i) => (
                <motion.article
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                  whileHover={{ y: -6 }}
                  className="group relative"
                >
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className="relative block w-full aspect-square rounded-2xl bg-secondary overflow-hidden shadow-warm focus:outline-none focus:ring-2 focus:ring-accent"
                      aria-label={`View ${item.name}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </button>
                    {(() => {
                      const key = `${category.slug}:${item.name}`;
                      const active = has(key);
                      return (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle({
                              product_key: key,
                              product_name: item.name,
                              product_price: item.price,
                              product_image: item.image,
                              category_slug: category.slug,
                            });
                          }}
                          aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
                          aria-pressed={active}
                          className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-background/85 backdrop-blur-sm shadow-warm hover:bg-background transition-all duration-300 hover:scale-110"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              active ? "fill-red-500 text-red-500" : "text-primary"
                            }`}
                          />
                        </button>
                      );
                    })()}
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl text-primary leading-tight">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-accent font-semibold shrink-0">{item.price}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <Footer />

        <QuickView
          item={selected}
          categoryLabel={category.label}
          onClose={() => setSelected(null)}
        />
        <CartDrawer />
      </motion.main>
    </AnimatePresence>
  );
};

export default Category;
