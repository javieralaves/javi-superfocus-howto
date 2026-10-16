"use client";

import { useState } from "react";
import { Rocket, Target } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { GOALS, type GoalId } from "./data";
import { CoachIcon } from "./icons";
import { RecommendationRow, StatusPill, type DemoRecommendation, type TrajectoryStatus } from "./primitives";
import { Rise, Stage, useStage } from "./stage";
import { TrajectoryChart, type ChartPoint, type ChartSeries } from "./trajectory-chart";

const LABEL =
  "Superfocus season trajectory chart plotting each goal as on track, needs adjustment or off track, with the coach's recommendations to get back on track";

const TOTAL_DAYS = 84;
const TODAY = 52;
const WEEK_X = [0.5, 7.5, 14.5, 21.5, 28.5, 35.5, 42.5, 49.5, 52.5];
const PROJECTION_X = [52.5, 59.5, 66.5, 73.5, 80.5, 84];

const HISTORY: Record<Exclude<GoalId, "reading">, Array<number>> = {
  youtube: [48, 52, 57, 55, 63, 68, 72, 76, 81],
  marathon: [72, 70, 64, 60, 63, 69, 73, 75, 77],
  ship: [76, 78, 74, 66, 60, 55, 51, 47, 44],
};

const ROWS: Array<{ goal: Exclude<GoalId, "reading">; status: TrajectoryStatus }> = [
  { goal: "youtube", status: "on_track" },
  { goal: "marathon", status: "on_track" },
  { goal: "ship", status: "adjust" },
];

const RECS: Array<DemoRecommendation> = [
  {
    id: "ship-mornings",
    icon: Target,
    goal: GOALS.ship,
    title: "Move Ship v2 to your mornings",
    body: "Its Thursday afternoon blocks were rescheduled three times since week 5. Mornings are when you actually ship.",
    cta: "Update block",
    doneLabel: "Updated",
  },
  {
    id: "batch-film",
    icon: Rocket,
    goal: GOALS.youtube,
    title: "Batch-film episodes 2 and 3",
    body: "You\u2019re ahead on the channel. One batch session on Saturday buys you two weeks.",
    cta: "Schedule it",
    doneLabel: "Scheduled",
  },
];

function history(values: Array<number>): Array<ChartPoint> {
  return values.map((y, i) => ({
    x: WEEK_X[i],
    y,
    dot: i === values.length - 1 ? "large" : "small",
    hollow: i === 0,
  }));
}

function projection(values: Array<number>) {
  return values.map((y, i) => ({ x: PROJECTION_X[i], y }));
}

function CoachingScene() {
  const { play, still } = useStage();
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const shipFixed = !!accepted["ship-mornings"];

  const series: Array<ChartSeries> = [
    {
      id: "youtube",
      color: GOALS.youtube.color,
      points: history(HISTORY.youtube),
      projection: projection(accepted["batch-film"] ? [81, 86, 90, 93, 95, 96] : [81, 84, 87, 89, 91, 92]),
    },
    {
      id: "marathon",
      color: GOALS.marathon.color,
      points: history(HISTORY.marathon),
      projection: projection([77, 78, 80, 81, 82, 83]),
    },
    {
      id: "ship",
      color: GOALS.ship.color,
      points: history(HISTORY.ship),
      projection: projection(shipFixed ? [44, 50, 57, 63, 69, 72] : [44, 41, 38, 35, 33, 32]),
    },
  ];

  return (
    <div className="sf-ui absolute inset-0 overflow-hidden rounded-[24px] bg-[#f5f6f8]">
      <Rise
        delay={0.05}
        y={18}
        className="absolute left-[28px] right-[28px] top-[28px] flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.16)] [mask-image:linear-gradient(to_bottom,black_86%,transparent)]"
        style={{ height: 600 }}
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium leading-6 text-foreground">
            Day {TODAY} of {TOTAL_DAYS}
          </p>
          <p className="text-lg font-medium leading-6 text-muted-foreground">{TOTAL_DAYS - TODAY} days left</p>
        </div>

        <TrajectoryChart
          width={502}
          height={220}
          padding={{ top: 22, right: 8, bottom: 24, left: 8 }}
          series={series}
          xDomain={[-1, TOTAL_DAYS]}
          yDomain={[0, 100]}
          ticks={Array.from({ length: 12 }, (_, i) => ({ x: 3.5 + i * 7, label: `w${i + 1}` }))}
          todayX={TODAY + 0.5}
          todayLabel
          play={play}
          still={still}
          delay={0.35}
          drawSeconds={1.4}
          highlight={hovered}
        />

        <div className="-mx-1.5 -mt-1 flex items-center gap-1">
          {ROWS.map((row, i) => {
            const goal = GOALS[row.goal];
            const improved = row.goal === "ship" && shipFixed;
            return (
              <Rise key={row.goal} delay={1.2 + i * 0.07} y={6}>
                <div
                  onMouseEnter={() => setHovered(row.goal)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "flex h-8 cursor-default items-center gap-1.5 rounded-md px-1.5 transition-colors",
                    hovered === row.goal && "bg-surface-2",
                  )}
                >
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: goal.color }} />
                  <span className="whitespace-nowrap type-body font-medium text-foreground">{goal.short}</span>
                  <StatusPill status={improved ? "on_track" : row.status} trend={improved ? "up" : undefined} />
                </div>
              </Rise>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <Rise delay={1.45} y={6} className="flex items-center gap-1.5">
            <CoachIcon className="size-3.5 text-coach-brand" />
            <p className="text-[13px] font-medium leading-5 text-foreground">Recommendations</p>
          </Rise>
          {RECS.map((rec, i) => (
            <Rise key={rec.id} delay={1.55 + i * 0.1} y={10}>
              <div
                onMouseEnter={() => setHovered(rec.goal.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <RecommendationRow
                  rec={rec}
                  accepted={!!accepted[rec.id]}
                  onAccept={() => setAccepted((prev) => ({ ...prev, [rec.id]: true }))}
                />
              </div>
            </Rise>
          ))}
        </div>
      </Rise>
    </div>
  );
}

export function CoachingIllustration({ fit }: { fit?: "width" | "contain" }) {
  return (
    <Stage fit={fit} width={600} height={600} label={LABEL} name="Coach recommendations + trajectory">
      <CoachingScene />
    </Stage>
  );
}
