import { Language, subHeaderTranslations } from "@/lib/i18n";

interface SubHeaderProps {
  language: Language;
}

const translations = subHeaderTranslations;

export const SubHeader = ({ language }: SubHeaderProps) => {
  const t = translations[language];

  return (
    <section className="pt-24 pb-12 bg-background">
      <div className="container mx-auto px-6 text-left">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 tracking-tight">
          {t.headline}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide">
          {t.subline}
        </p>
      </div>
    </section>
  );
};