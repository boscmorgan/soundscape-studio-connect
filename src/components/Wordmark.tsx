import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';
import { site } from '@/config/site';

interface WordmarkProps {
  /** Wraps the mark in an <h1> on the page that owns the primary heading. */
  as?: 'h1' | 'div';
  className?: string;
}

const LETTERS = [...site.name];

/**
 * Each letter sits one step further along a single sine period spread across
 * the word. The phase is handed to CSS twice:
 *
 *   - as a negative `animation-delay`, so the letters are already spread
 *     across the cycle on the first frame and the wave travels left to right;
 *   - as `--wave-y` / `--wave-r`, the pose that phase corresponds to at t=0,
 *     which is what reduced-motion users see frozen.
 *
 * `-cos` and `sin` mirror the keyframes in src/styles/base.css.
 */
const letterStyle = (index: number): CSSProperties => {
  const phase = index / LETTERS.length;
  const radians = phase * 2 * Math.PI;

  return {
    animationDelay: `calc(var(--wordmark-wave-duration) * ${(phase - 1).toFixed(4)})`,
    '--wave-y': (-Math.cos(radians)).toFixed(4),
    '--wave-r': Math.sin(radians).toFixed(4),
  } as CSSProperties;
};

/**
 * The lorenzo1UP wordmark — live type, not artwork.
 *
 * Set in the display face, stroked white with a transparent body, and waving
 * on a loop. Size it by overriding `--wordmark-size` per instance with the
 * arbitrary property `[--wordmark-size:…]`; the stroke, tracking and wave all
 * scale from it.
 *
 * The letters are split into spans to be animated individually, so the label
 * is restated on the wrapper — assistive tech reads the word, not ten
 * characters.
 */
export const Wordmark = ({ as: Tag = 'div', className }: WordmarkProps) => (
  <Tag
    aria-label={site.name}
    className={cn('wordmark w-fit max-w-full select-none', className)}
  >
    <span
      aria-hidden="true"
      className="inline-block whitespace-nowrap"
      style={{ transform: 'skewX(var(--wordmark-slant))' }}
    >
      {LETTERS.map((letter, index) => (
        <span
          // The mark is a fixed string; index is the letter's identity here.
          key={`${letter}-${index}`}
          className="wordmark-letter"
          style={letterStyle(index)}
        >
          {letter}
        </span>
      ))}
    </span>
  </Tag>
);
