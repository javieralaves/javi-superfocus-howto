"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { Check, ChevronDown, Pause, Play, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { GOALS } from "./data";
import { ChromeIcon } from "./icons";
import { FloatingTimer, formatClock, type QualityBreakdown } from "./floating-timer";
import { PRESS } from "./primitives";
import { Rise, Stage, useStage } from "./stage";

const LABEL =
  "Superfocus focus timer showing focused time and a 91% focus quality score, with blocked distractions, focus music and a completed session scored for focus quality";

const QUALITY: QualityBreakdown = {
  score: 94,
  label: "Reviewing beta tester interviews",
  onTask: 45 * 60,
  offTask: 2 * 60,
  idle: 60,
  rows: [
    { label: "Review beta tester interviews", minutes: 45, pct: 94, dot: GOALS.ship.color },
    { label: "Distraction", detail: " \u00b7 Slack: #random", minutes: 2, pct: 4, dot: "color-mix(in srgb, var(--success-strong) 30%, transparent)", muted: true },
    { label: "Idle", minutes: 1, pct: 2, dot: "color-mix(in srgb, var(--muted-foreground) 30%, transparent)", muted: true },
  ],
};

function qualityColor(score: number) {
  if (score >= 80) return "var(--success-strong)";
  if (score >= 50) return "var(--warning-strong)";
  return "var(--destructive)";
}

function CountUp({ to, delay }: { to: number; delay: number }) {
  const { play, still } = useStage();
  const [counted, setCounted] = useState(0);
  useEffect(() => {
    if (!play || still) return;
    const controls = animate(0, to, {
      duration: 1.1,
      delay,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => setCounted(Math.round(v)),
    });
    return () => controls.stop();
  }, [play, still, to, delay]);
  return <>{still ? to : counted}</>;
}

function FocusTimerBar() {
  const { play, still } = useStage();
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(17 * 60 + 8);
  const accent = GOALS.youtube.color;

  useEffect(() => {
    if (!play || still || paused) return;
    const interval = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [play, still, paused]);

  return (
    <div
      className="overflow-hidden rounded-xl border border-l-4 border-sidebar-border bg-sidebar shadow-[0_12px_32px_-16px_rgba(0,0,0,0.16)]"
      style={{ borderLeftColor: accent }}
    >
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[13px] font-medium leading-5 text-muted-foreground">Focused time</p>
            <span className="text-2xl font-semibold tabular-nums tracking-tight">2h 31m</span>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium leading-5 text-muted-foreground">Focus quality</p>
            <span className="text-2xl font-semibold tabular-nums tracking-tight" style={{ color: qualityColor(91) }}>
              <CountUp to={91} delay={0.5} />%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[13px] leading-5">
            <span className="flex size-4 shrink-0 items-center justify-center">
              <span
                className={cn("size-2 rounded-full", !paused && "animate-pulse")}
                style={{ backgroundColor: accent }}
              />
            </span>
            <span className="min-w-0 flex-1 truncate text-foreground">Film + record voiceover</span>
            <span className={cn("tabular-nums", paused ? "text-muted-foreground" : "text-foreground")}>
              {formatClock(elapsed)}
            </span>
          </div>
          <div className="flex w-full items-center justify-between text-[13px]">
            <span className="text-muted-foreground">Focus sessions</span>
            <span className="flex items-center gap-1.5 text-foreground tabular-nums">
              3 sessions
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="flex size-5 items-center justify-center rounded-md">
              <ChromeIcon className="size-4" />
            </span>
            <span className="flex size-5 items-center justify-center rounded-md text-foreground">
              <Smartphone className="size-4" strokeWidth={2} />
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex h-8 items-center gap-1.5 rounded-full bg-surface-2 px-3 text-[11px] font-medium">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative size-1.5 rounded-full bg-emerald-500" />
              </span>
              Lo-fi beats
            </span>
            <button
              type="button"
              tabIndex={-1}
              aria-label={paused ? "Resume" : "Pause"}
              onClick={() => setPaused((p) => !p)}
              className={cn(
                "flex size-8 cursor-pointer items-center justify-center rounded-full",
                PRESS,
                paused ? "" : "bg-surface-2 hover:bg-hover",
              )}
              style={paused ? { backgroundColor: accent } : undefined}
            >
              {paused ? (
                <Play className="size-3.5" fill="white" stroke="none" />
              ) : (
                <Pause className="size-3.5 text-muted-foreground" />
              )}
            </button>
            <span className="flex size-8 items-center justify-center rounded-full bg-surface-2">
              <Check className="size-3.5 text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowScene() {
  return (
    <div className="sf-ui absolute inset-0 overflow-hidden rounded-[24px] bg-[#f5f6f8]">
      <Rise delay={0.05} y={18} className="absolute left-[32px] top-[36px] w-[400px]">
        <FocusTimerBar />
      </Rise>

      <Rise delay={0.9} y={24} scale={0.97} className="absolute bottom-[24px] right-[24px] z-20">
        <FloatingTimer
          width={330}
          color={GOALS.ship.color}
          title="Review beta tester interviews"
          startSeconds={47 * 60 + 52}
          blockSeconds={60 * 60}
          quality={QUALITY}
          autoFinishAfterMs={2600}
        />
      </Rise>
    </div>
  );
}

export function FlowIllustration({ fit }: { fit?: "width" | "contain" }) {
  return (
    <Stage fit={fit} width={640} height={480} label={LABEL} name="Focus timer + focus quality">
      <FlowScene />
    </Stage>
  );
}
