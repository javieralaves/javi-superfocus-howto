"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useStage } from "@/components/illustrations/stage";

/** Background and clipping shared by every guide scene. */
export function Scene({
  children,
  className,
  onInteract,
}: {
  children: ReactNode;
  className?: string;
  onInteract?: () => void;
}) {
  return (
    <div
      onPointerDownCapture={onInteract}
      className={cn("sf-ui absolute inset-0 overflow-hidden rounded-[24px] bg-[#f5f6f8]", className)}
    >
      {children}
    </div>
  );
}

/**
 * Lets a scene play itself until the reader takes over. Each step runs once,
 * `delayMs` after the stage starts playing, and never after an interaction.
 */
export function useAutopilot() {
  const { play, still } = useStage();
  const [interacted, setInteracted] = useState(false);
  const takeOver = useCallback(() => setInteracted(true), []);
  const active = play && !still && !interacted;
  return { active, takeOver, still };
}

export function useAutoStep(active: boolean, delayMs: number, step: () => void, deps: unknown[] = []) {
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(step, delayMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, delayMs, ...deps]);
}

/** Types `text` out once `active` turns true. */
export function useTypewriter(text: string, active: boolean, msPerChar = 28) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (count >= text.length) return;
    const t = window.setTimeout(() => setCount((c) => c + 1), msPerChar);
    return () => window.clearTimeout(t);
  }, [active, count, text, msPerChar]);
  return { typed: text.slice(0, count), done: count >= text.length };
}

export function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      className="flex cursor-pointer items-center gap-2 type-body font-medium text-foreground"
    >
      <span
        className={cn(
          "relative h-[18px] w-[30px] rounded-full transition-colors duration-200",
          on ? "bg-foreground" : "bg-border-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] size-[14px] rounded-full bg-white shadow-sm transition-[left] duration-200 ease-[var(--ease-out)]",
            on ? "left-[14px]" : "left-[2px]",
          )}
        />
      </span>
      {label}
    </button>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-sidebar-border bg-card shadow-[0_12px_32px_-16px_rgba(0,0,0,0.16)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function formatDuration(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}
