import { useEffect, useRef, useState } from 'react';

import { toNumber, toPx, toSeconds, type FontContext } from '@/lib/cssValue';
import { drawWordmark } from '@/lib/wordmarkRaster';
import { createWaveRenderer, type WaveRenderer, type WaveSettings } from '@/lib/wordmarkWave';

/**
 * Drives the wave: measures the live copy of the mark, rasterises it, and
 * feeds the result to the shader.
 *
 * The live DOM copy stays the source of truth for everything — face, size,
 * tracking, stroke, slant all come back out of `getComputedStyle`, so the
 * tokens keep deciding how the mark looks and this file never guesses. It is
 * also the fallback: until the texture is up, and forever on a machine with
 * no WebGL, the copy is simply what you see.
 */

/**
 * The mark is rasterised, and drawn, at twice the device pixel ratio.
 *
 * The wave samples the texture at points that fall between texels, so at 1:1
 * a bilinear tap visibly softens a stroke this thin. Supersampling and letting
 * the browser scale the canvas down puts the edge back. Capped, because both
 * the texture and the fragment count grow with its square — and at 3 the mark
 * is already sharper than the screen can show.
 */
const RENDER_SCALE = 2;
const MAX_RENDER_SCALE = 3;

/**
 * Ceiling on either texture dimension. Browsers cap canvases somewhere above
 * this and fail by handing back a blank one, so an unusually large
 * `--wordmark-size` should cost resolution rather than the whole mark.
 */
const MAX_TEXTURE_PX = 4096;

/**
 * Structural floors — deliberately NOT a copy of the design.
 *
 * tokens.css defines all twelve knobs on `:root`, so a fallback only fires if
 * the stylesheet is missing outright, and then the mark is unstyled anyway.
 * They exist so that an absent token cannot reach the shader as a NaN or a
 * divide by zero — nothing more.
 *
 * Do not sync these when you retune the wave. tokens.css is the design; if
 * these ever agree with it, that is a coincidence and not worth preserving.
 * Lengths are multiples of the mark's font size.
 */
const FLOOR = {
  amplitude: 0.05,
  sway: 0.04,
  lean: 0.05,
  aberration: 0,
  cycles: 1,
  cycles2: 2.5,
  cyclesNoise: 1.5,
  duration: 5,
  duration2: 8,
  drift: 12,
  noise: 0.3,
  depth: 0.05,
} as const;

const length = (
  styles: CSSStyleDeclaration,
  name: string,
  font: FontContext,
  floor: number,
) => toPx(styles.getPropertyValue(name), font) ?? font.em * floor;

const readSettings = (
  styles: CSSStyleDeclaration,
  font: FontContext,
): WaveSettings => ({
  amplitude: length(styles, '--wordmark-wave-amplitude', font, FLOOR.amplitude),
  sway: length(styles, '--wordmark-wave-sway', font, FLOOR.sway),
  lean: length(styles, '--wordmark-wave-lean', font, FLOOR.lean),
  aberration: length(styles, '--wordmark-wave-aberration', font, FLOOR.aberration),
  cycles: toNumber(styles.getPropertyValue('--wordmark-wave-cycles'), FLOOR.cycles),
  cycles2: toNumber(styles.getPropertyValue('--wordmark-wave-cycles-2'), FLOOR.cycles2),
  cyclesNoise: toNumber(
    styles.getPropertyValue('--wordmark-wave-cycles-noise'),
    FLOOR.cyclesNoise,
  ),
  duration: toSeconds(
    styles.getPropertyValue('--wordmark-wave-duration'),
    FLOOR.duration,
  ),
  duration2: toSeconds(
    styles.getPropertyValue('--wordmark-wave-duration-2'),
    FLOOR.duration2,
  ),
  drift: toSeconds(styles.getPropertyValue('--wordmark-wave-drift'), FLOOR.drift),
  noise: toNumber(styles.getPropertyValue('--wordmark-wave-noise'), FLOOR.noise),
  depth: toNumber(styles.getPropertyValue('--wordmark-wave-depth'), FLOOR.depth),
});

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export const useWordmarkWave = (text: string) => {
  const typeRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const type = typeRef.current;
    const canvas = canvasRef.current;
    if (!type || !canvas) return;

    const scratch = document.createElement('canvas');
    let renderer: WaveRenderer | null = null;
    let cancelled = false;
    let pending = 0;

    /** Reduced motion freezes the clock, but the mark keeps the wave's shape. */
    const reduced = window.matchMedia(REDUCED_MOTION);
    let onScreen = true;

    const shouldRun = () =>
      !reduced.matches && onScreen && document.visibilityState === 'visible';

    const build = () => {
      if (cancelled || !renderer) return;

      const styles = getComputedStyle(type);
      const fontSize = Number.parseFloat(styles.fontSize);
      const { width: boxWidth, height: boxHeight } = type.getBoundingClientRect();
      if (!(fontSize > 0 && boxWidth > 0 && boxHeight > 0)) return;

      const font: FontContext = {
        em: fontSize,
        rem:
          Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16,
      };
      const settings = readSettings(styles, font);
      const pixelRatio = Math.max(
        1,
        Math.min(
          (window.devicePixelRatio || 1) * RENDER_SCALE,
          MAX_RENDER_SCALE,
          MAX_TEXTURE_PX / Math.max(boxWidth, boxHeight),
        ),
      );

      const raster = drawWordmark(scratch, {
        text,
        font: `${styles.fontStyle} ${styles.fontWeight} ${fontSize}px ${styles.fontFamily}`,
        tracking: Number.parseFloat(styles.letterSpacing) || 0,
        strokeWidth:
          toPx(styles.getPropertyValue('-webkit-text-stroke-width'), font) ??
          toPx(styles.getPropertyValue('--wordmark-stroke-width'), font) ??
          fontSize * 0.038,
        strokeColor:
          styles.getPropertyValue('-webkit-text-stroke-color').trim() ||
          styles.getPropertyValue('--wordmark-stroke-color').trim() ||
          '#fff',
        slant: toNumber(styles.getPropertyValue('--wordmark-slant'), 0),
        boxWidth,
        boxHeight,
        // Headroom for everything the shader can push outward. Depth pulls on
        // the vertical axis because it magnifies about the texture's middle.
        bleedX: Math.ceil(settings.sway + settings.lean + settings.aberration + 2),
        bleedY: Math.ceil(
          settings.amplitude +
            settings.aberration +
            (boxHeight * settings.depth) / 2 +
            2,
        ),
        pixelRatio,
      });
      if (!raster || cancelled) return;

      canvas.style.left = `${-raster.insetX}px`;
      canvas.style.top = `${-raster.insetY}px`;

      renderer.setGeometry({
        width: raster.width,
        height: raster.height,
        pixelRatio,
        span: raster.span,
      });
      renderer.setSettings(settings);
      renderer.setTexture(scratch);
      renderer.render();

      setActive(true);
    };

    /** Resize fires in bursts; one rebuild per frame is plenty. */
    const scheduleBuild = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(build);
    };

    const sync = () => renderer?.setRunning(shouldRun());

    const boot = () => {
      renderer = createWaveRenderer(canvas);
      // No WebGL: the live copy is already on screen and stays there.
      if (!renderer) return false;
      build();
      sync();
      return true;
    };

    // A lost context leaves a blank canvas, so hand the mark back to the DOM
    // copy until the browser gives us a new one.
    const onContextLost = (event: Event) => {
      event.preventDefault();
      renderer?.destroy();
      renderer = null;
      setActive(false);
    };

    const onContextRestored = () => {
      if (cancelled || renderer) return;
      boot();
    };

    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const observer = new ResizeObserver(scheduleBuild);
    const visibility = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      sync();
    });

    // The face is preloaded and set to `block`, so this normally resolves on
    // the first turn — but rasterising a fallback face would be a visible bug,
    // and unlike live text a texture does not re-flow when the real one lands.
    const initial = getComputedStyle(type);
    const ready = document.fonts
      ? document.fonts
          .load(`${initial.fontSize} ${initial.fontFamily}`)
          .catch(() => undefined)
          .then(() => document.fonts.ready)
      : Promise.resolve();

    ready.then(() => {
      if (cancelled) return;
      if (!boot()) return;
      observer.observe(type);
      visibility.observe(type);
      reduced.addEventListener('change', sync);
      document.addEventListener('visibilitychange', sync);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(pending);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      observer.disconnect();
      visibility.disconnect();
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      renderer?.destroy();
      renderer = null;
      setActive(false);
    };
  }, [text]);

  return { typeRef, canvasRef, active };
};
