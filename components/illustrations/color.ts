/** Goal color math ported from superos-frontend's useCalendarTheme. */

function srgbToLinear(channel: number) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function hexToOklch(hex: string) {
  const value = hex.replace("#", "");
  const r = srgbToLinear(parseInt(value.slice(0, 2), 16));
  const g = srgbToLinear(parseInt(value.slice(2, 4), 16));
  const b = srgbToLinear(parseInt(value.slice(4, 6), 16));

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const c = Math.sqrt(A * A + B * B);
  const h = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

export interface BlockColors {
  fill: string;
  text: string;
  line: string;
}

export const UNASSIGNED_COLORS: BlockColors = {
  fill: "oklch(0.98 0.003 260)",
  text: "oklch(0.42 0.015 260)",
  line: "oklch(0.91 0.006 260)",
};

export function blockColors(hex: string | null): BlockColors {
  if (!hex) return UNASSIGNED_COLORS;
  const { c, h } = hexToOklch(hex);
  return {
    fill: `oklch(0.95 ${Math.max(0.02, c * 0.3).toFixed(4)} ${h.toFixed(2)})`,
    text: `oklch(0.35 ${Math.max(0.05, c * 0.7).toFixed(4)} ${h.toFixed(2)})`,
    line: hex,
  };
}
