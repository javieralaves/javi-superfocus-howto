"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, BookOpenText, Brain, ListChecks, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoachIcon } from "@/components/illustrations/icons";
import { BUTTON_PRIMARY, BUTTON_SM, PRESS } from "@/components/illustrations/primitives";
import { EASE_OUT, Rise, Stage } from "@/components/illustrations/stage";
import { TasksPanel } from "@/components/illustrations/tasks-panel";
import { Panel, Scene, useAutoStep, useAutopilot, useTypewriter } from "./kit";

type Tab = "tasks" | "memory" | "journal";

const TABS: Array<{ id: Tab; label: string; icon: typeof Brain }> = [
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "journal", label: "Journal", icon: BookOpenText },
];

const MEMORY_SAMPLE = "Travelling to Lisbon next week, so keep the plan light.";
const JOURNAL_SAMPLE = "Agreed with Maya to cut the onboarding redesign from v2. Relieved, and it frees up Thursday.";

interface Memory {
  id: string;
  group: string;
  text: string;
  fresh?: boolean;
}

const MEMORIES: Array<Memory> = [
  { id: "m1", group: "How you work", text: "Does their best deep work before noon. Energy dips mid-afternoon." },
  { id: "m2", group: "How you work", text: "Prefers planning week by week over fixed recurring routines." },
  { id: "m3", group: "Life context", text: "Evenings are family time, so keep work out of them." },
  { id: "m4", group: "Life context", text: "Training for a half marathon in the spring. Long runs on Sundays." },
];

interface Entry {
  id: string;
  kind: string;
  when: string;
  text: string;
}

const ENTRIES: Array<Entry> = [
  {
    id: "e1",
    kind: "Daily sync",
    when: "Yesterday",
    text: "Solid progress on the script. Back-to-back calls after lunch were draining.",
  },
  {
    id: "e2",
    kind: "Note",
    when: "Mon",
    text: "Decided to push the beta launch a week so the interviews get proper attention.",
  },
  {
    id: "e3",
    kind: "Weekly sync",
    when: "Sun",
    text: "Protected mornings worked. The long run slipped twice, so it moves to Saturday.",
  },
];

function useComposer(sample: string, auto: boolean, onCommit: (text: string) => void) {
  const [draft, setDraft] = useState("");
  const { typed, done } = useTypewriter(sample, auto, 26);
  const value = auto ? typed : draft;

  useEffect(() => {
    if (!auto || !done) return;
    const t = window.setTimeout(() => onCommit(sample), 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, done]);

  const commit = () => {
    if (!draft.trim()) return;
    onCommit(draft.trim());
    setDraft("");
  };
  return { value, setDraft, commit };
}

function MemoryPane({ auto }: { auto: boolean }) {
  const [items, setItems] = useState(MEMORIES);
  const [committed, setCommitted] = useState(false);
  const composer = useComposer(MEMORY_SAMPLE, auto && !committed, (text) => {
    setCommitted(true);
    setItems((prev) => [{ id: `n${prev.length}`, group: "Recently added", text, fresh: true }, ...prev]);
  });
  const groups = [...new Set(items.map((m) => m.group))];

  return (
    <Panel className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-5 pb-3 pt-4">
        <p className="type-heading-sm font-semibold text-foreground">Memory</p>
        <p className="type-body text-muted-foreground">What the coach knows and thinks about you</p>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-5 pt-3 [mask-image:linear-gradient(to_bottom,black_85%,transparent)]">
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-coach-surface px-3 py-2 type-body text-foreground">
          <CoachIcon className="size-3.5 shrink-0 text-coach-brand" />
          <span>
            Want sharper recommendations?{" "}
            <span className="font-medium text-coach-brand underline decoration-coach-brand/30 underline-offset-2">
              Answer a few questions
            </span>{" "}
            and your coach fills in the gaps.
          </span>
        </div>
        {groups.map((group) => (
          <div key={group} className="mb-2.5">
            <p className="mb-1 type-caption font-medium text-muted-foreground">{group}</p>
            <AnimatePresence initial={false}>
              {items
                .filter((m) => m.group === group)
                .map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className="flex items-start gap-2 py-1 type-body text-foreground/85"
                  >
                    <span className="mt-[6px] size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                    <span className="flex-1">{m.text}</span>
                    {m.fresh && (
                      <span className="rounded-full bg-coach-surface px-1.5 py-0.5 text-[10px] font-semibold text-coach-brand">
                        New
                      </span>
                    )}
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-1 py-1.5 pl-3 pr-1.5">
          <input
            tabIndex={-1}
            value={composer.value}
            onChange={(e) => composer.setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && composer.commit()}
            placeholder="Tell your coach something new, or what to change"
            className="min-w-0 flex-1 bg-transparent type-body text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Mic className="size-3.5 text-muted-foreground" />
          <button
            type="button"
            tabIndex={-1}
            onClick={composer.commit}
            aria-label="Send"
            className={cn("flex size-6 cursor-pointer items-center justify-center rounded-md", BUTTON_PRIMARY, PRESS)}
          >
            <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </Panel>
  );
}

function JournalPane({ auto }: { auto: boolean }) {
  const [entries, setEntries] = useState(ENTRIES);
  const [committed, setCommitted] = useState(false);
  const composer = useComposer(JOURNAL_SAMPLE, auto && !committed, (text) => {
    setCommitted(true);
    setEntries((prev) => [{ id: `j${prev.length}`, kind: "Note", when: "Just now", text }, ...prev]);
  });

  return (
    <Panel className="flex h-full flex-col overflow-hidden">
      <div className="px-5 pb-3 pt-4">
        <p className="type-heading-sm font-semibold text-foreground">Journal</p>
        <div className="mt-2 flex gap-1">
          {["All entries", "Daily syncs", "Weekly syncs", "Notes"].map((f, i) => (
            <span
              key={f}
              className={cn(
                "rounded-full px-2.5 py-1 type-caption font-medium",
                i === 0 ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground",
              )}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-5 rounded-lg border border-border bg-surface-1 p-3">
        <textarea
          tabIndex={-1}
          rows={2}
          value={composer.value}
          onChange={(e) => composer.setDraft(e.target.value)}
          placeholder="What happened, what you decided, how it felt."
          className="w-full resize-none bg-transparent type-body text-foreground outline-none placeholder:text-muted-foreground"
        />
        <div className="flex justify-end">
          <button
            type="button"
            tabIndex={-1}
            onClick={composer.commit}
            className={cn(BUTTON_SM, BUTTON_PRIMARY, "h-6 cursor-pointer px-2.5")}
          >
            Save
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-5 pt-3 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        <AnimatePresence initial={false}>
          {entries.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="border-b border-border-subtle py-2.5 last:border-0"
            >
              <div className="flex items-center gap-2 type-caption">
                <span className="font-semibold text-foreground">{e.kind}</span>
                <span className="text-muted-foreground">{e.when}</span>
              </div>
              <p className="mt-0.5 type-body text-foreground/85">{e.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Panel>
  );
}

function UpToDateScene() {
  const { active, takeOver } = useAutopilot();
  const [tab, setTab] = useState<Tab>("tasks");

  useAutoStep(active, 3800, () => setTab("memory"));
  useAutoStep(active, 9000, () => setTab("journal"));

  return (
    <Scene onInteract={takeOver}>
      <Rise delay={0.05} y={10} className="absolute inset-x-0 top-[18px] flex justify-center">
        <div className="flex gap-0.5 rounded-lg bg-surface-3 p-0.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                tabIndex={-1}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-3 type-body font-medium",
                  PRESS,
                  tab === t.id ? "bg-card text-foreground shadow-module" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </Rise>

      <Rise delay={0.15} y={14} className="absolute inset-x-[90px] bottom-[20px] top-[62px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="h-full"
          >
            {tab === "tasks" && <TasksPanel delay={0.1} />}
            {tab === "memory" && <MemoryPane auto={active} />}
            {tab === "journal" && <JournalPane auto={active} />}
          </motion.div>
        </AnimatePresence>
      </Rise>
    </Scene>
  );
}

export function StayUpToDateVisual() {
  return (
    <Stage
      width={640}
      height={440}
      label="Three Superfocus surfaces for keeping context current: goal tasks you can check off, the coach's Memory of you, and a Journal of syncs and notes."
    >
      <UpToDateScene />
    </Stage>
  );
}
