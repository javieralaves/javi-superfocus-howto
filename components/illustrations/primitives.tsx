"use client";

import type { ComponentType, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoGoal } from "./data";
import { EASE_OUT } from "./stage";

export const PRESS =
  "transition-[color,background-color,border-color,opacity,transform] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]";

export const BUTTON_SM = cn(
  "inline-flex h-7 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 type-body font-medium",
  PRESS,
);
export const BUTTON_PRIMARY = "bg-primary text-primary-foreground hover:bg-[oklch(0.28_0.015_260)]";
export const BUTTON_SECONDARY = "bg-secondary text-secondary-foreground hover:bg-hover";
export const BUTTON_OUTLINE = "border border-border bg-surface-1 text-foreground hover:bg-hover";

/** 28px tinted goal chip used in the tasks panel goal headers. */
export function GoalChip({ goal }: { goal: DemoGoal }) {
  const Icon = goal.icon;
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-md"
      style={{ backgroundColor: `${goal.color}15`, color: goal.color }}
    >
      <Icon className="size-3.5" />
    </span>
  );
}

/** 20px tinted badge used next to goal names in coach surfaces. */
export function GoalIconBadge({ goal }: { goal: DemoGoal }) {
  const Icon = goal.icon;
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-md"
      style={{ backgroundColor: `${goal.color}22` }}
    >
      <Icon className="size-3.5" style={{ color: goal.color }} />
    </span>
  );
}

export function TaskCheckbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      aria-label={checked ? "Mark incomplete" : "Mark complete"}
      className={cn(
        "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm",
        PRESS,
        checked
          ? "bg-foreground text-background"
          : "bg-surface-3 text-muted-foreground ring-1 ring-inset ring-foreground/10 hover:ring-foreground/25",
      )}
    >
      <AnimatePresence initial={false}>
        {checked && (
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className="flex"
          >
            <Check className="size-3 stroke-[2.5]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-sm bg-surface-2 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
      {children}
    </span>
  );
}

export type TrajectoryStatus = "on_track" | "adjust" | "off_track";

const STATUS_LABEL: Record<TrajectoryStatus, string> = {
  on_track: "On track",
  adjust: "Adjust",
  off_track: "Off track",
};

const STATUS_CLASSES: Record<TrajectoryStatus, string> = {
  on_track: "bg-success-surface text-success-strong",
  adjust: "bg-warning-surface text-warning-strong",
  off_track: "bg-destructive/15 text-destructive",
};

export function StatusPill({
  status,
  trend,
}: {
  status: TrajectoryStatus;
  trend?: "up" | "down";
}) {
  return (
    <span className="relative inline-flex h-[22px] shrink-0 items-center overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={`${status}-${trend ?? ""}`}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.24, ease: EASE_OUT }}
          className="inline-flex"
        >
          <span
            className={cn(
              "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold",
              STATUS_CLASSES[status],
            )}
          >
            <span className="size-[6px] rounded-full bg-current" />
            {STATUS_LABEL[status]}
            {trend === "up" && " \u2197"}
            {trend === "down" && " \u2198"}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Timer ring from shared/ui/progress-ring.tsx. */
export function ProgressRing({
  progress,
  color,
  active = false,
  size = 44,
  stroke = 3,
  tint = true,
  transition = "stroke-dashoffset 0.4s ease",
  children,
}: {
  progress: number;
  color: string;
  active?: boolean;
  size?: number;
  stroke?: number;
  tint?: boolean;
  transition?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const disc = size - stroke * 2 - 6;
  const value = Math.min(1, Math.max(0, progress));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {active && (
        <span
          className="sf-breathe absolute rounded-full"
          style={{
            inset: stroke,
            background: `color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        />
      )}
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tint ? `color-mix(in srgb, ${color} 16%, transparent)` : "var(--muted)"}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - value)}
          strokeLinecap="round"
          style={{ transition }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: disc,
            height: disc,
            background: tint ? `color-mix(in srgb, ${color} 15%, transparent)` : "transparent",
            color: tint ? color : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface DemoRecommendation {
  id: string;
  icon: ComponentType<{ className?: string; weight?: "fill" }>;
  goal: DemoGoal;
  title: string;
  body: string;
  cta: string;
  doneLabel: string;
}

export function RecommendationRow({
  rec,
  accepted,
  dismissed,
  onAccept,
  onDismiss,
}: {
  rec: DemoRecommendation;
  accepted: boolean;
  dismissed?: boolean;
  onAccept: () => void;
  onDismiss?: () => void;
}) {
  const Icon = rec.icon;
  const GoalIcon = rec.goal.icon;
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-opacity duration-200",
        dismissed && "opacity-40",
      )}
    >
      <div className="relative flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-2 text-foreground">
        <Icon weight="fill" className="size-4" />
        <span
          className="absolute -bottom-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border-2 border-card text-white"
          style={{ backgroundColor: rec.goal.color }}
        >
          <GoalIcon className="size-2.5" />
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-semibold leading-5 text-foreground">{rec.title}</p>
          <p className="text-[12px] leading-4 text-muted-foreground">{rec.body}</p>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence initial={false} mode="popLayout">
            {accepted ? (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className={cn(BUTTON_SM, "bg-success-surface px-2 text-success-strong")}
              >
                <Check className="size-3.5 stroke-[2.5]" />
                {rec.doneLabel}
              </motion.span>
            ) : (
              <motion.button
                key="cta"
                type="button"
                tabIndex={-1}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={onAccept}
                className={cn(BUTTON_SM, BUTTON_PRIMARY, "cursor-pointer")}
              >
                {rec.cta}
              </motion.button>
            )}
          </AnimatePresence>
          <span className={cn(BUTTON_SM, BUTTON_SECONDARY)}>Chat with coach</span>
          <button
            type="button"
            tabIndex={-1}
            onClick={onDismiss}
            aria-label="Dismiss recommendation"
            className={cn(
              "flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-1 text-muted-foreground hover:bg-hover",
              PRESS,
            )}
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
