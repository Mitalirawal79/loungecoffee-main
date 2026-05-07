import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";
import { FlyingIngredients } from "@/components/FlyingIngredients";

/**
 * Explore Categories — premium circular category showcase.
 * Each item navigates to a dedicated category page with related items.
 */


export const SecretSauce = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 md:py-32 bg-secondary overflow-hidden">
      <FlyingIngredients preset="light" />
      {/* Ambient warm wells */}
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-primary/40" />
            <p className="uppercase tracking-[0.4em] text-[0.65rem] text-primary/70">
              Explore the Lounge
            </p>
            <span className="h-px w-10 bg-primary/40" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-primary leading-tight">
            Curated <em className="italic font-normal text-accent">collections</em>
            <br />
            for every craving.
          </h2>
        </motion.div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
          {categories.map((c, i) => (
            <motion.button
              key={c.label}
              type="button"
              onClick={() => navigate(`/category/${c.slug}`)}
              aria-label={`Explore ${c.label}`}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.12,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              whileHover={{ y: -8 }}
              className="group flex flex-col items-center text-center focus:outline-none"
            >
              {/* Floating circular image */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
                className="relative"
              >
                {/* Glow ring */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background:
                      "radial-gradient(circle, hsl(34 60% 65% / 0.7), transparent 70%)",
                    transform: "scale(1.3)",
                  }}
                />

                {/* Rotating dashed ring */}
                <motion.div
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-3 rounded-full border border-dashed border-primary/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Image */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-1 ring-primary/10 shadow-warm transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={c.hero}
                    alt={c.label}
                    width={512}
                    height={512}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  {/* Shimmer */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 30%, hsl(40 60% 95% / 0.45) 50%, transparent 70%)",
                    }}
                  />
                  {/* Inner warm gradient */}
                  <div
                    aria-hidden
                    className="absolute inset-0 mix-blend-overlay opacity-60"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, hsl(40 60% 80% / 0.4), transparent 60%)",
                    }}
                  />
                </div>
              </motion.div>

              {/* Label */}
              <div className="mt-6">
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-accent/80 mb-1.5">
                  {c.tag}
                </p>
                <h3 className="font-display text-primary text-lg md:text-xl relative inline-block">
                  {c.label}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-px w-0 bg-primary/60 transition-all duration-500 group-hover:w-full" />
                </h3>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer caption */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em] text-primary/60"
        >
          <span className="h-px w-16 bg-primary/30" />
          Crafted with care · Served with soul
          <span className="h-px w-16 bg-primary/30" />
        </motion.div>
      </div>

      {/* Word marquee below */}
      <div className="mt-20 overflow-hidden border-y border-primary/10 py-6">
        <div className="flex w-max animate-marquee gap-12 font-display text-3xl md:text-5xl text-primary/80 italic whitespace-nowrap">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Premium Beans", "★", "Freshly Ground", "★", "Small Batch", "★", "Slow Roasted", "★"].map((w, i) => (
              <span key={`${k}-${i}`}>{w}</span>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
