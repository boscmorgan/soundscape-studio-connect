interface SubHeaderProps {
  language: 'en' | 'it';
}

const translations = {
  en: {
    headline: "Craft your sound. Shape your future.",
    subline: "Mixing. Mastering. Musicianship."
  },
  it: {
    headline: "Crea il tuo suono. Modella il tuo futuro.",
    subline: "Mixing. Mastering. Musicianship."
  }
};

export const SubHeader = ({ language }: SubHeaderProps) => {
  const t = translations[language];

  return (
    <section className="pt-24 pb-12 bg-background">
      <div className="container mx-auto px-6 text-center">
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