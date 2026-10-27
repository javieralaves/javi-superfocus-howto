"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUp, BookOpenText, Check, GitBranch, MessagesSquare, NotebookText, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { blockColors, UNASSIGNED_COLORS } from "@/components/illustrations/color";
import { BUTTON_OUTLINE, BUTTON_PRIMARY, BUTTON_SM, PRESS, Pill } from "@/components/illustrations/primitives";
import { EASE_OUT } from "@/components/illustrations/stage";
import { CHANGES, GOAL, type ChangeRowProps } from "./ai-planning-data";
import { Panel, useAutoStep, useTypewriter } from "./kit";

const ASK = "I have two hours for this goal tomorrow. Given the work we've done, what should I focus on?";
const REPLY = "Test the new flow with users first. Save the broader redesign for later.";

const SOURCES = [
  { icon: <GitBranch className="size-3 shrink-0" />, source: "GitHub", context: "Product work", text: "Explored a simpler onboarding flow" },
  { icon: <NotebookText className="size-3 shrink-0" />, source: "Meeting notes", context: "Team discussion", text: "Agreed to test the flow with users" },
];

type Step = "context" | "ask" | "review";
type Decision = "pending" | "kept" | "discarded";

const STEPS: Array<{ id: Step; label: string }> = [
  { id: "context", label: "Context" },
  { id: "ask", label: "Ask" },
  { id: "review", label: "Review" },
];

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

function SfMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/sf-logo.svg" alt="" aria-hidden className={cn("size-3 shrink-0", className)} />;
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="flex items-center gap-1.5 type-caption font-medium text-muted-foreground">{children}</p>;
}

export function SourceCard({
  icon,
  source,
  context,
  text,
}: {
  icon: ReactNode;
  source: string;
  context: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5 shadow-module">
      <p className="flex items-center gap-1.5 type-caption text-muted-foreground">
        {icon}
        <span className="font-medium text-foreground/80">{source}</span>
        <span aria-hidden>·</span>
        <span>{context}</span>
      </p>
      <p className="mt-1 type-body-lg text-foreground">{text}</p>
    </div>
  );
}

function GoalChip() {
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-md"
      style={{ backgroundColor: `${GOAL.color}15`, color: GOAL.color }}
    >
      <Rocket className="size-3.5" />
    </span>
  );
}

const STRIP_START = 12;
const STRIP_END = 17;
const STRIP_HOUR = 22;

const STRIP_DAYS: Array<{
  day: string;
  focus?: boolean;
  blocks: Array<{ title: string; start: number; end: number; protected?: boolean }>;
}> = [
  { day: "Tue", blocks: [{ title: "Team sync", start: 13, end: 14 }] },
  { day: "Wed", focus: true, blocks: [{ title: "Protected", start: 14, end: 16, protected: true }] },
  { day: "Thu", blocks: [{ title: "Design review", start: 15, end: 16 }] },
];

function WeekStrip() {
  const hours = Array.from({ length: STRIP_END - STRIP_START }, (_, i) => STRIP_START + i);
  const goal = blockColors(GOAL.color);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-calendar-grid">
      <div className="flex border-b border-border">
        <span className="w-7 shrink-0" />
        {STRIP_DAYS.map((d) => (
          <span
            key={d.day}
            className={cn(
              "flex-1 py-1 text-center type-caption",
              d.focus ? "font-semibold text-foreground" : "font-medium text-muted-foreground",
            )}
          >
            {d.day}
          </span>
        ))}
      </div>
      <div className="relative flex pt-1.5" style={{ height: hours.length * STRIP_HOUR + 6 }}>
        <div className="w-7 shrink-0">
          {hours.map((h, i) => (
            <div key={h} className="relative" style={{ height: STRIP_HOUR }}>
              {i > 0 && (
                <span className="absolute -top-[6px] right-1 text-[9px] text-muted-foreground">{h > 12 ? h - 12 : h}</span>
              )}
            </div>
          ))}
        </div>
        {STRIP_DAYS.map((d) => (
          <div key={d.day} className="relative flex-1 border-l border-border-subtle">
            {hours.map((h, i) => (
              <div key={h} className={i ? "border-t border-border-subtle" : ""} style={{ height: STRIP_HOUR }} />
            ))}
            {d.blocks.map((b) => {
              const colors = b.protected ? goal : UNASSIGNED_COLORS;
              return (
                <div
                  key={b.title}
                  className="absolute inset-x-[3px] overflow-hidden rounded-[6px] px-1.5 py-1"
                  style={{
                    top: (b.start - STRIP_START) * STRIP_HOUR + 1,
                    height: (b.end - b.start) * STRIP_HOUR - 2,
                    color: colors.text,
                    backgroundColor: b.protected ? `color-mix(in srgb, ${colors.line} 9%, transparent)` : colors.fill,
                    border: b.protected ? `1px dashed ${colors.line}` : undefined,
                    boxShadow: b.protected ? undefined : `inset 0 0 0 1px ${colors.line}`,
                  }}
                >
                  <p className="truncate text-[10px] font-medium leading-3">{b.title}</p>
                  {b.protected && <p className="mt-0.5 text-[9px] leading-3 opacity-80">2 – 4 PM</p>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContextScene() {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col gap-2">
        <motion.div variants={item}>
          <Caption>Recent work, elsewhere</Caption>
        </motion.div>
        {SOURCES.map((s) => (
          <motion.div key={s.source} variants={item}>
            <SourceCard {...s} />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <motion.div variants={item}>
          <Caption>
            <SfMark />
            In Superfocus
          </Caption>
        </motion.div>
        <motion.div variants={item}>
          <Panel className="flex flex-col gap-3 p-3">
            <div className="flex items-center gap-2.5">
              <GoalChip />
              <div className="min-w-0">
                <p className="type-caption text-muted-foreground">Goal</p>
                <p className="truncate type-body-lg font-medium text-foreground">{GOAL.title}</p>
              </div>
            </div>
            <div>
              <p className="mb-1.5 type-caption text-muted-foreground">
                Protected time · <span className="font-medium text-foreground">Wednesday, 2–4 PM</span>
              </p>
              <WeekStrip />
            </div>
          </Panel>
        </motion.div>
      </div>
    </div>
  );
}

function BasedOn({ className }: { className?: string }) {
  const chips: Array<{ key: string; icon: ReactNode; label: string }> = [
    { key: "gh", icon: <GitBranch className="size-3 shrink-0" />, label: "Product work" },
    { key: "notes", icon: <NotebookText className="size-3 shrink-0" />, label: "Team discussion" },
    { key: "goal", icon: <SfMark />, label: "Goal" },
    { key: "time", icon: <SfMark />, label: "Wed 2–4 PM" },
  ];
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      <span className="mr-0.5 type-caption text-muted-foreground">Based on</span>
      {chips.map((c) => (
        <span
          key={c.key}
          className="flex items-center gap-1 rounded-full border border-border bg-surface-1 px-2 py-0.5 type-caption text-foreground/80"
        >
          {c.icon}
          {c.label}
        </span>
      ))}
    </div>
  );
}

function AskScene({ message, typing, replied }: { message: string; typing: boolean; replied: boolean }) {
  return (
    <motion.div variants={item} className="mx-auto max-w-[540px]">
      <Panel className="flex flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <span className="flex items-center gap-2 type-body font-semibold text-foreground">
            <span className="flex size-6 items-center justify-center rounded-md bg-surface-2 text-muted-foreground">
              <MessagesSquare className="size-3.5" />
            </span>
            Assistant
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-surface-2 px-2 py-0.5 type-caption text-muted-foreground">
            <SfMark />
            Superfocus connected
          </span>
        </div>

        <div className="flex min-h-[188px] flex-col gap-3 px-4 py-3.5">
          <div className="max-w-[88%] self-end rounded-2xl rounded-br-md bg-foreground px-3 py-2 type-body-lg text-background">
            {message}
            {typing && <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-background/70" />}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {replied ? (
              <motion.div
                key="reply"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="flex flex-col gap-2"
              >
                <p className="type-body-lg text-foreground">{REPLY}</p>
                <BasedOn />
                <p className="type-caption text-muted-foreground">Suggestions only. Nothing in Superfocus has changed.</p>
              </motion.div>
            ) : (
              !typing && (
                <motion.p
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sf-shimmer type-body"
                >
                  Checking your goal and Wednesday&apos;s protected time…
                </motion.p>
              )
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-border p-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-1 py-1.5 pl-3 pr-1.5">
            <span className="flex-1 type-body text-muted-foreground">Reply…</span>
            <span className={cn("flex size-6 items-center justify-center rounded-md", BUTTON_PRIMARY)}>
              <ArrowUp className="size-3.5" />
            </span>
          </div>
        </div>
      </Panel>
    </motion.div>
  );
}

/** A Superfocus change, either still a suggestion or kept by the user. */
export function ChangeRow({ kind, title, day, state }: ChangeRowProps & { state: Decision }) {
  const kept = state === "kept";
  const discarded = state === "discarded";
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-[background-color,border-color,opacity] duration-300",
        kept ? "border-border bg-card" : "border-dashed",
        state === "pending" && "border-coach-brand/35 bg-coach-surface/60",
        discarded && "border-border opacity-45",
      )}
    >
      {kind === "task" ? (
        <span
          className={cn(
            "size-4 shrink-0 rounded-sm transition-colors duration-300",
            kept ? "bg-surface-3 ring-1 ring-inset ring-foreground/10" : "border border-dashed border-current text-coach-brand/60",
          )}
        />
      ) : (
        <BookOpenText className={cn("size-4 shrink-0", kept ? "text-muted-foreground" : "text-coach-brand/70")} />
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block type-body-lg text-foreground", discarded && "line-through")}>{title}</span>
        <span className="flex items-center gap-1.5 type-caption text-muted-foreground">
          {kind === "task" ? (
            <>
              <span className="size-1.5 rounded-full" style={{ backgroundColor: GOAL.color }} />
              {GOAL.title}
            </>
          ) : kept ? (
            "Saved to Journal"
          ) : (
            "Journal note"
          )}
        </span>
      </span>
      {day && (
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="hidden type-caption text-muted-foreground min-[380px]:inline">Plan for</span>
          <Pill>{day}</Pill>
        </span>
      )}
    </div>
  );
}

export function DecisionBadge({ state }: { state: Decision }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={state}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: EASE_OUT }}
        className={cn(
          "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold",
          state === "pending" && "bg-coach-surface text-coach-brand",
          state === "kept" && "bg-success-surface text-success-strong",
          state === "discarded" && "bg-surface-2 text-muted-foreground",
        )}
      >
        {state === "kept" && <Check className="size-3" strokeWidth={2.5} />}
        {state === "pending" ? "Review first" : state === "kept" ? "Kept by you" : "Discarded"}
      </motion.span>
    </AnimatePresence>
  );
}

function ReviewScene({
  decision,
  onDecide,
}: {
  decision: Decision;
  onDecide: (decision: Exclude<Decision, "pending">) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)]">
      <motion.div variants={item} className="flex flex-col gap-2">
        <Caption>From the conversation</Caption>
        <div className="rounded-lg border border-border bg-card px-3 py-2.5 shadow-module">
          <p className="flex items-center gap-1.5 type-caption text-muted-foreground">
            <MessagesSquare className="size-3" />
            Assistant
          </p>
          <p className="mt-1 type-body text-foreground/85">{REPLY}</p>
        </div>
        <BasedOn />
      </motion.div>

      <motion.div variants={item}>
        <Panel className="flex flex-col">
          <div className="flex items-start justify-between gap-3 px-4 pb-2.5 pt-3.5">
            <div className="min-w-0">
              <p className="type-heading-sm font-semibold text-foreground">Suggested changes</p>
              <p className="mt-0.5 type-body text-muted-foreground">Nothing changes until you keep it.</p>
            </div>
            <DecisionBadge state={decision} />
          </div>
          <div className="flex flex-col gap-1.5 px-3">
            {CHANGES.map((c) => (
              <motion.div key={c.title} variants={item}>
                <ChangeRow {...c} state={decision} />
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex min-h-[48px] items-center justify-end gap-2 border-t border-border px-4 py-2.5">
            <AnimatePresence mode="wait" initial={false}>
              {decision === "pending" ? (
                <motion.div
                  key="actions"
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => onDecide("discarded")}
                    className={cn(BUTTON_SM, BUTTON_OUTLINE, "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coach-brand")}
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecide("kept")}
                    className={cn(BUTTON_SM, BUTTON_PRIMARY, PRESS, "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coach-brand")}
                  >
                    Keep
                  </button>
                </motion.div>
              ) : (
                <motion.p
                  key="result"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="flex w-full items-center gap-1.5 type-body text-muted-foreground"
                >
                  {decision === "kept" ? (
                    <>
                      <Check className="size-3.5 text-success-strong" strokeWidth={2.5} />
                      Two tasks planned and a Journal note saved, after your review.
                    </>
                  ) : (
                    "Discarded. Your plan stays as it was."
                  )}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}

export function AIAssistedPlanningVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const still = useReducedMotion() ?? false;
  const [interacted, setInteracted] = useState(false);
  const [step, setStep] = useState<Step>("context");
  const [replied, setReplied] = useState(false);
  const [decision, setDecision] = useState<Decision>("pending");

  const active = inView && !still && !interacted;
  const shown: Step = still && !interacted ? "review" : step;

  useAutoStep(active, 2800, () => setStep("ask"));
  const { typed, done } = useTypewriter(ASK, active && step === "ask", 18);
  useAutoStep(active && done, 1000, () => setReplied(true));
  useAutoStep(active && replied, 2000, () => setStep("review"));
  useAutoStep(active && step === "review", 2000, () => setDecision("kept"));

  const choose = (next: Step) => {
    setInteracted(true);
    setStep(next);
  };
  const decide = (next: Exclude<Decision, "pending">) => {
    setInteracted(true);
    setDecision(next);
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Illustrated example. Recent work from GitHub and meeting notes, a Superfocus goal and Wednesday's protected time go into a conversation with an assistant. Its suggestion becomes proposed tasks and a Journal note that stay unchanged until you choose to keep them."
      className="sf-ui overflow-hidden rounded-[24px] bg-[#f5f6f8] p-3 sm:p-5"
    >
      <div role="group" aria-label="Steps in this example" className="flex justify-center">
        <div className="flex gap-0.5 rounded-lg bg-surface-3 p-0.5">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={shown === s.id}
              onClick={() => choose(s.id)}
              className={cn(
                "flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-3 type-body font-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-coach-brand",
                PRESS,
                shown === s.id ? "bg-card text-foreground shadow-module" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{i + 1}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 min-h-[470px] sm:min-h-[316px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={shown}
            variants={list}
            initial={still ? false : "hidden"}
            animate={inView || still ? "show" : "hidden"}
            exit={{ opacity: 0, transition: { duration: still ? 0 : 0.18 } }}
          >
            {shown === "context" && <ContextScene />}
            {shown === "ask" && (
              <AskScene message={active ? typed : ASK} typing={active && !done} replied={!active || replied} />
            )}
            {shown === "review" && <ReviewScene decision={decision} onDecide={decide} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
