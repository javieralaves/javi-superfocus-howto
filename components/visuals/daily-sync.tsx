"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UNASSIGNED_COLORS, blockColors } from "@/components/illustrations/color";
import { GOALS, formatHour, type GoalId } from "@/components/illustrations/data";
import { CoachIcon } from "@/components/illustrations/icons";
import {
  BUTTON_OUTLINE,
  BUTTON_PRIMARY,
  BUTTON_SM,
  PRESS,
  Pill,
  StatusPill,
} from "@/components/illustrations/primitives";
import { EASE_OUT, Rise, Stage } from "@/components/illustrations/stage";
import { TrajectoryChart, type ChartSeries } from "@/components/illustrations/trajectory-chart";
import { Panel, Scene, useAutoStep, useAutopilot } from "./kit";

type Step = "progress" | "tomorrow" | "read";
const STEPS: Array<Step> = ["progress", "tomorrow", "read"];

const OPTIONS = [
  { label: "A massive amount of progress", description: "This was an outlier day" },
  { label: "Solid progress", description: "I'd be happy with this most days" },
  { label: "Mixed progress", description: "Not the best of days" },
  { label: "Little progress", description: "A day to forget" },
];

const START = 8;
const END = 16;
const HOUR = 30;

const PROTECTED: Array<{ goal: GoalId; start: number; end: number }> = [
  { goal: "youtube", start: 9, end: 11 },
  { goal: "ship", start: 13, end: 15 },
];
const MEETINGS = [{ title: "Team sync", start: 11.5, end: 12 }];

interface DueTask {
  id: string;
  title: string;
  goal: GoalId;
  slot: { start: number; end: number } | null;
}

const DUE: Array<DueTask> = [
  { id: "t1", title: "Script episode 2", goal: "youtube", slot: { start: 9, end: 10.5 } },
  { id: "t2", title: "Reply to beta testers", goal: "ship", slot: { start: 13, end: 14 } },
  { id: "t3", title: "Review pricing page", goal: "ship", slot: { start: 14, end: 15 } },
  { id: "t4", title: "Edit intro footage", goal: "youtube", slot: null },
];

function line(values: Array<number>, offset = 0) {
  return values.map((y, i) => ({
    x: i + offset,
    y,
    dot: i === values.length - 1 ? ("large" as const) : ("small" as const),
  }));
}

const SERIES: Array<ChartSeries> = [
  {
    id: "youtube",
    color: GOALS.youtube.color,
    points: line([52, 55, 54, 60, 63, 66, 71]),
    projection: [
      { x: 6, y: 71 },
      { x: 9, y: 79 },
      { x: 12, y: 85 },
    ],
  },
  {
    id: "ship",
    color: GOALS.ship.color,
    points: line([70, 66, 61, 58, 56, 57, 60]),
    projection: [
      { x: 6, y: 60 },
      { x: 9, y: 63 },
      { x: 12, y: 66 },
    ],
  },
];

function ProgressStep({ picked, onPick }: { picked: number | null; onPick: (i: number) => void }) {
  return (
    <div className="mx-auto max-w-[440px] pt-6">
      <p className="text-center type-heading font-semibold text-foreground">
        How much closer did today bring you to achieving your goals?
      </p>
      <div className="mt-6 flex flex-col gap-2">
        {OPTIONS.map((o, i) => (
          <button
            key={o.label}
            type="button"
            tabIndex={-1}
            onClick={() => onPick(i)}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-lg border px-4 py-2.5 text-left",
              PRESS,
              picked === i
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface-1 hover:bg-hover",
            )}
          >
            <span>
              <span className="block type-body-lg font-medium">{o.label}</span>
              <span className={cn("block type-body", picked === i ? "text-background/70" : "text-muted-foreground")}>
                {o.description}
              </span>
            </span>
            {picked === i && <Check className="size-4" strokeWidth={2.5} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function TomorrowStep({
  placed,
  moved,
  onPlace,
  onMove,
}: {
  placed: Record<string, boolean>;
  moved: Record<string, boolean>;
  onPlace: (id: string) => void;
  onMove: (id: string) => void;
}) {
  const hours = Array.from({ length: END - START }, (_, i) => START + i);
  return (
    <div className="flex gap-5 pt-1">
      <div className="min-w-0 flex-1">
        <p className="type-heading-sm font-semibold text-foreground">Here&apos;s a starting point for tomorrow</p>
        <p className="mt-0.5 type-body text-muted-foreground">Your protected time is already in place.</p>
        <p className="mb-1.5 mt-4 type-caption font-medium text-muted-foreground">Due tomorrow</p>
        <div className="flex flex-col gap-1">
          {DUE.map((t) => {
            const goal = GOALS[t.goal];
            const isPlaced = placed[t.id];
            const isMoved = moved[t.id];
            return (
              <div key={t.id} className="flex h-9 items-center gap-2 rounded-md px-2 hover:bg-foreground/[0.03]">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: goal.color }} />
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate type-body text-foreground/85",
                    isMoved && "text-muted-foreground",
                  )}
                >
                  {t.title}
                </span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={isMoved ? "thu" : "wed"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pill>{isMoved ? "Thu" : "Wed"}</Pill>
                  </motion.span>
                </AnimatePresence>
                {isPlaced ? (
                  <span className="flex w-[68px] items-center justify-center gap-1 type-caption font-medium text-success-strong">
                    <Check className="size-3" strokeWidth={2.5} />
                    Planned
                  </span>
                ) : isMoved ? (
                  <span className="w-[68px] text-center type-caption text-muted-foreground">Moved</span>
                ) : t.slot ? (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => onPlace(t.id)}
                    className={cn(BUTTON_SM, BUTTON_OUTLINE, "h-6 w-[68px] cursor-pointer px-2")}
                  >
                    Add
                  </button>
                ) : (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => onMove(t.id)}
                    className={cn(BUTTON_SM, BUTTON_OUTLINE, "h-6 w-[68px] cursor-pointer gap-1 px-2")}
                  >
                    Move
                    <ArrowRight className="size-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-[190px] shrink-0 overflow-hidden rounded-lg border border-border bg-calendar-grid">
        <div className="border-b border-border px-3 py-1.5 type-caption font-medium text-muted-foreground">
          Wed 14
        </div>
        <div className="relative flex pt-1.5" style={{ height: (END - START) * HOUR + 8 }}>
          <div className="w-9 shrink-0">
            {hours.map((h, i) => (
              <div key={h} className="relative" style={{ height: HOUR }}>
                {i > 0 && (
                  <span className="absolute -top-[7px] right-1.5 text-[9px] text-muted-foreground">
                    {formatHour(h).replace(":00", "")}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="relative flex-1 pr-1.5">
            {hours.map((h, i) => (
              <div key={h} className={i ? "border-t border-border-subtle" : ""} style={{ height: HOUR }} />
            ))}
            {PROTECTED.map((p) => (
              <div
                key={p.goal}
                className="absolute inset-x-0 rounded-[7px]"
                style={{
                  top: (p.start - START) * HOUR + 1,
                  height: (p.end - p.start) * HOUR - 2,
                  border: `1px dashed ${GOALS[p.goal].color}`,
                  backgroundColor: `color-mix(in srgb, ${GOALS[p.goal].color} 8%, transparent)`,
                }}
              />
            ))}
            {MEETINGS.map((m) => (
              <div
                key={m.title}
                className="absolute inset-x-0 rounded-[6px] px-1.5 text-[9px] font-medium leading-[14px]"
                style={{
                  top: (m.start - START) * HOUR + 1,
                  height: (m.end - m.start) * HOUR - 2,
                  background: UNASSIGNED_COLORS.fill,
                  color: UNASSIGNED_COLORS.text,
                  boxShadow: `inset 0 0 0 1px ${UNASSIGNED_COLORS.line}`,
                }}
              >
                {m.title}
              </div>
            ))}
            <AnimatePresence>
              {DUE.filter((t) => placed[t.id] && t.slot).map((t) => {
                const colors = blockColors(GOALS[t.goal].color);
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                    className="absolute inset-x-[3px] overflow-hidden rounded-[5px] px-1.5 py-0.5 text-[9px] font-medium leading-3"
                    style={{
                      top: (t.slot!.start - START) * HOUR + 3,
                      height: (t.slot!.end - t.slot!.start) * HOUR - 6,
                      backgroundColor: colors.fill,
                      color: colors.text,
                    }}
                  >
                    {t.title}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadStep() {
  return (
    <div className="pt-1">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-coach-surface">
          <CoachIcon className="size-3.5 text-coach-brand" />
        </span>
        <p className="type-heading-sm font-semibold text-foreground">Coach read unlocked</p>
      </div>
      <div className="mt-3 rounded-lg border border-border bg-card px-3 pt-2">
        <div className="flex items-center justify-between type-body font-medium">
          <span className="text-foreground">Day 34 of 84</span>
          <span className="text-muted-foreground">50 days left</span>
        </div>
        <TrajectoryChart
          width={518}
          height={150}
          padding={{ top: 16, right: 6, bottom: 8, left: 6 }}
          series={SERIES}
          xDomain={[-0.5, 12]}
          yDomain={[20, 100]}
          todayX={6.4}
          todayLabel
          play
          still={false}
          delay={0.2}
          drawSeconds={1.1}
        />
      </div>
      <Rise delay={1.2} y={8} className="mt-3 flex items-start gap-3">
        <div className="flex shrink-0 flex-col gap-1.5">
          <span className="flex items-center gap-1.5 type-body font-medium">
            <span className="size-2 rounded-full" style={{ background: GOALS.youtube.color }} />
            YouTube <StatusPill status="on_track" trend="up" />
          </span>
          <span className="flex items-center gap-1.5 type-body font-medium">
            <span className="size-2 rounded-full" style={{ background: GOALS.ship.color }} />
            Ship v2 <StatusPill status="adjust" trend="up" />
          </span>
        </div>
        <p className="type-body text-foreground/80">
          Two solid days on the channel. Tomorrow&apos;s script block keeps you ahead of the Oct 30 milestone, and
          Ship v2 is recovering now that its afternoon blocks are holding.
        </p>
      </Rise>
    </div>
  );
}

function DailySyncScene() {
  const { active, takeOver, still } = useAutopilot();
  const [step, setStep] = useState<Step>(still ? "read" : "progress");
  const [picked, setPicked] = useState<number | null>(null);
  const [placed, setPlaced] = useState<Record<string, boolean>>({});
  const [moved, setMoved] = useState<Record<string, boolean>>({});

  const pick = (i: number) => {
    setPicked(i);
    window.setTimeout(() => setStep("tomorrow"), 450);
  };
  const place = (id: string) => setPlaced((p) => ({ ...p, [id]: true }));
  const move = (id: string) => setMoved((m) => ({ ...m, [id]: true }));

  useAutoStep(active && step === "progress", 1800, () => pick(1));
  useAutoStep(active && step === "tomorrow", 1100, () => place("t1"));
  useAutoStep(active && step === "tomorrow", 1800, () => place("t2"));
  useAutoStep(active && step === "tomorrow", 2500, () => place("t3"));
  useAutoStep(active && step === "tomorrow", 3300, () => move("t4"));
  useAutoStep(active && step === "tomorrow", 4600, () => setStep("read"));

  const index = STEPS.indexOf(step);

  return (
    <Scene onInteract={takeOver}>
      <Rise delay={0.05} y={14} className="absolute inset-[20px]">
        <Panel className="flex h-full flex-col px-6 pb-5 pt-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <span className="flex items-center gap-1.5 type-body font-medium text-foreground">
              <CoachIcon className="size-3.5 text-coach-brand" />
              Daily sync
            </span>
            <span className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  className={cn(
                    "h-1.5 rounded-full transition-[width,background-color] duration-300",
                    i === index ? "w-5 bg-foreground" : i < index ? "w-1.5 bg-foreground" : "w-1.5 bg-border-strong",
                  )}
                />
              ))}
            </span>
            <span className="flex justify-end">
              <X className="size-4 text-muted-foreground" />
            </span>
          </div>

          <div className="relative mt-4 min-h-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="h-full"
              >
                {step === "progress" && <ProgressStep picked={picked} onPick={pick} />}
                {step === "tomorrow" && (
                  <TomorrowStep placed={placed} moved={moved} onPlace={place} onMove={move} />
                )}
                {step === "read" && <ReadStep />}
              </motion.div>
            </AnimatePresence>
          </div>

          {step === "tomorrow" && (
            <div className="flex justify-end">
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setStep("read")}
                className={cn(BUTTON_SM, BUTTON_PRIMARY, "cursor-pointer")}
              >
                Finish sync
              </button>
            </div>
          )}
        </Panel>
      </Rise>
    </Scene>
  );
}

export function DailySyncVisual() {
  return (
    <Stage
      width={640}
      height={460}
      label="The Superfocus daily coach sync: rate today's progress, place tomorrow's due tasks into protected time or move them, then see the coach read and trajectory it unlocks."
    >
      <DailySyncScene />
    </Stage>
  );
}
