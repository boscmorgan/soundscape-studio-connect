import { cn } from '@/lib/utils';
import { site, wordmarkImage } from '@/config/site';

interface WordmarkProps {
  /** Wraps the mark in an <h1> on the page that owns the primary heading. */
  as?: 'h1' | 'div';
  className?: string;
}

/**
 * The lorenzo1UP wordmark — the supplied artwork, not type.
 *
 * Width is driven by the `--wordmark-width` token; height follows from the
 * asset's intrinsic aspect ratio, so the mark never distorts. Override per
 * instance with the arbitrary property `[--wordmark-width:…]`.
 */
export const Wordmark = ({ as: Tag = 'div', className }: WordmarkProps) => (
  <Tag className={cn('w-[--wordmark-width] max-w-full', className)}>
    <img
      src={wordmarkImage.src}
      srcSet={wordmarkImage.srcSet}
      sizes={wordmarkImage.sizes}
      width={wordmarkImage.width}
      height={wordmarkImage.height}
      alt={site.name}
      className="h-auto w-full select-none"
      style={{ filter: 'var(--wordmark-shadow)' }}
      draggable={false}
    />
  </Tag>
);
