"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Ring = "season" | "week" | "day" | "coach";

const RINGS: Array<{ id: Exclude<Ring, "coach">; label: string; r: number; seconds: number }> = [
  { id: "season", label: "SEASON", r: 128, seconds: 48 },
  { id: "week", label: "WEEK", r: 92, seconds: 20 },
  { id: "day", label: "DAY", r: 56, seconds: 7 },
];

const ORDER: Array<Ring> = ["season", "week", "day", "coach"];
const C = 140;
const ACCENT = "var(--color-accent)";
const INK = "var(--color-ink)";

export function RhythmLoop({ items }: { items: Array<{ label: string; text: string }> }) {
  const reduce = useReducedMotion() ?? false;
  const [auto, setAuto] = useState(0);
  const [hovered, setHovered] = useState<Ring | null>(null);
  const active = hovered ?? ORDER[auto];

  useEffect(() => {
    if (hovered || reduce) return;
    const t = window.setInterval(() => setAuto((i) => (i + 1) % ORDER.length), 2800);
    return () => window.clearInterval(t);
  }, [hovered, reduce]);

  return (
    <div className="grid items-center gap-8 rounded-[30px] border border-rule bg-white/55 p-6 sm:grid-cols-[minmax(0,260px)_1fr] sm:p-8">
      <svg viewBox="0 0 280 280" className="mx-auto w-full max-w-[260px]" aria-hidden>
        {RINGS.map((ring) => {
          const on = active === ring.id;
          return (
            <g key={ring.id}>
              <circle
                cx={C}
                cy={C}
                r={ring.r}
                fill="none"
                stroke={on ? ACCENT : INK}
                strokeOpacity={on ? 0.9 : 0.14}
                strokeWidth={on ? 1.75 : 1}
                style={{ transition: "stroke 300ms, stroke-opacity 300ms, stroke-width 300ms" }}
              />
              <g>
                {!reduce && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${C} ${C}`}
                    to={`360 ${C} ${C}`}
                    dur={`${ring.seconds}s`}
                    repeatCount="indefinite"
                  />
                )}
                <circle
                  cx={C}
                  cy={C - ring.r}
                  r={on ? 5 : 3.5}
                  fill={on ? ACCENT : INK}
                  fillOpacity={on ? 1 : 0.35}
                  style={{ transition: "r 300ms, fill 300ms" }}
                />
              </g>
              <text
                x={C}
                y={C + ring.r - 6}
                textAnchor="middle"
                fontSize={9}
                letterSpacing={2}
                fontWeight={600}
                fill={on ? ACCENT : INK}
                fillOpacity={on ? 1 : 0.4}
                style={{ fontFamily: "var(--font-dm-sans)", transition: "fill 300ms" }}
              >
                {ring.label}
              </text>
            </g>
          );
        })}

        {!reduce &&
          [0, 1].map((i) => (
            <motion.circle
              key={i}
              cx={C}
              cy={C}
              fill="none"
              stroke={ACCENT}
              strokeWidth={1}
              initial={{ r: 20, opacity: 0 }}
              animate={{ r: [20, 128], opacity: [active === "coach" ? 0.7 : 0.3, 0] }}
              transition={{ duration: 3.2, ease: "easeOut", repeat: Infinity, delay: i * 1.6 }}
            />
          ))}

        <circle
          cx={C}
          cy={C}
          r={20}
          fill={active === "coach" ? ACCENT : INK}
          style={{ transition: "fill 300ms" }}
        />
        <path
          transform={`translate(${C - 8} ${C - 8})`}
          fill="var(--color-paper)"
          d="M8 1.5c.2 0 .4.1.5.3l1.4 4 4 1.4c.2.1.3.3.3.5v.1c0 .2-.1.4-.3.5l-4 1.4-1.4 4c-.1.2-.3.3-.5.3s-.4-.1-.5-.3l-1.4-4-4-1.4c-.2-.1-.3-.3-.3-.5s.1-.4.3-.5l4-1.4 1.4-4c.1-.2.3-.3.5-.3Z"
        />
      </svg>

      <ol className="space-y-1">
        {items.map((item, i) => {
          const ring = ORDER[i];
          const on = active === ring;
          return (
            <li
              key={item.label}
              onMouseEnter={() => setHovered(ring)}
              onMouseLeave={() => setHovered(null)}
              className={`cursor-default rounded-xl px-4 py-3 transition-colors duration-300 ${
                on ? "bg-accent-soft/60" : ""
              }`}
            >
              <p
                className={`text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                  on ? "text-accent" : "text-faded"
                }`}
              >
                {item.label}
              </p>
              <p className="mt-1 text-[1rem] leading-relaxed text-ink/85">{item.text}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
