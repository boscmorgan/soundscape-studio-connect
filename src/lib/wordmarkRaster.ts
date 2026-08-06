/**
 * Rasterises the wordmark into an offscreen 2D canvas, which the wave shader
 * then samples as a texture.
 *
 * The point of this step is that the wave becomes a property of the *mark*
 * rather than of the letters: once the word is a single image, a displacement
 * field can bend it anywhere, including through the middle of a glyph. Nothing
 * here knows the word has ten characters in it.
 *
 * Everything the raster needs — face, size, tracking, stroke, slant — is read
 * off the live DOM copy by the caller, so the tokens in tokens.css stay the
 * single source of truth and this module never hard-codes a value.
 */

export interface WordmarkRasterInput {
  text: string;
  /** Canvas `font` shorthand, built from the live copy's computed style. */
  font: string;
  /** Letter-spacing in px. */
  tracking: number;
  /** `-webkit-text-stroke-width` in px. */
  strokeWidth: number;
  strokeColor: string;
  /** `skewX()` angle in degrees, as applied to the live copy. */
  slant: number;
  /** Layout box of the live copy — the raster is aligned to it. */
  boxWidth: number;
  boxHeight: number;
  /** Headroom for the wave, in px, beyond the ink itself. */
  bleedX: number;
  bleedY: number;
  pixelRatio: number;
}

/** What the geometry needs out of `measureText`, already resolved to numbers. */
export interface WordmarkMetrics {
  /** The face's own ascent and descent — these place the baseline. */
  fontAscent: number;
  fontDescent: number;
  /** This particular string's ink, as distances from the baseline. */
  inkAscent: number;
  inkDescent: number;
  /** This string's ink, as x coordinates from the drawing origin. */
  inkLeft: number;
  inkRight: number;
}

export interface WordmarkGeometry {
  /** Texture size in CSS px, ink plus bleed. */
  width: number;
  height: number;
  /** How far the texture extends past the layout box, top-left, in CSS px. */
  insetX: number;
  insetY: number;
  /** Width of the word as a fraction of the texture — the shader's word space. */
  span: number;
  /** Where the baseline sits below the top of the layout box. */
  baseline: number;
  /** `tan()` of the slant, the form both the skew and its spread need. */
  shear: number;
}

export type WordmarkRaster = Omit<WordmarkGeometry, 'baseline' | 'shear'>;

/**
 * Where the mark sits, and how much room the wave needs around it.
 *
 * Pure, and separate from the drawing, because this is the arithmetic that
 * fails quietly: a sign error here does not throw, it just puts the mark
 * somewhere slightly wrong, or crops the crest of the wave.
 *
 * Returns null if the numbers do not describe a usable texture, which the
 * caller treats as "leave the live copy on screen".
 */
export const wordmarkGeometry = (
  metrics: WordmarkMetrics,
  input: Pick<
    WordmarkRasterInput,
    'boxWidth' | 'boxHeight' | 'strokeWidth' | 'slant' | 'bleedX' | 'bleedY'
  >,
): WordmarkGeometry | null => {
  // `line-height: 1` gives the box the font-size, and splits whatever the face
  // does not fill evenly above and below. That is where the baseline lands.
  const baseline =
    (input.boxHeight - (metrics.fontAscent + metrics.fontDescent)) / 2 +
    metrics.fontAscent;

  // Ink bounds in layout-box coordinates. `measureText` reports the fill, so
  // the stroke adds half its width on every side.
  const half = input.strokeWidth / 2;
  const inkLeft = metrics.inkLeft - half;
  const inkRight = metrics.inkRight + half;
  const inkTop = baseline - metrics.inkAscent - half;
  const inkBottom = baseline + metrics.inkDescent + half;

  // `skewX()` pivots on the box centre, so the shear grows with the distance
  // from it and is widest at whichever of the two ink edges is further out.
  const shear = Math.tan((input.slant * Math.PI) / 180);
  const pivot = input.boxHeight / 2;
  const shearTop = shear * (inkTop - pivot);
  const shearBottom = shear * (inkBottom - pivot);

  const minX = Math.floor(
    Math.min(0, inkLeft + Math.min(shearTop, shearBottom)) - input.bleedX,
  );
  const maxX = Math.ceil(
    Math.max(input.boxWidth, inkRight + Math.max(shearTop, shearBottom)) +
      input.bleedX,
  );
  const minY = Math.floor(Math.min(0, inkTop) - input.bleedY);
  const maxY = Math.ceil(Math.max(input.boxHeight, inkBottom) + input.bleedY);

  const width = maxX - minX;
  const height = maxY - minY;

  // A metric that did not resolve propagates as NaN all the way to
  // `canvas.width`, where the browser quietly coerces it to 0 — a mark that
  // has vanished rather than one that has failed. Refuse instead.
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  if (width <= 0 || height <= 0 || input.boxWidth <= 0) return null;

  return {
    width,
    height,
    insetX: -minX,
    insetY: -minY,
    span: input.boxWidth / width,
    baseline,
    shear,
  };
};

/**
 * `fontBoundingBox*` describes the face; `actualBoundingBox*` describes this
 * particular string. Safari only grew the former recently, hence the chain —
 * and the last value in each is a guaranteed number, so nothing downstream
 * ever has to reason about NaN.
 */
const firstFinite = (...values: (number | undefined)[]): number =>
  values.find((value): value is number => Number.isFinite(value)) ?? 0;

const resolveMetrics = (
  metrics: TextMetrics,
  input: WordmarkRasterInput,
): WordmarkMetrics => {
  const fontAscent = firstFinite(
    metrics.fontBoundingBoxAscent,
    metrics.actualBoundingBoxAscent,
    input.boxHeight * 0.8,
  );
  const fontDescent = firstFinite(
    metrics.fontBoundingBoxDescent,
    metrics.actualBoundingBoxDescent,
    input.boxHeight * 0.2,
  );

  return {
    fontAscent,
    fontDescent,
    inkAscent: firstFinite(metrics.actualBoundingBoxAscent, fontAscent),
    inkDescent: firstFinite(metrics.actualBoundingBoxDescent, fontDescent),
    // `actualBoundingBoxLeft` is measured *leftward* from the origin, so it
    // negates into an x coordinate.
    inkLeft: -firstFinite(metrics.actualBoundingBoxLeft, 0),
    inkRight: firstFinite(metrics.actualBoundingBoxRight, input.boxWidth),
  };
};

/** Applies the text styles that both measuring and stroking depend on. */
const applyTextStyle = (
  ctx: CanvasRenderingContext2D,
  input: WordmarkRasterInput,
) => {
  ctx.font = input.font;
  // Chrome 99+, Safari 17.4+, Firefox 128+. Without it the mark simply sets
  // tighter than the DOM copy, which is a cosmetic drift, not a break.
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${input.tracking}px`;
};

export const drawWordmark = (
  canvas: HTMLCanvasElement,
  input: WordmarkRasterInput,
): WordmarkRaster | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  applyTextStyle(ctx, input);

  const geometry = wordmarkGeometry(resolveMetrics(ctx.measureText(input.text), input), input);
  if (!geometry) return null;

  canvas.width = Math.round(geometry.width * input.pixelRatio);
  canvas.height = Math.round(geometry.height * input.pixelRatio);

  // Setting the size already cleared the bitmap, but it also reset the state,
  // so everything below has to be applied after it, not before.
  ctx.scale(input.pixelRatio, input.pixelRatio);
  ctx.translate(geometry.insetX, geometry.insetY);
  ctx.transform(1, 0, geometry.shear, 1, (-geometry.shear * input.boxHeight) / 2, 0);

  applyTextStyle(ctx, input);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.lineWidth = input.strokeWidth;
  // Titan One is a rounded face and the mark is stroked, not filled: a miter
  // would throw spikes off the few sharp joins it does have.
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = input.strokeColor;
  ctx.strokeText(input.text, 0, geometry.baseline);

  return {
    width: geometry.width,
    height: geometry.height,
    insetX: geometry.insetX,
    insetY: geometry.insetY,
    span: geometry.span,
  };
};
