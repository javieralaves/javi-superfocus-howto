"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blockColors } from "./color";
import { GOALS, formatHour, formatRange, type DemoBlock } from "./data";
import { EASE_OUT, useStage } from "./stage";

export const HOUR_HEIGHT = 72;
const GUTTER = 64;

export function CalendarBlock({ block, height }: { block: DemoBlock; height: number }) {
  const colors = blockColors(block.goal ? GOALS[block.goal].color : null);
  const radius = Math.min(10, Math.max(3, height * 0.15));
  const small = height < 50;
  const style = block.protected
    ? {
        backgroundColor: `color-mix(in srgb, ${colors.line} 8%, transparent)`,
        border: `1px dashed ${colors.line}`,
        borderRadius: 10,
        color: colors.text,
      }
    : { backgroundColor: colors.fill, borderRadius: radius, color: colors.text };

  return (
    <div className="h-full overflow-hidden" style={style}>
      <div className={small ? "px-2 py-1.5" : "p-2"}>
        <div className="truncate text-xs font-medium leading-tight">{block.title}</div>
        {height >= 55 && (
          <div className="mt-0.5 truncate text-[10px] opacity-80">{formatRange(block.start, block.end)}</div>
        )}
      </div>
    </div>
  );
}

export function DayCalendar({
  blocks,
  startHour,
  endHour,
  nowHour,
  dayLabel = "Mon",
  dateLabel = "12",
  delay = 0,
  headerAction,
  realityLane,
}: {
  blocks: Array<DemoBlock>;
  startHour: number;
  endHour: number;
  nowHour: number;
  dayLabel?: string;
  dateLabel?: string;
  delay?: number;
  headerAction?: ReactNode;
  /** When set, plan blocks take the left half and this fills the right. */
  realityLane?: ReactNode;
}) {
  const { play, still } = useStage();
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const nowTop = (nowHour - startHour) * HOUR_HEIGHT;
  const nowLabel = formatHour(nowHour).replace(/ (AM|PM)/, "");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-sidebar-border bg-calendar-grid shadow-module">
      <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs">
            <ChevronLeft className="size-4" />
          </span>
          <span className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs">
            <ChevronRight className="size-4" />
          </span>
          <span className="ml-1 flex h-8 items-center rounded-full border border-border bg-card px-3.5 type-body text-foreground shadow-xs">
            Today
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="type-caption font-medium text-primary">{dayLabel}</span>
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-destructive type-body font-semibold text-primary-foreground">
            {dateLabel}
          </span>
        </div>
        <div className="flex justify-end">{headerAction}</div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden pt-3">
        <div className="relative flex">
          <div className="shrink-0" style={{ width: GUTTER }}>
            {hours.map((hour, i) => (
              <div key={hour} className="relative" style={{ height: HOUR_HEIGHT }}>
                {i > 0 && (
                  <span className="absolute -top-2 right-2 type-body text-muted-foreground">
                    {formatHour(hour)}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="relative flex-1">
            {hours.map((hour, i) => (
              <div
                key={hour}
                className={i === 0 ? "" : "border-t border-border-subtle"}
                style={{ height: HOUR_HEIGHT }}
              />
            ))}

            {blocks.map((block, i) => {
              const top = (block.start - startHour) * HOUR_HEIGHT + 1;
              const height = (block.end - block.start) * HOUR_HEIGHT - 2;
              return (
                <motion.div
                  key={block.id}
                  className={realityLane ? "absolute left-0 w-[49.7%]" : "absolute inset-x-0 px-0.5"}
                  style={{ top, height }}
                  initial={still ? false : { opacity: 0, scale: 0.96 }}
                  animate={play ? { opacity: 1, scale: 1 } : undefined}
                  transition={
                    still ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT, delay: delay + i * 0.07 }
                  }
                >
                  <CalendarBlock block={block} height={height} />
                </motion.div>
              );
            })}

            {realityLane}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
            style={{ top: nowTop - 1 }}
          >
            <div className="flex shrink-0 justify-end pr-1.5" style={{ width: GUTTER }}>
              <motion.span
                className="rounded-sm bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white"
                initial={still ? false : { opacity: 0 }}
                animate={play ? { opacity: 1 } : undefined}
                transition={{ duration: 0.3, delay: still ? 0 : delay + 0.5 }}
              >
                {nowLabel}
              </motion.span>
            </div>
            <div className="relative flex-1">
              <span className="absolute -left-1 -top-[3px] size-2 rounded-full bg-red-600" />
              <motion.div
                className="h-0.5 origin-left bg-red-600"
                initial={still ? false : { scaleX: 0 }}
                animate={play ? { scaleX: 1 } : undefined}
                transition={still ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT, delay: delay + 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
