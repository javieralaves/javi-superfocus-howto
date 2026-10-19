import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProtectedWeekCard } from "@/components/visuals/protected-week";
import { PromptCard } from "../_components/prompt-card";
import { seasonPrompt } from "../_content/season-prompt";

const title = "How to plan your season";
const description =
  "A practical way to turn everything you've got going on into a few meaningful priorities and a workable plan in Superfocus, with examples and a prompt for ChatGPT or Claude.";
const guideSection = "/#start-with-what-matters";

export const metadata: Metadata = {
  title: `${title} · How I Use Superfocus`,
  description,
};

const linkClass = "font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink";

function Part({ number, label, title, children }: { number: string; label: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-rule pt-12 pb-12">
      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em]">
        <span className="font-mono text-accent tabular-nums">{number}</span>
        <span className="h-px w-6 bg-rule" />
        <span className="text-faded">{label}</span>
      </div>
      <h2 className="mt-3 font-serif text-[1.75rem] leading-[1.2] font-medium tracking-[-0.01em] text-balance text-ink sm:text-[2rem]">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const CONCEPTS: Array<{ term: string; children: ReactNode }> = [
  {
    term: "Goals",
    children: (
      <>
        Meaningful outcomes or directions for the current season. They live
        under <strong className="font-medium text-ink">Season goals</strong>.
      </>
    ),
  },
  {
    term: "Support areas",
    children: (
      <>
        Ongoing responsibilities that deserve time and attention without
        becoming seasonal goals. They have no finish line, so you don&apos;t
        complete them the way you complete a goal.
      </>
    ),
  },
  {
    term: "Milestones",
    children: (
      <>
        Intermediate checkpoints within a goal. I also use them pragmatically
        to group the work for a project.
      </>
    ),
  },
  {
    term: "Tasks",
    children: <>Specific actions that move the work forward.</>,
  },
  {
    term: "Habits",
    children: (
      <>
        Recurring actions you want to keep doing. You can set a block&apos;s
        type to <strong className="font-medium text-ink">Habit</strong>, and
        Superfocus shows how consistently you&apos;re keeping it up.
      </>
    ),
  },
];

const EXAMPLES: Array<{
  area: string;
  kind: string;
  rows: Array<{ label: string; text: string }>;
  note?: string;
}> = [
  {
    area: "Work",
    kind: "Goal",
    rows: [
      { label: "Goal", text: "Make meaningful progress building my business." },
      { label: "Milestones", text: "Improve distribution, develop the product, prepare the next release." },
      { label: "Tasks", text: "Draft a campaign, review a pull request, publish an update." },
    ],
  },
  {
    area: "Family",
    kind: "Goal or support area",
    rows: [
      { label: "Goal or support area", text: "Be more present with family and friends." },
      { label: "Milestones", text: "Prepare for an upcoming family trip or important event." },
      { label: "Tasks", text: "Book accommodation, coordinate arrangements." },
    ],
    note: "If being more present is something you're deliberately working on this season, make it a goal. If it's about looking after something that's already going well, a support area is enough.",
  },
  {
    area: "Health",
    kind: "Support area",
    rows: [
      { label: "Support area", text: "Maintain a sustainable health and fitness routine." },
      { label: "Habits", text: "Exercise several times a week, keep up other recurring practices." },
    ],
  },
];

export default function PlanYourSeason() {
  return (
    <>
      <main id="top" className="mx-auto max-w-[680px] px-6 pt-10 pb-24 sm:pt-14">
        <Link
          href={guideSection}
          className="inline-flex items-center gap-1.5 rounded-full py-1 text-sm font-medium text-faded transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          How I use Superfocus
        </Link>

        <header className="mt-12 sm:mt-16">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em]">
            <span className="text-accent">Getting started</span>
            <span className="h-px w-6 bg-rule" />
            <span className="text-faded">About 5 min read</span>
          </div>
          <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] font-medium tracking-[-0.02em] text-balance sm:text-[3.5rem]">
            {title}
          </h1>
          <p className="mt-5 font-serif text-xl leading-snug text-pretty text-faded italic">
            A practical way to turn everything you&apos;ve got going on into a
            few meaningful priorities and a workable plan.
          </p>
        </header>

        <div className="prose-guide mt-10 pb-12">
          <p>
            Most setup questions I hear aren&apos;t really about features.
            They&apos;re about deciding what counts as a goal, what&apos;s just
            part of life, and where everything else should go.
          </p>
          <p>
            This is how I work through that at the start of a season. It&apos;s
            the approach I find useful, not the only valid way to use
            Superfocus, so take what helps and leave the rest.
          </p>
        </div>

        <Part number="01" label="Take stock" title="Start with your situation">
          <div className="prose-guide">
            <p>
              Before I create any goals, I find it useful to get a rough
              picture of where things stand:
            </p>
            <ul>
              <li>What I&apos;m currently working on.</li>
              <li>What I want to accomplish over the next few months.</li>
              <li>What responsibilities already take up my time.</li>
              <li>What I&apos;m struggling to make progress on.</li>
              <li>What meaningful changes I&apos;d like to see.</li>
              <li>How much time and capacity I realistically have.</li>
            </ul>
            <p>
              None of this needs to be well formulated. A messy description of
              your circumstances is a perfectly good place to start. Write it
              down, say it out loud, whatever is easiest.
            </p>
            <p>
              The point isn&apos;t to produce goals yet. It&apos;s to end up with
              a useful picture of what matters.
            </p>
          </div>
        </Part>

        <Part number="02" label="Prioritize" title="Choose your seasonal priorities">
          <div className="prose-guide">
            <p>
              I think of a season as roughly three months in which I
              deliberately prioritize a handful of things. Superfocus suggests
              12 weeks, though you can pick a shorter season or set your own
              length.
            </p>
            <p>
              Not every ambition needs to become a seasonal goal. Some
              commitments stay important without being the main focus of the
              season, and that&apos;s fine.
            </p>
            <p>
              What makes something a goal, for me, is that it should
              meaningfully influence how I spend my time and attention. It
              doesn&apos;t have to be a perfectly measurable achievement. For
              example:
            </p>
            <ul>
              <li>Make meaningful progress building a business.</li>
              <li>Improve an important aspect of health.</li>
              <li>Become more present with family.</li>
              <li>Establish a more sustainable working routine.</li>
            </ul>
            <p>
              Even when a goal has no definitive finish line, it helps to know
              what progress would look like. &ldquo;More present with
              family&rdquo; might mean phone-free evenings most weeknights, or a
              proper day out together every weekend.
            </p>
            <p>
              I don&apos;t aim for a particular number of goals. I aim for a
              list short enough that it actually changes what I do next week.
            </p>
          </div>
        </Part>

        <Part number="03" label="Organize" title="Give everything a place">
          <div className="prose-guide">
            <p>
              Once I know what I&apos;m prioritizing, I sort things into
              Superfocus. In plain English:
            </p>
          </div>

          <dl className="mt-6 divide-y divide-rule rounded-2xl border border-rule bg-white/60">
            {CONCEPTS.map((concept) => (
              <div key={concept.term} className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className="font-serif text-lg leading-snug font-medium text-ink">{concept.term}</dt>
                <dd className="text-[0.98rem] leading-relaxed text-ink/75">{concept.children}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 border-l-2 border-accent pl-4 text-[0.95rem] leading-relaxed text-ink/70">
            <span className="font-medium text-ink">
              Superfocus doesn&apos;t currently have a separate project concept.{" "}
            </span>
            Some people use milestones to organize projects within a larger
            goal. In other cases, a sufficiently important project might justify
            its own goal. It depends on what you want to prioritize and how
            closely you want to track progress.
          </p>

          <div className="prose-guide mt-6">
            <p>
              I try to stay flexible without making the distinctions
              meaningless. When I&apos;m unsure, I ask: is this something I
              want to deliberately prioritize this season, or something I
              simply need to keep looking after? The first might deserve a
              place among my seasonal goals. The second might be better suited
              to a support area. And if my priorities change, I can adjust that
              structure.
            </p>
            <p>
              For odds and ends that don&apos;t belong anywhere yet, there&apos;s
              the <strong>Inbox</strong>, which sits with your support areas.
              I&apos;d rather leave something there than invent a goal for it.
            </p>
          </div>

          <p className="mt-10 text-xs font-medium tracking-[0.14em] text-accent uppercase">
            An illustrative example
          </p>
          <div className="mt-3 space-y-3">
            {EXAMPLES.map((example) => (
              <div key={example.area} className="rounded-2xl border border-rule bg-white/60 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-serif text-xl leading-snug font-medium text-ink">{example.area}</p>
                  <span className="text-xs font-medium tracking-[0.14em] text-faded uppercase">{example.kind}</span>
                </div>
                <dl className="mt-3 space-y-2">
                  {example.rows.map((row) => (
                    <div key={row.label} className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
                      <dt className="text-sm font-medium text-ink">{row.label}</dt>
                      <dd className="text-[0.95rem] leading-relaxed text-ink/75">{row.text}</dd>
                    </div>
                  ))}
                </dl>
                {example.note && (
                  <p className="mt-4 border-t border-rule pt-3 text-sm leading-relaxed text-faded">{example.note}</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-faded">
            These are examples, not a template. Your areas, and where they
            land, will look different.
          </p>

          <aside className="mt-8 border-l-2 border-accent pl-4">
            <p className="text-[0.95rem] leading-relaxed font-medium text-ink">
              Already started your season?
            </p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">
              You don&apos;t necessarily need to start over. You can rename
              goals and milestones, reorganize tasks, and change a goal into a
              support area or vice versa.
            </p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">
              I&apos;d recommend adjusting what you&apos;ve already created
              before considering a full reset. Your first structure doesn&apos;t
              need to be perfect. You can refine it as you learn what works for
              you.
            </p>
          </aside>
        </Part>

        <Part number="04" label="Protect time" title="Make time for what matters">
          <div className="prose-guide">
            <p>
              Each week, I look at the commitments already on my calendar, then
              reserve time for the goals and responsibilities I want to
              prioritize. I call this <strong>protecting time</strong>.
            </p>
            <p>
              I don&apos;t necessarily know which tasks I&apos;ll do in those
              blocks. I might protect Monday morning for work on Superfocus
              without deciding the precise tasks until Monday arrives. I
              sometimes think of it as painting my week with my priorities, then
              filling in the details as each day approaches.
            </p>
          </div>

          <ProtectedWeekCard />

          <div className="prose-guide">
            <p>It helps me to keep four things separate:</p>
          </div>
          <ol className="mt-4 space-y-3">
            {[
              "Deciding something matters.",
              "Protecting time for it.",
              "Choosing specific tasks.",
              "Actually doing the work.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4 text-[1.0625rem] leading-relaxed text-ink/85">
                <span className="font-mono text-sm leading-[1.9] text-accent tabular-nums">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="prose-guide mt-6">
            <p>
              They aren&apos;t the same commitment, and they don&apos;t have to
              happen at the same time. Some protected time doesn&apos;t need
              tasks at all. If you want to spend more time with your kids, you
              can protect your evenings for family without inventing tasks to
              fill them.
            </p>
            <p>
              If you&apos;d like a hand, the coach can look at your calendar,
              goals, and the time you&apos;ve protected when you plan with it,
              and propose changes you can keep or undo. Treat its suggestions as
              a starting point. It won&apos;t always get the trade-offs right,
              and you know things it doesn&apos;t.
            </p>
            <p>
              The main guide covers{" "}
              <Link href="/#protect-time" className={linkClass}>
                how I protect time each week
              </Link>{" "}
              and{" "}
              <Link href="/#daily-sync" className={linkClass}>
                how I plan the next day
              </Link>{" "}
              in more detail.
            </p>
          </div>

          <div className="prose-guide">
            <h3>Start small, then refine</h3>
            <p>
              You don&apos;t need to organize everything perfectly before
              getting started. I&apos;d recommend beginning with a relatively
              simple setup:
            </p>
          </div>
          <ol className="mt-4 space-y-3">
            {[
              "Define the few goals you want to prioritize this season.",
              "Add support areas for the ongoing responsibilities you want to keep visible.",
              "Create a handful of useful milestones and tasks.",
              "Protect some time for your priorities during the coming week.",
              "Start working, and adjust the structure as you learn what works.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4 text-[1.0625rem] leading-relaxed text-ink/85">
                <span className="font-mono text-sm leading-[1.9] text-accent tabular-nums">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="prose-guide mt-6">
            <p>
              The important part is getting to a point where Superfocus helps
              you make better decisions about your time. You can add more
              detail when you actually need it.
            </p>
          </div>
        </Part>

        <Part number="05" label="Get help" title="Need help? Try this prompt">
          <div className="prose-guide">
            <p>
              If you&apos;re struggling to turn everything you&apos;ve got going
              on into a sensible Superfocus setup, you don&apos;t have to figure
              it all out alone.
            </p>
            <p>
              I&apos;ve put together a prompt you can paste into ChatGPT or
              Claude. You can then write or talk through your situation and let
              the conversation help you arrive at a structure that makes sense.
              You can use voice if that&apos;s easier.
            </p>
            <p>
              The prompt explains how Superfocus works today, so the assistant
              can make recommendations that fit the actual product.
            </p>
          </div>

          <PromptCard prompt={seasonPrompt} label="Prompt for ChatGPT or Claude" />

          <p className="border-l-2 border-accent pl-4 text-[0.95rem] leading-relaxed text-ink/70">
            This exercise helps you work out a structure you can bring into
            Superfocus. ChatGPT and Claude won&apos;t automatically have access
            to your Superfocus account, so you&apos;ll still need to review and
            apply the recommendations yourself.
          </p>
        </Part>

        <div className="flex flex-col gap-5 rounded-2xl border border-rule bg-white p-7 sm:flex-row sm:items-center sm:p-8">
          <Image
            src="/javi.jpeg"
            alt="Javier Alaves"
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover ring-1 ring-rule"
          />
          <p className="flex-1 text-[0.95rem] leading-relaxed text-ink/75">
            Once your season has some shape, the main guide picks up from
            there: calendars, protected time, daily and weekly syncs, and
            reflection.
          </p>
          <Link
            href="/#connect-calendars"
            className="inline-flex shrink-0 items-center self-start rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/85 sm:self-center"
          >
            Continue the guide
          </Link>
        </div>

        <Link
          href={guideSection}
          className="group mt-6 flex items-center gap-2 text-sm font-medium text-faded transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          Back to the guide
        </Link>
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
