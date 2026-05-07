import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import bean from "@/assets/coffee-bean.png";
import cinnamon from "@/assets/ingredient-cinnamon.png";
import vanilla from "@/assets/ingredient-vanilla.png";
import leaf from "@/assets/ingredient-leaf.png";
import cocoa from "@/assets/ingredient-cocoa.png";

/**
 * Scroll-triggered flying ingredients overlay.
 * Drop inside any `relative` section to add GSAP-style parallax fly-ins.
 * Pure overlay — does not affect layout.
 */

type Item = {
  src: string;
  size: number;
  /** start position (% of section) */
  startX: string;
  startY: string;
  /** travel distances in px across scroll */
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  rotateFrom: number;
  rotateTo: number;
  opacity?: number;
  blur?: number;
  driftDur?: number;
  driftDelay?: number;
};

const PRESETS: Record<string, Item[]> = {
  // beans flying across, cinnamon drifting in
  warm: [
    { src: bean, size: 44, startX: "-4%", startY: "20%", fromX: -200, fromY: -80, toX: 220, toY: 60, rotateFrom: -120, rotateTo: 180, opacity: 0.85 },
    { src: bean, size: 30, startX: "92%", startY: "70%", fromX: 240, fromY: 120, toX: -260, toY: -80, rotateFrom: 90, rotateTo: -180, opacity: 0.7 },
    { src: bean, size: 36, startX: "60%", startY: "8%", fromX: 80, fromY: -160, toX: -120, toY: 220, rotateFrom: -45, rotateTo: 220, opacity: 0.8, blur: 0.5 },
    { src: cinnamon, size: 110, startX: "-2%", startY: "62%", fromX: -260, fromY: 100, toX: 180, toY: -140, rotateFrom: -60, rotateTo: 40, opacity: 0.85 },
    { src: vanilla, size: 130, startX: "82%", startY: "10%", fromX: 240, fromY: -120, toX: -180, toY: 160, rotateFrom: 30, rotateTo: -50, opacity: 0.75 },
    { src: leaf, size: 100, startX: "12%", startY: "82%", fromX: -180, fromY: 160, toX: 140, toY: -120, rotateFrom: -40, rotateTo: 60, opacity: 0.55, blur: 1 },
    { src: cocoa, size: 56, startX: "70%", startY: "55%", fromX: 200, fromY: 80, toX: -200, toY: -60, rotateFrom: 30, rotateTo: -90, opacity: 0.8 },
  ],
  // lighter set
  light: [
    { src: bean, size: 32, startX: "8%", startY: "30%", fromX: -160, fromY: -60, toX: 180, toY: 80, rotateFrom: -60, rotateTo: 120, opacity: 0.7 },
    { src: bean, size: 28, startX: "88%", startY: "78%", fromX: 200, fromY: 80, toX: -200, toY: -80, rotateFrom: 60, rotateTo: -120, opacity: 0.6 },
    { src: leaf, size: 90, startX: "75%", startY: "20%", fromX: 180, fromY: -100, toX: -140, toY: 140, rotateFrom: 20, rotateTo: -40, opacity: 0.5, blur: 1 },
    { src: cinnamon, size: 80, startX: "5%", startY: "70%", fromX: -180, fromY: 80, toX: 140, toY: -100, rotateFrom: -30, rotateTo: 30, opacity: 0.7 },
    { src: cocoa, size: 44, startX: "50%", startY: "92%", fromX: 60, fromY: 140, toX: -80, toY: -160, rotateFrom: 0, rotateTo: 90, opacity: 0.7 },
  ],
};

const Floater = ({
  item,
  scrollYProgress,
}: {
  item: Item;
  scrollYProgress: MotionValue<number>;
}) => {
  const x = useTransform(scrollYProgress, [0, 1], [item.fromX, item.toX]);
  const y = useTransform(scrollYProgress, [0, 1], [item.fromY, item.toY]);
  const rotate = useTransform(scrollYProgress, [0, 1], [item.rotateFrom, item.rotateTo]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, item.opacity ?? 0.8, item.opacity ?? 0.8, 0]
  );

  const style: CSSProperties = {
    left: item.startX,
    top: item.startY,
    width: item.size,
    height: item.size,
    filter: item.blur ? `blur(${item.blur}px)` : undefined,
  };

  return (
    <motion.div
      className="absolute pointer-events-none will-change-transform"
      style={{ ...style, x, y, rotate, opacity }}
    >
      <img
        src={item.src}
        alt=""
        aria-hidden
        loading="lazy"
        width={item.size}
        height={item.size}
        className="w-full h-full object-contain drop-shadow-[0_12px_28px_rgba(60,30,10,0.25)]"
      />
    </motion.div>
  );
};

interface Props {
  preset?: keyof typeof PRESETS;
  className?: string;
}

export const FlyingIngredients = ({ preset = "warm", className = "" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const items = PRESETS[preset];

  return (
    <div
      ref={ref}
      aria-hidden
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    >
      {items.map((it, i) => (
        <Floater key={i} item={it} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
};
