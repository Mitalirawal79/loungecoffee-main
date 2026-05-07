import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import bean from "@/assets/coffee-bean.png";
import cup from "@/assets/lounge-black.png";
import cinnamon from "@/assets/ingredient-cinnamon.png";
import vanilla from "@/assets/ingredient-vanilla.png";
import leaf from "@/assets/ingredient-leaf.png";
import cocoa from "@/assets/ingredient-cocoa.png";

/**
 * Editorial showcase — "The Art of the Roast"
 * Premium magazine-style split layout with multi-layer parallax ingredients.
 */

type Floater = {
  src: string;
  x: string;
  y: string;
  size: number;
  depth: number; // 0..1, larger = moves more
  rotate: number;
  driftDur: number;
  driftDelay: number;
  blur?: number;
  opacity?: number;
};

const floaters: Floater[] = [
  // Coffee beans — multiple depths
  { src: bean, x: "6%", y: "12%", size: 56, depth: 0.9, rotate: -18, driftDur: 9, driftDelay: 0, opacity: 0.85 },
  { src: bean, x: "14%", y: "78%", size: 38, depth: 0.5, rotate: 24, driftDur: 11, driftDelay: 0.6, opacity: 0.7 },
  { src: bean, x: "88%", y: "20%", size: 48, depth: 0.8, rotate: 12, driftDur: 10, driftDelay: 0.4, opacity: 0.85 },
  { src: bean, x: "92%", y: "70%", size: 34, depth: 0.4, rotate: -28, driftDur: 12, driftDelay: 0.9, opacity: 0.65 },
  { src: bean, x: "48%", y: "94%", size: 30, depth: 0.3, rotate: 8, driftDur: 13, driftDelay: 1.2, opacity: 0.55, blur: 1 },
  // Cinnamon
  { src: cinnamon, x: "3%", y: "55%", size: 110, depth: 0.7, rotate: -32, driftDur: 14, driftDelay: 0.2, opacity: 0.9 },
  { src: cinnamon, x: "82%", y: "88%", size: 90, depth: 0.6, rotate: 42, driftDur: 16, driftDelay: 1, opacity: 0.8 },
  // Vanilla pods
  { src: vanilla, x: "78%", y: "5%", size: 130, depth: 0.85, rotate: 28, driftDur: 15, driftDelay: 0.5, opacity: 0.75 },
  { src: vanilla, x: "10%", y: "30%", size: 100, depth: 0.55, rotate: -48, driftDur: 17, driftDelay: 1.4, opacity: 0.6 },
  // Coffee leaves
  { src: leaf, x: "70%", y: "60%", size: 120, depth: 0.5, rotate: 18, driftDur: 13, driftDelay: 0.3, opacity: 0.55 },
  { src: leaf, x: "20%", y: "5%", size: 95, depth: 0.4, rotate: -22, driftDur: 15, driftDelay: 0.8, opacity: 0.5, blur: 1 },
  // Cocoa fragments
  { src: cocoa, x: "30%", y: "85%", size: 60, depth: 0.7, rotate: 14, driftDur: 11, driftDelay: 0.7, opacity: 0.85 },
  { src: cocoa, x: "60%", y: "8%", size: 50, depth: 0.6, rotate: -22, driftDur: 12, driftDelay: 0.2, opacity: 0.75 },
];

const FloatingItem = ({ f, scrollYProgress }: { f: Floater; scrollYProgress: MotionValue<number> }) => {
  // Parallax: depth controls translation range
  const range = 220 * f.depth;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const x = useTransform(scrollYProgress, [0, 1], [range * 0.25, -range * 0.25]);
  const rot = useTransform(scrollYProgress, [0, 1], [f.rotate - 12, f.rotate + 12]);

  return (
    <motion.div
      className="absolute pointer-events-none will-change-transform"
      style={{
        left: f.x,
        top: f.y,
        width: f.size,
        height: f.size,
        x,
        y,
        rotate: rot,
        opacity: f.opacity ?? 0.8,
        filter: f.blur ? `blur(${f.blur}px)` : undefined,
      }}
      initial={{ scale: 0.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: f.opacity ?? 0.8 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: f.driftDelay * 0.2 }}
    >
      <motion.img
        src={f.src}
        alt=""
        aria-hidden
        loading="lazy"
        width={f.size}
        height={f.size}
        className="w-full h-full object-contain drop-shadow-[0_12px_28px_rgba(60,30,10,0.25)]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: f.driftDur, repeat: Infinity, ease: "easeInOut", delay: f.driftDelay }}
      />
    </motion.div>
  );
};

export const BigNumber = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Cup motion
  const cupY = useTransform(scrollYProgress, [0, 1], [60, -80]);
  const cupScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.04, 0.98]);
  const cupRotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  // Steam fade in/out with scroll
  const steamOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.85], [0, 1, 0.6]);

  // Background "01 / The Roast" big numeral parallax
  const numeralY = useTransform(scrollYProgress, [0, 1], [60, -120]);
  const numeralOpacity = useTransform(scrollYProgress, [0.05, 0.4], [0, 0.08]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, hsl(32 50% 92%) 0%, hsl(30 45% 88%) 50%, hsl(28 40% 84%) 100%)",
      }}
      aria-labelledby="editorial-heading"
    >
      {/* Soft warm light wells */}
      <div
        className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(34 55% 70% / 0.55), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -right-32 w-[560px] h-[560px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(28 45% 60% / 0.4), transparent 70%)" }}
      />

      {/* Giant editorial numeral in background */}
      <motion.span
        aria-hidden
        style={{ y: numeralY, opacity: numeralOpacity }}
        className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold text-primary text-[28rem] md:text-[40rem] leading-none tracking-tighter"
      >
        01
      </motion.span>

      {/* Parallax floating ingredients */}
      <div className="absolute inset-0 pointer-events-none">
        {floaters.map((f, i) => (
          <FloatingItem key={i} f={f} scrollYProgress={scrollYProgress} />
        ))}
      </div>

      <div className="container relative z-10">
        {/* Editorial card container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-cream/60 backdrop-blur-md shadow-warm"
          style={{
            background:
              "linear-gradient(135deg, hsl(32 55% 95% / 0.85), hsl(30 45% 88% / 0.7))",
          }}
        >
          {/* subtle grain via gradient */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, hsl(22 40% 8%) 1px, transparent 1px), radial-gradient(circle at 70% 60%, hsl(22 40% 8%) 1px, transparent 1px)",
              backgroundSize: "32px 32px, 28px 28px",
            }}
          />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 px-6 md:px-12 lg:px-16 py-14 md:py-20 items-center">
            {/* LEFT — Editorial text */}
            <div className="lg:col-span-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="h-px w-10 bg-primary/40" />
                <p className="uppercase tracking-[0.4em] text-[0.65rem] text-primary/70">
                  Chapter 01 — The Craft
                </p>
              </motion.div>

              <motion.h2
                id="editorial-heading"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="font-display text-primary text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance"
              >
                Slow roasted.
                <br />
                <em className="font-normal italic text-accent">Carefully composed.</em>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8 text-primary/75 text-lg md:text-xl leading-relaxed max-w-xl"
              >
                Every cup begins as a quiet ritual — single-origin beans,
                hand-selected spices, and patience measured in mornings.
                A composition of warmth you can taste.
              </motion.p>

              {/* Meta details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="mt-12 grid grid-cols-3 gap-6 max-w-md"
              >
                {[
                  { k: "Origin", v: "Ethiopia" },
                  { k: "Roast", v: "Medium" },
                  { k: "Notes", v: "Cocoa · Vanilla" },
                ].map((d) => (
                  <div key={d.k}>
                    <p className="text-[0.6rem] uppercase tracking-[0.3em] text-accent mb-2">
                      {d.k}
                    </p>
                    <p className="font-display text-primary text-base md:text-lg leading-snug">
                      {d.v}
                    </p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-12 flex items-center gap-4"
              >
                <span className="h-px flex-1 max-w-[120px] bg-primary/30" />
                <p className="font-display italic text-primary/60 text-sm">
                  Est. since the first sunrise
                </p>
              </motion.div>
            </div>

            {/* RIGHT — Cup stage */}
            <div className="lg:col-span-6 relative h-[440px] md:h-[560px] flex items-center justify-center">
              {/* warm halo */}
              <div
                className="absolute w-[360px] h-[360px] rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, hsl(34 60% 65% / 0.55), transparent 70%)",
                }}
              />

              {/* Steam */}
              <motion.div
                style={{ opacity: steamOpacity }}
                className="absolute left-1/2 -translate-x-1/2 top-2 w-44 h-44 pointer-events-none"
                aria-hidden
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="absolute bottom-0 w-6 h-6 rounded-full bg-primary/15 blur-md animate-steam"
                    style={{
                      animationDelay: `${i * 0.7}s`,
                      left: `${30 + i * 12}%`,
                    }}
                  />
                ))}
              </motion.div>

              {/* Cup */}
              <motion.div
                style={{ y: cupY, scale: cupScale, rotate: cupRotate }}
                className="relative z-10"
              >
                <motion.img
                  src={cup}
                  alt="Lounge premium signature coffee cup"
                  width={768}
                  height={1024}
                  className="h-[400px] md:h-[520px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(60,30,10,0.35)]"
                  animate={{
                    y: [0, -16, 0, -8, 0],
                    rotate: [-2, 2, -1.5, 1.5, -2],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                />
              </motion.div>

              {/* Floor reflection */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[260px] h-6 rounded-full blur-xl"
                style={{ background: "hsl(22 40% 8% / 0.25)" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
