"use client";

import { useState, type ReactNode } from "react";

export function GuideVisual({ caption, children }: { caption: string; children: ReactNode }) {
  const [run, setRun] = useState(0);

  return (
    <figure className="mb-10">
      <div className="rounded-[30px] border border-rule bg-white/55 p-2 shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_48px_-32px_rgba(15,15,25,0.22)]">
        <div key={run}>{children}</div>
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-4 px-2 text-sm leading-snug text-faded">
        <span>{caption}</span>
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="-mt-1 shrink-0 rounded-md px-2 py-1 font-medium text-faded transition-colors hover:bg-paper-deep hover:text-ink"
        >
          Replay ↺
        </button>
      </figcaption>
    </figure>
  );
}
