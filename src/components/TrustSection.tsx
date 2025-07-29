import { Language, trustTranslations } from "@/lib/i18n";

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

          {/* Artists Row */}
          <div className="overflow-hidden">
            <div className="flex items-center gap-8 md:gap-12 whitespace-nowrap opacity-60 animate-scroll-right">
              {t.artists.map((client, index) => (
                <div
                  key={`artist-${index}`}
                  className="text-sm md:text-base font-medium text-black/70 hover:text-black transition-colors duration-200"
                >
                  {client}
                </div>
              ))}
              {t.artists.map((client, index) => (
                <div
                  key={`artist-dup-${index}`}
                  aria-hidden="true"
                  className="text-sm md:text-base font-medium text-black/70 hover:text-black transition-colors duration-200"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};