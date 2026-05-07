import { motion } from "framer-motion";
import yellow from "@/assets/lounge-yellow.png";
import red from "@/assets/lounge-red.png";
import black from "@/assets/lounge-black.png";
import orange from "@/assets/lounge-orange.png";
import iconCup from "@/assets/icon-cup.png";
import { SiteHeader } from "@/components/SiteHeader";

const cups = [
  { src: red, delay: 0.0, y: 20, rotate: -6, scale: 0.85, z: 1 },
  { src: yellow, delay: 0.15, y: -10, rotate: 4, scale: 1.05, z: 3 },
  { src: black, delay: 0.3, y: 0, rotate: -3, scale: 0.95, z: 2 },
  { src: orange, delay: 0.45, y: 30, rotate: 6, scale: 0.9, z: 1 },
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      <SiteHeader />

      {/* Main hero */}
      <div className="relative flex-1 grid lg:grid-cols-[1fr_2fr] gap-8 items-center container pb-20">
        {/* Left copy */}
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="font-display text-5xl md:text-6xl text-primary leading-[1.05] text-balance mb-6"
          >
            Rich & Aromatic<br />Lounge Coffee
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="text-muted-foreground max-w-md mb-8 leading-relaxed"
          >
            Premium single-origin beans, slow-crafted in small batches. A cinematic experience in every sip.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="px-8 py-3 rounded-full bg-accent text-accent-foreground font-medium tracking-wider uppercase text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-warm"
          >
            Shop Now
          </motion.button>
        </div>

        {/* Right: row of cups */}
        <div className="relative h-[420px] md:h-[560px]">
          {/* Glow */}
          <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />

          <div className="relative h-full flex items-end justify-center gap-2 md:gap-4">
            {cups.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 200, rotate: c.rotate * 3, scale: c.scale * 0.5 }}
                animate={{ opacity: 1, y: c.y, rotate: c.rotate, scale: c.scale }}
                transition={{
                  delay: 0.4 + c.delay,
                  duration: 1,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                style={{ zIndex: c.z }}
                className="relative h-full flex items-end"
              >
                <motion.img
                  src={c.src}
                  alt=""
                  width={768}
                  height={1024}
                  className="h-[85%] md:h-full w-auto object-contain drop-shadow-2xl"
                  animate={{ y: [0, -16, 0] }}
                  transition={{
                    duration: 4 + i * 0.4,
                    delay: 1 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Stat chips */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
            className="absolute top-2 right-0 flex gap-6 text-right"
          >
            {[
              { v: "20+", l: "Flavors" },
              { v: "15K+", l: "Reviews" },
              { v: "70+", l: "Variations" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl text-primary">{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
