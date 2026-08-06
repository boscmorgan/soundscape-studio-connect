import { cn } from '@/lib/utils';
import { useWordmarkWave } from '@/hooks/useWordmarkWave';
import { site } from '@/config/site';

interface WordmarkProps {
  /** Wraps the mark in an <h1> on the page that owns the primary heading. */
  as?: 'h1' | 'div';
  className?: string;
}

/**
 * The lorenzo1UP wordmark — live type, not artwork.
 *
 * Set in the display face, stroked white with a transparent body, and running
 * a continuous wave. Size it by overriding `--wordmark-size` per instance with
 * the arbitrary property `[--wordmark-size:…]`; stroke, tracking and the whole
 * wave scale from that one token.
 *
 * There are two copies of the mark here and only ever one of them is visible:
 *
 *   - the live type, which decides the layout box, carries every token, and is
 *     what you see before the texture is ready or on a machine without WebGL;
 *   - the canvas, which paints that same type read through a displacement
 *     field (see src/lib/wordmarkWave.ts).
 *
 * The wave belongs to the mark rather than to its letters, so nothing here
 * splits the word up: it is one string, and the field bends it wherever it
 * happens to cross a glyph. The canvas is `aria-hidden` and the label is
 * restated on the wrapper, so assistive tech reads the word once.
 */
export const Wordmark = ({ as: Tag = 'div', className }: WordmarkProps) => {
  const { typeRef, canvasRef, active } = useWordmarkWave(site.name);

  return (
    <Tag
      aria-label={site.name}
      // Both copies of the mark are aria-hidden, so the name has to come from
      // the wrapper — and a bare <div> is `generic`, a role that prohibits
      // naming. Chrome computes the name anyway, but nothing guarantees other
      // engines will. `img` is also simply what this now is: a rendered image
      // of the word. An <h1> already takes a name, and must keep its own role.
      role={Tag === 'div' ? 'img' : undefined}
      className={cn('wordmark relative w-fit max-w-full select-none', className)}
    >
      <span
        ref={typeRef}
        aria-hidden="true"
        className={cn('wordmark-type', active && 'opacity-0')}
      >
        <span className="wordmark-slant">{site.name}</span>
      </span>

      <canvas ref={canvasRef} aria-hidden="true" className="wordmark-canvas" />
    </Tag>
  );
};
