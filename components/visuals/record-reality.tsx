"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { blockColors } from "@/components/illustrations/color";
import { GOALS, formatHour, formatRange, type GoalId } from "@/components/illustrations/data";
import { BUTTON_OUTLINE, BUTTON_SM, Pill, TaskCheckbox } from "@/components/illustrations/primitives";
import { EASE_OUT, Rise, Stage } from "@/components/illustrations/stage";
import { Panel, Scene, formatDuration, useAutoStep, useAutopilot } from "./kit";

type State = "planned" | "done" | "moved";

const START = 8;
const END = 17;
const HOUR = 32;

const TASKS: Array<{ id: string; title: string; goal: GoalId; start: number; end: number }> = [
  { id: "a", title: "Review beta tester interviews", goal: "ship", start: 9, end: 10.5 },
  { id: "b", title: "Script the channel trailer", goal: "youtube", start: 11, end: 12 },
  { id: "c", title: "Easy 5K recovery run", goal: "marathon", start: 12.5, end: 13.25 },
  { id: "d", title: "Fix onboarding bugs", goal: "ship", start: 13.5, end: 15 },
  { id: "e", title: "Film + record voiceover", goal: "youtube", start: 15.5, end: 16.75 },
];

function short(h: number) {
  return formatHour(h).replace(":00", "");
}

function DayBlock({ task, state }: { task: (typeof TASKS)[number]; state: State }) {
  const colors = blockColors(GOALS[task.goal].color);
  const height = (task.end - task.start) * HOUR - 2;
  return (
    <motion.div
      layout
      className={cn(
        "absolute inset-x-1 overflow-hidden rounded-[7px] px-2 py-[4px] transition-[background-color,opacity,filter] duration-300",
        state === "moved" && "sf-trace",
      )}
      style={{
        top: (task.start - START) * HOUR + 1,
        height,
        color: colors.text,
        backgroundColor: state === "done" ? colors.fill : state === "planned" ? "transparent" : undefined,
        outline: state === "planned" ? `1px dashed ${colors.line}` : undefined,
        outlineOffset: -1,
      }}
    >
      <div className="flex items-start gap-1">
        <span className={cn("min-w-0 flex-1 truncate text-[11px] font-medium leading-[13px]", state === "moved" && "line-through")}>
          {task.title}
        </span>
        <AnimatePresence>
          {state === "done" && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="flex size-3.5 shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: colors.line }}
            >
              <Check className="size-2.5" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {height > 40 && (
        <div className="text-[10px] leading-[11px] opacity-75">
          {state === "moved" ? "Moved to Wed" : formatRange(task.start, task.end)}
        </div>
      )}
    </motion.div>
  );
}

function RecordScene() {
  const { active, takeOver, still } = useAutopilot();
  const [state, setState] = useState<Record<string, State>>(() =>
    Object.fromEntries(TASKS.map((t) => [t.id, still && t.id !== "e" ? "done" : still ? "moved" : "planned"])),
  );
  const set = (id: string, s: State) => setState((prev) => ({ ...prev, [id]: s }));

  useAutoStep(active, 1300, () => set("a", "done"));
  useAutoStep(active, 2000, () => set("b", "done"));
  useAutoStep(active, 2700, () => set("d", "done"));
  useAutoStep(active, 3600, () => set("e", "moved"));

  const hoursOf = (s: State) =>
    TASKS.filter((t) => state[t.id] === s).reduce((sum, t) => sum + (t.end - t.start), 0);
  const planned = TASKS.reduce((sum, t) => sum + (t.end - t.start), 0);
  const done = hoursOf("done");
  const moved = TASKS.filter((t) => state[t.id] === "moved").length;
  const hours = Array.from({ length: END - START }, (_, i) => START + i);

  return (
    <Scene onInteract={takeOver}>
      <Rise delay={0.05} y={14} className="absolute left-[20px] top-[20px] w-[236px]">
        <div className="overflow-hidden rounded-xl border border-sidebar-border bg-calendar-grid shadow-module">
          <div className="flex h-10 items-center justify-between border-b border-border px-3">
            <span className="type-body font-semibold text-foreground">Today</span>
            <span className="flex items-center gap-1.5">
              <span className="type-caption font-medium text-primary">Tue</span>
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-destructive type-body font-semibold text-primary-foreground">
                13
              </span>
            </span>
          </div>
          <div className="relative flex pt-2" style={{ height: (END - START) * HOUR + 12 }}>
            <div className="w-10 shrink-0">
              {hours.map((h, i) => (
                <div key={h} className="relative" style={{ height: HOUR }}>
                  {i > 0 && (
                    <span className="absolute -top-[7px] right-1.5 text-[9px] text-muted-foreground">{short(h)}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="relative flex-1 pr-1">
              {hours.map((h, i) => (
                <div key={h} className={i ? "border-t border-border-subtle" : ""} style={{ height: HOUR }} />
              ))}
              {TASKS.map((t) => (
                <DayBlock key={t.id} task={t} state={state[t.id]} />
              ))}
            </div>
          </div>
        </div>
      </Rise>

      <Rise delay={0.15} y={14} className="absolute bottom-[20px] left-[272px] right-[20px] top-[20px]">
        <Panel className="flex h-full flex-col">
          <div className="px-5 pt-4">
            <p className="type-heading-sm font-semibold text-foreground">Review today</p>
            <p className="mt-0.5 type-body text-muted-foreground">
              Mark what you finished. Move what didn&apos;t happen.
            </p>
          </div>
          <div className="mt-3 flex-1 px-3">
            {TASKS.map((t) => {
              const s = state[t.id];
              return (
                <div key={t.id} className="flex h-11 items-center gap-2.5 rounded-md px-2 hover:bg-foreground/[0.03]">
                  <TaskCheckbox
                    checked={s === "done"}
                    onToggle={() => set(t.id, s === "done" ? "planned" : "done")}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate type-body transition-colors duration-200",
                        s === "done" ? "text-muted-foreground line-through" : "text-foreground/85",
                        s === "moved" && "text-muted-foreground",
                      )}
                    >
                      {t.title}
                    </span>
                    <span className="flex items-center gap-1.5 type-caption text-muted-foreground">
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: GOALS[t.goal].color }} />
                      {GOALS[t.goal].short} · {short(t.start)}
                    </span>
                  </span>
                  {s === "moved" ? (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => set(t.id, "planned")}
                      className="cursor-pointer"
                    >
                      <Pill>Wed</Pill>
                    </button>
                  ) : (
                    s === "planned" && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => set(t.id, "moved")}
                        className={cn(BUTTON_SM, BUTTON_OUTLINE, "h-6 cursor-pointer gap-1 px-2")}
                      >
                        Move
                        <ArrowRight className="size-3" />
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t border-border px-5 py-3.5">
            <div className="flex items-baseline justify-between type-body">
              <span className="text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground">{formatDuration(done)}</span> done of{" "}
                {formatDuration(planned)} planned
              </span>
              <span className="type-caption text-muted-foreground">
                {moved ? `${moved} moved to tomorrow` : "Nothing moved"}
              </span>
            </div>
            <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-surface-3">
              <motion.div
                className="h-full bg-success-strong"
                animate={{ width: `${(done / planned) * 100}%` }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              />
              <motion.div
                className="h-full bg-muted-foreground/30"
                animate={{ width: `${(hoursOf("moved") / planned) * 100}%` }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              />
            </div>
          </div>
        </Panel>
      </Rise>
    </Scene>
  );
}

export function RecordRealityVisual() {
  return (
    <Stage
      width={640}
      height={382}
      label="An end-of-day review in Superfocus: planned blocks stay outlined until their task is marked complete, and unfinished work moves to tomorrow, so the record matches what really happened."
    >
      <RecordScene />
    </Stage>
  );
}
