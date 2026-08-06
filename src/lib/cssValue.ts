/**
 * Reading tokens back out of the cascade.
 *
 * The wave is tuned entirely in `tokens.css` but applied in a shader, so every
 * knob has to make one trip from CSS text into a number. These do that trip.
 * They take the resolving font sizes as arguments rather than touching the
 * document, which is what keeps them pure.
 */

export interface FontContext {
  /** Font size of the element the value resolves against, for `em`. */
  em: number;
  /** Root font size, for `rem`. */
  rem: number;
}

/**
 * A CSS length to px. Returns null when there is no number to read, so the
 * caller can tell "absent" from a legitimate `0`.
 *
 * `rem` has to be tested before `em` — it ends in `em` too, and getting that
 * order wrong silently scales every value by the wrong base.
 */
export const toPx = (raw: string, font: FontContext): number | null => {
  const text = raw.trim();
  const value = Number.parseFloat(text);
  if (!Number.isFinite(value)) return null;
  if (text.endsWith('rem')) return value * font.rem;
  if (text.endsWith('em')) return value * font.em;
  return value;
};

/** A CSS number, unitless. */
export const toNumber = (raw: string, fallback: number): number => {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
};

/**
 * A CSS time to seconds.
 *
 * Zero falls back rather than passing through: every duration here becomes a
 * rate, and a period of nothing is a divide by zero.
 */
export const toSeconds = (raw: string, fallback: number): number => {
  const text = raw.trim();
  const value = Number.parseFloat(text);
  if (!Number.isFinite(value) || value === 0) return fallback;
  return text.endsWith('ms') ? value / 1000 : value;
};
