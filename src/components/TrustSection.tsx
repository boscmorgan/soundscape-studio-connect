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
    <section className="py-16 bg-background text-foreground overflow-x-hidden">
      <div className="space-y-6">
        {/* Brands Row */}
          <div className="overflow-x-hidden overflow-y-visible group">
            <div className="flex items-center gap-8 md:gap-12 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-500 animate-scroll-left group-hover:[animation-play-state:paused]">
              {t.brands.map((client, index) => {
                const src = brandLogos[client];
                return src ? (
                  <img
                    key={`brand-${index}`}
                    src={src}
                    alt={client}
                    className="h-8 w-auto transition-all duration-300 hover:scale-110 filter grayscale hover:grayscale-0"
                  />
                ) : (
                  <div
                    key={`brand-${index}`}
                    className="text-sm md:text-base font-medium text-black/70 hover:text-black transition-all duration-300 hover:scale-110"
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
                    className="h-8 w-auto transition-all duration-300 hover:scale-110 filter grayscale hover:grayscale-0"
                  />
                ) : (
                  <div
                    key={`brand-dup-${index}`}
                    aria-hidden="true"
                    className="text-sm md:text-base font-medium text-black/70 hover:text-black transition-all duration-300 hover:scale-110"
                  >
                    {client}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative overflow-x-hidden">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-mx-2">
                {t.testimonials.map((item, index) => (
                  <CarouselItem
                    key={`testimonial-${index}`}
                    className="px-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="group relative aspect-[2/3] overflow-hidden rounded-xl shadow-md transition-transform duration-500">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[2px] opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-5 text-white">
                        <p className="text-xs sm:text-sm lg:text-base leading-snug tracking-wide whitespace-pre-line break-words">
                          {item.quote}
                        </p>
                        {item.name && (
                          <p className="mt-2 text-[0.65rem] sm:text-xs lg:text-sm font-semibold tracking-wide break-words">
                            {item.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 h-6 w-6 bg-black/50 text-white hover:bg-black/70 border-none backdrop-blur-sm transition-transform duration-300 hover:scale-110" />
              <CarouselNext className="right-2 h-6 w-6 bg-black/50 text-white hover:bg-black/70 border-none backdrop-blur-sm transition-transform duration-300 hover:scale-110" />
            </Carousel>
          </div>
        </div>
      </section>
    );
  };