import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { testimonials } from '@/content';

interface TestimonialsProps {
  className?: string;
}

export const Testimonials = ({ className }: TestimonialsProps) => (
  <div className={cn('relative', className)}>
    <Carousel opts={{ align: 'start' }} className="w-full">
      <CarouselContent className="-ml-[--space-sm]">
        {testimonials.map((item) => (
          <CarouselItem
            key={item.name}
            className="basis-full pl-[--space-sm] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <figure className="group relative aspect-[9/16] overflow-hidden rounded-[--radius]">
              <img
                src={item.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-slow ease-out group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20"
              />
              <figcaption className="absolute inset-0 flex flex-col justify-end p-[--space-md] text-foreground">
                <blockquote className="text-[length:var(--text-caption)] leading-snug">
                  {item.quote}
                </blockquote>
                <cite className="mt-[--space-xs] text-[length:var(--text-caption)] font-semibold not-italic text-foreground/80">
                  {item.name}
                </cite>
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 border-none bg-black/50 text-foreground hover:bg-black/70 hover:text-foreground" />
      <CarouselNext className="right-2 border-none bg-black/50 text-foreground hover:bg-black/70 hover:text-foreground" />
    </Carousel>
  </div>
);
