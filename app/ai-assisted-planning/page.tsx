import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AssistedPlanningExample } from "@/components/visuals/ai-planning-example";
import { PromptCard } from "../_components/prompt-card";
import { aiAssistedPlanningPrompt } from "../_content/ai-assisted-planning-prompt";

const title = "How I plan with AI assistants";
const description =
  "A practical way to bring work from other tools into my Superfocus goals, calendar, and journal.";
const guideSection = "/#ai-assisted-planning";

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

function SpokenPrompt({ children }: { children: ReactNode }) {
  return (
    <blockquote className="rounded-xl border border-rule bg-white/60 px-5 py-4 text-[0.98rem] leading-relaxed text-ink/80">
      {children}
    </blockquote>
  );
}

export default function AIAssistedPlanning() {
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
            <span className="text-accent">Optional workflow</span>
            <span className="h-px w-6 bg-rule" />
            <span className="text-faded">About 7 min read</span>
          </div>
          <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] font-medium tracking-[-0.02em] text-balance sm:text-[3.5rem]">
            {title}
          </h1>
          <p className="mt-5 font-serif text-xl leading-snug text-pretty text-faded italic">
            A practical way to connect the work happening across different tools
            to the goals I&apos;m trying to achieve.
          </p>
        </header>

        <div className="prose-guide mt-10 pb-12">
          <p>Most of my work doesn&apos;t happen in one application.</p>
          <p>
            I use GitHub for software projects, other tools for meeting notes
            and research, and AI assistants to help me think through what
            I&apos;m doing.
          </p>
          <p>
            Superfocus is where I keep track of my goals, how I&apos;m planning
            to spend my time, and whether I&apos;m making progress.
          </p>
          <p>
            Since the introduction of Superfocus&apos;s MCP integration,
            I&apos;ve started using assistants to connect those two worlds.
          </p>
          <p>
            This is how that works for me. It&apos;s still evolving, and you
            don&apos;t need to follow all of it to get value from Superfocus.
          </p>
        </div>

        <Part number="01" label="Foundations" title="Start with goals and available time">
          <div className="prose-guide">
            <p>
              Before I ask an assistant what to work on, I want Superfocus to
              have a useful picture of what matters.
            </p>
            <p>
              That usually means a few seasonal goals, some milestones and
              tasks, and protected time on my calendar.
            </p>
            <p>
              I don&apos;t necessarily know which individual tasks I&apos;ll
              complete when I protect time for a goal. Sometimes I reserve
              Wednesday afternoon for a project and decide what to do with those
              hours later.
            </p>
            <p>That gives me a useful starting point for a planning conversation.</p>
            <p>
              Instead of asking an assistant to generate a generic task list, I
              can ask what would make sense given the goal, the work I&apos;ve
              already done, and the time I actually have available.
            </p>
            <p>
              If you haven&apos;t set up your goals yet, I&apos;d recommend
              starting with{" "}
              <Link href="/plan-your-season" className={linkClass}>
                how to plan your season
              </Link>
              .
            </p>
          </div>
        </Part>

        <Part number="02" label="Setup" title="Connect Superfocus and the relevant sources">
          <div className="prose-guide">
            <p>
              I use ChatGPT, but the general approach applies to other
              assistants that can connect to Superfocus through MCP.
            </p>
            <p>
              The MCP connection lets a compatible assistant work with
              information in Superfocus, subject to the access and permissions
              I&apos;ve granted.
            </p>
            <p>
              That means I can have a conversation about my goals, tasks,
              schedule, and relevant journal context without manually copying
              those details into every message.
            </p>
            <p>But there&apos;s an important distinction.</p>
            <p>
              Connecting Superfocus doesn&apos;t automatically connect
              everything else I use.
            </p>
            <p>
              If I want an assistant to understand recent work in GitHub or
              review a meeting transcript, I need to make that information
              available through the appropriate connections or share it in the
              conversation.
            </p>
            <p>For now, I often tell my assistant where to look.</p>
            <p>
              For example, I might explain that my recent development work is on
              GitHub, my meeting notes are in another connected application, and
              my planning context is in Superfocus.
            </p>
            <p>
              I&apos;d also recommend being deliberate about permissions. You
              can start by letting an assistant read information and ask it for
              suggestions before allowing it to make changes.
            </p>
            <p>
              I prefer to explicitly approve changes to my goals, tasks, or
              schedule.
            </p>
          </div>

          <aside className="mt-8 border-l-2 border-accent pl-4">
            <p className="text-[0.95rem] leading-relaxed text-ink/70">
              <span className="font-medium text-ink">Where to set it up.</span>{" "}
              In Superfocus, go to{" "}
              <strong className="font-medium text-ink">Settings → Integrations → MCP</strong>.
              You&apos;ll find the server address and short instructions for
              ChatGPT, Claude, and other assistants. When an assistant asks to
              connect, you approve it from Superfocus, and it can then read
              things like your goals, tasks, calendar, and journal. Making
              changes is a separate{" "}
              <strong className="font-medium text-ink">Can edit</strong> switch
              for each connection, which you can turn off at any time from the
              same place. Saving a journal note through an assistant counts as
              a change, so it needs that switch on too.
            </p>
          </aside>
        </Part>

        <Part number="03" label="Discuss" title="Discuss the work before deciding what to capture">
          <div className="prose-guide">
            <p>This is where I find the setup most useful.</p>
            <p>Imagine I&apos;ve spent an afternoon exploring a new product direction.</p>
            <p>
              I&apos;ve looked at a few ideas, developed a prototype, and
              discussed the results with my team. There are several reasonable
              things I could do next.
            </p>
            <p>
              I could keep exploring, prepare a more polished prototype, talk to
              users, or move on to something else.
            </p>
            <p>I don&apos;t necessarily want to turn every possibility into a task.</p>
            <p>Instead, I ask my assistant to help me interpret what happened.</p>
            <p>I might say:</p>
            <SpokenPrompt>
              Look at the work I&apos;ve done on this project and my current
              Superfocus goal. I&apos;ve got a couple of hours protected for it
              tomorrow. What would be the most useful next step? Just give me
              suggestions for now.
            </SpokenPrompt>
            <p>
              Because the assistant can reference my goals and available time,
              the conversation is about more than what <em>could</em> be done.
            </p>
            <p>
              It&apos;s about what makes sense to do next, given what I&apos;m
              trying to achieve.
            </p>
            <p>
              Sometimes the answer is a new task. Sometimes it&apos;s changing
              the order of existing work or revisiting a milestone that no
              longer makes sense.
            </p>
            <p>And sometimes there&apos;s nothing I need to change.</p>
            <p>That&apos;s a perfectly useful outcome too.</p>
          </div>
        </Part>

        <Part number="04" label="Review" title="Review the proposed changes">
          <div className="prose-guide">
            <p>Once we&apos;ve talked through the options, I decide what belongs in Superfocus.</p>
            <p>
              The assistant might suggest adding tasks, updating a milestone, or
              rearranging part of my schedule.
            </p>
            <p>
              I don&apos;t want every idea or passing thought automatically
              captured as a commitment.
            </p>
            <p>
              I also don&apos;t want to fill my calendar simply because an
              assistant can find things for me to do.
            </p>
            <p>
              If a recommendation makes sense, I approve it and ask the assistant
              to make the change, assuming I&apos;ve granted the necessary
              permissions.
            </p>
            <p>
              Otherwise, I can keep discussing it, modify the suggestion, or
              leave my plan alone.
            </p>
          </div>

          <AssistedPlanningExample />

          <div className="prose-guide">
            <p>
              I find it useful to distinguish between a task I intend to work on
              on a particular day and work that actually needs a specific hour
              in my calendar.
            </p>
            <p>
              For most tasks, choosing <strong>Plan for</strong> is enough. I
              schedule a task when I have a reason to commit particular hours to
              it, and use deadlines only when there&apos;s a real due date.
            </p>
            <p>
              The aim is to finish the conversation with a more credible plan,
              not necessarily a more complicated one.
            </p>
          </div>
        </Part>

        <Part number="05" label="Capture" title="Leave some context for the next conversation">
          <div className="prose-guide">
            <p>
              After a meaningful discussion or change in direction, I often ask
              the assistant to capture a short memo in my Superfocus journal.
            </p>
            <p>I don&apos;t need it to reproduce the whole conversation.</p>
            <p>
              I&apos;d rather keep a concise account of what happened, what I
              learned, what we decided, and why.
            </p>
            <p>For example:</p>
            <SpokenPrompt>
              Capture a short journal memo explaining what we explored, the
              direction we decided to pursue, and how it relates to the upcoming
              work.
            </SpokenPrompt>
            <p>
              This is useful because a task title rarely explains the full story
              behind a decision.
            </p>
            <p>
              If I return to the project tomorrow, the journal gives me somewhere
              to recover that context. My Superfocus coach can make use of those
              notes, and connected assistants can access relevant journal
              information through MCP when permitted.
            </p>
            <p>
              I still leave detailed research, code, and source documents where
              they belong. The journal isn&apos;t intended to replace all of
              those tools.
            </p>
            <p>
              For me, it&apos;s a place to preserve the context that&apos;s
              useful for making progress.
            </p>
          </div>
        </Part>

        <Part number="06" label="Continue" title="Pick up where you left off">
          <div className="prose-guide">
            <p>
              The next time I return to a goal, I can open Superfocus and see the
              plan I&apos;ve established.
            </p>
            <p>
              If I&apos;m not sure where to begin, I can ask the coach or a
              connected assistant for help.
            </p>
            <p>For example:</p>
            <SpokenPrompt>
              I&apos;ve got two hours of protected time for this goal today.
              Review my current tasks, recent journal context, and the direction
              we&apos;ve been taking. What would you suggest I work on?
            </SpokenPrompt>
            <p>
              I also run a scheduled planning review through ChatGPT. It looks
              at my upcoming Superfocus schedule and relevant recent work, then
              tells me if there&apos;s anything worth reconsidering.
            </p>
            <p>It doesn&apos;t make changes without my approval.</p>
            <p>
              You don&apos;t need to automate this. You can run a similar review
              manually whenever it would help.
            </p>
            <p>
              And you don&apos;t have to operate Superfocus entirely through
              chat. I still use the calendar, tasks, journal, and coach directly.
            </p>
            <p>The assistant is another way of working with the same underlying plan.</p>
          </div>
        </Part>

        <Part number="07" label="Start small" title="Try it with one goal">
          <div className="prose-guide">
            <p>If this feels like a lot of setup, I&apos;d start much smaller.</p>
            <p>
              Pick one goal in Superfocus. Protect some time for it. Connect an
              assistant you already use.
            </p>
            <p>
              Then have one conversation about what you&apos;ve been doing and
              what might be worth doing next.
            </p>
            <p>
              Ask for suggestions before making changes. Keep the useful ones.
              Capture a short memo if something important was decided.
            </p>
            <p>
              Come back the following day and see whether that context helps you
              continue.
            </p>
            <p>
              You can add more sources, automate reviews, or build a more
              sophisticated workflow later.
            </p>
            <p>None of that is required.</p>
            <p>
              If you&apos;re already using ChatGPT or another connected
              assistant, this is a useful place to start. It asks the assistant
              to understand your goals, review relevant context, and suggest
              changes without automatically applying them. You can adapt it to
              whichever sources and permissions you have available.
            </p>
          </div>

          <PromptCard prompt={aiAssistedPlanningPrompt} label="Try this with your AI assistant" />
        </Part>

        <section className="border-t border-rule pt-12 pb-12">
          <h2 className="font-serif text-[1.75rem] leading-[1.2] font-medium tracking-[-0.01em] text-balance text-ink sm:text-[2rem]">
            What I&apos;m finding useful
          </h2>
          <div className="prose-guide mt-5">
            <p>
              I&apos;m still figuring out how I want all these tools to work
              together.
            </p>
            <p>
              I&apos;d like the experience to become more seamless, particularly
              when it comes to bringing in relevant context from different places
              without having to specify where to look every time.
            </p>
            <p>But the approach already makes a meaningful difference for me.</p>
          </div>
          <blockquote className="my-10 border-l-2 border-accent pl-6 font-serif text-[1.5rem] leading-snug text-ink italic">
            I spend less time translating everything I&apos;ve done into a task
            list, and more time thinking about what the work means and what I
            should do next.
          </blockquote>
          <div className="prose-guide">
            <p>That&apos;s the part I&apos;d encourage you to try.</p>
          </div>
        </section>

        <div className="flex flex-col gap-5 rounded-2xl border border-rule bg-white p-7 sm:flex-row sm:items-center sm:p-8">
          <Image
            src="/javi.jpeg"
            alt="Javier Alaves"
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover ring-1 ring-rule"
          />
          <p className="flex-1 text-[0.95rem] leading-relaxed text-ink/75">
            The main guide picks up from here, with how I keep the routine
            manageable and what it all comes down to.
          </p>
          <Link
            href="/#keep-it-manageable"
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
