import { cn } from '@/lib/utils';
import { brands, type Brand } from '@/content';

const BrandItem = ({ name, logo }: Brand) =>
  logo ? (
    <img
      src={logo}
      alt={name}
      loading="lazy"
      className="h-7 w-auto shrink-0 opacity-70 brightness-0 invert transition-opacity duration-fast hover:opacity-100 md:h-8"
    />
  ) : (
    <span className="shrink-0 whitespace-nowrap text-[length:var(--text-caption)] font-medium uppercase tracking-[0.1em] text-foreground/60 transition-colors duration-fast hover:text-foreground">
      {name}
    </span>
  );

interface BrandMarqueeProps {
  className?: string;
}

/**
 * Continuously scrolling logo strip. The list is rendered twice so the
 * -50% translation loops seamlessly; the duplicate is hidden from a11y tools.
 */
export const BrandMarquee = ({ className }: BrandMarqueeProps) => (
  <div className={cn('overflow-hidden', className)}>
    <div className="marquee-track flex w-max items-center gap-[--space-xl]">
      {brands.map((brand) => (
        <BrandItem key={brand.name} {...brand} />
      ))}
      <div aria-hidden className="flex items-center gap-[--space-xl]">
        {brands.map((brand) => (
          <BrandItem key={`dup-${brand.name}`} {...brand} />
        ))}
      </div>
    </div>
  </div>
);
