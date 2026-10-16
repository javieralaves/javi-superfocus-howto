"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "superfocus-guide:checklist";
const CHANGE_EVENT = "superfocus-guide:checklist-change";

type Item = { id: string; label: string; hint: string };

const basics: Item[] = [
  {
    id: "goals",
    label: "Define a few seasonal goals",
    hint: "Meaningful outcomes you can work backward from.",
  },
  {
    id: "calendars",
    label: "Connect your external calendars",
    hint: "Bring in meetings and existing commitments.",
  },
  {
    id: "protect",
    label: "Protect time for your goals this week",
    hint: "Reserve the time in advance instead of hoping for it.",
  },
  {
    id: "tasks",
    label: "Add tasks to each goal",
    hint: "The work needed to make progress.",
  },
  {
    id: "complete",
    label: "Mark tasks complete as you go",
    hint: "Or catch up later. Retrospective cleanup counts.",
  },
  {
    id: "daily-sync",
    label: "Do an evening daily coach sync",
    hint: "Unlocks a new coach read and a look at tomorrow.",
  },
  {
    id: "weekly-sync",
    label: "Do a weekly coach sync",
    hint: "Reflect on the week and adjust the next one.",
  },
];

const extras: Item[] = [
  {
    id: "recurring",
    label: "Recurring time blocks",
    hint: "For things that repeat consistently.",
  },
  {
    id: "memory",
    label: "Memory settings & structured questions",
    hint: "Broader context about your life and preferences.",
  },
  {
    id: "journal",
    label: "Journal entries",
    hint: "Immediate developments, decisions, and changes.",
  },
  {
    id: "milestones",
    label: "Weekly milestones",
    hint: "Break a broad seasonal goal into steps.",
  },
  {
    id: "mac",
    label: "Focus Mode & Reality Tracking on Mac",
    hint: "Extra focus and accountability at your computer.",
  },
];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

function parse(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function CheckItem({
  item,
  checked,
  onToggle,
}: {
  item: Item;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label className="group flex cursor-pointer items-start gap-3.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-paper-deep/70">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 ${
            checked
              ? "border-accent bg-accent text-paper"
              : "border-ink/25 bg-white group-hover:border-ink/40"
          }`}
        >
          <svg
            viewBox="0 0 16 16"
            className={`size-3 transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        </span>
        <span className="min-w-0">
          <span
            className={`block text-[0.95rem] font-medium leading-snug transition-colors ${
              checked ? "text-faded line-through decoration-ink/20" : "text-ink"
            }`}
          >
            {item.label}
          </span>
          <span className="mt-0.5 block text-sm leading-snug text-faded">
            {item.hint}
          </span>
        </span>
      </label>
    </li>
  );
}

export function Checklist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const done = new Set(parse(raw));

  const toggle = (id: string) => {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    write([...next]);
  };

  const basicsDone = basics.filter((item) => done.has(item.id)).length;
  const pct = Math.round((basicsDone / basics.length) * 100);

  return (
    <div className="rounded-2xl border border-rule bg-white/70 p-5 shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_32px_-16px_rgba(15,15,25,0.12)] sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4 px-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            Your checklist
          </p>
          <h3 className="mt-1.5 font-serif text-2xl font-medium leading-tight text-ink">
            Start with the basics
          </h3>
        </div>
        <p className="font-mono text-sm tabular-nums text-faded">
          {basicsDone}/{basics.length} basics
        </p>
      </div>

      <div className="mx-3 mt-4 h-1.5 overflow-hidden rounded-full bg-paper-deep">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-4 space-y-0.5">
        {basics.map((item) => (
          <CheckItem
            key={item.id}
            item={item}
            checked={done.has(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </ul>

      <div className="mt-6 border-t border-rule px-3 pt-5">
        <p className="text-sm font-medium text-ink">
          Add more structure when it creates value
        </p>
        <p className="mt-0.5 text-sm text-faded">
          Optional. Pick these up only if they help.
        </p>
      </div>
      <ul className="mt-3 space-y-0.5">
        {extras.map((item) => (
          <CheckItem
            key={item.id}
            item={item}
            checked={done.has(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-rule px-3 pt-4 text-xs text-faded">
        <span>Saved in this browser only.</span>
        {done.size > 0 && (
          <button
            type="button"
            onClick={() => write([])}
            className="rounded-md px-2 py-1 font-medium text-faded transition-colors hover:bg-paper-deep hover:text-ink"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
