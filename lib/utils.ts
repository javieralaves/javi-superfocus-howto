import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export const PRESS =
  "transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]";
