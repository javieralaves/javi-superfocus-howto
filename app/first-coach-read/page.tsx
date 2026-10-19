import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GuideVisual } from "@/components/visuals/guide-visual";
import {
  FocusScoreCard,
  PlanDayCard,
  TimeBlockingCard,
  UnlockChecklistVisual,
} from "@/components/visuals/unlock-checklist";

const title = "How to unlock your first coach read";
const description =
  "The three checklist steps Superfocus asks for before your first coach read, what each one is for, and the quickest honest way through them.";

export const metadata: Metadata = {
  title: `${title} · How I Use Superfocus`,
  description,
};

function Step({
  number,
  title,
  why,
  children,
}: {
  number: string;
  title: string;
  why: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-rule pt-12 pb-12">
      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em]">
        <span className="font-mono text-accent tabular-nums">{number}</span>
        <span className="h-px w-6 bg-rule" />
        <span className="text-faded">Step</span>
      </div>
      <h2 className="mt-3 font-serif text-[1.75rem] leading-[1.2] font-medium tracking-[-0.01em] text-balance text-ink sm:text-[2rem]">
        {title}
      </h2>
      <div className="prose-guide mt-5">{children}</div>
      <p className="mt-6 border-l-2 border-accent pl-4 text-[0.95rem] leading-relaxed text-ink/70">
        <span className="font-medium text-ink">Why it matters. </span>
        {why}
      </p>
    </section>
  );
}

export default function FirstCoachRead() {
  return (
    <>
      <main id="top" className="mx-auto max-w-[680px] px-6 pt-10 pb-24 sm:pt-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full py-1 text-sm font-medium text-faded transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          How I use Superfocus
        </Link>

        <header className="mt-12 sm:mt-16">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em]">
            <span className="text-accent">Support</span>
            <span className="h-px w-6 bg-rule" />
            <span className="text-faded">About 2 min read</span>
          </div>
          <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] font-medium tracking-[-0.02em] text-balance sm:text-[3.5rem]">
            How to unlock your first coach read
          </h1>
          <p className="mt-5 font-serif text-xl leading-snug text-pretty text-faded italic">
            Three steps on a checklist, and what each one is for.
          </p>
        </header>

        <div className="mt-10">
          <GuideVisual caption="The checklist appears on the Season view, and as a small card in the bottom-right corner of Superfocus, once your season is planned.">
            <UnlockChecklistVisual />
          </GuideVisual>
        </div>

        <div className="prose-guide pb-12">
          <p>
            A <strong>coach read</strong> is the coach&apos;s assessment of your
            season: how each goal is really going, where it&apos;s heading on
            the trajectory chart, and what to change. After the first one, your
            daily and weekly coach syncs keep it up to date.
          </p>
          <p>
            The coach compares what you planned with what actually happened.
            Before the first read, it needs a plan for today, a plan for the
            weeks ahead, and evidence of follow-through. Each step provides one.
          </p>
        </div>

        <Step
          number="01"
          title="Plan the rest of your day"
          why="It gives the coach a concrete picture of what you intend to do today, the baseline everything else is measured against."
        >
          <p>
            Click the step on the checklist. Superfocus opens today&apos;s calendar and adds a
            30-minute block called <strong>Plan the rest of the day</strong>.
            Use it to brain dump, ask the coach for help, or drag tasks onto
            the calendar. Then mark the block done.
          </p>
          <p>
            Completing any of your own task blocks also counts. Meetings from
            connected calendars and the <strong>Get started with Superfocus</strong>{" "}
            practice block don&apos;t.
          </p>
          <PlanDayCard />
        </Step>

        <Step
          number="02"
          title="Complete the time-blocking exercise"
          why="Scheduling your most important tasks before the week fills up makes you far more likely to do them, and gives the coach a plan to track."
        >
          <p>
            Click <strong>Start planning exercise</strong>. In four short parts,
            you break goals into milestones, answer a few questions to pick
            your key tasks for the next week or two, reserve time for them, and
            choose a weekly check-in slot. The step is checked when you finish
            the last screen. Restarting your season before unlocking resets it.
          </p>
          <TimeBlockingCard />
        </Step>

        <Step
          number="03"
          title="Reach a 100% Focus Score, or complete yesterday's check-in"
          why="It shows the coach how your plan meets reality. A read built on actual follow-through is far more useful than one built on intentions."
        >
          <p>The checklist shows one of two versions of this step.</p>
          <ul>
            <li>
              <strong>Reach 100% focus score today</strong> appears if you
              planned your season today. Your Focus Score combines how much of
              today&apos;s scheduled time you&apos;ve marked done (protected
              time doesn&apos;t count) with your daily coach sync. Mark
              finished tasks and meetings done and move what you won&apos;t
              get to. The Focus Score card then shows a{" "}
              <strong>Daily coach sync</strong> button. Complete it to reach
              100%.
            </li>
            <li>
              <strong>Complete yesterday&apos;s check-in</strong> appears if you
              planned your season on an earlier day. Click the step to open
              yesterday&apos;s daily check-in and finish it.
            </li>
          </ul>
          <FocusScoreCard />
        </Step>

        <section className="rounded-2xl border border-rule bg-white/60 p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            The fastest route
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight font-medium text-ink">
            Just want to unlock it?
          </h2>
          <ol className="mt-5 space-y-4 text-[0.98rem] leading-relaxed text-ink/80">
            <li className="flex gap-3">
              <span className="font-mono text-sm leading-[1.7] text-accent">1</span>
              <span>
                Drag one or two real tasks into today, then mark the{" "}
                <strong className="font-medium text-ink">Plan the rest of the day</strong>{" "}
                block done. <span className="text-faded">Optional shortcut: if you&apos;ve already finished one of your own tasks, marking it done is enough.</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-sm leading-[1.7] text-accent">2</span>
              <span>
                In the exercise, accept the suggestions wherever they look
                right. <span className="text-faded">Optional shortcut: on Break goals into milestones, leave every goal unticked and click Continue to skip to key tasks.</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-sm leading-[1.7] text-accent">3</span>
              <span>
                Keep today&apos;s plan small, mark what you actually finished,
                move the rest to another day, and complete the daily coach
                sync.{" "}
                <span className="text-faded">If the checklist asks for yesterday&apos;s check-in instead, that one check-in is all it takes.</span>
              </span>
            </li>
          </ol>
          <p className="mt-6 border-t border-rule pt-5 text-sm leading-relaxed text-faded">
            There&apos;s no way to skip the steps themselves: each one checks
            itself when the real action happens. Marking work done that you
            didn&apos;t do would only give the coach a misleading first read.
          </p>
        </section>

        <section className="pt-12">
          <h2 className="font-serif text-[1.75rem] leading-[1.2] font-medium text-ink">
            Then get your read
          </h2>
          <div className="prose-guide mt-4">
            <p>
              Once all three steps are checked, the card reads{" "}
              <strong>Your first coach read is ready</strong>. Click{" "}
              <strong>Get your first coach read</strong> and give the coach a
              moment to read your season. If it doesn&apos;t go through, click
              the button again.
            </p>
          </div>
        </section>

        <div className="mt-14 flex flex-col gap-5 rounded-2xl border border-rule bg-white p-7 sm:flex-row sm:items-center sm:p-8">
          <Image
            src="/javi.jpeg"
            alt="Javier Alaves"
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover ring-1 ring-rule"
          />
          <p className="flex-1 text-[0.95rem] leading-relaxed text-ink/75">
            See how coach reads fit into a weekly routine in the main guide.
          </p>
          <Link
            href="/#trajectory"
            className="inline-flex shrink-0 items-center self-start rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/85 sm:self-center"
          >
            Read the guide
          </Link>
        </div>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm text-faded">
          <Link href="/" className="transition-colors hover:text-ink">
            How I Use Superfocus · A personal guide
          </Link>
          <a href="#top" className="transition-colors hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
