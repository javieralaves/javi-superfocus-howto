"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon, Mic01Icon } from "@hugeicons/core-free-icons";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { GOALS, TASKS_BY_GOAL, type GoalId } from "./data";
import { MilestonesIcon } from "./icons";
import { GoalChip, Pill, TaskCheckbox } from "./primitives";
import { Rise } from "./stage";

function HeaderButton({ icon }: { icon: typeof Mic01Icon }) {
  return (
    <span className="flex size-7 items-center justify-center rounded-md text-muted-foreground">
      <HugeiconsIcon icon={icon} size={16} strokeWidth={1.8} />
    </span>
  );
}

export function TasksPanel({ delay = 0, focusGoal }: { delay?: number; focusGoal?: GoalId }) {
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      TASKS_BY_GOAL.flatMap(({ tasks }) => tasks.map((t) => [t.id, !!t.done])),
    ),
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-sidebar-border bg-sidebar shadow-module">
      <div className="flex min-h-10 items-center justify-between px-3 pb-1 pt-2">
        <span className="text-sm font-semibold text-foreground">Tasks</span>
        <div className="flex items-center gap-0.5">
          <HeaderButton icon={Mic01Icon} />
          <HeaderButton icon={FilterHorizontalIcon} />
        </div>
      </div>

      <div className="flex min-h-8 items-center justify-between px-3 pb-1 pt-2">
        <span className="text-xs font-medium text-muted-foreground">Season goals</span>
        <span className="flex size-6 items-center justify-center rounded-md text-muted-foreground">
          <Plus className="size-3.5" />
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-1 [mask-image:linear-gradient(to_bottom,black_88%,transparent)]">
        {TASKS_BY_GOAL.map(({ goal: goalId, tasks }, groupIndex) => {
          const goal = GOALS[goalId];
          return (
            <Rise
              key={goalId}
              delay={delay + groupIndex * 0.09}
              y={8}
              className={cn("pb-2", focusGoal && focusGoal !== goalId && "opacity-55")}
            >
              <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
                <GoalChip goal={goal} />
                <span className="min-w-0 truncate text-sm font-medium text-foreground">
                  {goal.title}
                </span>
              </div>
              {tasks.map((task) =>
                task.milestone ? (
                  <div key={task.id} className="flex h-8 items-center gap-2.5 rounded-md pl-[18px] pr-3">
                    <MilestonesIcon className="size-4 shrink-0" style={{ color: goal.color }} />
                    <span className="min-w-0 flex-1 truncate text-xs text-foreground/80">
                      {task.title}
                    </span>
                    {task.pill && <Pill>{task.pill}</Pill>}
                  </div>
                ) : (
                  <div
                    key={task.id}
                    className="flex h-8 items-center gap-2.5 rounded-md pl-[18px] pr-3 hover:bg-foreground/[0.035]"
                  >
                    <TaskCheckbox
                      checked={done[task.id]}
                      onToggle={() => setDone((prev) => ({ ...prev, [task.id]: !prev[task.id] }))}
                    />
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-xs leading-4 transition-colors duration-200",
                        done[task.id] ? "text-muted-foreground line-through" : "text-foreground/80",
                      )}
                    >
                      {task.title}
                    </span>
                    {task.pill && <Pill>{task.pill}</Pill>}
                  </div>
                ),
              )}
            </Rise>
          );
        })}
      </div>
    </div>
  );
}
