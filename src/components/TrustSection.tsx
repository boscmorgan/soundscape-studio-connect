import { Language, trustTranslations } from "@/lib/i18n";

interface TrustSectionProps {
  language: Language;
}

const translations = trustTranslations;

export const TrustSection = ({ language }: TrustSectionProps) => {
  const t = translations[language];

  return (
    <section className="py-16 bg-background text-foreground">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-8">
            {t.title}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Brands Row */}
          <div className="overflow-hidden">
            <div className="flex items-center gap-8 md:gap-12 whitespace-nowrap opacity-60 animate-scroll-left">
              {t.brands.map((client, index) => (
                <div
                  key={`brand-${index}`}
                  className="text-sm md:text-base font-medium text-black/70 hover:text-black transition-colors duration-200"
                >
                  {client}
                </div>
              ))}
              {t.brands.map((client, index) => (
                <div
                  key={`brand-dup-${index}`}
                  aria-hidden="true"
                  className="text-sm md:text-base font-medium text-black/70 hover:text-black transition-colors duration-200"
                >
                  {client}
                </div>
              ))}
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