"use client";

import { useState, type ReactNode, type SVGProps } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Check, ListChecks, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoachIcon, MilestonesIcon } from "@/components/illustrations/icons";
import { BUTTON_PRIMARY, BUTTON_SM } from "@/components/illustrations/primitives";
import { EASE_OUT, Rise, Stage } from "@/components/illustrations/stage";
import { Panel, Scene, useAutoStep, useAutopilot } from "./kit";

/** Step icons from superos-frontend/src/features/compass/components/icons. */
function CalendarStepIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <g stroke="#0284C7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.3333 1.66667V5M6.66667 1.66667V5" />
        <path
          d="M10.8333 3.33333H9.16667C6.02397 3.33333 4.45262 3.33333 3.47631 4.30964C2.5 5.28596 2.5 6.8573 2.5 10V11.6667C2.5 14.8093 2.5 16.3807 3.47631 17.357C4.45262 18.3333 6.02397 18.3333 9.16667 18.3333H10.8333C13.976 18.3333 15.5474 18.3333 16.5237 17.357C17.5 16.3807 17.5 14.8093 17.5 11.6667V10C17.5 6.8573 17.5 5.28596 16.5237 4.30964C15.5474 3.33333 13.976 3.33333 10.8333 3.33333Z"
          fill="#E0F2FE"
        />
        <path d="M2.5 8.33333H17.5" />
        <path d="M6.25 11.6667H6.354M10 11.6667H10.105M13.75 11.6667H13.854M6.25 15H6.354M10 15H10.105" strokeWidth="1.75" />
      </g>
    </svg>
  );
}

function MilestonesStepIcon({ className }: { className?: string }) {
  return <MilestonesIcon className={cn("fill-indigo-100 stroke-indigo-600", className)} />;
}

function FirstDayStepIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M18.3333 10C18.3333 5.39762 14.6023 1.66667 10 1.66667C5.39762 1.66667 1.66667 5.39762 1.66667 10C1.66667 14.6023 5.39762 18.3333 10 18.3333C14.6023 18.3333 18.3333 14.6023 18.3333 10Z"
        fill="#CCFBF1"
        stroke="#0D9488"
        strokeWidth="1.25"
      />
      <path
        d="M6.66667 10.4167L8.75 12.5L13.3333 7.5"
        stroke="#0D9488"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ITEMS = [
  { id: "plan", label: "Plan the rest of the day", cta: "Plan the rest of the day", icon: CalendarStepIcon },
  { id: "blocking", label: "Do the time blocking exercise", cta: "Start planning exercise", icon: MilestonesStepIcon },
  { id: "focus", label: "Reach 100% focus score today", cta: "Start focusing", icon: FirstDayStepIcon },
] as const;

function ChecklistRow({
  label,
  icon: Icon,
  met,
  onClick,
}: {
  label: string;
  icon: (props: { className?: string }) => ReactNode;
  met: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar p-3 text-left shadow-sm",
        !met && "hover:bg-hover",
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-sm transition-colors duration-200",
          met ? "bg-primary text-primary-foreground" : "border border-sidebar-border",
        )}
      >
        <AnimatePresence initial={false}>
          {met && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              className="flex"
            >
              <Check className="size-3 stroke-[2.5]" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className={cn("flex shrink-0 transition-opacity", met && "opacity-50")}>
        <Icon className="size-5" />
      </span>
      <span
        className={cn(
          "flex-1 type-body-lg font-medium transition-colors",
          met ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {label}
      </span>
    </button>
  );
}

function UnlockScene() {
  const { active, takeOver, still } = useAutopilot();
  const [met, setMet] = useState<Record<string, boolean>>(
    still ? { plan: true, blocking: true, focus: true } : {},
  );
  const tick = (id: string) => setMet((m) => ({ ...m, [id]: true }));

  useAutoStep(active, 1300, () => tick("plan"));
  useAutoStep(active, 2300, () => tick("blocking"));
  useAutoStep(active, 3300, () => tick("focus"));

  const done = ITEMS.filter((i) => met[i.id]).length;
  const allMet = done === ITEMS.length;
  const next = ITEMS.find((i) => !met[i.id]);

  return (
    <Scene onInteract={takeOver}>
      <Rise delay={0.05} y={14} className="absolute left-1/2 top-[26px] w-[420px] -translate-x-1/2">
        <Panel className="p-6">
          <div className="flex items-center gap-2">
            <span className="type-caption font-semibold uppercase tracking-wide text-primary">Progress</span>
            <span className="type-caption text-muted-foreground tabular-nums">
              {done} of {ITEMS.length} steps done
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-[var(--ease-out)]"
              style={{ width: `${(done / ITEMS.length) * 100}%` }}
            />
          </div>

          <p className="mt-5 type-heading font-semibold text-foreground">
            {allMet ? "Your first coach read is ready" : "Unlock your first coach read"}
          </p>
          <p className="mt-2 type-body text-muted-foreground">
            {allMet
              ? "All three steps done. Your coach can now assess how each goal is going and what to change."
              : "Complete these steps to unlock your first coach read, and a Season view that keeps assessing your plan with recommendations."}
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            {ITEMS.map((item) => (
              <ChecklistRow
                key={item.id}
                label={item.label}
                icon={item.icon}
                met={!!met[item.id]}
                onClick={() => tick(item.id)}
              />
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={allMet ? "unlock" : next?.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className={cn(BUTTON_SM, BUTTON_PRIMARY, "mt-5 flex h-8 w-full gap-1.5")}
            >
              {allMet && <CoachIcon className="size-3.5" />}
              {allMet ? "Get your first coach read" : next?.cta}
            </motion.span>
          </AnimatePresence>
        </Panel>
      </Rise>
    </Scene>
  );
}

export function UnlockChecklistVisual() {
  return (
    <Stage
      width={640}
      height={440}
      label="The Superfocus unlock checklist: plan the rest of the day, do the time blocking exercise, and reach a 100% Focus Score. Once all three are checked, the button reads Get your first coach read."
    >
      <UnlockScene />
    </Stage>
  );
}

/**
 * The per-step cards render at native size instead of inside a scaled Stage,
 * so their product-sized text stays legible on phones.
 */
function StepFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure
      aria-label={label}
      className="my-8 rounded-[24px] border border-rule bg-white/55 p-1.5 shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_40px_-30px_rgba(15,15,25,0.22)]"
    >
      <div className="sf-ui rounded-[18px] bg-[#f5f6f8] p-3 sm:p-4">{children}</div>
    </figure>
  );
}

function StaticCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm",
        checked
          ? "bg-foreground text-background"
          : "bg-surface-3 ring-1 ring-inset ring-foreground/10",
      )}
    >
      {checked && <Check className="size-3 stroke-[2.5]" />}
    </span>
  );
}

const PLAN_SUBTASKS = [
  "Start focus on this block",
  "Plan today: brain dump, ask your coach, or drag tasks in",
  "Mark this block done",
];

export function PlanDayCard() {
  return (
    <StepFrame label="The Plan the rest of the day block: a 30-minute task block with three subtasks, ending with Mark this block done.">
      <div className="flex gap-3">
        <div className="hidden w-[124px] shrink-0 flex-col rounded-lg border border-border bg-calendar-grid p-2 sm:flex">
          <span className="type-caption font-medium text-muted-foreground">Today</span>
          <div className="mt-2 rounded-[6px] bg-sky-100 px-2 py-1.5 type-caption font-medium text-sky-800 ring-2 ring-sky-500/60">
            Plan the rest of the day
            <span className="mt-0.5 block font-normal text-sky-700/80">30m</span>
          </div>
          <div className="mt-1.5 h-9 rounded-[6px] border border-dashed border-border-strong" />
        </div>
        <Panel className="min-w-0 flex-1 p-4">
          <div className="flex items-center gap-2">
            <CalendarStepIcon className="size-4 shrink-0" />
            <p className="type-heading-sm font-semibold text-foreground">Plan the rest of the day</p>
            <span className="ml-auto shrink-0 rounded-sm bg-surface-2 px-1.5 py-0.5 type-caption text-muted-foreground tabular-nums sm:hidden">
              30m
            </span>
          </div>
          <p className="mt-1 type-body text-muted-foreground">
            Brain dump, ask your coach, or drag tasks onto the calendar. Then mark this done.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {PLAN_SUBTASKS.map((title, i) => (
              <div key={title} className="flex items-start gap-2 type-body text-foreground/85">
                <StaticCheckbox checked={i < 2} />
                <span className={cn(i < 2 && "text-muted-foreground line-through decoration-foreground/20")}>
                  {title}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </StepFrame>
  );
}

const EXERCISE = [
  { title: "Milestones", note: "Optional", icon: <MilestonesIcon className="size-4 fill-indigo-100 stroke-indigo-600" /> },
  { title: "Key tasks", note: "A few questions", icon: <ListChecks className="size-4 text-foreground" /> },
  { title: "Schedule", note: "Reserve the time", icon: <CalendarCheck className="size-4 text-foreground" /> },
  { title: "Check-in", note: "Pick a weekly slot", icon: <Repeat className="size-4 text-foreground" /> },
];

export function TimeBlockingCard() {
  return (
    <StepFrame label="The time blocking exercise in four parts: optional milestones, key tasks, scheduling those tasks, and a weekly check-in.">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
        {EXERCISE.map((s, i) => (
          <li key={s.title}>
            <Panel className="flex h-full flex-col gap-3 p-3">
              <span className="flex items-center justify-between">
                <span className="flex size-7 items-center justify-center rounded-md bg-surface-2">{s.icon}</span>
                <span className="font-mono type-caption text-muted-foreground tabular-nums">{i + 1}</span>
              </span>
              <span>
                <span className="block type-body-lg font-semibold text-foreground">{s.title}</span>
                <span
                  className={cn(
                    "mt-0.5 block type-caption",
                    i === 0 ? "font-medium text-coach-brand" : "text-muted-foreground",
                  )}
                >
                  {s.note}
                </span>
              </span>
            </Panel>
          </li>
        ))}
      </ol>
    </StepFrame>
  );
}

export function FocusScoreCard() {
  return (
    <StepFrame label="Two ways the third step is completed: a Focus Score card at 100% with every task and the daily coach sync done, or the Complete yesterday's check-in step.">
      <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr] sm:gap-4">
        <Panel className="flex flex-col gap-2 p-4">
          <p className="text-xl font-semibold tabular-nums text-foreground">100%</p>
          <div className="flex items-center gap-[2px]" aria-hidden>
            <div className="h-2.5 flex-1 rounded-full bg-success" />
            <div className="h-2.5 w-9 shrink-0 rounded-full bg-success-strong" />
          </div>
          <span className="type-body text-muted-foreground">Day complete</span>
          <span className="mt-1 type-caption text-muted-foreground">
            Every scheduled task done, plus the daily coach sync.
          </span>
        </Panel>
        <div className="flex flex-col justify-center gap-2 px-1 pb-1 sm:px-0 sm:pb-0">
          <span className="type-caption font-medium uppercase tracking-wide text-muted-foreground">
            Or, if the checklist says
          </span>
          <span className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar p-3 shadow-sm">
            <span className="size-4 shrink-0 rounded-sm border border-sidebar-border" />
            <FirstDayStepIcon className="size-5 shrink-0" />
            <span className="type-body font-medium text-foreground">Complete yesterday&apos;s check-in</span>
          </span>
          <span className="type-caption text-muted-foreground">
            Shown when your season was planned on an earlier day.
          </span>
        </div>
      </div>
    </StepFrame>
  );
}

