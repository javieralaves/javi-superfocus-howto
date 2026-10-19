"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Lock,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UNASSIGNED_COLORS, blockColors, type BlockColors } from "@/components/illustrations/color";
import { GOALS, formatHour, type GoalId } from "@/components/illustrations/data";
import { BUTTON_OUTLINE, BUTTON_SM, GoalIconBadge } from "@/components/illustrations/primitives";
import { EASE_OUT, Rise, Stage, useCue, useStage } from "@/components/illustrations/stage";
import { Mark, type ProviderId } from "./connect-calendars";
import { Scene, StepFrame } from "./kit";

const START = 9;
const END = 16;
const HOUR = 40;

interface DayEvent {
  id: string;
  title: string;
  start: number;
  end: number;
  colors: BlockColors;
  mark?: ProviderId;
  lock?: boolean;
}

const GOOGLE_COLORS: BlockColors = { fill: "#e8f0fe", text: "#1a56c4", line: "#c6dafc" };
const EXPORTED_COLORS: BlockColors = { fill: "#f1f3f4", text: "#3c4043", line: "#dadce0" };

const MEETINGS = [
  { id: "standup", title: "Standup", start: 9.5, end: 10 },
  { id: "client", title: "Client call", start: 11, end: 12 },
  { id: "maya", title: "1:1 with Maya", start: 14, end: 14.5 },
];

const GOAL_BLOCKS: Array<{ id: string; title: string; start: number; end: number; goal: GoalId }> = [
  { id: "video", title: "Edit launch video", start: 10, end: 11, goal: "youtube" },
  { id: "run", title: "Long run", start: 12.5, end: 13.5, goal: "marathon" },
  { id: "spec", title: "Write v2 spec", start: 14.5, end: 15.5, goal: "ship" },
];

function EventChip({ event, delay }: { event: DayEvent; delay: number }) {
  const { still } = useStage();
  const short = event.end - event.start < 0.75;
  return (
    <motion.div
      initial={still ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE_OUT, delay: still ? 0 : delay }}
      className={cn(
        "absolute inset-x-1 overflow-hidden rounded-[6px] px-2",
        short ? "flex items-center" : "py-[3px]",
      )}
      style={{
        top: (event.start - START) * HOUR + 1,
        height: (event.end - event.start) * HOUR - 2,
        background: event.colors.fill,
        color: event.colors.text,
        boxShadow: `inset 0 0 0 1px ${event.colors.line}`,
      }}
    >
      <div className="flex w-full items-center gap-1">
        {event.lock && <Lock className="size-2.5 shrink-0" strokeWidth={2.5} />}
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium leading-[13px]">{event.title}</span>
        {event.mark && <Mark id={event.mark} size={12} />}
      </div>
      {!short && (
        <div className="text-[10px] leading-[11px] opacity-75">
          {event.lock ? "Busy · Private" : `${formatHour(event.start)} – ${formatHour(event.end)}`}
        </div>
      )}
    </motion.div>
  );
}

function DayColumn({
  title,
  icon,
  base,
  incoming,
  show,
}: {
  title: string;
  icon: ReactNode;
  base: Array<DayEvent>;
  incoming: Array<DayEvent>;
  show: boolean;
}) {
  const hours = Array.from({ length: END - START }, (_, i) => START + i);
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-sidebar-border bg-calendar-grid shadow-module">
      <div className="flex h-11 items-center gap-2 border-b border-border px-4">
        {icon}
        <span className="type-body font-semibold text-foreground">{title}</span>
        <span className="ml-auto type-caption text-muted-foreground">Today</span>
      </div>
      <div className="relative flex pt-2 pb-2" style={{ height: (END - START) * HOUR + 16 }}>
        <div className="w-11 shrink-0">
          {hours.map((h, i) => (
            <div key={h} className="relative" style={{ height: HOUR }}>
              {i > 0 && (
                <span className="absolute -top-2 right-2 type-caption text-muted-foreground">
                  {formatHour(h).replace(":00", "")}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="relative flex-1 pr-1">
          {hours.map((h, i) => (
            <div key={h} className={i ? "border-t border-border-subtle" : ""} style={{ height: HOUR }} />
          ))}
          {base.map((e) => (
            <EventChip key={e.id} event={e} delay={0} />
          ))}
          <AnimatePresence>
            {show && incoming.map((e, i) => <EventChip key={e.id} event={e} delay={i * 0.12} />)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DirectionBadge({ on, tone, children }: { on: boolean; tone: "in" | "out"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-full border transition-colors duration-300",
        on
          ? tone === "in"
            ? "border-foreground bg-foreground text-background"
            : "border-coach bg-coach text-white"
          : "border-border bg-surface-1 text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function LegendChip({ on, icon, label, detail }: { on: boolean; icon: ReactNode; label: string; detail: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 rounded-full border border-border bg-surface-1 py-1.5 pr-3.5 pl-2 transition-opacity duration-300",
        on ? "opacity-100" : "opacity-45",
      )}
    >
      {icon}
      <span className="type-body font-semibold text-foreground">{label}</span>
      <span className="type-body text-muted-foreground">{detail}</span>
    </span>
  );
}

function SyncScene() {
  const incoming = useCue(900);
  const outgoing = useCue(2300);

  const googleMeetings: Array<DayEvent> = MEETINGS.map((m) => ({ ...m, colors: GOOGLE_COLORS }));
  const exported: Array<DayEvent> = GOAL_BLOCKS.map((b) => ({
    id: `out-${b.id}`,
    title: "Blocked via Superfocus",
    start: b.start,
    end: b.end,
    colors: EXPORTED_COLORS,
    lock: true,
  }));
  const goalBlocks: Array<DayEvent> = GOAL_BLOCKS.map((b) => ({ ...b, colors: blockColors(GOALS[b.goal].color) }));
  const imported: Array<DayEvent> = MEETINGS.map((m) => ({
    ...m,
    id: `in-${m.id}`,
    colors: UNASSIGNED_COLORS,
    mark: "google",
  }));

  return (
    <Scene>
      <Rise delay={0.05} className="absolute left-[24px] top-[24px] w-[268px]">
        <DayColumn
          title="Google Calendar"
          icon={<Mark id="google" size={18} />}
          base={googleMeetings}
          incoming={exported}
          show={outgoing}
        />
      </Rise>

      <div className="absolute left-[292px] top-[24px] flex h-[340px] w-[56px] flex-col items-center justify-center gap-16">
        <DirectionBadge on={incoming} tone="in">
          <ArrowRight className="size-4" strokeWidth={2.25} />
        </DirectionBadge>
        <DirectionBadge on={outgoing} tone="out">
          <ArrowLeft className="size-4" strokeWidth={2.25} />
        </DirectionBadge>
      </div>

      <Rise delay={0.15} className="absolute right-[24px] top-[24px] w-[268px]">
        <DayColumn
          title="Superfocus"
          icon={<Image src="/sf-logo.svg" alt="" width={16} height={16} className="size-4" />}
          base={goalBlocks}
          incoming={imported}
          show={incoming}
        />
      </Rise>

      <Rise delay={0.3} className="absolute inset-x-0 top-[384px] flex justify-center gap-2.5">
        <LegendChip
          on={incoming}
          icon={<ArrowRight className="size-3.5 text-foreground" strokeWidth={2.25} />}
          label="Incoming"
          detail="calendar events"
        />
        <LegendChip
          on={outgoing}
          icon={<ArrowLeft className="size-3.5 text-coach" strokeWidth={2.25} />}
          label="Outgoing"
          detail="your Superfocus blocks"
        />
      </Rise>
    </Scene>
  );
}

export function CalendarSyncVisual() {
  return (
    <Stage
      width={640}
      height={436}
      label="Two calendars side by side. Meetings from Google Calendar come into Superfocus, and Superfocus goal blocks go out to Google Calendar as private, busy events titled Blocked via Superfocus."
    >
      <SyncScene />
    </Stage>
  );
}

function BoxIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface-1 text-foreground shadow-xs">
      {children}
    </span>
  );
}

function Tick({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm transition-colors duration-150",
        checked ? "bg-foreground text-background" : "bg-surface-3 ring-1 ring-inset ring-foreground/10",
      )}
    >
      {checked && <Check className="size-3 stroke-[2.5]" />}
    </span>
  );
}

function PillSelect({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      className={cn(
        BUTTON_SM,
        BUTTON_OUTLINE,
        "max-w-[60%] cursor-pointer gap-1 rounded-full pr-2 pl-3",
        !onClick && "pointer-events-none",
      )}
    >
      <span className="truncate">{children}</span>
      <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
    </button>
  );
}

function ProviderRow({ id, label }: { id: ProviderId; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-1 p-3">
      <Mark id={id} size={20} />
      <span className="flex-1 type-body font-medium text-foreground">{label}</span>
      <span className="flex size-6 items-center justify-center rounded-full bg-surface-1 text-muted-foreground shadow-xs ring-1 ring-border-subtle">
        <ChevronRight className="size-3.5" />
      </span>
    </div>
  );
}

const ACCOUNTS = [
  { email: "you@gmail.com", synced: "Synced 2 min ago" },
  { email: "side-project@gmail.com", synced: "Synced 2 min ago" },
];

export function ProviderListCard() {
  return (
    <StepFrame label="Settings, Integrations, Calendar: Google Calendar with two connected accounts, each with edit and disconnect buttons and a Connect another account button, then rows to connect Outlook, iCloud Calendar, or subscribe via link, and a Sync now button.">
      <div className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-xl border border-border bg-surface-1">
          <div className="flex items-center gap-3 border-b border-border p-3">
            <Mark id="google" size={20} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="type-body font-medium text-foreground">Google Calendar</span>
              <span className="truncate type-caption text-muted-foreground">2 accounts connected</span>
            </span>
            <span className="flex size-6 items-center justify-center rounded-full bg-surface-1 text-muted-foreground shadow-xs ring-1 ring-border-subtle">
              <ChevronDown className="size-3.5 rotate-180" />
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-surface-2 p-2">
            {ACCOUNTS.map((a) => (
              <div key={a.email} className="flex items-center gap-2 rounded-lg px-2 py-1">
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate type-body text-foreground">{a.email}</span>
                  <span className="truncate type-caption text-muted-foreground">{a.synced}</span>
                </span>
                <span className="flex size-6 items-center justify-center rounded-full border border-border bg-surface-1 text-foreground">
                  <Pencil className="size-3" />
                </span>
                <span className="flex size-6 items-center justify-center rounded-full border border-border bg-surface-1 text-foreground">
                  <Trash2 className="size-3" />
                </span>
              </div>
            ))}
            <span className={cn(BUTTON_SM, BUTTON_OUTLINE, "mt-1 w-full gap-2")}>
              <Plus className="size-3.5" />
              Connect another account
            </span>
          </div>
        </div>
        <ProviderRow id="outlook" label="Connect Outlook" />
        <ProviderRow id="icloud" label="Connect iCloud Calendar" />
        <ProviderRow id="link" label="Subscribe to calendar via link" />
        <span className={cn(BUTTON_SM, BUTTON_OUTLINE, "mt-2 self-start")}>Sync now</span>
      </div>
    </StepFrame>
  );
}

const SUBCALENDARS = [
  { id: "main", name: "you@gmail.com" },
  { id: "team", name: "Team rota" },
  { id: "family", name: "Family" },
  { id: "holidays", name: "Holidays in Spain" },
];

export function CalendarsToSyncCard() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["main"]));
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const summary =
    selected.size === SUBCALENDARS.length ? "All calendars" : `${selected.size} of ${SUBCALENDARS.length}`;

  return (
    <StepFrame label="Calendars to sync for a Google account: only the main calendar is ticked; Team rota, Family and Holidays in Spain are unticked.">
      <div className="overflow-hidden rounded-xl border border-border bg-surface-1">
        <div className="flex items-center gap-3 border-b border-border p-3">
          <BoxIcon>
            <CalendarDays className="size-4" />
          </BoxIcon>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="type-body font-medium text-foreground">Calendars to sync</span>
            <span className="truncate type-caption text-muted-foreground tabular-nums">{summary}</span>
          </span>
          <span className="flex size-6 items-center justify-center rounded-full border border-border bg-surface-1 text-foreground">
            <ChevronDown className="size-3.5 rotate-180" />
          </span>
        </div>
        <div className="flex flex-col gap-2 bg-surface-2 p-3">
          {SUBCALENDARS.map((cal) => (
            <button
              key={cal.id}
              type="button"
              tabIndex={-1}
              onClick={() => toggle(cal.id)}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-surface-1 px-3 py-2.5 text-left shadow-xs hover:bg-hover"
            >
              <Tick checked={selected.has(cal.id)} />
              <span className="type-body text-foreground">{cal.name}</span>
            </button>
          ))}
        </div>
      </div>
    </StepFrame>
  );
}

const TITLES = ['"Blocked via Superfocus"', "Goal name", "Block title", "Custom"];
const SHARED_GOALS: Array<GoalId> = ["youtube", "marathon", "ship", "reading"];

export function ExportSettingsCard() {
  const [enabled, setEnabled] = useState(true);
  const [titleIndex, setTitleIndex] = useState(0);
  const [goals, setGoals] = useState<Set<GoalId>>(() => new Set(SHARED_GOALS));
  const toggleGoal = (id: GoalId) =>
    setGoals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const goalsLabel =
    goals.size === 0
      ? "No goals"
      : goals.size === SHARED_GOALS.length
        ? "All goals"
        : `${goals.size} goal${goals.size !== 1 ? "s" : ""}`;

  return (
    <StepFrame label="Show Superfocus blocks on Google Calendar, switched on, with Target calendar you@gmail.com, Event title Blocked via Superfocus, and Goals shared set to all goals.">
      <div className="overflow-hidden rounded-xl border border-border bg-surface-1">
        <div className={cn("flex items-center gap-3 p-3", enabled && "border-b border-border")}>
          <BoxIcon>
            <Mark id="google" size={16} />
          </BoxIcon>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="type-body font-medium text-foreground">Show Superfocus blocks on Google Calendar</span>
            <span className="truncate type-caption text-muted-foreground">
              {enabled ? `Shown as ${TITLES[titleIndex]}` : "Off: Superfocus won't add events to Google Calendar"}
            </span>
          </span>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setEnabled((v) => !v)}
            aria-label="Toggle export"
            className={cn(
              "relative h-[18px] w-[30px] shrink-0 cursor-pointer rounded-full transition-colors duration-200",
              enabled ? "bg-foreground" : "bg-border-strong",
            )}
          >
            <span
              className={cn(
                "absolute top-[2px] size-[14px] rounded-full bg-white shadow-sm transition-[left] duration-200 ease-[var(--ease-out)]",
                enabled ? "left-[14px]" : "left-[2px]",
              )}
            />
          </button>
        </div>
        <AnimatePresence initial={false}>
          {enabled && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1 bg-surface-2 p-2">
                <div className="flex items-center gap-2 px-2 py-1">
                  <span className="flex-1 type-body text-foreground">Target calendar</span>
                  <PillSelect>you@gmail.com</PillSelect>
                </div>
                <div className="flex items-center gap-2 px-2 py-1">
                  <span className="flex-1 type-body text-foreground">Event title</span>
                  <PillSelect onClick={() => setTitleIndex((i) => (i + 1) % TITLES.length)}>
                    {TITLES[titleIndex]}
                  </PillSelect>
                </div>
                <div className="flex items-center gap-2 px-2 py-1">
                  <span className="flex-1 type-body text-foreground">Goals shared</span>
                  <PillSelect>{goalsLabel}</PillSelect>
                </div>
                <div className="mx-2 mb-1 flex flex-col rounded-lg border border-border bg-surface-1 p-1 shadow-xs">
                  {SHARED_GOALS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      tabIndex={-1}
                      onClick={() => toggleGoal(id)}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-hover"
                    >
                      <GoalIconBadge goal={GOALS[id]} />
                      <span className="flex-1 truncate type-body text-foreground">{GOALS[id].title}</span>
                      {goals.has(id) && <Check className="size-3.5 shrink-0 text-foreground" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepFrame>
  );
}
