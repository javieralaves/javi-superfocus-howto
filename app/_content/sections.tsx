import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoachingIllustration } from "@/components/illustrations/coaching-illustration";
import { CoachIcon } from "@/components/illustrations/icons";
import { FlowIllustration } from "@/components/illustrations/flow-illustration";
import { ConnectCalendarsVisual } from "@/components/visuals/connect-calendars";
import { DailySyncVisual } from "@/components/visuals/daily-sync";
import { ProtectTimeVisual } from "@/components/visuals/protect-time";
import { RecordRealityVisual } from "@/components/visuals/record-reality";
import { StayUpToDateVisual } from "@/components/visuals/stay-up-to-date";
import { WeeklySyncVisual } from "@/components/visuals/weekly-sync";

export type Section = {
  id: string;
  number: string;
  cadence: string;
  title: string;
  shortTitle: string;
  lede: string;
  visual?: { node: ReactNode; caption: string };
  body: ReactNode;
  after?: "checklist";
};

function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-10 border-l-2 border-accent pl-6 font-serif text-[1.5rem] leading-snug text-ink italic">
      {children}
    </blockquote>
  );
}

export const sections: Section[] = [
  {
    id: "connect-calendars",
    number: "01",
    cadence: "Setup",
    title: "Connect my external calendars",
    shortTitle: "Connect calendars",
    lede: "Bring in existing commitments so you can see where there's real room for your goals.",
    visual: {
      node: <ConnectCalendarsVisual />,
      caption: "Connect a calendar and your existing commitments fill in the day.",
    },
    body: (
      <>
        <p>
          I connect my external calendars to Superfocus, primarily to bring in
          meetings and other existing commitments.
        </p>
        <p>
          I prefer to manage the time I dedicate to my goals directly within
          Superfocus, rather than importing everything from elsewhere. This
          gives me a clearer view of my availability and where I can
          realistically make time for the things I want to accomplish.
        </p>
      </>
    ),
  },
  {
    id: "protect-time",
    number: "02",
    cadence: "Weekly",
    title: "Protect time for my goals every week",
    shortTitle: "Protect time weekly",
    lede: "Reserve time in advance rather than hoping you'll find space for it.",
    visual: {
      node: <ProtectTimeVisual />,
      caption: "Drag a goal onto the week to protect time for it. Toggle repeat if it recurs.",
    },
    body: (
      <>
        <p>
          At the beginning of each week, I look at my schedule and protect time
          for the goals I want to make progress on.
        </p>
        <p>
          I use <strong>protected time blocks</strong> to reserve that time in
          advance, rather than hoping I&apos;ll find space for it throughout the
          week.
        </p>
        <p>
          If something repeats consistently, Superfocus lets me make the block
          recurring, so I don&apos;t need to schedule it again every week.
        </p>
        <p>
          Personally, I prefer to keep things flexible and plan week by week. My
          priorities and availability can change, so I like to reassess how I
          distribute my time rather than committing to a rigid recurring
          schedule.
        </p>
      </>
    ),
  },
  {
    id: "stay-up-to-date",
    number: "03",
    cadence: "Throughout the day",
    title: "Keep my goals, tasks, and context up to date",
    shortTitle: "Keep things up to date",
    lede: "Keep Superfocus reasonably aligned with reality, in three ways.",
    visual: {
      node: <StayUpToDateVisual />,
      caption: "Tasks, memory, and the journal: three ways to keep the coach informed.",
    },
    body: (
      <>
        <p>
          Throughout the day, I try to keep Superfocus reasonably aligned with
          reality. For me, this involves three things.
        </p>
        <h3>Keeping my tasks up to date</h3>
        <p>
          I think of goals as meaningful outcomes I want to achieve within the
          current season, which I can reasonably work backward from. Each goal
          has tasks that represent the work needed to make progress.
        </p>
        <p>
          I try to keep those tasks current, adding new ones, adjusting existing
          ones, and completing them as I go.
        </p>
        <h3>Helping the coach understand me</h3>
        <p>
          The more relevant context the coach has, the more useful its guidance
          can become.
        </p>
        <p>
          I use the <strong>memory settings</strong> to provide broader context
          about my life, priorities, goals, and planning preferences. There are
          also structured questions that help the coach learn more about me.
        </p>
        <h3>Capturing context through the journal</h3>
        <p>
          For more immediate developments, thoughts, decisions, or changes in
          circumstances, I use the <strong>journal</strong>.
        </p>
        <p>
          This helps the coach understand not only what I&apos;m trying to
          accomplish, but also what&apos;s happening around those goals.
        </p>
      </>
    ),
  },
  {
    id: "daily-sync",
    number: "04",
    cadence: "Daily · Evening",
    title: "Complete my daily coach sync in the evening",
    shortTitle: "Daily coach sync",
    lede: "Unlock a fresh coach read and end the day with a sense of tomorrow.",
    visual: {
      node: <DailySyncVisual />,
      caption: "Rate the day, fit tomorrow's tasks into protected time, then read the coach.",
    },
    body: (
      <>
        <p>
          I usually complete my daily coach sync in the evening, after I&apos;m
          finished with my tasks for the day. There are two main reasons I find
          this useful.
        </p>
        <p>
          <strong>First, completing the sync unlocks a new coach read.</strong>{" "}
          I like seeing the coach&apos;s assessment of how I&apos;m progressing,
          particularly the trajectory chart that appears in the season view.
        </p>
        <p>
          <strong>Second, the sync encourages me to think about tomorrow.</strong>{" "}
          I don&apos;t necessarily need to plan my entire day in advance, but I
          like to finish with a general sense of what tomorrow might look like.
        </p>
        <p>
          Because I&apos;ve already protected time for my goals during weekly
          planning, I usually have a reasonable starting point. From there,
          I&apos;ll identify a handful of tasks that I want to focus on.
        </p>
        <p>
          I sometimes use task deadlines as a way of loosely assigning work to a
          particular day, rather than as strict due dates. If I have tasks
          assigned to tomorrow, I try to make room for them. If they no longer
          fit, I&apos;ll move them to another day. This is simply my personal
          planning preference, rather than how everyone should use deadlines.
        </p>
        <p>
          I rarely ask the coach to help me plan during the daily sync because I
          generally know how I want to approach the following day. However,
          that support can be useful when I&apos;m dealing with competing
          priorities, difficult trade-offs, or uncertainty about what to work on
          next.
        </p>
      </>
    ),
  },
  {
    id: "weekly-sync",
    number: "05",
    cadence: "Weekly",
    title: "Complete my weekly coach sync to reflect and adjust",
    shortTitle: "Weekly coach sync",
    lede: "Step back from individual tasks and look at the shape of the week.",
    visual: {
      node: <WeeklySyncVisual />,
      caption: "The coach can break a season goal into weekly milestones. Keep or undo.",
    },
    body: (
      <>
        <p>My weekly coach sync serves a different purpose.</p>
        <p>
          Rather than focusing on individual tasks or tomorrow&apos;s schedule, I
          use it to reflect on the broader week. I want to understand how things
          went, whether I&apos;m making meaningful progress, and what I could do
          differently to make the following week a step in the right direction.
        </p>
        <p>
          I recommend using the built-in conversation with the coach during
          this process. It can help surface things you might otherwise overlook
          or suggest adjustments to how you&apos;re approaching your goals.
        </p>
        <p>
          For example, the coach might recommend breaking a larger seasonal goal
          into smaller weekly milestones.
        </p>
        <p>
          I think this is worth trying, particularly if you&apos;re struggling
          to translate a broad outcome into manageable progress. But it
          isn&apos;t something everyone needs to adopt. You can review the
          recommendations, revert changes you don&apos;t want, and continue
          planning in whatever way works best for you.
        </p>
        <PullQuote>
          The important part is creating space to reflect, learn, and adjust.
        </PullQuote>
      </>
    ),
  },
  {
    id: "trajectory",
    number: "06",
    cadence: "Seasonal",
    title: "Use coach reads and trajectory to guide the season",
    shortTitle: "Coach reads & trajectory",
    lede: "The daily and weekly routines feed a larger feedback loop.",
    visual: {
      node: <CoachingIllustration />,
      caption: "A coach read: where the season is heading, and what to adjust.",
    },
    body: (
      <>
        <p>
          I start the season with outcomes I want to achieve. I protect time for
          those outcomes, work through tasks, and keep Superfocus informed about
          what actually happens.
        </p>
        <p>
          The coach then uses that context to assess my progress and provide
          recommendations.
        </p>
        <p>
          I find the <strong>trajectory view</strong> particularly useful
          because it helps me think beyond whether I had a productive day. It
          encourages me to consider whether my recent activity is actually
          moving me toward the outcomes I care about.
        </p>
        <p>
          Over time, I can use those assessments to identify patterns, adjust
          how I plan, refine my goals, and improve how I approach the rest of
          the season.
        </p>
        <p>
          I don&apos;t treat the trajectory as a definitive prediction.
          It&apos;s a useful perspective on my progress, informed by what
          Superfocus knows about my goals and follow-through.
        </p>
        <Link
          href="/first-coach-read"
          className="group !mt-10 flex items-center gap-3 rounded-xl border border-rule bg-white/50 px-4 py-3 text-sm leading-snug text-faded transition-colors hover:border-ink/15 hover:bg-white"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
            <CoachIcon className="size-3.5" />
          </span>
          <span className="flex-1">
            <span className="font-medium text-ink">
              Haven&apos;t had a coach read yet?
            </span>{" "}
            Here&apos;s how to unlock your first one.
          </span>
          <ArrowRight
            className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </>
    ),
  },
  {
    id: "mac-app",
    number: "07",
    cadence: "Optional",
    title: "Use the Mac app for additional focus and accountability",
    shortTitle: "The Mac app",
    lede: "Two features that help me stay engaged with the work I've planned.",
    visual: {
      node: <FlowIllustration />,
      caption: "The floating timer and Reality Tracking on the Mac.",
    },
    body: (
      <>
        <p>
          Beyond the core planning and coaching experience, I also use
          Superfocus on my Mac. There are two features I find particularly
          helpful.
        </p>
        <h3>Reality Tracking</h3>
        <p>
          Reality Tracking gives me an additional layer of accountability
          throughout the day. It helps me understand how I&apos;m actually
          spending my time and provides a deeper picture of my focus quality.
        </p>
        <h3>Focus Mode</h3>
        <p>
          Focus Mode is useful when I&apos;m working on tasks at my computer. I
          particularly like having the floating timer visible while I work, so I
          can keep track of the time I&apos;m spending on something without
          constantly checking the calendar.
        </p>
        <p>
          Neither feature is essential to the broader routine, but both help me
          stay engaged with the work I&apos;ve planned.
        </p>
      </>
    ),
  },
  {
    id: "record-reality",
    number: "08",
    cadence: "Daily",
    title: "Record what actually happened, not just what I planned",
    shortTitle: "Record what happened",
    lede: "Protecting time for something doesn't mean the work happened.",
    visual: {
      node: <RecordRealityVisual />,
      caption: "A plan isn't progress. Mark what you finished, move what didn't happen.",
    },
    body: (
      <>
        <p>
          One of the most important habits I&apos;ve developed is making sure I
          mark tasks as completed and keep Superfocus informed about my actual
          follow-through.
        </p>
        <p>
          It&apos;s easy to spend time organizing a calendar and assume that the
          plan itself represents progress. But protecting time for something
          doesn&apos;t necessarily mean the work happened.
        </p>
        <p>
          Ideally, I work through tasks one at a time and mark them complete as I
          go. When it makes sense, I&apos;ll use Focus Mode while working.
        </p>
        <p>
          Other times, I don&apos;t interact much with Superfocus during the
          day. In those cases, I&apos;ll come back later, review what happened,
          complete the tasks I finished, and adjust anything that didn&apos;t go
          according to plan. That retrospective cleanup is still valuable.
        </p>
        <PullQuote>
          The goal isn&apos;t to maintain a perfect record of every minute.
          It&apos;s to keep Superfocus sufficiently aligned with reality.
        </PullQuote>
        <p>
          That way it remains a useful source of context about what I&apos;m
          working toward and how I&apos;m progressing. The more accurately it
          understands my follow-through, the more relevant its future
          assessments and recommendations can become.
        </p>
      </>
    ),
  },
  {
    id: "keep-it-manageable",
    number: "09",
    cadence: "Principle",
    title: "Keep the routine manageable",
    shortTitle: "Keep it manageable",
    lede: "Start with the basics and add structure only when it creates value.",
    body: (
      <>
        <p>
          One thing worth acknowledging is that Superfocus becomes more useful
          when you keep it reasonably up to date.
        </p>
        <p>
          At the same time, different people have different amounts of time,
          attention, and willingness to maintain a planning system. I don&apos;t
          think everyone needs to use every feature or follow the same routine.
        </p>
        <p>
          For some people, a simple combination of goals, protected time,
          completed tasks, and regular coach syncs might be enough. Others might
          benefit from more structured planning, recurring time blocks, detailed
          milestones, journal entries, or additional tracking.
        </p>
        <p>
          I&apos;d recommend starting with the basics and adding more structure
          only when it creates meaningful value.
        </p>
        <p>
          We&apos;re also continuously exploring ways to make Superfocus easier
          to maintain, so that people can receive useful guidance without
          needing to spend too much time managing the system itself.
        </p>
      </>
    ),
    after: "checklist",
  },
];

export const rhythm = [
  {
    label: "Seasonally",
    text: "Define meaningful outcomes I want to work toward.",
  },
  {
    label: "Weekly",
    text: "Protect time for those goals and reflect on my progress.",
  },
  {
    label: "Daily",
    text: "Work through tasks, keep the system aligned with reality, and complete my evening coach sync.",
  },
  {
    label: "Throughout the season",
    text: "Use coach reads and trajectory to understand how I'm doing and make adjustments.",
  },
];
