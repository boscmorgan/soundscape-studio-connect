import { Language, aboutTranslations } from "@/lib/i18n";

interface AboutSectionProps {
  language: Language;
}

const translations = aboutTranslations;

export const AboutSection = ({ language }: AboutSectionProps) => {
  const t = translations[language];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row gap-8">
        <h2 className="text-2xl md:text-3xl font-semibold md:w-1/4">{t.title}</h2>
        <p className="text-base text-muted-foreground md:w-3/4 max-w-prose">
          {t.text}
        </p>
      </div>
    </section>
  );
};
