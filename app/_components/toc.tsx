"use client";

import { useEffect, useState } from "react";

export type TocItem = {
  id: string;
  number: string;
  title: string;
};

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        }
        const first = ids.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function useInContent(firstId: string) {
  const [inContent, setInContent] = useState(false);

  useEffect(() => {
    const first = document.getElementById(firstId);
    if (!first) return;
    const update = () => setInContent(first.getBoundingClientRect().top <= window.innerHeight * 0.5);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [firstId]);

  return inContent;
}

/** Edge rail of dashes that expands into the full contents on hover or focus. */
export function TocRail({ items }: { items: TocItem[] }) {
  const [ids] = useState(() => items.map((item) => item.id));
  const active = useActiveSection(ids);
  const inContent = useInContent(ids[0]);

  return (
    <nav
      aria-label="Table of contents"
      className={`group fixed top-1/2 left-0 z-30 hidden -translate-y-1/2 transition-[opacity,visibility] duration-300 lg:block ${
        inContent ? "opacity-100" : "pointer-events-none invisible opacity-0"
      }`}
    >
      <ol aria-hidden className="flex flex-col gap-[9px] py-4 pr-6 pl-6">
        {items.map((item) => (
          <li
            key={item.id}
            className={`h-px rounded-full transition-all duration-200 ${
              item.id === active ? "w-5 bg-ink" : "w-3 bg-ink/20"
            }`}
          />
        ))}
      </ol>

      <div className="pointer-events-none invisible absolute top-1/2 left-3 w-64 -translate-x-1 -translate-y-1/2 opacity-0 transition-all duration-200 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
        <ol className="rounded-2xl border border-rule bg-white p-1.5 shadow-[0_1px_2px_rgba(15,15,25,0.04),0_16px_40px_-16px_rgba(15,15,25,0.18)]">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`flex gap-3 rounded-lg px-3 py-1.5 text-sm leading-snug transition-colors hover:bg-paper-deep ${
                    isActive ? "text-ink" : "text-faded hover:text-ink"
                  }`}
                >
                  <span
                    className={`w-5 shrink-0 font-mono text-xs leading-5 tabular-nums ${
                      isActive ? "text-accent" : "text-faded/60"
                    }`}
                  >
                    {item.number}
                  </span>
                  <span className="truncate">{item.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
