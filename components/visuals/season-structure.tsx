"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { DropletIcon } from "@hugeicons/core-free-icons";
import { Check, HeartPulse, Rocket, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MilestonesIcon } from "@/components/illustrations/icons";
import { EASE_OUT } from "@/components/illustrations/stage";
import { Panel } from "./kit";

const GOAL_COLOR = "#6366f1";

function Appear({ delay = 0, className, children }: { delay?: number; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

function Checkbox({ checked = false }: { checked?: boolean }) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm",
        checked ? "bg-foreground text-background" : "bg-surface-3 ring-1 ring-inset ring-foreground/10",
      )}
    >
      {checked && <Check className="size-3 stroke-[2.5]" />}
    </span>
  );
}

function CardHeader({
  icon: Icon,
  color,
  title,
  badge,
  badgeClass,
  note,
}: {
  icon: LucideIcon;
  color: string | null;
  title: string;
  badge: string;
  badgeClass: string;
  note: string;
}) {
  return (
    <div className="flex items-start gap-2.5 px-3 pt-3 pb-2">
      <span
        className={cn("flex size-7 shrink-0 items-center justify-center rounded-md", !color && "bg-surface-2 text-muted-foreground")}
        style={color ? { backgroundColor: `${color}15`, color } : undefined}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] leading-none font-semibold", badgeClass)}>
            {badge}
          </span>
        </div>
        <p className="mt-0.5 type-caption text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}

function Row({ indent = false, icon, children }: { indent?: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <div className={cn("flex min-h-8 items-center gap-2.5 pr-3", indent ? "pl-[46px]" : "pl-[18px]")}>
      {icon}
      <span className="min-w-0 flex-1 text-xs leading-4 text-foreground/80">{children}</span>
    </div>
  );
}

function WeekDots({ done }: { done: number[] }) {
  return (
    <span className="flex shrink-0 gap-[3px]">
      {Array.from({ length: 7 }, (_, i) => (
        <span
          key={i}
          className={cn("size-[7px] rounded-full", done.includes(i) ? "bg-foreground/70" : "bg-surface-3")}
        />
      ))}
    </span>
  );
}

export function SeasonStructureVisual() {
  return (
    <div
      role="img"
      aria-label="One season holds two kinds of things. A goal, Build my business, is an outcome for the season, broken into milestones with tasks underneath and one task directly under the goal. A support area, Health and fitness, is an ongoing responsibility with habits and a task, and no finish line."
      className="sf-ui rounded-[24px] bg-[#f5f6f8] p-3 sm:p-5"
    >
      <Appear className="mb-3 flex items-center gap-3 px-1">
        <span className="type-caption font-semibold tracking-wide text-foreground uppercase">This season</span>
        <span className="h-px flex-1 bg-border" />
        <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 type-caption text-muted-foreground tabular-nums">
          12 weeks
        </span>
      </Appear>

      <div className="grid gap-3 sm:grid-cols-[1.25fr_1fr]">
        <Appear delay={0.08}>
          <Panel className="h-full pb-2">
            <CardHeader
              icon={Rocket}
              color={GOAL_COLOR}
              title="Build my business"
              badge="Goal"
              badgeClass="bg-[#e3ddf9] text-[#6850e5]"
              note="An outcome I'm working toward"
            />
            <Row icon={<MilestonesIcon className="size-4 shrink-0" style={{ color: GOAL_COLOR }} />}>
              Improve distribution
            </Row>
            <Row indent icon={<Checkbox checked />}>
              <span className="text-muted-foreground line-through decoration-foreground/20">Publish an update</span>
            </Row>
            <Row indent icon={<Checkbox />}>
              Draft the launch campaign
            </Row>
            <Row icon={<MilestonesIcon className="size-4 shrink-0" style={{ color: GOAL_COLOR }} />}>
              Prepare the next release
            </Row>
            <Row indent icon={<Checkbox />}>
              Review a pull request
            </Row>
            <Row icon={<Checkbox />}>Reply to partner emails</Row>
          </Panel>
        </Appear>

        <Appear delay={0.18}>
          <Panel className="h-full pb-2">
            <CardHeader
              icon={HeartPulse}
              color={null}
              title="Health & fitness"
              badge="Support area"
              badgeClass="bg-surface-2 text-muted-foreground"
              note="Ongoing, with no finish line"
            />
            <Row icon={<HugeiconsIcon icon={DropletIcon} size={16} strokeWidth={1.8} className="shrink-0 text-muted-foreground" />}>
              <span className="flex items-center justify-between gap-2">
                Exercise
                <WeekDots done={[0, 2, 4]} />
              </span>
            </Row>
            <Row icon={<HugeiconsIcon icon={DropletIcon} size={16} strokeWidth={1.8} className="shrink-0 text-muted-foreground" />}>
              <span className="flex items-center justify-between gap-2">
                Walk after lunch
                <WeekDots done={[0, 1, 2, 3]} />
              </span>
            </Row>
            <Row icon={<Checkbox />}>Book a physio check-up</Row>
          </Panel>
        </Appear>
      </div>

      <Appear delay={0.28} className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1 type-caption text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MilestonesIcon className="size-3.5" style={{ color: GOAL_COLOR }} />
          Milestone
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[3px] bg-surface-3 ring-1 ring-inset ring-foreground/10" />
          Task
        </span>
        <span className="flex items-center gap-1.5">
          <HugeiconsIcon icon={DropletIcon} size={13} strokeWidth={1.8} />
          Habit
        </span>
      </Appear>
    </div>
  );
}
