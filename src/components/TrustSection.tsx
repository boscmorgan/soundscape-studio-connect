import { Language, trustTranslations } from "@/lib/i18n";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TrustSectionProps {
  language: Language;
}

const translations = trustTranslations;

const brandLogos: Record<string, string> = {
  "Soho House": "/brand_logos/soho_house.png",
  "Native Instruments": "/brand_logos/native_instruments.png",
  Nike: "/brand_logos/nike.png",
  "Arts Council of England": "/brand_logos/arts_council.png",
  RedBull: "/brand_logos/redbull.png",
  "Hard Rock": "/brand_logos/hard_rock.png",
  VICE: "/brand_logos/vice.png",
  "The Hoxton": "/brand_logos/hoxton.svg.png",
  "Pirate Studios": "/brand_logos/pirate_studios.png",
  "pointblank Music School": "/brand_logos/pointblank.png",
};

export const TrustSection = ({ language }: TrustSectionProps) => {
  const t = translations[language];

  return (
    <section className="py-16 bg-background text-foreground">
      <div className="container mx-auto px-6">

        <div className="space-y-6">
          {/* Brands Row */}
          <div className="overflow-hidden group">
            <div className="flex items-center gap-8 md:gap-12 whitespace-nowrap opacity-60 animate-scroll-left group-hover:[animation-play-state:paused]">
              {t.brands.map((client, index) => {
                const src = brandLogos[client];
                return src ? (
                  <img
                    key={`brand-${index}`}
                    src={src}
                    alt={client}
                    className="h-8 w-auto transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <div
                    key={`brand-${index}`}
                    className="text-sm md:text-base font-medium text-black/70 hover:text-black transition-colors duration-200 transition-transform duration-300 hover:scale-110"
                  >
                    {client}
                  </div>
                );
              })}
              {t.brands.map((client, index) => {
                const src = brandLogos[client];
                return src ? (
                  <img
                    key={`brand-dup-${index}`}
                    aria-hidden="true"
                    src={src}
                    alt={client}
                    className="h-8 w-auto transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <div
                    key={`brand-dup-${index}`}
                    aria-hidden="true"
                    className="text-sm md:text-base font-medium text-black/70 hover:text-black transition-colors duration-200 transition-transform duration-300 hover:scale-110"
                  >
                    {client}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {t.testimonials.map((item, index) => (
                  <CarouselItem
                    key={`testimonial-${index}`}
                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm p-2 sm:p-3 md:p-4 flex flex-col justify-end text-white">
                        <p className="text-xs sm:text-sm md:text-base leading-snug whitespace-pre-line">
                          {item.quote}
                        </p>
                        {item.name && (
                          <p className="mt-1 text-xs sm:text-sm md:text-base font-medium">
                            {item.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 h-6 w-6 bg-black/50 text-white hover:bg-black/70 border-none" />
              <CarouselNext className="right-2 h-6 w-6 bg-black/50 text-white hover:bg-black/70 border-none" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};