import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { searchProducts } from "@/lib/searchProducts";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "";
  const [query, setQuery] = useState(initial);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    setQuery(initial);
  }, [initial]);

  const results = useMemo(() => searchProducts(query), [query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(query ? { q: query } : {});
  };

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container py-12 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/70 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-accent uppercase tracking-[0.4em] text-xs mb-4">Search</p>
          <h1 className="font-display text-4xl md:text-5xl text-primary leading-tight">
            Find your perfect cup
          </h1>
          <p className="mt-3 text-muted-foreground">
            Search across Bestseller, Drinks, Espresso, Merchandise, and Coffee At Home.
          </p>

          <form onSubmit={onSubmit} className="mt-8 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={18} />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setParams(e.target.value ? { q: e.target.value } : {});
              }}
              placeholder="Try ‘latte’, ‘arabica’, ‘mug’…"
              className="w-full h-14 pl-12 pr-4 rounded-full bg-cream/60 border border-primary/15 text-primary placeholder:text-muted-foreground/70 outline-none focus:border-accent/60 focus:shadow-[0_0_24px_-4px_hsl(var(--accent)/0.5)] transition-all"
            />
          </form>
        </motion.div>

        <div className="mt-12">
          {!query.trim() ? (
            <p className="text-muted-foreground text-sm">Start typing to see results.</p>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground">No products match “{query}”.</p>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-primary/60 mb-6">
                {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence>
                  {results.map((item, i) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                    >
                      <Link to={`/category/${item.categorySlug}`} className="group block">
                        <div className="relative aspect-square rounded-2xl bg-secondary overflow-hidden shadow-warm">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] bg-cream/90 text-primary px-2 py-1 rounded-full">
                            {item.categoryLabel}
                          </span>
                        </div>
                        <div className="mt-4 flex items-end justify-between gap-3">
                          <div>
                            <h3 className="font-display text-lg text-primary leading-tight">
                              {item.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                          <span className="text-accent font-semibold shrink-0">{item.price}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Search;
