import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import beansBg from "@/assets/beans-bg.jpg";
import iconStar from "@/assets/icon-star.png";
import { FlyingIngredients } from "@/components/FlyingIngredients";

const stats = [
  { value: 150000, suffix: "+", label: "Happy Customers" },
  { value: 20, suffix: "+", label: "Signature Flavors" },
  { value: 5, suffix: "", label: "Average Rating", iconAfter: iconStar },
];

const Counter = ({ to, suffix, iconAfter }: { to: number; suffix: string; iconAfter?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="font-display text-6xl md:text-8xl text-cream tabular-nums inline-flex items-center gap-3 justify-center">
      {n.toLocaleString()}
      {suffix && <span className="text-accent">{suffix}</span>}
      {iconAfter && (
        <img src={iconAfter} alt="" loading="lazy" width={72} height={72} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
      )}
    </span>
  );
};

export const Stats = () => (
  <section className="relative py-32 overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${beansBg})` }}
    />
    <div className="absolute inset-0 bg-espresso/85" />
    <FlyingIngredients preset="warm" />

    <div className="container relative z-10 grid md:grid-cols-3 gap-12 md:gap-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.7 }}
          className="text-center md:border-r md:last:border-r-0 border-cream/15"
        >
          <Counter to={s.value} suffix={s.suffix} iconAfter={(s as any).iconAfter} />
          <p className="mt-4 text-cream/70 uppercase tracking-[0.3em] text-xs">{s.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);
