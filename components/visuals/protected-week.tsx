import type { ReactNode } from "react";
import { blockColors } from "@/components/illustrations/color";
import { StepFrame } from "./kit";

const BUSINESS = "#6366f1";
const FAMILY = "#ec4899";

function ProtectedBlock({
  color,
  title,
  time,
  children,
}: {
  color: string;
  title: string;
  time: string;
  children?: ReactNode;
}) {
  const colors = blockColors(color);
  return (
    <div
      className="flex min-h-[96px] flex-col sm:min-h-[148px] gap-2 rounded-[10px] p-2.5"
      style={{
        backgroundColor: `color-mix(in srgb, ${colors.line} 8%, transparent)`,
        border: `1px dashed ${colors.line}`,
        color: colors.text,
      }}
    >
      <div>
        <p className="text-xs leading-tight font-medium">{title}</p>
        <p className="mt-0.5 text-[10px] opacity-80">{time}</p>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">{children}</div>
    </div>
  );
}

function TaskBlock({ color, title }: { color: string; title: string }) {
  const colors = blockColors(color);
  return (
    <div
      className="rounded-[6px] px-2 py-1.5 text-[11px] leading-tight font-medium"
      style={{ backgroundColor: colors.fill, color: colors.text, boxShadow: `inset 2px 0 0 ${colors.line}` }}
    >
      {title}
    </div>
  );
}

function Column({ day, note, children }: { day: string; note: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="type-caption font-medium text-muted-foreground">{day}</span>
      {children}
      <span className="type-caption text-muted-foreground">{note}</span>
    </div>
  );
}

export function ProtectedWeekCard() {
  return (
    <StepFrame label="Three protected time blocks. Monday morning for the business, with two tasks chosen that morning. Wednesday morning for the business, with tasks still to be decided. Weeknight evenings for family, with no tasks at all.">
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-3">
        <Column day="Monday" note="Tasks chosen on Monday morning.">
          <ProtectedBlock color={BUSINESS} title="Build my business" time="9 AM – 12 PM">
            <TaskBlock color={BUSINESS} title="Review a pull request" />
            <TaskBlock color={BUSINESS} title="Draft the launch campaign" />
          </ProtectedBlock>
        </Column>
        <Column day="Wednesday" note="I'll decide closer to the day.">
          <ProtectedBlock color={BUSINESS} title="Build my business" time="9 AM – 12 PM">
            <div className="flex flex-1 items-center justify-center rounded-[6px] border border-dashed border-current/25 px-2 text-center text-[10px] opacity-70">
              No tasks yet
            </div>
          </ProtectedBlock>
        </Column>
        <Column day="Weeknights" note="No tasks needed. The time is the point.">
          <ProtectedBlock color={FAMILY} title="Family" time="6 PM – 9 PM" />
        </Column>
      </div>
    </StepFrame>
  );
}
