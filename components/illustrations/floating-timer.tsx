"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChevronDownIcon,
  HeadphonesIcon,
  PauseIcon,
  PlayIcon,
  RotateClockwiseIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { PRESS, ProgressRing } from "./primitives";
import { EASE_OUT, useStage } from "./stage";

const ON_TASK = "var(--success-strong)";
const OFF_TASK = "color-mix(in srgb, var(--success-strong) 30%, transparent)";
const IDLE = "color-mix(in srgb, var(--muted-foreground) 30%, transparent)";

export function formatClock(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function verdict(score: number) {
  if (score >= 90) return "Locked in. Great session";
  if (score >= 70) return "Solid focus with a few distractions";
  if (score >= 50) return "In and out of focus";
  return "Tough one. The distractions won today";
}

function IconButton({
  icon,
  label,
  onClick,
  className,
}: {
  icon: typeof PauseIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-hover hover:text-foreground",
        PRESS,
        className,
      )}
    >
      <HugeiconsIcon icon={icon} size={17} strokeWidth={2} />
    </button>
  );
}

export function QualityRing({
  score,
  play,
  still,
  delay = 0.05,
  size = 44,
  stroke = 3.5,
}: {
  score: number;
  play: boolean;
  still: boolean;
  delay?: number;
  size?: number;
  stroke?: number;
}) {
  const [counted, setCounted] = useState(0);
  const shown = still ? score : counted;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;

  useEffect(() => {
    if (!play || still) return;
    const controls = animate(0, score, {
      duration: 0.7,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setCounted(Math.round(v)),
    });
    return () => controls.stop();
  }, [play, still, score, delay]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} stroke="var(--muted)" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ON_TASK}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: still ? circ * (1 - score / 100) : circ }}
          animate={{ strokeDashoffset: play ? circ * (1 - score / 100) : circ }}
          transition={still ? { duration: 0 } : { duration: 0.7, ease: "easeOut", delay }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold tabular-nums"
        style={{ fontSize: size > 50 ? 18 : 14 }}
      >
        {shown}
      </span>
    </div>
  );
}

export interface QualityBreakdown {
  score: number;
  label: string;
  onTask: number;
  offTask: number;
  idle: number;
  rows: Array<{ label: string; detail?: string; minutes: number; pct: number; dot: string; muted?: boolean }>;
}

export function QualityPanel({
  quality,
  play,
  still,
  delay = 0,
  bordered = true,
}: {
  quality: QualityBreakdown;
  play: boolean;
  still: boolean;
  delay?: number;
  bordered?: boolean;
}) {
  const [rated, setRated] = useState<"up" | "down" | null>(null);
  const total = quality.onTask + quality.offTask + quality.idle;
  const segments = [
    { key: "on", value: quality.onTask, color: ON_TASK },
    { key: "off", value: quality.offTask, color: OFF_TASK },
    { key: "idle", value: quality.idle, color: IDLE },
  ];
  const t = (extra: number) =>
    still ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT, delay: delay + extra };

  return (
    <div className={cn("px-4 py-4", bordered && "border-t border-border")}>
      <div className="mb-3 flex flex-col gap-0.5">
        <div className="type-body-lg font-semibold text-foreground">Focus session complete</div>
        <div className="type-caption text-muted-foreground">{quality.label}</div>
      </div>
      <div className="flex items-center gap-3">
        <QualityRing score={quality.score} play={play} still={still} delay={delay + 0.05} />
        <div className="min-w-0 flex-1">
          <div className="type-body-lg font-semibold text-foreground">Focus quality</div>
          <div className="mt-0.5 type-caption leading-snug text-muted-foreground">{verdict(quality.score)}</div>
        </div>
      </div>
      <div className="mt-3.5 flex h-1.5 gap-px overflow-hidden rounded-full">
        {segments.map((segment, i) => (
          <motion.div
            key={segment.key}
            className="rounded-full"
            style={{ background: segment.color }}
            initial={{ width: still ? `${(segment.value / total) * 100}%` : "0%" }}
            animate={{ width: play ? `${(segment.value / total) * 100}%` : "0%" }}
            transition={t(0.15 + i * 0.12)}
          />
        ))}
      </div>
      <div className="mt-3.5 flex flex-col gap-1.5">
        {quality.rows.map((row, i) => (
          <motion.div
            key={row.label}
            className={cn("flex items-start gap-1.5 text-xs", row.muted && "opacity-70")}
            initial={still ? false : { opacity: 0, y: 4 }}
            animate={play ? { opacity: row.muted ? 0.7 : 1, y: 0 } : undefined}
            transition={t(0.35 + i * 0.08)}
          >
            <span className="mt-1 size-2 shrink-0 rounded-full" style={{ background: row.dot }} />
            <span className="min-w-0 flex-1 break-words">
              <span className="font-medium">{row.label}</span>
              {row.detail}
            </span>
            <span className="shrink-0 tabular-nums">
              {row.minutes}m · {row.pct}%
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3.5 flex h-6 items-center justify-between text-xs text-muted-foreground">
        <AnimatePresence mode="wait" initial={false}>
          {rated ? (
            <motion.span key="thanks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Thanks for the feedback.
            </motion.span>
          ) : (
            <motion.span key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Was your focus well assessed?
            </motion.span>
          )}
        </AnimatePresence>
        <span className="flex items-center gap-0.5">
          {(["up", "down"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              tabIndex={-1}
              aria-label={dir === "up" ? "Yes" : "No"}
              onClick={() => setRated(dir)}
              className={cn(
                "flex size-6 cursor-pointer items-center justify-center rounded-md hover:bg-hover hover:text-foreground",
                PRESS,
                rated === dir && "text-foreground",
              )}
            >
              <HugeiconsIcon
                icon={dir === "up" ? ThumbsUpIcon : ThumbsDownIcon}
                size={16}
                strokeWidth={rated === dir ? 2.2 : 1.6}
              />
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}

export type TimerPhase = "running" | "paused" | "scoring" | "done";
type Phase = TimerPhase;

export function FloatingTimer({
  width = 340,
  color,
  title,
  startSeconds,
  blockSeconds,
  quality,
  invite = false,
  autoFinishAfterMs,
  onPhaseChange,
}: {
  width?: number;
  color: string;
  title: string;
  startSeconds: number;
  blockSeconds: number;
  quality: QualityBreakdown;
  /** Pulse the finish button to invite a click. */
  invite?: boolean;
  /** Finish on its own once, this long after the stage starts playing. */
  autoFinishAfterMs?: number;
  onPhaseChange?: (phase: Phase) => void;
}) {
  const { play, still } = useStage();
  const [phase, setPhase] = useState<Phase>("running");
  const [elapsed, setElapsed] = useState(startSeconds);
  const [finishedAt, setFinishedAt] = useState(startSeconds);
  const onPhaseRef = useRef(onPhaseChange);

  useEffect(() => {
    onPhaseRef.current = onPhaseChange;
  });

  useEffect(() => {
    onPhaseRef.current?.(phase);
  }, [phase]);

  useEffect(() => {
    if (!play || still || phase !== "running") return;
    const interval = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [play, still, phase]);

  const autoFinished = useRef(false);
  const elapsedRef = useRef(elapsed);
  useEffect(() => {
    elapsedRef.current = elapsed;
  });

  useEffect(() => {
    if (!play || autoFinishAfterMs === undefined || autoFinished.current) return;
    const timeout = window.setTimeout(
      () => {
        autoFinished.current = true;
        setFinishedAt(elapsedRef.current);
        setPhase(still ? "done" : "scoring");
      },
      still ? 0 : autoFinishAfterMs,
    );
    return () => window.clearTimeout(timeout);
  }, [play, still, autoFinishAfterMs]);

  useEffect(() => {
    if (phase !== "scoring") return;
    const timeout = window.setTimeout(() => setPhase("done"), still ? 0 : 1500);
    return () => window.clearTimeout(timeout);
  }, [phase, still]);

  const finish = () => {
    setFinishedAt(elapsed);
    setPhase("scoring");
  };
  const restart = () => {
    setElapsed(startSeconds);
    setPhase("running");
  };

  const finished = phase === "scoring" || phase === "done";
  const paused = phase === "paused";

  return (
    <div
      className="overflow-hidden border border-border bg-overlay shadow-[0_4px_16px_rgba(0,0,0,0.10),0_24px_48px_-12px_rgba(0,0,0,0.12)]"
      style={{ width, borderRadius: 16 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {finished ? (
          <motion.div
            key="finished"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-4 py-3.5"
          >
            <ProgressRing progress={1} color={ON_TASK}>
              <HugeiconsIcon icon={Tick02Icon} size={18} strokeWidth={2.5} />
            </ProgressRing>
            <div className="min-w-0 flex-1">
              <div className="truncate type-body-lg font-semibold text-foreground">{title}</div>
              <div className="type-caption text-muted-foreground">Focused {formatClock(finishedAt)}</div>
            </div>
            <IconButton icon={RotateClockwiseIcon} label="Start again" onClick={restart} />
          </motion.div>
        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label={paused ? "Resume" : "Pause"}
              className={cn("shrink-0 cursor-pointer", PRESS)}
              onClick={() => setPhase(paused ? "running" : "paused")}
            >
              <ProgressRing progress={elapsed / blockSeconds} color={color} active={!paused}>
                <HugeiconsIcon
                  icon={paused ? PlayIcon : PauseIcon}
                  size={16}
                  strokeWidth={2.2}
                  className="text-foreground"
                />
              </ProgressRing>
            </button>
            <div className="min-w-0 flex-1">
              <div className="truncate type-body-lg font-semibold text-foreground">{title}</div>
              <div
                className={cn(
                  "font-mono type-heading leading-tight tabular-nums",
                  paused ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {formatClock(elapsed)}
              </div>
            </div>
            <IconButton icon={HeadphonesIcon} label="Music" />
            <span className="relative">
              {invite && !still && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg"
                  style={{ boxShadow: "0 0 0 2px var(--success-strong)" }}
                  animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1.25, 1.4] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6, ease: "easeOut" }}
                />
              )}
              <IconButton icon={Tick02Icon} label="Finish" onClick={finish} />
            </span>
            <IconButton icon={ChevronDownIcon} label="Expand" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {phase === "scoring" && (
          <motion.div
            key="scoring"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 border-t border-border px-4 py-3 type-caption text-muted-foreground">
              <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Scoring your focus…
            </div>
          </motion.div>
        )}
        {phase === "done" && (
          <motion.div
            key="quality"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <QualityPanel quality={quality} play still={still} delay={0.15} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
