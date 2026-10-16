"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, Undo2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GOALS } from "@/components/illustrations/data";
import { CoachIcon, MilestonesIcon } from "@/components/illustrations/icons";
import {
  BUTTON_OUTLINE,
  BUTTON_PRIMARY,
  BUTTON_SM,
  GoalChip,
  PRESS,
  Pill,
} from "@/components/illustrations/primitives";
import { EASE_OUT, Rise, Stage } from "@/components/illustrations/stage";
import { Panel, Scene, useAutoStep, useAutopilot, useTypewriter } from "./kit";

type Phase = "question" | "proposal" | "kept" | "reverted";
type Mode = "write" | "chat";

const ANSWER = "Publish the first episode, and keep the long runs on Saturdays.";
const GOAL = GOALS.youtube;

const WEEKLY = [
  { id: "w1", title: "Film episode 1", pill: "Oct 18" },
  { id: "w2", title: "Publish episode 1", pill: "Oct 25" },
  { id: "w3", title: "Publish episode 2", pill: "Nov 1" },
  { id: "w4", title: "Publish episode 3", pill: "Nov 8" },
];

function Bubble({ from, children }: { from: "coach" | "you"; children: ReactNode }) {
  return (
    <div className={cn("flex gap-2", from === "you" && "justify-end")}>
      {from === "coach" && (
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-coach-surface">
          <CoachIcon className="size-3 text-coach-brand" />
        </span>
      )}
      <p
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2 type-body",
          from === "coach" ? "bg-surface-2 text-foreground" : "bg-foreground text-background",
        )}
      >
        {children}
      </p>
    </div>
  );
}

function WeeklySyncScene() {
  const { active, takeOver, still } = useAutopilot();
  const [phase, setPhase] = useState<Phase>(still ? "kept" : "question");
  const [mode, setMode] = useState<Mode>("write");
  const [draft, setDraft] = useState("");
  const { typed, done } = useTypewriter(ANSWER, active && phase === "question", 30);
  const answer = active ? typed : draft || (phase === "question" ? "" : ANSWER);

  useAutoStep(active && phase === "question" && done, 700, () => setPhase("proposal"));
  useAutoStep(active && phase === "proposal", 3600, () => setPhase("kept"));

  const showGhosts = phase === "proposal";
  const showKept = phase === "kept";

  return (
    <Scene onInteract={takeOver}>
      <Rise delay={0.05} y={14} className="absolute bottom-[20px] left-[20px] top-[20px] w-[340px]">
        <Panel className="flex h-full flex-col p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 type-body font-medium text-foreground">
              <CoachIcon className="size-3.5 text-coach-brand" />
              Weekly sync
            </span>
            <X className="size-4 text-muted-foreground" />
          </div>

          <p className="mt-5 type-heading-sm font-semibold text-foreground">What would make next week a success?</p>
          <div className="mt-3 flex w-fit gap-0.5 rounded-lg bg-surface-3 p-0.5">
            {(["write", "chat"] as const).map((m) => (
              <button
                key={m}
                type="button"
                tabIndex={-1}
                onClick={() => setMode(m)}
                className={cn(
                  "h-6 cursor-pointer rounded-md px-3 type-body font-medium capitalize",
                  PRESS,
                  mode === m ? "bg-card text-foreground shadow-module" : "text-muted-foreground",
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="mt-3 min-h-0 flex-1">
            {mode === "write" ? (
              <textarea
                tabIndex={-1}
                rows={2}
                value={answer}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a few words…"
                className="w-full resize-none rounded-lg border border-border bg-surface-1 p-3 type-body text-foreground outline-none placeholder:text-muted-foreground"
              />
            ) : (
              <div className="flex flex-col gap-2">
                <Bubble from="coach">What&apos;s the one outcome that would make next week feel like real progress?</Bubble>
                {answer && <Bubble from="you">{answer}</Bubble>}
              </div>
            )}

            <AnimatePresence>
              {phase !== "question" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="mt-3"
                >
                  <Bubble from="coach">
                    &ldquo;{GOAL.title}&rdquo; is a big outcome for one season. I&apos;ve broken it into weekly
                    milestones so each week has a clear target.
                  </Bubble>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-end gap-2">
            {phase === "question" && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setPhase("proposal")}
                className={cn(BUTTON_SM, BUTTON_PRIMARY, "cursor-pointer")}
              >
                Continue
              </button>
            )}
            {phase === "proposal" && (
              <>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setPhase("reverted")}
                  className={cn(BUTTON_SM, BUTTON_OUTLINE, "cursor-pointer")}
                >
                  <Undo2 className="size-3.5" />
                  Undo
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setPhase("kept")}
                  className={cn(BUTTON_SM, BUTTON_PRIMARY, "cursor-pointer")}
                >
                  Keep changes
                </button>
              </>
            )}
            {(phase === "kept" || phase === "reverted") && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setPhase(phase === "kept" ? "reverted" : "proposal")}
                className={cn(BUTTON_SM, BUTTON_OUTLINE, "cursor-pointer")}
              >
                {phase === "kept" ? <Undo2 className="size-3.5" /> : <RotateCcw className="size-3.5" />}
                {phase === "kept" ? "Undo" : "Show suggestion again"}
              </button>
            )}
          </div>
        </Panel>
      </Rise>

      <Rise delay={0.2} y={14} className="absolute right-[20px] top-[20px] w-[240px]">
        <Panel className="p-4">
          <div className="flex items-center gap-2.5">
            <GoalChip goal={GOAL} />
            <span className="min-w-0">
              <span className="block type-body font-semibold leading-4 text-foreground">{GOAL.title}</span>
              <span className="block type-caption text-muted-foreground">Season goal · 12 weeks</span>
            </span>
          </div>
          <p className="mb-1 mt-4 type-caption font-medium text-muted-foreground">Milestones</p>
          <div className="flex h-8 items-center gap-2 rounded-md">
            <MilestonesIcon className="size-4 shrink-0" style={{ color: GOAL.color }} />
            <span className="min-w-0 flex-1 truncate type-body font-medium text-foreground">Publish first 3 videos</span>
            <Pill>Nov 8</Pill>
          </div>
          <AnimatePresence>
            {(showGhosts || showKept) &&
              WEEKLY.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 32 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: still ? 0 : 0.3, ease: EASE_OUT, delay: still ? 0 : i * 0.08 }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      "mt-1 ml-4 flex h-7 items-center gap-2 rounded-md px-2 transition-[outline-color,background-color] duration-300",
                      showGhosts ? "sf-ghost" : "bg-transparent",
                    )}
                    style={
                      {
                        "--ghost-line": "var(--coach)",
                        "--ghost-bg": "var(--coach-surface)",
                      } as CSSProperties
                    }
                  >
                    <MilestonesIcon className="size-3.5 shrink-0" style={{ color: GOAL.color }} />
                    <span className="min-w-0 flex-1 truncate type-body text-foreground/85">{w.title}</span>
                    <Pill>{w.pill}</Pill>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </Panel>

        <div className="mt-3 flex h-8 justify-center">
          <AnimatePresence mode="wait">
            {(phase === "kept" || phase === "reverted") && (
              <motion.span
                key={phase}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 type-body font-medium text-background shadow-float"
              >
                <Check className="size-3.5" strokeWidth={2.5} />
                {phase === "kept" ? "4 weekly milestones added" : "Change reverted"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Rise>
    </Scene>
  );
}

export function WeeklySyncVisual() {
  return (
    <Stage
      width={640}
      height={436}
      label="The Superfocus weekly coach sync asks what would make next week a success, then the coach breaks a seasonal goal into weekly milestones that you can keep or undo."
    >
      <WeeklySyncScene />
    </Stage>
  );
}
