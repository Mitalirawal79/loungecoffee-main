import { motion } from "framer-motion";
import { products } from "@/data/products";
import { FlyingIngredients } from "@/components/FlyingIngredients";
import iconGlobe from "@/assets/icon-globe.png";
import iconFire from "@/assets/icon-fire.png";
import iconChocolate from "@/assets/icon-chocolate.png";

export const Story = () => {
  const featured = products.slice(0, 3);
  return (
    <section id="about" className="relative py-28 bg-background overflow-hidden">
      <FlyingIngredients preset="light" />
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <p className="text-accent uppercase tracking-[0.4em] text-xs mb-4">Our Story</p>
          <h2 className="font-display text-5xl md:text-7xl text-primary text-balance">
            Beans with a Journey
          </h2>
        </div>

        <div className="space-y-28">
          {featured.map((p, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={p.id}
                className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: reverse ? 80 : -80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <p className="text-accent uppercase tracking-[0.3em] text-xs mb-4">
                    Chapter {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-4xl md:text-5xl text-primary mb-6">
                    {p.name}
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <Detail icon={iconGlobe} label="Origin" value={p.origin} />
                    <Detail icon={iconFire} label="Roast" value={p.roast} />
                    <Detail icon={iconChocolate} label="Taste Notes" value={p.notes} />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: reverse ? -80 : 80, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                  <div className="relative aspect-square bg-secondary rounded-3xl overflow-hidden shadow-warm">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={768}
                      height={768}
                      className="w-full h-full object-contain p-10"
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Detail = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex items-start gap-4">
    <img src={icon} alt="" loading="lazy" width={40} height={40} className="w-9 h-9 object-contain shrink-0" />
    <div>
      <p className="text-xs uppercase tracking-widest text-accent mb-1">{label}</p>
      <p className="text-primary text-lg leading-snug">{value}</p>
    </div>
  </div>
);
