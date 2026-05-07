import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import beanImg from "@/assets/coffee-bean.png";

/**
 * Cinematic intro:
 * Stage 0 — bean appears, slowly rotates + scales up
 * Stage 1 — subtle shake / tension build
 * Stage 2 — bean cracks open vertically, warm glow appears in the crack
 * Stage 3 — glow bursts outward, "opening" the page
 * Stage 4 — overlay fades out, revealing the site
 */
export const BeanIntro = ({ onDone }: { onDone: () => void }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1600); // shake after slow rotate/scale
    const t2 = setTimeout(() => setStage(2), 2300); // crack open
    const t3 = setTimeout(() => setStage(3), 3100); // burst
    const t4 = setTimeout(() => setStage(4), 3900); // reveal
    const t5 = setTimeout(() => onDone(), 4600);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(22 45% 14%) 0%, hsl(22 55% 7%) 55%, hsl(22 60% 4%) 100%)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,hsl(22_60%_3%)_90%)]" />

          {/* Expanding warm burst that "opens" the page */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 220,
              height: 220,
              background:
                "radial-gradient(circle, hsl(34 85% 68% / 0.95), hsl(28 75% 52% / 0.6) 40%, hsl(22 50% 6% / 0) 70%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: stage >= 3 ? 28 : stage >= 2 ? 1.6 : 0,
              opacity: stage >= 3 ? 1 : stage >= 2 ? 0.9 : 0,
            }}
            transition={{ duration: stage >= 3 ? 1 : 0.5, ease: "easeOut" }}
          />

          {/* Bean container — slow rotate + scale up during stage 0/1 */}
          <motion.div
            className="relative w-[260px] h-[260px] md:w-[420px] md:h-[420px]"
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{
              scale: stage >= 2 ? 1.1 : stage >= 1 ? 1.05 : 1,
              rotate: stage >= 1 ? 0 : 12,
              opacity: 1,
            }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left half */}
            <motion.div
              className="absolute inset-0"
              animate={
                stage === 1
                  ? { x: [-2, 2, -2, 2, 0], rotate: [-1, 1, -1, 1, 0] }
                  : {}
              }
              transition={{ duration: 0.5, repeat: stage === 1 ? Infinity : 0 }}
            >
              <motion.img
                src={beanImg}
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
                style={{ clipPath: "inset(0 50% 0 0)" }}
                initial={{ x: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: stage >= 2 ? -130 : 0,
                  rotate: stage >= 2 ? -24 : 0,
                  opacity: stage >= 3 ? 0 : 1,
                }}
                transition={{ duration: 0.95, ease: [0.7, 0, 0.3, 1] }}
              />
            </motion.div>

            {/* Right half */}
            <motion.div
              className="absolute inset-0"
              animate={
                stage === 1
                  ? { x: [2, -2, 2, -2, 0], rotate: [1, -1, 1, -1, 0] }
                  : {}
              }
              transition={{ duration: 0.5, repeat: stage === 1 ? Infinity : 0 }}
            >
              <motion.img
                src={beanImg}
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
                style={{ clipPath: "inset(0 0 0 50%)" }}
                initial={{ x: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: stage >= 2 ? 130 : 0,
                  rotate: stage >= 2 ? 24 : 0,
                  opacity: stage >= 3 ? 0 : 1,
                }}
                transition={{ duration: 0.95, ease: [0.7, 0, 0.3, 1] }}
              />
            </motion.div>

            {/* Inner crack glow */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold blur-2xl"
              style={{ width: "55%", height: "55%" }}
              initial={{ opacity: 0, scaleY: 0.15 }}
              animate={{
                opacity: stage >= 1 ? 1 : 0,
                scaleY: stage >= 2 ? 1.5 : stage >= 1 ? 1 : 0.2,
              }}
              transition={{ duration: 0.7 }}
            />
          </motion.div>

          {/* Caption */}
          <motion.p
            className="absolute bottom-14 text-cream/80 text-xs md:text-sm tracking-[0.4em] uppercase font-medium"
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{
              opacity: stage <= 1 ? 1 : 0,
              letterSpacing: "0.4em",
            }}
            transition={{ duration: 0.8 }}
          >
            Lounge Coffee
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
