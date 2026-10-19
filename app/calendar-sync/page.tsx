import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import { GuideVisual } from "@/components/visuals/guide-visual";
import {
  CalendarSyncVisual,
  CalendarsToSyncCard,
  ExportSettingsCard,
  ProviderListCard,
} from "@/components/visuals/calendar-sync";

const title = "Connecting your calendars to Superfocus";
const description =
  "How calendar syncing works in both directions, how to set it up, and what to try when events or Superfocus blocks don't look right.";
const supportEmail = "help@superfocus.me";

export const metadata: Metadata = {
  title: `${title} · How I Use Superfocus`,
  description,
};

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

function Direction({
  tag,
  title,
  icon,
  children,
}: {
  tag: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-rule bg-white/60 p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-accent">
        {icon}
        {tag}
      </div>
      <p className="mt-2 font-serif text-xl leading-snug font-medium text-ink">{title}</p>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/75">{children}</p>
    </div>
  );
}

function SetupStep({ number, children }: { number: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="font-mono text-sm leading-[1.9] text-accent tabular-nums">{number}</span>
      <div className="prose-guide min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Faq({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="group border-b border-rule">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-[1.05rem] leading-snug font-medium text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
        {question}
        <Plus
          className="mt-0.5 size-4 shrink-0 text-faded transition-transform duration-200 group-open:rotate-45"
          aria-hidden
        />
      </summary>
      <div className="prose-guide pb-6 text-[1rem]">{children}</div>
    </details>
  );
}

export default function CalendarSync() {
  return (
    <>
      <main id="top" className="mx-auto max-w-[680px] px-6 pt-10 pb-24 sm:pt-14">
        <Link
          href="/#connect-calendars"
          className="inline-flex items-center gap-1.5 rounded-full py-1 text-sm font-medium text-faded transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          How I use Superfocus
        </Link>

        <header className="mt-12 sm:mt-16">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em]">
            <span className="text-accent">Support</span>
            <span className="h-px w-6 bg-rule" />
            <span className="text-faded">About 3 min read</span>
          </div>
          <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] font-medium tracking-[-0.02em] text-balance sm:text-[3.5rem]">
            {title}
          </h1>
          <p className="mt-5 font-serif text-xl leading-snug text-pretty text-faded italic">
            What comes in, what goes out, and what to try when something looks off.
          </p>
        </header>

        <div className="mt-10">
          <GuideVisual caption="Events come in from your calendars. Your Superfocus blocks can go out as private, busy events.">
            <CalendarSyncVisual />
          </GuideVisual>
        </div>

        <div className="prose-guide pb-12">
          <p>
            I connect my calendars so Superfocus knows when I&apos;m already
            busy. Most calendar questions I hear come down to one thing: which
            direction you&apos;re looking at. So that&apos;s where to start.
          </p>
        </div>

        <Part number="01" label="The basics" title="How calendar syncing works">
          <div className="prose-guide">
            <p>Syncing runs in two directions, and each has its own settings.</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Direction
              tag="Incoming"
              title="Calendar events → Superfocus"
              icon={<ArrowDownLeft className="size-3.5" aria-hidden />}
            >
              Meetings and other events from the calendars you select appear in
              Superfocus, so you can plan around them.
            </Direction>
            <Direction
              tag="Outgoing"
              title="Superfocus blocks → your calendar"
              icon={<ArrowUpRight className="size-3.5" aria-hidden />}
            >
              Time you block for your goals can be added to one of your
              calendars as a private, busy event, so others don&apos;t book
              over it.
            </Direction>
          </div>
          <div className="prose-guide mt-6">
            <p>
              The two are independent. You can bring events in without sending
              anything out, and events that came in from a calendar are never
              sent back.
            </p>
          </div>
        </Part>

        <Part number="02" label="Setup" title="Getting set up">
          <div className="space-y-6">
            <SetupStep number="1">
              <p>
                In Superfocus, open{" "}
                <strong>Settings → Integrations → Calendar</strong>.
              </p>
            </SetupStep>
            <SetupStep number="2">
              <p>
                Connect your accounts with <strong>Connect Google Calendar</strong>,{" "}
                <strong>Connect Outlook</strong>, or{" "}
                <strong>Connect iCloud Calendar</strong>. iCloud asks for an
                app-specific password, and the screen walks you through
                creating one. To add more accounts from the same provider,
                expand it and click <strong>Connect another account</strong>.
              </p>
              <ProviderListCard />
            </SetupStep>
            <SetupStep number="3">
              <p>
                Pick what comes in. Right after you connect, the account&apos;s
                settings open. Under <strong>Calendars to sync</strong>, only
                your main calendar is ticked. Tick any shared, team, or family
                calendars you also want to see.
              </p>
              <CalendarsToSyncCard />
            </SetupStep>
            <SetupStep number="4">
              <p>
                Decide what goes out. <strong>Show Superfocus blocks on…</strong>{" "}
                controls the outgoing direction for that account: which{" "}
                <strong>Target calendar</strong> the blocks land on, their{" "}
                <strong>Event title</strong>, and which{" "}
                <strong>Goals shared</strong>.
              </p>
              <ExportSettingsCard />
              <p className="border-l-2 border-accent pl-4 text-[0.95rem] leading-relaxed text-ink/70">
                <span className="font-medium text-ink">Already on? </span>
                For your first Google, Outlook, or iCloud account, Superfocus
                switches this on for you: blocks for all your goals go to your
                main calendar as &ldquo;Blocked via Superfocus&rdquo;. Accounts
                you add later start with it off. You can change the destination,
                title, and goals anytime.
              </p>
            </SetupStep>
            <SetupStep number="5">
              <p>
                Click <strong>Save changes</strong>. To come back later, expand
                the provider and click the pencil next to the account.
              </p>
            </SetupStep>
          </div>
        </Part>

        <Part number="03" label="Troubleshooting" title="Frequently asked questions">
          <div className="border-t border-rule">
            <Faq question="Why aren't some of my Google Calendar events showing up?">
              <p>
                Usually the calendar they live on isn&apos;t selected. Only your
                main calendar is ticked when you connect, so shared, team, and
                family calendars stay hidden until you tick them under{" "}
                <strong>Calendars to sync</strong>.
              </p>
              <p>
                Then click <strong>Sync now</strong> at the bottom of the
                Calendar settings, or the refresh icon at the top of your
                calendar. Also worth checking: the events might be on another
                Google account (connect it too), and events you&apos;ve declined
                aren&apos;t brought in.
              </p>
            </Faq>
            <Faq question={"Why did \u201cBlocked via Superfocus\u201d events appear in my calendar?"}>
              <p>
                That&apos;s the outgoing sync. It switches on automatically when
                you connect your first Google, Outlook, or iCloud account, so
                the time you plan for your goals shows as busy to others.
              </p>
              <p>
                To change it, open the account&apos;s settings. You can turn off{" "}
                <strong>Show Superfocus blocks</strong>, pick another{" "}
                <strong>Target calendar</strong>, use the goal name, block
                title, or your own text as the <strong>Event title</strong>, or
                share fewer goals. Turning it off removes the blocks Superfocus
                added.
              </p>
            </Faq>
            <Faq question="What can other people see?">
              <p>
                Exported blocks are created as <strong>private</strong> and{" "}
                <strong>busy</strong>. People who can see your calendar or your
                free/busy times see that you&apos;re busy, not what you&apos;re
                working on. With the default title, the event name only says
                &ldquo;Blocked via Superfocus&rdquo; anyway.
              </p>
              <p>
                Someone with edit or delegate access to your calendar may still
                see titles, so keep that in mind if you switch to goal or block
                names.
              </p>
            </Faq>
            <Faq question="Why is Calendly or Cal.com showing me as unavailable?">
              <p>
                Scheduling tools treat busy events as conflicts, and exported
                blocks are busy. That&apos;s often the point, since it protects
                your goal time. If it&apos;s blocking too much:
              </p>
              <ul>
                <li>
                  <strong>Share only some goals</strong>, so only those blocks
                  go out.
                </li>
                <li>
                  <strong>Use a separate target calendar</strong> that your
                  scheduling tool doesn&apos;t check for conflicts, if it lets
                  you choose.
                </li>
                <li>
                  <strong>Turn export off.</strong> Your booking links open up
                  again, but people can then book over time you planned for
                  your goals.
                </li>
              </ul>
            </Faq>
            <Faq question="My work calendar won't connect. What can I do?">
              <p>
                Some companies don&apos;t allow apps to connect to work
                calendars. If yours lets you publish or share a calendar link
                (often an ICS link), use{" "}
                <strong>Subscribe to calendar via link</strong>, paste it, and
                give it a name. Check with IT if you&apos;re not sure it&apos;s
                allowed.
              </p>
              <p>
                It&apos;s read-only: you&apos;ll see the events in Superfocus,
                but can&apos;t change them, and Superfocus blocks can&apos;t be
                sent to it. Each link covers one calendar, and updates depend on
                how often your provider refreshes it.
              </p>
            </Faq>
            <Faq question="Can I move or edit Superfocus blocks in my other calendar?">
              <p>
                Partly. If you drag or resize a one-off block to a new time in
                Google Calendar, Outlook, or iCloud, Superfocus picks up the new
                time on the next sync. That doesn&apos;t work for recurring or
                all-day blocks, and other edits, like renaming, don&apos;t come
                back. If you delete the event there, the block stays in
                Superfocus but won&apos;t be added to that calendar again.
              </p>
              <p>
                For anything beyond a quick time change, I&apos;d edit the block
                in Superfocus. Your calendar updates to match, and it&apos;s the
                most reliable route.
              </p>
            </Faq>
            <Faq question="Syncing stopped working. What should I try?">
              <ul>
                <li>
                  In <strong>Settings → Integrations → Calendar</strong>, look
                  for <strong>Sync stopped, reconnect needed</strong> under a
                  provider. If it&apos;s there, click <strong>Reconnect</strong>.
                </li>
                <li>
                  Open the account&apos;s settings and check the right calendars
                  are ticked.
                </li>
                <li>
                  Click <strong>Sync now</strong> and give it a minute.
                </li>
                <li>
                  Still nothing? Disconnect the account and connect it again.
                  Its events and exported blocks are removed and come back
                  once it reconnects, so re-check your calendar and export
                  settings afterwards.
                </li>
                <li>If none of that helps, get in touch (below).</li>
              </ul>
            </Faq>
          </div>
        </Part>

        <section className="flex flex-col gap-5 rounded-2xl border border-rule bg-white p-7 sm:flex-row sm:items-center sm:p-8">
          <Image
            src="/javi.jpeg"
            alt="Javier Alaves"
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover ring-1 ring-rule"
          />
          <div className="flex-1">
            <h2 className="text-lg font-medium text-ink">Still stuck?</h2>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/75">
              If these steps don&apos;t sort it out, email us at{" "}
              <a href={`mailto:${supportEmail}`} className="font-medium text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
                {supportEmail}
              </a>{" "}
              or use <strong className="font-medium text-ink">Settings → Help &amp; resources → Contact support</strong>.
              Tell us which calendar you&apos;re using and what you expected to
              see, and we&apos;ll help.
            </p>
          </div>
          <a
            href={`mailto:${supportEmail}`}
            className="inline-flex shrink-0 items-center self-start rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/85 sm:self-center"
          >
            Email support
          </a>
        </section>

        <Link
          href="/#connect-calendars"
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
