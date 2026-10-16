"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Cloud, Link2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UNASSIGNED_COLORS } from "@/components/illustrations/color";
import { formatHour, formatRange } from "@/components/illustrations/data";
import { BUTTON_OUTLINE, BUTTON_SM } from "@/components/illustrations/primitives";
import { EASE_OUT, Rise, Stage } from "@/components/illustrations/stage";
import { Panel, Scene, formatDuration, useAutoStep, useAutopilot } from "./kit";

type ProviderId = "google" | "outlook" | "icloud" | "link";
type Status = "idle" | "connecting" | "connected";

interface Meeting {
  id: string;
  title: string;
  start: number;
  end: number;
}

const START = 8;
const END = 18;
const HOUR = 32;

function Mark({ id, size = 22 }: { id: ProviderId; size?: number }) {
  const base = "flex shrink-0 items-center justify-center rounded-[6px] font-bold text-white";
  const style = { width: size, height: size, fontSize: size * 0.55 };
  if (id === "google") return <span className={base} style={{ ...style, background: "#4285f4" }}>G</span>;
  if (id === "outlook") return <span className={base} style={{ ...style, background: "#0a64c9" }}>O</span>;
  if (id === "icloud")
    return (
      <span className={base} style={{ ...style, background: "linear-gradient(#5ac8fa, #2f7cf6)" }}>
        <Cloud style={{ width: size * 0.6, height: size * 0.6 }} strokeWidth={2.5} />
      </span>
    );
  return (
    <span className={cn(base, "bg-surface-3 text-foreground")} style={style}>
      <Link2 style={{ width: size * 0.6, height: size * 0.6 }} strokeWidth={2.25} />
    </span>
  );
}

const PROVIDERS: Array<{ id: ProviderId; name: string; meetings: Array<Meeting> }> = [
  {
    id: "google",
    name: "Google Calendar",
    meetings: [
      { id: "g1", title: "Standup", start: 9.5, end: 10 },
      { id: "g2", title: "Design review", start: 13, end: 14 },
      { id: "g3", title: "1:1 with Maya", start: 16, end: 16.5 },
    ],
  },
  { id: "outlook", name: "Outlook", meetings: [{ id: "o1", title: "Client call", start: 11, end: 12 }] },
  { id: "icloud", name: "iCloud Calendar", meetings: [{ id: "i1", title: "Dentist", start: 17.25, end: 18 }] },
  {
    id: "link",
    name: "Subscribe to calendar via link",
    meetings: [{ id: "l1", title: "Company all-hands", start: 14.5, end: 15.25 }],
  },
];

function openHours(meetings: Array<Meeting>) {
  const sorted = [...meetings].sort((a, b) => a.start - b.start);
  let busy = 0;
  let cursor = START;
  for (const m of sorted) {
    const s = Math.max(m.start, cursor);
    const e = Math.min(m.end, END);
    if (e > s) {
      busy += e - s;
      cursor = e;
    }
  }
  return END - START - busy;
}

function StatusButton({ status, onClick }: { status: Status; onClick: () => void }) {
  let content: ReactNode = "Connect";
  if (status === "connecting")
    content = (
      <>
        <Loader2 className="size-3 animate-spin" />
        Connecting
      </>
    );
  if (status === "connected")
    content = (
      <>
        <Check className="size-3.5 stroke-[2.5]" />
        Connected
      </>
    );
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      className={cn(
        BUTTON_SM,
        "w-[96px] cursor-pointer",
        status === "connected" ? "bg-success-surface text-success-strong" : BUTTON_OUTLINE,
      )}
    >
      {content}
    </button>
  );
}

function ConnectScene() {
  const { active, takeOver, still } = useAutopilot();
  const [status, setStatus] = useState<Record<ProviderId, Status>>(() => ({
    google: still ? "connected" : "idle",
    outlook: "idle",
    icloud: "idle",
    link: "idle",
  }));

  const toggle = (id: ProviderId) => {
    if (status[id] === "connecting") return;
    if (status[id] === "connected") {
      setStatus((s) => ({ ...s, [id]: "idle" }));
      return;
    }
    setStatus((s) => ({ ...s, [id]: "connecting" }));
    window.setTimeout(() => setStatus((s) => ({ ...s, [id]: "connected" })), 800);
  };

  useAutoStep(active, 1300, () => toggle("google"));
  useAutoStep(active, 3600, () => toggle("outlook"));

  const meetings = PROVIDERS.flatMap((p) =>
    status[p.id] === "connected" ? p.meetings.map((m) => ({ ...m, provider: p.id })) : [],
  );
  const hours = Array.from({ length: END - START }, (_, i) => START + i);
  const connectedCount = PROVIDERS.filter((p) => status[p.id] === "connected").length;

  return (
    <Scene onInteract={takeOver}>
      <Rise delay={0.05} y={16} className="absolute left-[24px] top-[24px] w-[310px]">
        <Panel className="p-5">
          <p className="type-heading-sm font-semibold text-foreground">Connect your calendar</p>
          <p className="mt-1 type-body text-muted-foreground">
            Add as many as you like. Superfocus plans your day around your real commitments and constraints.
          </p>
          <div className="mt-4 flex flex-col gap-1.5">
            {PROVIDERS.map((p) => (
              <div
                key={p.id}
                className="flex h-12 items-center gap-3 rounded-lg border border-border-subtle bg-surface-1 px-3"
              >
                <Mark id={p.id} />
                <span className="min-w-0 flex-1 type-body font-medium leading-4 text-foreground">{p.name}</span>
                <StatusButton status={status[p.id]} onClick={() => toggle(p.id)} />
              </div>
            ))}
          </div>
          <p className="mt-4 type-caption text-muted-foreground">
            {connectedCount === 0
              ? "No calendars connected yet."
              : `${connectedCount} calendar${connectedCount > 1 ? "s" : ""} connected`}
          </p>
        </Panel>
      </Rise>

      <Rise delay={0.2} y={16} className="absolute right-[24px] top-[24px] w-[272px]">
        <div className="flex flex-col overflow-hidden rounded-xl border border-sidebar-border bg-calendar-grid shadow-module">
          <div className="flex h-11 items-center justify-between border-b border-border px-4">
            <span className="type-body font-semibold text-foreground">Today</span>
            <span className="flex items-center gap-1.5">
              <span className="type-caption font-medium text-primary">Tue</span>
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-destructive type-body font-semibold text-primary-foreground">
                13
              </span>
            </span>
          </div>
          <div className="relative flex pt-2" style={{ height: (END - START) * HOUR + 16 }}>
            <div className="w-12 shrink-0">
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
            <div className="relative flex-1 pr-2">
              {hours.map((h, i) => (
                <div key={h} className={i ? "border-t border-border-subtle" : ""} style={{ height: HOUR }} />
              ))}
              <AnimatePresence>
                {meetings.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 14 }}
                    transition={{ duration: still ? 0 : 0.4, ease: EASE_OUT, delay: still ? 0 : i * 0.06 }}
                    className={cn(
                      "absolute inset-x-0.5 overflow-hidden rounded-[6px] px-2",
                      m.end - m.start < 0.75 ? "flex items-center" : "py-[3px]",
                    )}
                    style={{
                      top: (m.start - START) * HOUR + 1,
                      height: (m.end - m.start) * HOUR - 2,
                      background: UNASSIGNED_COLORS.fill,
                      color: UNASSIGNED_COLORS.text,
                      boxShadow: `inset 0 0 0 1px ${UNASSIGNED_COLORS.line}`,
                    }}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      <span className="truncate text-[11px] font-medium leading-[13px]">{m.title}</span>
                      <Mark id={m.provider} size={12} />
                    </div>
                    {m.end - m.start >= 0.75 && (
                      <div className="text-[10px] leading-[11px] opacity-75">{formatRange(m.start, m.end)}</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex h-9 items-center justify-between border-t border-border px-4">
            <span className="type-caption text-muted-foreground">Open time today</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={openHours(meetings)}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="type-body font-semibold tabular-nums text-foreground"
              >
                {formatDuration(openHours(meetings))}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </Rise>
    </Scene>
  );
}

export function ConnectCalendarsVisual() {
  return (
    <Stage
      width={640}
      height={464}
      label="Superfocus 'Connect your calendar' dialog with Google, Outlook, iCloud and link options; connecting one brings its meetings into today's calendar and updates the open time left."
    >
      <ConnectScene />
    </Stage>
  );
}
