"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; ordered: boolean; items: Array<{ text: string; children: string[] }> };

function parse(source: string): Block[] {
  return source.split(/\n\s*\n/).map((chunk) => {
    const lines = chunk.split("\n");
    const ordered = /^\d+\.\s/.test(lines[0]);
    if (!ordered && !lines[0].startsWith("- ")) return { kind: "p", text: chunk };
    const items: Array<{ text: string; children: string[] }> = [];
    for (const line of lines) {
      if (/^\s+-\s/.test(line)) items[items.length - 1]?.children.push(line.replace(/^\s+-\s/, ""));
      else items.push({ text: line.replace(/^(\d+\.|-)\s/, ""), children: [] });
    }
    return { kind: "list", ordered, items };
  });
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

function copyWithFallback(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  return ok;
}

export function PromptCard({ prompt, label }: { prompt: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = window.setTimeout(() => setStatus("idle"), 2400);
    return () => window.clearTimeout(t);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus("copied");
    } catch {
      setStatus(copyWithFallback(prompt) ? "copied" : "error");
    }
  };

  const blocks = parse(prompt);

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-rule bg-white shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_48px_-32px_rgba(15,15,25,0.22)]">
      <figcaption className="flex items-center justify-between gap-4 border-b border-rule bg-paper-deep/60 py-3 pr-3 pl-5">
        <span className="text-xs font-medium tracking-[0.14em] text-accent uppercase">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {status === "copied" ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          {status === "copied" ? "Copied" : "Copy prompt"}
        </button>
      </figcaption>
      <div className="relative">
        <div
          tabIndex={0}
          role="region"
          aria-label="Prompt text"
          className="max-h-[28rem] overflow-y-auto px-5 pt-5 pb-10 text-[0.95rem] leading-relaxed text-ink/80 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-inset sm:px-6"
        >
          <div className="space-y-4">
            {blocks.map((block, i) => {
              if (block.kind === "p") return <p key={i}>{inline(block.text)}</p>;
              const List = block.ordered ? "ol" : "ul";
              return (
                <List
                  key={i}
                  className={block.ordered ? "list-decimal space-y-2 pl-5 marker:text-accent" : "list-disc space-y-2 pl-5 marker:text-accent"}
                >
                  {block.items.map((item, j) => (
                    <li key={j} className="pl-1">
                      {inline(item.text)}
                      {item.children.length > 0 && (
                        <ul className="mt-2 list-[circle] space-y-1.5 pl-5 marker:text-faded">
                          {item.children.map((child, k) => (
                            <li key={k} className="pl-1">
                              {inline(child)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </List>
              );
            })}
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-white/0" />
      </div>
      <p aria-live="polite" className="sr-only">
        {status === "copied" ? "Prompt copied to clipboard" : status === "error" ? "Couldn't copy. Select the text and copy it manually." : ""}
      </p>
      {status === "error" && (
        <p className="border-t border-rule px-5 py-3 text-sm text-faded">
          Couldn&apos;t copy automatically. Select the text above and copy it manually.
        </p>
      )}
    </figure>
  );
}
