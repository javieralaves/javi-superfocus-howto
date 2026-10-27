import type { ReactNode } from "react";
import { MessagesSquare, NotebookText } from "lucide-react";
import { ChangeRow, DecisionBadge, SourceCard } from "./ai-assisted-planning";
import { CHANGES } from "./ai-planning-data";
import { StepFrame } from "./kit";

function Phase({ number, label, aside, children }: { number: string; label: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4">
      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-start sm:justify-start sm:pt-2">
        <p className="flex items-baseline gap-2 type-body font-semibold text-foreground">
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{number}</span>
          {label}
        </p>
        {aside}
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

export function AssistedPlanningExample() {
  return (
    <StepFrame
      label="An example in three stages. What happened: explored a new onboarding flow and agreed to test it with users. What the assistant suggests: prepare a usability test during Wednesday's protected time and review the results on Thursday. What I choose to keep: two tasks, planned for Wednesday and Thursday, and a short Journal note."
      caption="The useful part isn't creating three new records. It's deciding what the recent work means for the plan."
    >
      <div className="flex flex-col gap-4">
        <Phase number="1" label="What happened">
          <SourceCard
            icon={<NotebookText className="size-3 shrink-0" />}
            source="Recent work"
            context="Notes and GitHub"
            text="Explored a new onboarding flow and agreed to test it with users."
          />
        </Phase>

        <div className="h-px bg-border-subtle" />

        <Phase number="2" label="What the assistant suggests" aside={<DecisionBadge state="pending" />}>
          <div className="rounded-lg border border-dashed border-coach-brand/35 bg-coach-surface/60 px-3 py-2.5">
            <p className="flex items-center gap-1.5 type-caption text-muted-foreground">
              <MessagesSquare className="size-3" />
              Suggestion, not yet applied
            </p>
            <p className="mt-1 type-body-lg text-foreground">
              Prepare a usability test during Wednesday&apos;s protected time. Review the results on Thursday.
            </p>
          </div>
        </Phase>

        <div className="h-px bg-border-subtle" />

        <Phase number="3" label="What I choose to keep" aside={<DecisionBadge state="kept" />}>
          {CHANGES.map((c) => (
            <ChangeRow
              key={c.title}
              {...c}
              title={c.kind === "journal" ? "Testing the simpler flow before committing to a larger redesign." : c.title}
              state="kept"
            />
          ))}
        </Phase>
      </div>
    </StepFrame>
  );
}
