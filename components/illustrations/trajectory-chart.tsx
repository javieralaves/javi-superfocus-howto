"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "./stage";

interface Point {
  x: number;
  y: number;
}

export interface ChartPoint extends Point {
  dot?: "small" | "large";
  hollow?: boolean;
}

export interface ChartSeries {
  id: string;
  color: string;
  points: Array<ChartPoint>;
  projection: Array<Point>;
}

/** Monotone cubic interpolation, same as compass/utils/coachReadCurve.ts. */
function tangents(points: Array<Point>) {
  const n = points.length;
  if (n < 2) return points.map(() => 0);
  const slopes: Array<number> = [];
  for (let i = 0; i < n - 1; i++) {
    const h = points[i + 1].x - points[i].x;
    slopes.push(h === 0 ? 0 : (points[i + 1].y - points[i].y) / h);
  }
  if (n === 2) return [slopes[0], slopes[0]];
  const result: Array<number> = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    const h0 = points[i].x - points[i - 1].x;
    const h1 = points[i + 1].x - points[i].x;
    const s0 = slopes[i - 1];
    const s1 = slopes[i];
    const p = (s0 * h1 + s1 * h0) / (h0 + h1);
    const sign = (v: number) => (v < 0 ? -1 : 1);
    result[i] =
      (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }
  result[0] = (3 * slopes[0] - result[1]) / 2;
  result[n - 1] = (3 * slopes[n - 2] - result[n - 2]) / 2;
  return result;
}

export function monotonePath(points: Array<Point>) {
  if (points.length === 0) return "";
  const m = tangents(points);
  const f = (v: number) => v.toFixed(2);
  let d = `M${f(points[0].x)},${f(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const h = (b.x - a.x) / 3;
    d += `C${f(a.x + h)},${f(a.y + h * m[i])},${f(b.x - h)},${f(b.y - h * m[i + 1])},${f(b.x)},${f(b.y)}`;
  }
  return d;
}

const BANDS = [
  {
    key: "on-track",
    label: "On track",
    fill: "var(--success-surface)",
    opacity: 0.6,
    labelColor: "var(--success-strong)",
    halo: "var(--success-surface)",
  },
  {
    key: "adjust",
    label: "Adjust",
    fill: "var(--warning-surface)",
    opacity: 0.45,
    labelColor: "var(--warning-strong)",
    halo: "var(--warning-surface)",
  },
  {
    key: "off-track",
    label: "Off track",
    fill: "var(--destructive)",
    opacity: 0.06,
    labelColor: "var(--destructive)",
    halo: "color-mix(in oklab, var(--destructive) 6%, var(--card))",
  },
];

export function TrajectoryChart({
  width,
  height,
  padding,
  series,
  xDomain,
  yDomain,
  bands = { major: 34, some: 67 },
  ticks = [],
  todayX = null,
  todayLabel = false,
  showBandLabels = true,
  play,
  still,
  delay = 0,
  drawSeconds = 1.1,
  highlight = null,
}: {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  series: Array<ChartSeries>;
  xDomain: [number, number];
  yDomain: [number, number];
  bands?: { major: number; some: number };
  ticks?: Array<{ x: number; label: string }>;
  todayX?: number | null;
  todayLabel?: boolean;
  showBandLabels?: boolean;
  play: boolean;
  still: boolean;
  delay?: number;
  drawSeconds?: number;
  highlight?: string | null;
}) {
  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const sx = (x: number) => padding.left + ((x - x0) / (x1 - x0)) * innerWidth;
  const sy = (y: number) => padding.top + (1 - (y - y0) / (y1 - y0)) * innerHeight;

  const bandRanges = [
    { from: bands.some, to: 100 },
    { from: bands.major, to: bands.some },
    { from: 0, to: bands.major },
  ];
  const visibleBands = BANDS.map((band, i) => ({
    ...band,
    from: Math.max(bandRanges[i].from, y0),
    to: Math.min(bandRanges[i].to, y1),
  })).filter((band) => band.to > band.from);

  const stagger = 0.14;
  const lineEnd = (i: number) => delay + i * stagger + drawSeconds;
  const instant = still ? { duration: 0 } : null;

  return (
    <svg width={width} height={height} className="block overflow-visible" aria-hidden="true">
      {visibleBands.map((band) => (
        <rect
          key={band.key}
          x={padding.left}
          width={innerWidth}
          y={sy(band.to)}
          height={sy(band.from) - sy(band.to)}
          fill={band.fill}
          fillOpacity={band.opacity}
        />
      ))}

      {todayX !== null && (
        <g>
          <line
            x1={sx(todayX)}
            x2={sx(todayX)}
            y1={padding.top}
            y2={padding.top + innerHeight}
            stroke="var(--muted-foreground)"
            strokeOpacity={0.5}
            strokeDasharray="4 4"
          />
          {todayLabel && (
            <text
              x={sx(todayX)}
              y={padding.top - 6}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="var(--muted-foreground)"
            >
              Today
            </text>
          )}
        </g>
      )}

      {series.map((s, i) => {
        const pixels = s.points.map((p) => ({ x: sx(p.x), y: sy(p.y) }));
        const projection = s.projection.map((p) => ({ x: sx(p.x), y: sy(p.y) }));
        const dimmed = highlight !== null && highlight !== s.id;
        return (
          <g
            key={s.id}
            style={{ opacity: dimmed ? 0.2 : 1, transition: "opacity 200ms var(--ease-out)" }}
          >
            <motion.path
              d={monotonePath(pixels)}
              fill="none"
              stroke={s.color}
              strokeWidth={2.25}
              strokeLinecap="round"
              initial={{ pathLength: still ? 1 : 0 }}
              animate={{ pathLength: play ? 1 : 0 }}
              transition={
                instant ?? { duration: drawSeconds, ease: EASE_OUT, delay: delay + i * stagger }
              }
            />
            {projection.length > 1 && (
              <motion.path
                fill="none"
                stroke={s.color}
                strokeOpacity={0.7}
                strokeWidth={2}
                strokeDasharray="4 4"
                strokeLinecap="round"
                initial={{ opacity: still ? 1 : 0, d: monotonePath(projection) }}
                animate={{ opacity: play ? 1 : 0, d: monotonePath(projection) }}
                transition={
                  instant ?? {
                    opacity: { duration: 0.5, ease: EASE_OUT, delay: lineEnd(i) },
                    d: { duration: 0.7, ease: EASE_OUT },
                  }
                }
              />
            )}
            {s.points.map((point, index) => {
              if (!point.dot) return null;
              const r = point.dot === "large" ? 4.5 : 3;
              const at = (index / Math.max(1, s.points.length - 1)) * drawSeconds;
              return (
                <motion.circle
                  key={index}
                  cx={pixels[index].x}
                  cy={pixels[index].y}
                  r={r}
                  fill={point.hollow ? "var(--card)" : s.color}
                  stroke={point.hollow ? s.color : "var(--card)"}
                  strokeWidth={point.hollow ? 1.75 : 2}
                  initial={{ opacity: still ? 1 : 0 }}
                  animate={{ opacity: play ? 1 : 0 }}
                  transition={instant ?? { duration: 0.2, delay: delay + i * stagger + at }}
                />
              );
            })}
          </g>
        );
      })}

      {showBandLabels &&
        visibleBands.map((band) => {
          const top = sy(band.to);
          const bandHeight = sy(band.from) - top;
          const collapsed = bandHeight < 30;
          return (
            <text
              key={band.key}
              x={padding.left + 12}
              y={collapsed ? top + bandHeight / 2 + 3.5 : top + 18}
              fontSize={collapsed ? 10 : 11}
              fontWeight={600}
              fill={band.labelColor}
              stroke={band.halo}
              strokeWidth={5}
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              {band.label}
            </text>
          );
        })}

      {ticks.map((tick) => (
        <text
          key={tick.x}
          x={sx(tick.x)}
          y={height - 4}
          textAnchor="middle"
          fontSize={11}
          fill="var(--muted-foreground)"
        >
          {tick.label}
        </text>
      ))}
    </svg>
  );
}
