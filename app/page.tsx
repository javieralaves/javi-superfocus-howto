import Image from "next/image";
import { GuideVisual } from "@/components/visuals/guide-visual";
import { RhythmLoop } from "@/components/visuals/rhythm-loop";
import { Checklist } from "./_components/checklist";
import { ProgressBar } from "./_components/progress-bar";
import { TocRail, type TocItem } from "./_components/toc";
import { rhythm, sections } from "./_content/sections";

const summaryId = "what-it-comes-down-to";
const introId = "start-here";
const overviewUrl = "https://www.youtube.com/watch?v=zygOP8H0H1E";

const tocItems: TocItem[] = [
  { id: introId, number: "00", title: "Start with the overview" },
  ...sections.map(({ id, number, shortTitle }) => ({
    id,
    number,
    title: shortTitle,
  })),
  { id: summaryId, number: "10", title: "What it comes down to" },
];

function SectionHeader({
  number,
  cadence,
  title,
  lede,
}: {
  number: string;
  cadence: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em]">
        <span className="font-mono text-accent tabular-nums">{number}</span>
        <span className="h-px w-6 bg-rule" />
        <span className="text-faded">{cadence}</span>
      </div>
      <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] font-medium tracking-[-0.01em] text-balance text-ink sm:text-[2.5rem]">
        {title}
      </h2>
      <p className="mt-3 font-serif text-xl leading-snug text-pretty text-faded italic">
        {lede}
      </p>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <ProgressBar />

      <div className="sticky top-0 z-40 border-b border-rule/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sf-logo.svg" alt="" width={18} height={18} className="size-[18px]" />
            <span className="text-sm font-semibold tracking-tight">
              Superfocus
            </span>
            <span className="ml-1 hidden text-sm text-faded sm:inline">
              / How I use it
            </span>
          </a>
          <a
            href={`#${summaryId}`}
            className="text-sm text-faded transition-colors hover:text-ink"
          >
            Skip to summary
          </a>
        </div>
      </div>

      <main id="top">
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="flex items-center gap-3">
            <Image
              src="/javi.jpeg"
              alt="Javier Alaves"
              width={40}
              height={40}
              preload
              className="size-10 rounded-full object-cover ring-1 ring-rule"
            />
            <div className="leading-tight">
              <p className="text-sm font-medium text-ink">Javier Alaves</p>
              <p className="text-sm text-faded">
                Part of the team building Superfocus
              </p>
            </div>
          </div>
          <h1 className="mt-8 max-w-4xl font-serif text-[3.25rem] leading-[1.02] font-medium tracking-[-0.025em] text-balance sm:text-7xl lg:text-[5.5rem]">
            How I use <span className="italic">Superfocus</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-ink/75 sm:text-xl">
            How I plan my time, work toward my goals, and reflect on my
            progress. People organize their time differently, and what works
            for me won&apos;t necessarily work for everyone. But I&apos;ve found
            a relatively simple routine that helps me stay focused, keep my
            plans realistic, and get useful feedback from the coach.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-faded">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              10 sections
            </span>
            <span>About 8 min read</span>
            <a
              href={`#${introId}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-ink/85"
            >
              Start reading
              <span aria-hidden>↓</span>
            </a>
          </div>

          <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {rhythm.map((item) => (
              <div key={item.label} className="bg-paper p-6">
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                  {item.label}
                </dt>
                <dd className="mt-2.5 text-[0.95rem] leading-relaxed text-ink/80">
                  {item.text}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-32">
          <details className="group mx-auto mb-12 max-w-[680px] rounded-xl border border-rule bg-white/50 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium">
              Contents
              <span
                aria-hidden
                className="text-faded transition-transform group-open:rotate-180"
              >
                ↓
              </span>
            </summary>
            <ol className="border-t border-rule px-5 py-3">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex gap-3 py-1.5 text-sm text-faded hover:text-ink"
                  >
                    <span className="w-5 font-mono text-xs leading-5 text-accent">
                      {item.number}
                    </span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <TocRail items={tocItems} />

          <div>
            <article className="mx-auto max-w-[680px]">
              <section id={introId} className="scroll-mt-24 pb-16">
                <SectionHeader
                  number="00"
                  cadence="Before you start"
                  title="Start with the overview from Ali"
                  lede="The bigger picture: what Superfocus is and the philosophy behind it."
                />
                <a
                  href={overviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-[30px] border border-rule bg-white/55 p-2 shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_48px_-32px_rgba(15,15,25,0.22)] transition-shadow hover:shadow-[0_1px_0_rgba(0,0,0,0.02),0_28px_56px_-28px_rgba(15,15,25,0.3)]"
                >
                  <span className="relative block aspect-video overflow-hidden rounded-[24px] bg-paper-deep">
                    <Image
                      src="/ali-headshot.png"
                      alt="Ali Abdaal, cofounder of Superfocus"
                      fill
                      sizes="(min-width: 720px) 664px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition-transform duration-300 group-hover:scale-105">
                        <svg viewBox="0 0 24 24" className="ml-1 size-6 fill-ink" aria-hidden>
                          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                        </svg>
                      </span>
                    </span>
                    <span className="absolute right-5 bottom-4 left-5 flex items-end justify-between gap-4 text-white">
                      <span>
                        <span className="block text-sm font-medium">Ali Abdaal</span>
                        <span className="block text-sm text-white/75">Cofounder of Superfocus</span>
                      </span>
                      <span className="text-sm text-white/75">Watch on YouTube ↗</span>
                    </span>
                  </span>
                </a>
                <div className="prose-guide mt-10">
                  <p>
                    Before getting into my own routine, I&apos;d recommend
                    watching Ali&apos;s overview. It covers what Superfocus is,
                    how the pieces fit together, and the broader philosophy
                    behind it. Everything that follows is one way of putting
                    that into practice.
                  </p>
                </div>
              </section>

              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 border-t border-rule pt-14 pb-16 first:border-t-0 first:pt-0"
                >
                  <SectionHeader {...section} />
                  {section.visual && (
                    <GuideVisual caption={section.visual.caption}>
                      {section.visual.node}
                    </GuideVisual>
                  )}
                  <div className="prose-guide">{section.body}</div>
                  {section.after === "checklist" && (
                    <div className="mt-12">
                      <Checklist />
                    </div>
                  )}
                </section>
              ))}

              <section
                id={summaryId}
                className="scroll-mt-24 border-t border-rule pt-14"
              >
                <SectionHeader
                  number="10"
                  cadence="Summary"
                  title="What it all comes down to"
                  lede="My approach to Superfocus is relatively straightforward."
                />

                <RhythmLoop items={rhythm} />

                <div className="prose-guide mt-12">
                  <p>
                    I don&apos;t expect every day to go according to plan, and I
                    don&apos;t need Superfocus to make every decision for me.
                  </p>
                  <p>
                    What I value is having a system that helps me connect what I
                    want to accomplish with how I actually spend my time, while
                    giving me an opportunity to reflect and improve along the
                    way.
                  </p>
                </div>

                <div className="mt-14 rounded-2xl bg-ink px-8 py-10 text-paper sm:px-10 sm:py-12">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#a99cf2]">
                    In short
                  </p>
                  <p className="mt-4 font-serif text-[1.65rem] leading-snug text-pretty sm:text-3xl">
                    That&apos;s ultimately how I use Superfocus: as a planning
                    system, a source of accountability, and a coach that becomes
                    more helpful as it understands my goals, preferences, and
                    progress.
                  </p>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm text-faded">
          <span>How I Use Superfocus · A personal guide</span>
          <a href="#top" className="transition-colors hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
