import { Language, trustTranslations } from "@/lib/i18n";

interface TrustSectionProps {
  language: Language;
}

const translations = trustTranslations;

export const TrustSection = ({ language }: TrustSectionProps) => {
  const t = translations[language];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            {t.title}
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
          {t.clients.map((client, index) => (
            <div 
              key={index}
              className="text-sm md:text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};