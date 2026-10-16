"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Repeat, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UNASSIGNED_COLORS, blockColors } from "@/components/illustrations/color";
import { GOALS, formatHour, type GoalId } from "@/components/illustrations/data";
import { GoalChip } from "@/components/illustrations/primitives";
import { EASE_OUT, Rise, Stage } from "@/components/illustrations/stage";
import { Panel, Scene, Switch, formatDuration, useAutoStep, useAutopilot } from "./kit";

const W = 640;
const START = 8;
const END = 17;
const HOUR = 33;
const LENGTH = 2;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SIDEBAR_GOALS: Array<GoalId> = ["ship", "youtube", "marathon"];

const MEETINGS = [
  { id: "m1", day: 0, start: 10.5, end: 11.5, title: "Team sync" },
  { id: "m2", day: 1, start: 14, end: 15, title: "Client call" },
  { id: "m3", day: 2, start: 9, end: 9.5, title: "Standup" },
  { id: "m4", day: 2, start: 13, end: 14, title: "Design review" },
  { id: "m5", day: 3, start: 11, end: 12, title: "1:1" },
  { id: "m6", day: 4, start: 15, end: 16, title: "Retro" },
];

interface Block {
  id: string;
  goal: GoalId;
  day: number;
  start: number;
}

interface Drag {
  goal: GoalId;
  x: number;
  y: number;
  target: { day: number; start: number } | null;
}

function shortHour(h: number) {
  return formatHour(h).replace(":00", "").replace(" ", "").toLowerCase();
}

function ProtectedBlock({ block, repeat, onRemove }: { block: Block; repeat: boolean; onRemove?: () => void }) {
  const goal = GOALS[block.goal];
  const colors = blockColors(goal.color);
  return (
    <div
      className="group h-full overflow-hidden rounded-[8px] px-1.5 py-1"
      style={{
        backgroundColor: `color-mix(in srgb, ${colors.line} 9%, transparent)`,
        border: `1px dashed ${colors.line}`,
        color: colors.text,
      }}
    >
      <div className="flex items-center gap-1">
        <span className="min-w-0 flex-1 truncate text-[10px] font-semibold leading-3">{goal.short}</span>
        {repeat && <Repeat className="size-2.5 shrink-0" strokeWidth={2.5} />}
        {onRemove && (
          <button
            type="button"
            tabIndex={-1}
            onClick={onRemove}
            aria-label="Remove protected time"
            className="hidden size-3 shrink-0 cursor-pointer items-center justify-center rounded-full group-hover:flex"
          >
            <X className="size-2.5" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div className="mt-0.5 text-[9px] leading-3 opacity-80">
        {shortHour(block.start)}–{shortHour(block.start + LENGTH)}
      </div>
    </div>
  );
}

function ProtectScene() {
  const { active, takeOver } = useAutopilot();
  const rootRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [blocks, setBlocks] = useState<Array<Block>>([]);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [repeat, setRepeat] = useState(false);

  const place = (goal: GoalId, day: number, start: number) =>
    setBlocks((prev) => [
      ...prev.filter((b) => !(b.day === day && b.start < start + LENGTH && start < b.start + LENGTH)),
      { id: `${goal}-${day}-${start}-${prev.length}`, goal, day, start },
    ]);

  useAutoStep(active, 1200, () => place("ship", 0, 8));
  useAutoStep(active, 2200, () => place("youtube", 2, 10.5));
  useAutoStep(active, 3200, () => place("ship", 3, 8.5));

  const toScene = (e: ReactPointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    const s = r.width / W;
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  };

  const hitTest = (e: ReactPointerEvent) => {
    for (let day = 0; day < DAYS.length; day++) {
      const r = colRefs.current[day]?.getBoundingClientRect();
      if (!r || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) continue;
      const hour = START + ((e.clientY - r.top) / r.height) * (END - START);
      const start = Math.min(Math.max(Math.round((hour - LENGTH / 2) * 2) / 2, START), END - LENGTH);
      return { day, start };
    }
    return null;
  };

  const onDown = (goal: GoalId) => (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ goal, ...toScene(e), target: null });
  };
  const onMove = (e: ReactPointerEvent) => {
    if (!drag) return;
    setDrag({ ...drag, ...toScene(e), target: hitTest(e) });
  };
  const onUp = () => {
    if (drag?.target) place(drag.goal, drag.target.day, drag.target.start);
    setDrag(null);
  };

  const hoursFor = (goal: GoalId) => blocks.filter((b) => b.goal === goal).length * LENGTH;
  const total = blocks.length * LENGTH;
  const hours = Array.from({ length: END - START }, (_, i) => START + i);

  return (
    <Scene onInteract={takeOver}>
      <div ref={rootRef} className="absolute inset-0">
        <Rise delay={0.05} y={14} className="absolute left-[20px] top-[20px] w-[176px]">
          <Panel className="p-2">
            <p className="px-2 pb-1 pt-1.5 type-caption font-medium text-muted-foreground">Season goals</p>
            {SIDEBAR_GOALS.map((id) => {
              const goal = GOALS[id];
              const h = hoursFor(id);
              return (
                <div
                  key={id}
                  onPointerDown={onDown(id)}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={() => setDrag(null)}
                  className={cn(
                    "flex cursor-grab touch-none items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-hover active:cursor-grabbing",
                    drag?.goal === id && "bg-hover",
                  )}
                >
                  <GoalChip goal={goal} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate type-body font-medium text-foreground">{goal.short}</span>
                    <span className="block type-caption tabular-nums text-muted-foreground">
                      {h ? `${formatDuration(h)} protected${repeat ? " / wk" : ""}` : "No time yet"}
                    </span>
                  </span>
                </div>
              );
            })}
          </Panel>
          <p className="mt-3 px-1 type-body leading-[17px] text-muted-foreground">
            Drag a goal onto the week to protect time for it.
          </p>
        </Rise>

        <Rise delay={0.15} y={14} className="absolute left-[212px] right-[20px] top-[20px]">
          <div className="overflow-hidden rounded-xl border border-sidebar-border bg-calendar-grid shadow-module">
            <div className="flex h-10 items-center justify-between border-b border-border px-3">
              <span className="type-body font-semibold text-foreground">Oct 12 – 16</span>
              <span className="flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 type-body font-medium text-foreground">
                <ShieldCheck className="size-3.5" />
                Protect time
              </span>
            </div>
            <div className="flex border-b border-border-subtle pl-9">
              {DAYS.map((d, i) => (
                <span key={d} className="flex-1 py-1.5 text-center type-caption font-medium text-muted-foreground">
                  {d} {12 + i}
                </span>
              ))}
            </div>
            <div className="relative flex pt-2" style={{ height: (END - START) * HOUR + 12 }}>
              <div className="w-9 shrink-0">
                {hours.map((h, i) => (
                  <div key={h} className="relative" style={{ height: HOUR }}>
                    {i > 0 && (
                      <span className="absolute -top-[7px] right-1.5 text-[9px] text-muted-foreground">
                        {shortHour(h)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {DAYS.map((d, day) => (
                <div
                  key={d}
                  ref={(el) => {
                    colRefs.current[day] = el;
                  }}
                  className="relative flex-1 border-l border-border-subtle"
                  style={{ height: (END - START) * HOUR }}
                >
                  {hours.map((h, i) => (
                    <div key={h} className={i ? "border-t border-border-subtle" : ""} style={{ height: HOUR }} />
                  ))}

                  <AnimatePresence>
                    {blocks
                      .filter((b) => b.day === day)
                      .map((b) => (
                        <motion.div
                          key={b.id}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ duration: 0.35, ease: EASE_OUT }}
                          className="absolute inset-x-[2px]"
                          style={{ top: (b.start - START) * HOUR + 1, height: LENGTH * HOUR - 2 }}
                        >
                          <ProtectedBlock
                            block={b}
                            repeat={repeat}
                            onRemove={() => setBlocks((prev) => prev.filter((x) => x.id !== b.id))}
                          />
                        </motion.div>
                      ))}
                  </AnimatePresence>

                  {drag?.target?.day === day && (
                    <div
                      className="pointer-events-none absolute inset-x-[2px] rounded-[8px] border border-dashed border-foreground/40 bg-foreground/[0.04]"
                      style={{ top: (drag.target.start - START) * HOUR + 1, height: LENGTH * HOUR - 2 }}
                    />
                  )}

                  {MEETINGS.filter((m) => m.day === day).map((m) => (
                    <div
                      key={m.id}
                      className="pointer-events-none absolute inset-x-[5px] z-10 overflow-hidden rounded-[6px] px-1.5 py-0.5"
                      style={{
                        top: (m.start - START) * HOUR + 1,
                        height: (m.end - m.start) * HOUR - 2,
                        background: UNASSIGNED_COLORS.fill,
                        color: UNASSIGNED_COLORS.text,
                        boxShadow: `inset 0 0 0 1px ${UNASSIGNED_COLORS.line}, 0 1px 2px rgb(0 0 0 / 0.04)`,
                      }}
                    >
                      <span className="block truncate text-[9px] font-medium leading-3">{m.title}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex h-10 items-center justify-between border-t border-border px-3">
              <Switch on={repeat} onToggle={() => setRepeat((r) => !r)} label="Repeat weekly" />
              <span className="type-body tabular-nums text-muted-foreground">
                {total ? (
                  <>
                    <span className="font-semibold text-foreground">{formatDuration(total)}</span>{" "}
                    {repeat ? "protected every week" : "protected this week"}
                  </>
                ) : (
                  "Nothing protected yet"
                )}
              </span>
            </div>
          </div>
        </Rise>

        {drag && (
          <div
            className="pointer-events-none absolute z-30 flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5 shadow-float"
            style={{ left: drag.x - 18, top: drag.y - 18 }}
          >
            <GoalChip goal={GOALS[drag.goal]} />
            <span className="type-body font-medium text-foreground">{GOALS[drag.goal].short}</span>
          </div>
        )}
      </div>
    </Scene>
  );
}

export function ProtectTimeVisual() {
  return (
    <Stage
      width={W}
      height={446}
      label="A Superfocus week with meetings; dragging a goal onto open time creates a dashed protected time block for that goal, with an option to repeat it weekly."
    >
      <ProtectScene />
    </Stage>
  );
}
