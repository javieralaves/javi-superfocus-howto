"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

interface StageState {
  /** True once the illustration has scrolled into view. */
  play: boolean;
  /** Skip choreography and render the settled state. */
  still: boolean;
}

const StageContext = createContext<StageState>({ play: true, still: false });

export function useStage() {
  return useContext(StageContext);
}

/**
 * Renders children at a fixed design size and scales them to the available
 * width, so every illustration stays pixel-consistent across breakpoints.
 */
export function Stage({
  width,
  height,
  label,
  name = "Illustration",
  className,
  children,
  amount = 0.35,
  fit = "width",
}: {
  width: number;
  height: number;
  label: string;
  /** Short name shown on the ?figma=1 placeholder. */
  name?: string;
  className?: string;
  children: ReactNode;
  amount?: number;
  /** "contain" fills the parent and fits the scene inside it, centred. */
  fit?: "width" | "contain";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ scale: number; x: number; y: number } | null>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduceMotion = useReducedMotion() ?? false;
  const scale = box?.scale ?? null;

  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      const w = node.clientWidth;
      if (fit === "width") return setBox({ scale: w / width, x: 0, y: 0 });
      const h = node.clientHeight;
      const s = Math.min(w / width, h / height);
      setBox({ scale: s, x: (w - width * s) / 2, y: (h - height * s) / 2 });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [width, height, fit]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      data-stage=""
      className={cn("relative w-full select-none", fit === "contain" && "h-full", className)}
      style={fit === "width" ? { aspectRatio: `${width} / ${height}` } : undefined}
    >
      <span className="sf-placeholder" aria-hidden="true">
        {name}
        <span className="sf-placeholder-size">
          {width} × {height}
        </span>
      </span>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width,
          height,
          transform: `translate(${box?.x ?? 0}px, ${box?.y ?? 0}px) scale(${scale ?? 1})`,
          visibility: scale === null ? "hidden" : undefined,
        }}
      >
        <StageContext.Provider
          value={{ play: inView || reduceMotion, still: reduceMotion }}
        >
          {children}
        </StageContext.Provider>
      </div>
    </div>
  );
}

/** Fades and lifts its children in once the stage starts playing. */
export function Rise({
  delay = 0,
  y = 14,
  scale = 1,
  duration = 0.6,
  className,
  style,
  children,
}: {
  delay?: number;
  y?: number;
  scale?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { play, still } = useStage();
  return (
    <motion.div
      className={className}
      style={style}
      initial={still ? false : { opacity: 0, y, scale }}
      animate={play ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={still ? { duration: 0 } : { duration, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Fires `true` after `delayMs` once the stage is playing. */
export function useCue(delayMs: number) {
  const { play, still } = useStage();
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    if (!play || still) return;
    const timeout = window.setTimeout(() => setElapsed(true), delayMs);
    return () => window.clearTimeout(timeout);
  }, [play, still, delayMs]);
  return play && (still || elapsed);
}
