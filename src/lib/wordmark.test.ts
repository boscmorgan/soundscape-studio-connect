import { describe, it, expect } from 'vitest';

import { toNumber, toPx, toSeconds, type FontContext } from './cssValue';
import { wordmarkGeometry, type WordmarkMetrics } from './wordmarkRaster';

const font: FontContext = { em: 100, rem: 16 };

describe('toPx', () => {
  it('scales em against the element font size', () => {
    expect(toPx('0.105em', font)).toBeCloseTo(10.5);
  });

  // `rem` ends in `em`, so a naive suffix check silently uses the wrong base.
  it('scales rem against the root font size, not the element', () => {
    expect(toPx('2rem', font)).toBe(32);
  });

  it('passes px and bare numbers through', () => {
    expect(toPx('4.978px', font)).toBeCloseTo(4.978);
    expect(toPx('12', font)).toBe(12);
  });

  it('tolerates the whitespace getPropertyValue leaves on custom properties', () => {
    expect(toPx(' 0.5em ', font)).toBe(50);
  });

  // The tokens document "set it to 0"; that has to survive the round trip.
  it('keeps a legitimate zero distinct from absent', () => {
    expect(toPx('0', font)).toBe(0);
    expect(toPx('0em', font)).toBe(0);
    expect(toPx('', font)).toBeNull();
    expect(toPx('normal', font)).toBeNull();
  });
});

describe('toSeconds', () => {
  it('reads s and ms', () => {
    expect(toSeconds('4.2s', 1)).toBeCloseTo(4.2);
    expect(toSeconds('300ms', 1)).toBeCloseTo(0.3);
  });

  // Every duration becomes a rate, so zero would divide by zero downstream.
  it('falls back rather than passing zero through', () => {
    expect(toSeconds('0s', 9)).toBe(9);
    expect(toSeconds('', 9)).toBe(9);
  });
});

describe('toNumber', () => {
  it('reads unitless values and falls back on junk', () => {
    expect(toNumber('1.25', 0)).toBe(1.25);
    expect(toNumber('-7deg', 0)).toBe(-7);
    expect(toNumber('', 3)).toBe(3);
  });
});

/**
 * A mark 800 wide in a 100-tall box, ink filling it, no stroke and no slant —
 * so every number below is the geometry alone.
 */
const metrics: WordmarkMetrics = {
  fontAscent: 80,
  fontDescent: 20,
  inkAscent: 75,
  inkDescent: 15,
  inkLeft: 0,
  inkRight: 800,
};

const input = {
  boxWidth: 800,
  boxHeight: 100,
  strokeWidth: 0,
  slant: 0,
  bleedX: 10,
  bleedY: 10,
};

describe('wordmarkGeometry', () => {
  it('surrounds the layout box with the bleed', () => {
    const geometry = wordmarkGeometry(metrics, input)!;

    expect(geometry.width).toBe(820);
    expect(geometry.height).toBe(120);
    expect(geometry.insetX).toBe(10);
    expect(geometry.insetY).toBe(10);
  });

  it('puts the baseline where `line-height: 1` would', () => {
    // Face fills the box exactly (80 + 20), so there is no leading to split.
    expect(wordmarkGeometry(metrics, input)!.baseline).toBe(80);

    // A face shorter than the box gets the remainder split evenly.
    const short = { ...metrics, fontAscent: 60, fontDescent: 20 };
    expect(wordmarkGeometry(short, input)!.baseline).toBe(70);
  });

  it('reports the word as a fraction of the texture', () => {
    const geometry = wordmarkGeometry(metrics, input)!;

    expect(geometry.span).toBeCloseTo(800 / 820);
    // The shader inverts this to build word space; it must not be zero.
    expect(geometry.span).toBeGreaterThan(0);
  });

  it('grows the texture to cover ink that overflows the box', () => {
    // Titan One's caps and descenders exceed a line-height-1 box.
    const overflowing = { ...metrics, inkAscent: 95, inkDescent: 30 };
    const geometry = wordmarkGeometry(overflowing, input)!;

    // Ink runs from -15 to 110; the bleed sits outside that, not inside it.
    expect(geometry.insetY).toBe(25);
    expect(geometry.height).toBe(145);
  });

  it('makes room on both sides for the slant, which pivots on the box centre', () => {
    const geometry = wordmarkGeometry(metrics, { ...input, slant: -7 })!;
    const flat = wordmarkGeometry(metrics, input)!;

    expect(geometry.width).toBeGreaterThan(flat.width);
    // A forward lean pushes the top right and the bottom left, so both edges
    // move — cropping either one would clip the mark.
    expect(geometry.insetX).toBeGreaterThan(flat.insetX);
    expect(geometry.width - geometry.insetX).toBeGreaterThan(
      flat.width - flat.insetX,
    );
  });

  it('adds half the stroke on every side', () => {
    const geometry = wordmarkGeometry(metrics, { ...input, strokeWidth: 8 })!;

    expect(geometry.insetX).toBe(14);
    expect(geometry.width).toBe(828);
  });

  /*
   * The failure this guards against is not a crash: a NaN reaches
   * `canvas.width`, the browser coerces it to 0, and the mark disappears with
   * nothing logged. Returning null instead leaves the live copy on screen.
   */
  it('refuses geometry it cannot resolve', () => {
    expect(wordmarkGeometry({ ...metrics, fontAscent: NaN }, input)).toBeNull();
    expect(wordmarkGeometry(metrics, { ...input, boxWidth: 0 })).toBeNull();
    expect(wordmarkGeometry(metrics, { ...input, boxHeight: NaN })).toBeNull();
    expect(wordmarkGeometry(metrics, { ...input, bleedX: Infinity })).toBeNull();
  });
});
