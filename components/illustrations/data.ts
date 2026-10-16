import { Activity, BookOpen, Camera, Rocket, type LucideIcon } from "lucide-react";

export interface DemoGoal {
  id: GoalId;
  title: string;
  short: string;
  color: string;
  icon: LucideIcon;
}

export type GoalId = "youtube" | "marathon" | "ship" | "reading";

export const GOALS: Record<GoalId, DemoGoal> = {
  youtube: {
    id: "youtube",
    title: "Launch my YouTube channel",
    short: "YouTube",
    color: "#ef4444",
    icon: Camera,
  },
  marathon: {
    id: "marathon",
    title: "Run a half marathon",
    short: "Half marathon",
    color: "#14b8a6",
    icon: Activity,
  },
  ship: {
    id: "ship",
    title: "Ship v2 of the product",
    short: "Ship v2",
    color: "#6366f1",
    icon: Rocket,
  },
  reading: {
    id: "reading",
    title: "Read 12 books this year",
    short: "Read 12 books",
    color: "#f59e0b",
    icon: BookOpen,
  },
};

export interface DemoTask {
  id: string;
  title: string;
  pill?: string;
  done?: boolean;
  milestone?: boolean;
}

export const TASKS_BY_GOAL: Array<{ goal: GoalId; tasks: Array<DemoTask> }> = [
  {
    goal: "youtube",
    tasks: [
      { id: "y-m", title: "Publish first 3 videos", pill: "Oct 30", milestone: true },
      { id: "y-1", title: "Script the \u201cwhy I quit my 9\u20135\u201d video", pill: "11 AM" },
      { id: "y-2", title: "Film + record voiceover", pill: "Tue" },
    ],
  },
  {
    goal: "marathon",
    tasks: [
      { id: "m-m", title: "Build to a 10K base", pill: "Nov 2", milestone: true },
      { id: "m-2", title: "Easy 5K recovery run", pill: "6 PM" },
    ],
  },
  {
    goal: "ship",
    tasks: [
      { id: "s-m", title: "Close the beta feedback loop", pill: "Oct 27", milestone: true },
      { id: "s-1", title: "Review beta tester interviews", pill: "9 AM", done: true },
    ],
  },
];

export interface DemoBlock {
  id: string;
  title: string;
  goal: GoalId | null;
  /** Hours from midnight, e.g. 9.5 = 9:30. */
  start: number;
  end: number;
  protected?: boolean;
}

export const HERO_DAY_BLOCKS: Array<DemoBlock> = [
  { id: "b-1", title: "Inbox triage & plan the day", goal: null, start: 8.5, end: 9 },
  { id: "b-2", title: "Review beta tester interviews", goal: "ship", start: 9, end: 10.5 },
  { id: "b-3", title: "Walk + coffee", goal: null, start: 10.5, end: 11 },
  { id: "b-4", title: "Script the \u201cwhy I quit my 9\u20135\u201d video", goal: "youtube", start: 11, end: 12.5 },
  { id: "b-5", title: "Lunch", goal: null, start: 12.5, end: 13.25 },
  { id: "b-6", title: "Deep work \u2014 Ship v2", goal: "ship", start: 13.25, end: 15, protected: true },
  { id: "b-7", title: "Team sync", goal: null, start: 15, end: 15.75 },
];

export const HERO_NOW = 11.7;

export interface RealityRow {
  kind: "plan" | "other" | "distraction" | "idle";
  label: string;
  detail?: string;
  minutes: number;
  goal?: GoalId;
}

/** What tracking actually saw, laid against the plan in the reality lane. */
export interface RealityCard {
  id: string;
  title: string;
  goal: GoalId | null;
  start: number;
  end: number;
  session?: boolean;
  rows: Array<RealityRow>;
}

export interface RealitySpan {
  start: number;
  end: number;
}

const SCRIPT_TITLE = "Script the \u201cwhy I quit my 9\u20135\u201d video";

export const HERO_REALITY: Array<RealityCard> = [
  {
    id: "r-inbox",
    title: "Inbox triage & plan the day",
    goal: null,
    start: 8.5,
    end: 8 + 58 / 60,
    rows: [
      { kind: "plan", label: "Inbox triage & plan the day", minutes: 21 },
      { kind: "other", label: "Slack", detail: "#general", minutes: 5 },
      { kind: "idle", label: "Idle", minutes: 2 },
    ],
  },
  {
    id: "r-review",
    title: "Review beta tester interviews",
    goal: "ship",
    start: 9,
    end: 10.4,
    session: true,
    rows: [
      { kind: "plan", label: "Review beta tester interviews", minutes: 71, goal: "ship" },
      { kind: "distraction", label: "Slack", detail: "#random", minutes: 8 },
      { kind: "idle", label: "Idle", minutes: 5 },
    ],
  },
  {
    id: "r-script-1",
    title: SCRIPT_TITLE,
    goal: "youtube",
    start: 11,
    end: 11.5,
    session: true,
    rows: [
      { kind: "plan", label: SCRIPT_TITLE, minutes: 28, goal: "youtube" },
      { kind: "distraction", label: "YouTube", detail: "Comments", minutes: 2 },
    ],
  },
];

/** The rest of the live session, recorded once the timer is finished. */
export const HERO_REALITY_FINISHED: RealityCard = {
  id: "r-script-2",
  title: SCRIPT_TITLE,
  goal: "youtube",
  start: 11.5,
  end: HERO_NOW,
  session: true,
  rows: [
    { kind: "plan", label: SCRIPT_TITLE, minutes: 11, goal: "youtube" },
    { kind: "idle", label: "Idle", minutes: 1 },
  ],
};

export const HERO_REALITY_PENDING: RealitySpan & { label?: string } = {
  start: 11.5,
  end: HERO_NOW,
};

export const HERO_UNTRACKED: Array<RealitySpan> = [{ start: 10.4, end: 11 }];

export function formatHour(hour: number) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatRange(start: number, end: number) {
  return `${formatHour(start)} \u2013 ${formatHour(end)}`;
}
